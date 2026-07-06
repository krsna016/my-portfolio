const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const compression = require('compression');
const minifyHTML = require('html-minifier').minify;
const CleanCSS = require('clean-css');
const uglifyJS = require('uglify-js');

const { JWT_SECRET } = require('./config/env.config');
const securityHeaders = require('./middlewares/security.middleware');
const { parseCookies } = require('./middlewares/auth.middleware');

const app = express();

// Enable Gzip/Brotli compression
app.use(compression());

// Security headers
app.use(securityHeaders);

// Body parser
app.use(express.json({ limit: '10mb' }));

// In-Memory Asset Cache for Minification
const assetCache = {};

const allowedHtmlPages = [
    'index', 'articles', 'resume', 'certificates', 'contact', 'games', 'snake', 'trex', 'wp-admin'
];

// Cache-Control controls
app.use((req, res, next) => {
    const ext = path.extname(req.path);
    const isHtmlRoute = !ext || ext === '.html' || req.path === '/';
    const isApiOrDataRoute = req.path.startsWith('/api/') || ext === '.md' || ext === '.json';

    if (isHtmlRoute || isApiOrDataRoute) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
    } else {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
    next();
});

// On-The-Fly Minification Engine Middleware
app.use((req, res, next) => {
    let filePath = '';
    let isHtml = false;
    let isCss = false;
    let isJs = false;

    const ext = path.extname(req.path);

    if (req.path === '/') {
        filePath = path.join(__dirname, '../pages/index.html');
        isHtml = true;
    } else if (allowedHtmlPages.some(page => req.path === `/${page}` || req.path === `/${page}.html` || req.path === `/${page}/`)) {
        const pageName = req.path.split('/')[1].replace('.html', '');
        filePath = path.join(__dirname, '../pages', `${pageName}.html`);
        isHtml = true;
    } else if (req.path.startsWith('/assets/')) {
        filePath = path.join(__dirname, '..', req.path);
        isCss = ext === '.css';
        isJs = ext === '.js';
    } else if (req.path.startsWith('/blogs/')) {
        filePath = path.join(__dirname, '..', req.path);
    } else {
        return next();
    }

    if (!isHtml && !isCss && !isJs) {
        return next();
    }

    if (!fs.existsSync(filePath)) {
        return next();
    }

    try {
        const stats = fs.statSync(filePath);
        const mtime = stats.mtimeMs;

        if (assetCache[filePath] && assetCache[filePath].mtime === mtime) {
            res.setHeader('Content-Type', isCss ? 'text/css' : isJs ? 'application/javascript' : 'text/html');
            return res.send(assetCache[filePath].code);
        }

        let content = fs.readFileSync(filePath, 'utf8');
        let minified = content;

        if (isHtml) {
            minified = minifyHTML(content, {
                collapseWhitespace: true,
                removeComments: true,
                minifyCSS: true,
                minifyJS: true
            });
        } else if (isCss) {
            minified = new CleanCSS({}).minify(content).styles;
        } else if (isJs) {
            const result = uglifyJS.minify(content);
            if (!result.error) minified = result.code;
        }

        assetCache[filePath] = { code: minified, mtime: mtime };
        
        res.setHeader('Content-Type', isCss ? 'text/css' : isJs ? 'application/javascript' : 'text/html');
        return res.send(minified);
    } catch (e) {
        console.error('Minification error:', e);
        next();
    }
});

// Statically serve folders
app.use('/assets', express.static(path.join(__dirname, '../assets'), { maxAge: '1y', etag: true }));
app.use('/blogs', express.static(path.join(__dirname, '../blogs'), { maxAge: '1y', etag: true }));

// Serve core public documents
app.get('/manifest.json', (req, res) => res.sendFile(path.join(__dirname, '../public/manifest.json')));
app.get('/robots.txt', (req, res) => res.sendFile(path.join(__dirname, '../public/robots.txt')));
app.get('/sitemap.xml', (req, res) => res.sendFile(path.join(__dirname, '../public/sitemap.xml')));
app.get('/sw.js', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.sendFile(path.join(__dirname, '../public/sw.js'));
});

// API Routes
app.use('/api', require('./routes/auth.routes'));
app.use('/api', require('./routes/blog.routes'));
app.use('/api', require('./routes/config.routes'));

// Admin layout routing
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
        res.sendFile(path.join(__dirname, '../pages/admin_panel.html'));
    } else {
        res.sendFile(path.join(__dirname, '../pages/admin.html'));
    }
});

// Index layout routing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/index.html'));
});

// Explicit allowed HTML pages (Pretty URLs support)
allowedHtmlPages.forEach(page => {
    app.get([`/${page}`, `/${page}.html`], (req, res) => {
        res.sendFile(path.join(__dirname, '../pages', `${page}.html`));
    });
});

// SPA Routing Fallback
app.use((req, res) => {
    const isNavigation = req.accepts('html') && req.method === 'GET' && !req.path.includes('.') && !req.path.startsWith('/api/');
    if (isNavigation) {
        res.sendFile(path.join(__dirname, '../pages/index.html'));
    } else {
        res.status(404).send("File not found");
    }
});

module.exports = app;
