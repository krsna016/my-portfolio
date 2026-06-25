require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const compression = require('compression');

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

// Force NO caching anywhere (to break through Cloudflare/Railway CDN edge caching)
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});

// Serve static files with HTML extensions (pretty URLs) AND aggressive caching disabled
const cacheOptions = {
    extensions: ['html'],
    maxAge: 0,
    etag: false
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

// Get all posts (Public)
app.get('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send("Error reading data");
        }
        res.json(JSON.parse(data));
    });
});

// Create or update a post (Protected)
app.post('/api/posts', authenticateToken, (req, res) => {
    const { id, title, category, summary, content } = req.body;
    
    if (!id || !title || !content) {
        return res.status(400).send("Missing required fields");
    }

    // Write markdown file
    const mdFilePath = path.join(BLOGS_DIR, `${id}.md`);
    fs.writeFileSync(mdFilePath, content, 'utf8');

    // Update blog_data.json
    let dataObj = { posts: [], categories: [] };
    if (fs.existsSync(DATA_FILE)) {
        dataObj = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }

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

    fs.writeFileSync(DATA_FILE, JSON.stringify(dataObj, null, 4), 'utf8');
    
    res.send("Success");
});

// Delete a post (Protected)
app.delete('/api/posts/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    
    const mdFilePath = path.join(BLOGS_DIR, `${id}.md`);
    if (fs.existsSync(mdFilePath)) {
        fs.unlinkSync(mdFilePath);
    }

    if (fs.existsSync(DATA_FILE)) {
        const dataObj = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        dataObj.posts = dataObj.posts.filter(p => p.id !== id);
        fs.writeFileSync(DATA_FILE, JSON.stringify(dataObj, null, 4), 'utf8');
    }

    res.send("Deleted");
});

// Fallback to index.html for other routes
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Live CMS Server running at http://0.0.0.0:${PORT}`);
});
