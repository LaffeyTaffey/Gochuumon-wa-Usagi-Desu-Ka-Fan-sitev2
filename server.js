require('dotenv').config();
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
app.use(cors({
    origin: true,  // This allows all origins
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Uses the environment variable
    ssl: {
        rejectUnauthorized: false
    }
});

// User registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id',
            [username, hashedPassword]
        );
        res.status(201).json({ userId: result.rows[0].id });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// User login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        res.status(200).json({ userId: user.id });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Save chat history
app.post('/save-chat', async (req, res) => {
    const { userId, message, sender } = req.body;
    if (!userId || !message || !sender) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await pool.query(
            'INSERT INTO chat_history (user_id, message, sender) VALUES ($1, $2, $3)',
            [userId, message, sender]
        );
        res.status(201).send('Chat saved');
    } catch (error) {
        console.error('Chat save error:', error);
        res.status(500).json({ error: 'Failed to save chat' });
    }
});

// Get chat history
app.get('/chat-history/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM chat_history WHERE user_id = $1 ORDER BY timestamp',
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Chat history error:', error);
        res.status(500).json({ error: 'Failed to retrieve chat history' });
    }
});

app.delete('/delete-chat/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        await pool.query('DELETE FROM chat_history WHERE user_id = $1', [userId]);
        res.status(200).send('Chat history deleted');
    } catch (error) {
        console.error('Chat deletion error:', error);
        res.status(500).json({ error: 'Failed to delete chat history' });
    }
});

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

// Character Rss Proxy Routes
const characterRssUrls = {
    'chino': 'https://www.reddit.com/search/.rss?q=kafuu+chino&cId=4f66e521-73fc-4223-b8ef-8de9d0d7932d&iId=766a8ba6-6492-4054-b18c-25b030bc5952.rss',
    'cocoa': 'https://www.reddit.com/search/.rss?q=cocoa+hoto&cId=4fd85e1e-d424-4449-b580-bb204e1d016b&iId=29909bbd-e4ed-4231-b91e-3e2103786431',
    'chiya': 'https://www.reddit.com/search/.rss?q=Chiya+Ujimatsu&cId=ce53aa8f-07a6-45b2-91bf-5359276270f7&iId=51733a81-d7b2-4309-867d-9cb8d954f910',
    'syaro': 'https://www.reddit.com/search/.rss?q=Syaro+Kirima&cId=8e3d3c23-c955-4b88-870e-a4539f89a01a&iId=81977baf-6618-474e-9014-299c308971c3',
    'mocha': 'https://www.reddit.com/search/.rss?q=Mocha+Hoto&cId=5507da12-c86b-412d-9e14-1ae3e84b42b2&iId=7ed7295f-7082-4ad5-a54a-39c41999b706'
};

app.get('/character-gallery/:character', async (req, res) => {
    const { character } = req.params;
    const rssUrl = characterRssUrls[character.toLowerCase()];

    if (!rssUrl) {
        return res.status(404).json({ error: 'Character not found' });
    }

    try {
        const response = await axios.get(rssUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // Similar XML conversion logic as animewallpaper-proxy
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
                            title: [`${character.toUpperCase()} Fan Art`],
                            link: ['https://www.reddit.com/'],
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
            res.set('Content-Type', 'application/xml');
            res.send(response.data);
        }
    } catch (error) {
        console.error(`Proxy error for ${character}:`, error);
        res.status(500).json({
            error: 'Failed to fetch RSS feed',
            details: error.message
        });
    }
});

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

function performanceMiddleware(req, res, next) {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    });

    next();
}

const chatHistory = []; // Store conversation history

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Add user message to history
    chatHistory.push({ role: "user", content: userMessage });

    // Keep history within limits (avoid exceeding max tokens)
    if (chatHistory.length > 20) {  // will adjust this number later based on token count of messages
        chatHistory.shift(); // Remove oldest messages
    }

    try {
        const response = await axios.post('https://api.arliai.com/v1/chat/completions', {
            model: "Mistral-Nemo-12B-Instruct-2407",
            messages: [
                { role: "system", content: systemPrompt },
                ...chatHistory // Send entire conversation history
            ],
            temperature: 0.4,
            repetition_penalty: 1.08,
            top_p: 0.9,
            min_p: 0.1,
            dry_sequence_breakers: ["\n", ":", "*"]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.ARLIAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const botResponse = response.data.choices[0].message.content;
        
        // Add bot response to history
        chatHistory.push({ role: "assistant", content: botResponse });

        res.status(200).send(botResponse);
    } catch (error) {
        console.error('Error communicating with Arliai API:', error);
        res.status(500).json({ error: 'Failed to communicate with the chatbot' });
    }
});

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
                            title: ['Main Anime Wallpaper Gallery'],
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

app.post('/log-error', (req, res) => {
    const errorData = req.body;
    console.error('Image loading error:', errorData.error, errorData.details);
    res.status(200).send('Error logged');
});

app.use((req, res) => {
    console.log(`404 - Route Not Found: ${req.method} ${req.path}`);
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
