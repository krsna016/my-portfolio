require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const compression = require('compression');
const minifyHTML = require('html-minifier').minify;
const CleanCSS = require('clean-css');
const uglifyJS = require('uglify-js');

const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

if (!process.env.JWT_SECRET) {
    console.warn("⚠️ SECURITY WARNING: JWT_SECRET environment variable is missing. Generated a cryptographically secure random secret key in memory.");
}
if (ADMIN_PASSWORD === 'admin123') {
    console.warn("⚠️ SECURITY WARNING: Using fallback default ADMIN_PASSWORD ('admin123'). Set ADMIN_PASSWORD in production environment variables!");
}

// In-memory rate limiting map for login
const loginAttempts = {};

// Clean up expired rate limiter entries every 10 minutes
setInterval(() => {
    const now = Date.now();
    for (const ip in loginAttempts) {
        if (now > loginAttempts[ip].resetTime) {
            delete loginAttempts[ip];
        }
    }
}, 10 * 60 * 1000);

function rateLimitLogin(req, res, next) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    if (!loginAttempts[ip]) {
        loginAttempts[ip] = { count: 1, resetTime: now + 15 * 60 * 1000 }; // 15 mins block
    } else {
        if (now > loginAttempts[ip].resetTime) {
            // Reset block window
            loginAttempts[ip] = { count: 1, resetTime: now + 15 * 60 * 1000 };
        } else {
            loginAttempts[ip].count++;
        }
    }

    if (loginAttempts[ip].count > 5) {
        const minutesLeft = Math.ceil((loginAttempts[ip].resetTime - now) / (60 * 1000));
        return res.status(429).send(`Too many login attempts. Please try again in ${minutesLeft} minutes.`);
    }

    next();
}

// --- Optimizations ---
// Compress all HTTP responses (Gzip/Brotli)
app.use(compression());

// Browser & HTTP Security Headers Middleware (Production Hardening)
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://kit.fontawesome.com https://ka-f.fontawesome.com https://cdn.jsdelivr.net blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://kit.fontawesome.com https://ka-f.fontawesome.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com https://kit.fontawesome.com https://ka-f.fontawesome.com; img-src 'self' data: blob: https:; connect-src 'self' https://cdnjs.cloudflare.com https://kit.fontawesome.com https://ka-f.fontawesome.com https://cdn.jsdelivr.net; worker-src 'self' blob: https://cdnjs.cloudflare.com; object-src 'self' data: blob:;");
    next();
});

// Middleware to parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Paths
const DATA_FILE = path.join(__dirname, 'assets', 'js', 'data', 'blog_data.json');
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
            console.log("Blog data loaded into memory cache from JSON.");
        } catch (e) {
            console.error("Error loading blog data cache from JSON:", e);
        }
    } else {
        // Fallback: parse from assets/js/data/blog_data.js if JSON doesn't exist yet
        const jsFile = path.join(__dirname, 'assets', 'js', 'data', 'blog_data.js');
        if (fs.existsSync(jsFile)) {
            try {
                let jsContent = fs.readFileSync(jsFile, 'utf8').trim();
                // Strip "const blogData = " and trailing semicolon
                if (jsContent.startsWith('const blogData =')) {
                    jsContent = jsContent.replace(/^const blogData\s*=\s*/, '');
                }
                if (jsContent.endsWith(';')) {
                    jsContent = jsContent.slice(0, -1);
                }
                blogDataCache = JSON.parse(jsContent);
                console.log("Blog data loaded into memory cache from fallback JS.");
                // Write it to JSON to persist it
                fs.writeFileSync(DATA_FILE, JSON.stringify(blogDataCache, null, 4), 'utf8');
            } catch(e) {
                console.error("Error parsing fallback blog_data.js:", e);
            }
        }
    }
}
// Load initially
loadBlogDataCache();

// Smart Caching Strategy for Maximum Performance (Must be before send)
app.use((req, res, next) => {
    const ext = path.extname(req.path);
    // Prevent caching for HTML pages (including extensionless pretty URLs), API routes, and Blog Data to ensure fresh content
    const isHtmlRoute = !ext || ext === '.html' || req.path === '/';
    const isApiOrDataRoute = req.path.startsWith('/api/') || ext === '.md' || ext === '.json';

    if (isHtmlRoute || isApiOrDataRoute) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
    } else {
        // Cache static assets for 1 year (CSS, JS, images, fonts)
        res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
    next();
});

// --- In-Memory Asset Cache for Minification ---
const assetCache = {};

// On-The-Fly Minification Middleware
app.use((req, res, next) => {
    // Only process allowed public assets and pages
    const allowedHtmlPages = [
        'index', 'articles', 'resume', 'certificates', 'contact', 'games', 'snake', 'trex', 'wp-admin'
    ];
    const isAllowedAsset = req.path.startsWith('/assets/') || 
                           req.path.startsWith('/blogs/') || 
                           req.path === '/' || 
                           allowedHtmlPages.some(page => req.path === `/${page}` || req.path === `/${page}.html` || req.path === `/${page}/`);

    if (!isAllowedAsset) {
        return next();
    }

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

    try {
        const stats = fs.statSync(filePath);
        const mtime = stats.mtimeMs;

        // Serve from cache if available and not modified on disk
        if (assetCache[filePath] && assetCache[filePath].mtime === mtime) {
            res.setHeader('Content-Type', ext === '.css' ? 'text/css' : ext === '.js' ? 'application/javascript' : 'text/html');
            return res.send(assetCache[filePath].code);
        }

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

        // Cache the minified version in RAM with mtime
        assetCache[filePath] = { code: minified, mtime: mtime };
        
        res.setHeader('Content-Type', ext === '.css' ? 'text/css' : ext === '.js' ? 'application/javascript' : 'text/html');
        return res.send(minified);
    } catch (e) {
        console.error('Minification error:', e);
        next();
    }
});

// Serve static folders specifically (CSS, JS, media assets)
app.use('/assets', express.static(path.join(__dirname, 'assets'), { maxAge: '1y', etag: true }));
app.use('/blogs', express.static(path.join(__dirname, 'blogs'), { maxAge: '1y', etag: true }));

// Serve config and asset files explicitly with correct caching controls
app.get('/manifest.json', (req, res) => res.sendFile(path.join(__dirname, 'manifest.json')));
app.get('/robots.txt', (req, res) => res.sendFile(path.join(__dirname, 'robots.txt')));
app.get('/sitemap.xml', (req, res) => res.sendFile(path.join(__dirname, 'sitemap.xml')));
app.get('/sw.js', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.sendFile(path.join(__dirname, 'sw.js'));
});

// Explicit allowed public HTML pages (Pretty URLs support)
const allowedHtmlPages = [
    'index', 'articles', 'resume', 'certificates', 'contact', 'games', 'snake', 'trex', 'wp-admin'
];

allowedHtmlPages.forEach(page => {
    app.get([`/${page}`, `/${page}.html`], (req, res) => {
        res.sendFile(path.join(__dirname, `${page}.html`));
    });
});

// Parse cookies helper
function parseCookies(cookieHeader) {
    const list = {};
    if (!cookieHeader) return list;
    cookieHeader.split(';').forEach(cookie => {
        let parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return list;
}

// Secure Admin Routing (serve dashboard only to validated session tokens)
app.get(['/admin', '/admin.html'], (req, res) => {
    let isAuthenticated = false;
    if (req.headers.cookie) {
        const cookies = parseCookies(req.headers.cookie);
        const token = cookies['adminToken'];
        if (token) {
            try {
                jwt.verify(token, JWT_SECRET);
                isAuthenticated = true;
            } catch (err) {}
        }
    }
    
    if (isAuthenticated) {
        res.sendFile(path.join(__dirname, 'admin_panel.html'));
    } else {
        res.sendFile(path.join(__dirname, 'admin.html'));
    }
});

// Serve index.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- Auth Middleware ---
function authenticateToken(req, res, next) {
    // 1. Check Authorization header
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];
    
    // 2. Fallback to adminToken cookie
    if (!token && req.headers.cookie) {
        const cookies = parseCookies(req.headers.cookie);
        token = cookies['adminToken'];
    }
    
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
                'Content-Type': 'application/json',
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
app.post('/api/login', rateLimitLogin, (req, res) => {
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

// Check GitHub sync variables state (Protected or Public check)
app.get('/api/sync-status', (req, res) => {
    res.json({
        githubSyncActive: !!(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO),
        repo: process.env.GITHUB_REPO || null,
        branch: process.env.GITHUB_BRANCH || "master"
    });
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

    const idRegex = /^[a-zA-Z0-9_-]+$/;
    if (!idRegex.test(id)) {
        return res.status(400).send("Invalid post ID slug format. Only alphanumeric, dashes, and underscores allowed.");
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

    // Also write to fallback assets/js/data/blog_data.js to keep static hosting fallbacks in sync
    const jsDataFile = path.join(__dirname, 'assets', 'js', 'data', 'blog_data.js');
    const jsContent = `const blogData = ${jsonData};\n`;
    fs.writeFileSync(jsDataFile, jsContent, 'utf8');
    
    // Push changes to GitHub asynchronously
    pushToGitHub(`blogs/${id}.md`, content, `cms: add/update blog post ${id}`);
    pushToGitHub(`assets/js/data/blog_data.json`, jsonData, `cms: update blog config (JSON) for ${id}`);
    pushToGitHub(`assets/js/data/blog_data.js`, jsContent, `cms: update blog config (JS) for ${id}`);

    res.send("Success");
});

// Update bulk blog config (Protected)
app.post('/api/blog-config', authenticateToken, (req, res) => {
    const { posts, categories } = req.body;
    if (!posts || !categories) {
        return res.status(400).send("Missing required fields");
    }

    const dataObj = { posts, categories };
    blogDataCache = dataObj; // update RAM cache

    const jsonData = JSON.stringify(dataObj, null, 4);
    fs.writeFileSync(DATA_FILE, jsonData, 'utf8');

    const jsDataFile = path.join(__dirname, 'assets', 'js', 'data', 'blog_data.js');
    const jsContent = `const blogData = ${jsonData};\n`;
    fs.writeFileSync(jsDataFile, jsContent, 'utf8');

    // Push to GitHub
    pushToGitHub(`assets/js/data/blog_data.json`, jsonData, `cms: update bulk blog config (JSON)`);
    pushToGitHub(`assets/js/data/blog_data.js`, jsContent, `cms: update bulk blog config (JS)`);

    res.send("Success");
});

// Update unified portfolio config (Protected)
app.post('/api/save-config', authenticateToken, async (req, res) => {
    const { type, data } = req.body;
    if (!type || !Array.isArray(data)) {
        return res.status(400).send("Missing type or data array");
    }

    let filePath = "";
    let contentStr = "";
    let commitMessage = "";

    if (type === 'certificates') {
        filePath = 'assets/js/data/certificates_data.js';
        contentStr = `const certificatesData = ${JSON.stringify(data, null, 4)};\n`;
        commitMessage = "chore: auto-update certificates configuration";
    } else if (type === 'skills') {
        filePath = 'assets/js/data/skills_data.js';
        contentStr = `const skillsData = ${JSON.stringify(data, null, 4)};\n`;
        commitMessage = "chore: auto-update skills configuration";
    } else if (type === 'projects') {
        filePath = 'assets/js/data/projects_data.js';
        contentStr = `const projectsData = ${JSON.stringify(data, null, 4)};\n`;
        commitMessage = "chore: auto-update projects configuration";
    } else {
        return res.status(400).send("Invalid configuration type");
    }

    try {
        const fullLocalPath = path.join(__dirname, filePath);
        fs.writeFileSync(fullLocalPath, contentStr, 'utf8');
        
        // Auto-push to GitHub
        await pushToGitHub(filePath, contentStr, commitMessage);
        
        res.send("Success");
    } catch (e) {
        res.status(500).send(`Server error saving config: ${e.message}`);
    }
});

// Delete a post (Protected)
app.delete('/api/posts/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    const idRegex = /^[a-zA-Z0-9_-]+$/;
    if (!idRegex.test(id)) {
        return res.status(400).send("Invalid post ID slug format");
    }
    
    const mdFilePath = path.join(BLOGS_DIR, `${id}.md`);
    if (fs.existsSync(mdFilePath)) {
        fs.unlinkSync(mdFilePath);
    }

    // Update memory cache
    blogDataCache.posts = blogDataCache.posts.filter(p => p.id !== id);
    
    // Write to disk
    const jsonData = JSON.stringify(blogDataCache, null, 4);
    fs.writeFileSync(DATA_FILE, jsonData, 'utf8');

    // Also write to fallback assets/js/data/blog_data.js to keep static hosting fallbacks in sync
    const jsDataFile = path.join(__dirname, 'assets', 'js', 'data', 'blog_data.js');
    const jsContent = `const blogData = ${jsonData};\n`;
    fs.writeFileSync(jsDataFile, jsContent, 'utf8');

    // Push deletions to GitHub asynchronously
    pushToGitHub(`blogs/${id}.md`, "", `cms: delete blog post ${id}`, true);
    pushToGitHub(`assets/js/data/blog_data.json`, jsonData, `cms: update blog config after deleting ${id}`);
    pushToGitHub(`assets/js/data/blog_data.js`, jsContent, `cms: update blog config (JS) after deleting ${id}`);

    res.send("Deleted");
});

// GitHub Diagnostic Endpoint
app.get('/api/github-test', authenticateToken, async (req, res) => {
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

// Fallback to index.html for other navigation routes (SPA routing)
app.use((req, res) => {
    // Only serve index.html for page navigation requests (no extension, no API, accepts HTML)
    const isNavigation = req.accepts('html') && req.method === 'GET' && !req.path.includes('.') && !req.path.startsWith('/api/');
    if (isNavigation) {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        res.status(404).send("File not found");
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Live CMS Server running at http://0.0.0.0:${PORT}`);
});
