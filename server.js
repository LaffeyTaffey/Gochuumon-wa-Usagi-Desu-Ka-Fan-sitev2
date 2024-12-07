const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const xml2js = require('xml2js');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const chinoCustomPrompt = require('./chino_custom_prompt');
const chokidar = require('chokidar');
const fg = require('fast-glob');
const { promises: fsPromises } = require('fs');
const { readFileSync } = require('fs');
const NodeCache = require('node-cache');
const { Volume } = require('memfs');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

console.log(`🐰 Kafuu Chino is ready! Loaded custom prompt settings:
- System Prompt: ${chinoCustomPrompt.systemPrompt.split('\n')[0]}... 
- Context Size: ${chinoCustomPrompt.contextSize}
- Temperature: ${chinoCustomPrompt.temperature}
- Max Tokens: ${chinoCustomPrompt.maxTokens}`);

const { systemPrompt, contextSize, temperature, maxTokens } = chinoCustomPrompt;

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

if (isMainThread) {
    function processFilesInParallel(filePaths) {
        const workers = filePaths.map(filePath => {
            return new Worker(__filename, { 
                workerData: { filePath } 
            });
        });

        return Promise.allSettled(
            workers.map(worker => 
                new Promise((resolve, reject) => {
                    worker.on('message', resolve);
                    worker.on('error', (err) => {
                        console.error(`Worker error for ${workerData.filePath}:`, err);
                        reject(err);
                    });
                    worker.on('exit', (code) => {
                        if (code !== 0) {
                            console.warn(`Worker for ${workerData.filePath} exited with code ${code}`);
                            reject(new Error(`Worker stopped with exit code ${code}`));
                        }
                    });
                })
            )
        );
    }
}

const fileCache = new NodeCache({
    stdTTL: 60, // 1 minute cache
    checkPeriod: 120 // check for expired keys every 2 minutes
});

async function fastFileRetrieval(filePath) {
    const cachedFile = fileCache.get(filePath);
    if (cachedFile) return cachedFile;

    const fileContent = await readFile(filePath, 'utf8');
    fileCache.set(filePath, fileContent);
    return fileContent;
}

const vol = new Volume();

function loadFilesInMemory() {
    // Preload critical files into memory
    const configFiles = {
        '/config/chino_custom_prompt.js': readFileSync('./chino_custom_prompt.js'),
        '/config/urls.json': readFileSync('./urls.json')
    };

    Object.entries(configFiles).forEach(([path, content]) => {
        vol.writeFileSync(path, content);
    });

    return vol;
}

async function fastFileDiscovery() {
    try {
        const files = await fg([
            './data/**/*.json', 
            './config/*.js',
            '!./node_modules'
        ], { 
            dot: true,
            onlyFiles: true,
            absolute: true
        });

        return files;
    } catch (error) {
        console.error('File Discovery Error:', error);
        return [];
    }
}

async function initializeFileManagement() {
    try {
        // Discover files
        const discoveredFiles = await fastFileDiscovery();
        console.log('Discovered Files:', discoveredFiles);

        // Load files in memory (make sure readFileSync is imported)
        const memoryVolume = loadFilesInMemory();

        // Set up file watching
        const watcher = setupFastFileLoading();

        // Parallel file processing if needed
        if (discoveredFiles.length > 0) {
            await processFilesInParallel(discoveredFiles);
        }
    } catch (error) {
        console.error('File Management Initialization Error:', error);
    }
}

// Call function when server starts
initializeFileManagement().catch(console.error);

function setupFastFileLoading() {
    const watcher = chokidar.watch(['./urls.json', './config.json', './data/**/*.json'], {
        persistent: true,
        ignoreInitial: false,
        depth: 2,
        awaitWriteFinish: {
            stabilityThreshold: 200,
            pollInterval: 100
        }
    });

    watcher
        .on('change', async (path) => {
            console.log(`File ${path} has been changed`);
            try {
                await fetchKnowledgeBase();
                console.log(`Successfully reloaded data after ${path} change`);
            } catch (error) {
                console.error(`Error reloading data after ${path} change:`, error);
            }
        })
        .on('add', (path) => console.log(`File ${path} has been added`))
        .on('unlink', (path) => console.log(`File ${path} has been removed`))
        .on('error', error => console.error(`Watcher error: ${error}`));

    return watcher;
}

// URLs for scraping
const urls = [
    'https://gochiusa.fandom.com/wiki/Category:Characters', // Character Category
    'https://gochiusa.fandom.com/wiki/Chino_Kaf%C5%AB', // Chino's page
    'https://en.wikipedia.org/wiki/Is_the_Order_a_Rabbit%3F',
    'https://en.wikipedia.org/wiki/List_of_Is_the_Order_a_Rabbit%3F_episodes',
    'https://gochiusa.fandom.com/wiki/Is_the_Order_a_Rabbit%3F_Wiki' // Main Wiki page

];

// Function to scrape data from a URL
async function scrapeData(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        if (url.includes('Category:Characters')) {
            const characters = {};
            $('.category-page__member-link').each((i, element) => {
                const characterName = $(element).text().trim();
                characters[characterName.toLowerCase()] = {
                    name: characterName,
                    link: $(element).attr('href')
                };
            });
            return { category: 'Characters', data: characters };
        } else if (url.includes('Chino_Kaf%C5%AB') || url.includes('wiki/')) {
            const extractCharacterInfo = () => {
                const infobox = $('.infobox');
                const biography = $('#Biography').next().text().trim() || 
                                  $('#mw-content-text p').first().text().trim();
                
                return {
                    name: infobox.find('.infobox-title').text().trim() || 'Unknown',
                    biography: biography,
                    otherDetails: infobox.find('.infobox-data').map((i, el) => $(el).text().trim()).get()
                };
            };

            const characterInfo = extractCharacterInfo();
            return {
                category: 'Character',
                data: characterInfo
            };
        }
    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        return null;
    }
}

let knowledgeBase = [];

// Main function to scrape all URLs
async function fetchKnowledgeBase() {
    knowledgeBase = []; // Reset before populating
    const results = await Promise.all(urls.map(url => scrapeData(url)));
    results.forEach(result => {
        if (result) {
            knowledgeBase.push(result);
        }
    });
    console.log('Updated Knowledge Base:', JSON.stringify(knowledgeBase, null, 2));
}


// Call on server start and maybe periodically
fetchKnowledgeBase();
setInterval(fetchKnowledgeBase, 24 * 60 * 60 * 1000); // Update daily

let conversationHistory = [];
const MAX_HISTORY_LENGTH = 5; // Limit to prevent excessive context

app.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message || message.trim() === '') {
        return res.status(400).send('Message is required.');
    }

    try {
        conversationHistory.push({ role: 'user', content: message });

        let additionalContext = '';
        let relevantContext = '';

        // Check if message is asking about a specific character
        const characterMatch = message.match(/who\s+(?:is)?\s*(.*?)\?/i);

        if (characterMatch) {
            const characterName = characterMatch[1].trim().toLowerCase();
            
            // Search through knowledge base for character info
            for (let entry of knowledgeBase) {
                if (entry.category === 'Characters') {
                    const character = entry.data[characterName];
                    if (character) {
                        // If character found in characters list, try to get more details
                        const detailedEntry = knowledgeBase.find(
                            e => e.category === 'Character' && 
                            e.data.name.toLowerCase().includes(characterName)
                        );

                        if (detailedEntry) {
                            additionalContext = `Additional context about ${character.name}: ${detailedEntry.data.biography}`;
                        }
                        break;
                    }
                }
            }
        }

        // Find relevant knowledge base entries
        relevantContext = knowledgeBase
            .filter(entry =>
                message.toLowerCase().includes(entry.category.toLowerCase())
            )
            .map(entry => JSON.stringify(entry.data))
            .join('\n');

        // Combine additional context and relevant context
        const enrichedContext = [additionalContext, relevantContext].filter(Boolean).join('\n\n');

        // Prepare messages for API call
        const apiMessages = [
            {
                role: 'system',
                content: `${systemPrompt}\n\n${enrichedContext}`
            },
            ...conversationHistory.slice(-MAX_HISTORY_LENGTH)
        ];

        // Log API request settings
        console.log(`🐰 Chino's API settings:
- Model: cosmosrp
- Messages: ${JSON.stringify(apiMessages, null, 2)}
- Max Tokens: ${maxTokens}
- Temperature: ${temperature}
- Context Size: ${contextSize}`);

        const apiResponse = await axios.post(
            'https://api.pawan.krd/cosmosrp/v1/chat/completions',
            {
                model: 'cosmosrp',
                messages: apiMessages,
                maxTokens,
                temperature,
                contextSize
            }
        );

        const botResponse = apiResponse.data?.choices?.[0]?.message?.content?.trim();
        if (botResponse) {
            conversationHistory.push({ role: 'assistant', content: botResponse });

            if (conversationHistory.length > MAX_HISTORY_LENGTH * 2) {
                conversationHistory = conversationHistory.slice(-MAX_HISTORY_LENGTH * 2);
            }

            res.send(botResponse);
        } else {
            res.status(500).send('*looks confused* Something went wrong...');
        }
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        res.status(500).send('*adjusts hair clip* I apologize, there seems to be an issue.');
    }
});

function performanceMiddleware(req, res, next) {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    });
    
    next();
}

app.use(performanceMiddleware);

// Resets conversation history
app.post('/reset-chat', (req, res) => {
    conversationHistory = [];
    res.send('Conversation history reset');
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

app.post('/log-error', (req, res) => {
    const errorData = req.body;
    console.error('Image loading error:', errorData.error, errorData.details);
    res.status(200).send('Error logged');
});

app.use((req, res) => {
    res.status(404).sendFile(path.resolve('./404.html'));
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
