require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const compression = require('compression');
const minifyHTML = require('html-minifier').minify;
const CleanCSS = require('clean-css');
const uglifyJS = require('uglify-js');

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this-in-production';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// --- Optimizations ---
// Compress all HTTP responses (Gzip/Brotli)
app.use(compression());

// Middleware to parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Paths
const DATA_FILE = path.join(__dirname, 'assets', 'js', 'blog_data.json');
const BLOGS_DIR = path.join(__dirname, 'blogs');

// Ensure directories exist
if (!fs.existsSync(BLOGS_DIR)) {
    fs.mkdirSync(BLOGS_DIR);
}

// --- In-Memory API Cache ---
let blogDataCache = { posts: [], categories: [] };
function loadBlogDataCache() {
    if (fs.existsSync(DATA_FILE)) {
        try {
            blogDataCache = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            console.log("Blog data loaded into memory cache.");
        } catch (e) {
            console.error("Error loading blog data cache:", e);
        }
    }
}
// Load initially
loadBlogDataCache();

// Smart Caching Strategy for Maximum Performance (Must be before send)
app.use((req, res, next) => {
    // Prevent caching for HTML pages and API routes to ensure fresh content
    if (req.path.endsWith('.html') || req.path === '/' || req.path.startsWith('/api/')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
    } else {
        // Cache static assets for 1 year
        res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
    next();
});

// --- In-Memory Asset Cache for Minification ---
const assetCache = {};

// On-The-Fly Minification Middleware
app.use((req, res, next) => {
    let filePath = path.join(__dirname, req.path === '/' ? 'index.html' : req.path);
    
    // If it's a directory request, try to serve index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }

    // Only process .html, .css, .js
    const ext = path.extname(filePath);
    if (!['.html', '.css', '.js'].includes(ext)) {
        return next();
    }

    if (!fs.existsSync(filePath)) {
        // Fallback for extensionless URLs like /articles
        filePath += '.html';
        if (!fs.existsSync(filePath)) {
            return next();
        }
    }

    // Serve from cache if available
    if (assetCache[filePath]) {
        res.setHeader('Content-Type', ext === '.css' ? 'text/css' : ext === '.js' ? 'application/javascript' : 'text/html');
        // Let it fall through to cache control headers
        return res.send(assetCache[filePath]);
    }

    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let minified = content;

        if (ext === '.html') {
            minified = minifyHTML(content, {
                collapseWhitespace: true,
                removeComments: true,
                minifyCSS: true,
                minifyJS: true
            });
        } else if (ext === '.css') {
            minified = new CleanCSS({}).minify(content).styles;
        } else if (ext === '.js') {
            const result = uglifyJS.minify(content);
            if (!result.error) minified = result.code;
        }

        // Cache the minified version in RAM
        assetCache[filePath] = minified;
        
        res.setHeader('Content-Type', ext === '.css' ? 'text/css' : ext === '.js' ? 'application/javascript' : 'text/html');
        return res.send(minified);
    } catch (e) {
        console.error('Minification error:', e);
        next();
    }
});

// Serve static files with HTML extensions (pretty URLs) AND 1 year caching for CSS/JS/Images
const cacheOptions = {
    extensions: ['html'],
    maxAge: '1y', // Heavily cache static assets (super fast load times)
    etag: true
};
app.use(express.static(__dirname, cacheOptions));

// --- Auth Middleware ---
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// --- GitHub Auto-Commit Utility ---
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "master";

async function pushToGitHub(filePath, contentStr, commitMessage, isDelete = false) {
    if (!GITHUB_TOKEN || !GITHUB_REPO) return; // Silent if not configured

    try {
        const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
        
        // 1. Get file SHA if it exists
        let sha = null;
        const getRes = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Live-CMS-Robot'
            }
        });
        
        if (getRes.ok) {
            const data = await getRes.json();
            sha = data.sha;
        }

        if (isDelete && !sha) return; // Nothing to delete

        // 2. Commit the file
        const method = isDelete ? 'DELETE' : 'PUT';
        const body = { message: commitMessage, branch: GITHUB_BRANCH };
        
        if (sha) body.sha = sha;
        if (!isDelete) body.content = Buffer.from(contentStr).toString('base64');

        const commitRes = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Live-CMS-Robot'
            },
            body: JSON.stringify(body)
        });

        if (!commitRes.ok) console.error("GitHub API Commit Error:", await commitRes.text());
        else console.log(`Successfully synced ${filePath} to GitHub`);
    } catch (e) {
        console.error("GitHub Sync Error:", e);
    }
}

// --- API Endpoints ---

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } else {
        res.status(401).send("Invalid password");
    }
});

// Check Auth Endpoint (to show/hide admin controls on frontend)
app.get('/api/check-auth', authenticateToken, (req, res) => {
    res.json({ authenticated: true });
});

// Get all posts (Public) - Microsecond Response via RAM Cache
app.get('/api/data', (req, res) => {
    res.json(blogDataCache);
});

// Create or update a post (Protected)
app.post('/api/posts', authenticateToken, async (req, res) => {
    const { id, title, category, summary, content } = req.body;
    
    if (!id || !title || !content) {
        return res.status(400).send("Missing required fields");
    }

    // Write markdown file
    const mdFilePath = path.join(BLOGS_DIR, `${id}.md`);
    fs.writeFileSync(mdFilePath, content, 'utf8');

    // Update in-memory cache
    let dataObj = blogDataCache;

    const existingIndex = dataObj.posts.findIndex(p => p.id === id);
    const postMeta = {
        id,
        title,
        category: category || "Uncategorized",
        date: existingIndex >= 0 ? dataObj.posts[existingIndex].date : new Date().toISOString().split('T')[0],
        summary: summary || "",
        file: `blogs/${id}.md`
    };

    if (existingIndex >= 0) {
        dataObj.posts[existingIndex] = postMeta;
    } else {
        dataObj.posts.unshift(postMeta);
    }

    if (category && !dataObj.categories.includes(category)) {
        dataObj.categories.push(category);
    }

    const jsonData = JSON.stringify(dataObj, null, 4);
    fs.writeFileSync(DATA_FILE, jsonData, 'utf8');
    
    // Push changes to GitHub asynchronously
    pushToGitHub(`blogs/${id}.md`, content, `cms: add/update blog post ${id}`);
    pushToGitHub(`assets/js/blog_data.json`, jsonData, `cms: update blog config for ${id}`);

    res.send("Success");
});

// Delete a post (Protected)
app.delete('/api/posts/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    
    const mdFilePath = path.join(BLOGS_DIR, `${id}.md`);
    if (fs.existsSync(mdFilePath)) {
        fs.unlinkSync(mdFilePath);
    }

    // Update memory cache
    blogDataCache.posts = blogDataCache.posts.filter(p => p.id !== id);
    
    // Write to disk
    const jsonData = JSON.stringify(blogDataCache, null, 4);
    fs.writeFileSync(DATA_FILE, jsonData, 'utf8');

    // Push deletions to GitHub asynchronously
    pushToGitHub(`blogs/${id}.md`, "", `cms: delete blog post ${id}`, true);
    pushToGitHub(`assets/js/blog_data.json`, jsonData, `cms: update blog config after deleting ${id}`);

    res.send("Deleted");
});

// GitHub Diagnostic Endpoint
app.get('/api/github-test', async (req, res) => {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO;
    
    if (!GITHUB_TOKEN) return res.send("❌ Error: GITHUB_TOKEN is not set in Railway.");
    if (!GITHUB_REPO) return res.send("❌ Error: GITHUB_REPO is not set in Railway.");
    
    try {
        const url = `https://api.github.com/repos/${GITHUB_REPO}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Live-CMS-Robot'
            }
        });
        
        const data = await response.json();
        if (response.ok) {
            res.send(`✅ Success! Connected to repo: ${data.full_name}. The token has permissions: ${response.headers.get('x-oauth-scopes')}`);
        } else {
            res.send(`❌ GitHub API Error (${response.status}): ${data.message}. Make sure your repo is formatted as "username/repo" and the token has "repo" scope.`);
        }
    } catch (e) {
        res.send(`❌ Fetch Error: ${e.message}`);
    }
});

// Fallback to index.html for other routes
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Live CMS Server running at http://0.0.0.0:${PORT}`);
});
