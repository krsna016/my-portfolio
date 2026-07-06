const fs = require('fs');
const path = require('path');
const { DATA_FILE, BLOGS_DIR } = require('../config/env.config');
const { pushToGitHub } = require('../utils/github');

// Ensure directories exist
if (!fs.existsSync(BLOGS_DIR)) {
    fs.mkdirSync(BLOGS_DIR, { recursive: true });
}

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
        const jsFile = path.join(__dirname, '../../assets/js/data/blog_data.js');
        if (fs.existsSync(jsFile)) {
            try {
                let jsContent = fs.readFileSync(jsFile, 'utf8').trim();
                if (jsContent.startsWith('const blogData =')) {
                    jsContent = jsContent.replace(/^const blogData\s*=\s*/, '');
                }
                if (jsContent.endsWith(';')) {
                    jsContent = jsContent.slice(0, -1);
                }
                blogDataCache = JSON.parse(jsContent);
                console.log("Blog data loaded into memory cache from fallback JS.");
                fs.writeFileSync(DATA_FILE, JSON.stringify(blogDataCache, null, 4), 'utf8');
            } catch(e) {
                console.error("Error parsing fallback blog_data.js:", e);
            }
        }
    }
}

// Load initially
loadBlogDataCache();

function getData(req, res) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.json(blogDataCache);
}

async function createOrUpdatePost(req, res) {
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

    const existingIndex = blogDataCache.posts.findIndex(p => p.id === id);
    const postMeta = {
        id,
        title,
        category: category || "Uncategorized",
        date: existingIndex >= 0 ? blogDataCache.posts[existingIndex].date : new Date().toISOString().split('T')[0],
        summary: summary || "",
        file: `blogs/${id}.md`
    };

    if (existingIndex >= 0) {
        blogDataCache.posts[existingIndex] = postMeta;
    } else {
        blogDataCache.posts.unshift(postMeta);
    }

    if (category && !blogDataCache.categories.includes(category)) {
        blogDataCache.categories.push(category);
    }

    const jsonData = JSON.stringify(blogDataCache, null, 4);
    fs.writeFileSync(DATA_FILE, jsonData, 'utf8');

    const jsDataFile = path.join(__dirname, '../../assets/js/data/blog_data.js');
    const jsContent = `const blogData = ${jsonData};\n`;
    fs.writeFileSync(jsDataFile, jsContent, 'utf8');
    
    // Background GitHub sync
    (async () => {
        try {
            await pushToGitHub(`blogs/${id}.md`, content, `cms: add/update blog post ${id}`);
            await pushToGitHub(`assets/js/data/blog_data.json`, jsonData, `cms: update blog config (JSON) for ${id}`);
            await pushToGitHub(`assets/js/data/blog_data.js`, jsContent, `cms: update blog config (JS) for ${id}`);
        } catch (e) {
            console.error("Error in sequential GitHub push:", e);
        }
    })();

    res.send("Success");
}

function updateBlogConfig(req, res) {
    const { posts, categories } = req.body;
    if (!posts || !categories) {
        return res.status(400).send("Missing required fields");
    }

    const dataObj = { posts, categories };
    blogDataCache = dataObj;

    const jsonData = JSON.stringify(dataObj, null, 4);
    fs.writeFileSync(DATA_FILE, jsonData, 'utf8');

    const jsDataFile = path.join(__dirname, '../../assets/js/data/blog_data.js');
    const jsContent = `const blogData = ${jsonData};\n`;
    fs.writeFileSync(jsDataFile, jsContent, 'utf8');

    (async () => {
        try {
            await pushToGitHub(`assets/js/data/blog_data.json`, jsonData, `cms: update bulk blog config (JSON)`);
            await pushToGitHub(`assets/js/data/blog_data.js`, jsContent, `cms: update bulk blog config (JS)`);
        } catch (e) {
            console.error("Error in sequential GitHub push:", e);
        }
    })();

    res.send("Success");
}

async function deletePost(req, res) {
    const { id } = req.params;

    const idRegex = /^[a-zA-Z0-9_-]+$/;
    if (!idRegex.test(id)) {
        return res.status(400).send("Invalid post ID slug format");
    }
    
    const mdFilePath = path.join(BLOGS_DIR, `${id}.md`);
    if (fs.existsSync(mdFilePath)) {
        fs.unlinkSync(mdFilePath);
    }

    blogDataCache.posts = blogDataCache.posts.filter(p => p.id !== id);
    
    const jsonData = JSON.stringify(blogDataCache, null, 4);
    fs.writeFileSync(DATA_FILE, jsonData, 'utf8');

    const jsDataFile = path.join(__dirname, '../../assets/js/data/blog_data.js');
    const jsContent = `const blogData = ${jsonData};\n`;
    fs.writeFileSync(jsDataFile, jsContent, 'utf8');

    (async () => {
        try {
            await pushToGitHub(`blogs/${id}.md`, "", `cms: delete blog post ${id}`, true);
            await pushToGitHub(`assets/js/data/blog_data.json`, jsonData, `cms: update blog config after deleting ${id}`);
            await pushToGitHub(`assets/js/data/blog_data.js`, jsContent, `cms: update blog config (JS) after deleting ${id}`);
        } catch (e) {
            console.error("Error in sequential GitHub delete:", e);
        }
    })();

    res.send("Deleted");
}

module.exports = {
    getData,
    createOrUpdatePost,
    updateBlogConfig,
    deletePost
};
