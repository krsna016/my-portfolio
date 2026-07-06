const path = require('path');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || (() => {
    console.warn("⚠️ SECURITY WARNING: JWT_SECRET environment variable is missing. Generated a cryptographically secure random secret key in memory.");
    return crypto.randomBytes(64).toString('hex');
})();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (() => {
    console.warn("⚠️ SECURITY WARNING: Using fallback default ADMIN_PASSWORD ('admin123'). Set ADMIN_PASSWORD in production environment variables!");
    return 'admin123';
})();

module.exports = {
    PORT: process.env.PORT || 8000,
    JWT_SECRET,
    ADMIN_PASSWORD,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
    GITHUB_REPO: process.env.GITHUB_REPO || '',
    GITHUB_OWNER: process.env.GITHUB_OWNER || '',
    GITHUB_BRANCH: process.env.GITHUB_BRANCH || 'master',
    DATA_FILE: path.join(__dirname, '../../assets/js/data/blog_data.json'),
    BLOGS_DIR: path.join(__dirname, '../../blogs')
};
