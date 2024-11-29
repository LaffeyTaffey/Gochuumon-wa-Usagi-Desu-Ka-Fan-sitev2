const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const xml2js = require('xml2js');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

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

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});


app.listen(PORT, () => {
    console.log(`🐰 Welcome to the Rabbit House! Server is hopping on http://localhost:${PORT} 🐰`);
    console.log(`If you navigate to http://localhost:54537 and see nothing, please refresh the page.`);
});