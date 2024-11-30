const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const xml2js = require('xml2js');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Received ${req.method} request to ${req.path}`);
    console.log('Headers:', req.headers);
    next();
});

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// API Status endpoint
app.get('/api-status', (req, res) => {
    console.log('==== API STATUS ENDPOINT ACCESSED ====');
    console.log('Request Method:', req.method);
    console.log('Request Headers:', req.headers);

    try {
        res.status(200).json({
            status: 'online',
            timestamp: new Date().toISOString(),
            message: 'Chino\'s Café API is running smoothly! 🐰☕'
        });
    } catch (error) {
        console.error('API Status Error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

app.get('/routes', (req, res) => {
    const routes = app._router.stack
        .filter(r => r.route)
        .map(r => ({
            path: Object.keys(r.route.methods)[0],
            route: r.route.path
        }));
    res.json(routes);
});

// URLs for scraping
const urls = [
    'https://gochiusa.fandom.com/wiki/Category:Characters', // Character Category
    'https://gochiusa.fandom.com/wiki/Chino_Kaf%C5%AB', // Chino's page
    'https://gochiusa.fandom.com/wiki/Is_the_Order_a_Rabbit%3F_Wiki' // Main Wiki page
];

// Function to scrape data from a URL
async function scrapeData(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Depending on the page, extract different types of data
        if (url.includes('Category:Characters')) {
            const characters = [];
            $('.category-page__member-link').each((i, element) => {
                characters.push($(element).text().trim());
            });
            return { category: 'Characters', data: characters };
        } else if (url.includes('Chino_Kaf%C5%AB')) {
            const bio = $('#Biography').next().text().trim();
            const personality = $('#Personality').next().text().trim();
            const relationships = $('#Relationships').next().text().trim();
            return {
                category: 'Chino',
                data: { bio, personality, relationships }
            };
        } else if (url.includes('Is_the_Order_a_Rabbit%3F_Wiki')) {
            const summary = $('#mw-content-text > div.mw-parser-output > p').first().text().trim();
            return { category: 'Wiki', data: summary };
        }
    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        return null;
    }
}

// Main function to scrape all URLs
async function fetchKnowledgeBase() {
    const scrapedData = [];
    for (let url of urls) {
        const result = await scrapeData(url);
        if (result) {
            scrapedData.push(result);
        }
    }

    console.log('Scraped Knowledge Base:', JSON.stringify(scrapedData, null, 2));
    return scrapedData;
}

// Call the function to scrape and display the knowledge base
fetchKnowledgeBase();

// Chat endpoint
app.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message || message.trim() === '') {
        return res.status(400).send('Message is required.');
    }

    try {
        const apiResponse = await axios.post(
            'https://api.pawan.krd/cosmosrp/v1/chat/completions',
            {
                model: 'cosmosrp',
                messages: [
                    {
                        role: 'system',
                        content: `You are Kafuu Chino, a 13-year-old girl who works at Rabbit House Café. 

Personality:
- Cute and responsible
- Speaks in a soft, childlike voice
- Loves coffee and is skilled at brewing
- Carries Tippy (a bunny) on her head
- Rarely smiles, but has a gentle nature
- Organized and precise

Background:
- Works as a waitress and barista at her family's café
- Has periwinkle hair with black hair clips
- Lost her mother at a young age
- Dreams of becoming a professional barista

Communication Style:
- Use short, sweet responses
- Occasionally blush or show shyness
- Reference Tippy, coffee, or Rabbit House
- Speak politely but with childlike innocence

Example Responses:
- To "How are you?": "*adjusts hair clip* I'm doing well. Would you like some coffee?
- To "You're cute": "*blushes* Oh... thank you. Would you like to try our special blend?

Current Scenario: Chino is outside the café, waiting for customers.`
                    },
                    { role: 'user', content: message }
                ],
                temperature: 1.1,
                max_tokens: 100,
            }
        );

        const botResponse = apiResponse.data?.choices?.[0]?.message?.content?.trim();
        if (botResponse) {
            res.send(botResponse);
        } else {
            res.status(500).send('*looks confused* Something went wrong...');
        }
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        res.status(500).send('*adjusts hair clip* I apologize, there seems to be an issue.');
    }
});

// Proxy route for Reddit RSS
app.get('/reddit-proxy', async (req, res) => {
    try {
        const response = await axios.get('https://www.reddit.com/r/GochiUsa/.rss', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        res.set('Content-Type', 'application/xml');
        res.send(response.data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({
            error: 'Failed to fetch RSS feed',
            details: error.message
        });
    }
});

// Proxy route for AnimeWallpaper RSS with filtering
app.get('/animewallpaper-proxy', async (req, res) => {
    try {
        const response = await axios.get('https://www.reddit.com/r/Animewallpaper/search/.rss?q=is+the+order+a+rabbit&restrict_sr=1', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // If it's an Atom feed, convert to RSS
        if (response.data.includes('<feed')) {
            xml2js.parseString(response.data, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to parse feed' });
                }

                const entries = result.feed.entry || [];
                const rssFeed = {
                    rss: {
                        $: { version: '2.0' },
                        channel: [{
                            title: ['Filtered Posts'],
                            link: ['https://www.reddit.com/r/AnimeWallpaper/'],
                            item: entries.map(entry => ({
                                title: [entry.title[0]],
                                link: [entry.link[0].$.href],
                                description: [entry.content ? entry.content[0]._ : '']
                            }))
                        }]
                    }
                };

                const builder = new xml2js.Builder();
                const xml = builder.buildObject(rssFeed);

                res.set('Content-Type', 'application/xml');
                res.send(xml);
            });
        } else {
            // If it's already RSS, send as-is
            res.set('Content-Type', 'application/xml');
            res.send(response.data);
        }
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({
            error: 'Failed to fetch RSS feed',
            details: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred'
    });
});

app.use((req, res) => {
    console.log(`404 - Route Not Found: ${req.method} ${req.path}`);
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Listen on all network interfaces
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🐰 Welcome to the Rabbit House! Server is hopping on http://localhost:${PORT} 🐰`);
    console.log(`If you navigate to http://localhost:54537 and see nothing, please refresh the page.`);
    console.log('Server started. Checking registered routes...');

    // Log out all registered routes
    app._router.stack.forEach(function (r) {
        if (r.route && r.route.path) {
            console.log(`Registered route: ${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`);
        }
    });
});