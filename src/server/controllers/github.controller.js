const fs = require('fs');
const path = require('path');

function getSyncStatus(req, res) {
    res.json({
        githubSyncActive: !!(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO),
        repo: process.env.GITHUB_REPO || null,
        branch: process.env.GITHUB_BRANCH || "master"
    });
}

function saveGithubSettings(req, res) {
    const { repo, token, branch } = req.body;
    if (!repo) {
        return res.status(400).send("Repository name is required.");
    }

    try {
        const envPath = path.join(__dirname, '../../../.env');
        let envContent = '';
        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
        }

        const updateEnvVar = (content, key, value) => {
            const regex = new RegExp(`^${key}=.*$`, 'm');
            if (regex.test(content)) {
                return content.replace(regex, `${key}=${value}`);
            } else {
                return content + (content.endsWith('\n') ? '' : '\n') + `${key}=${value}\n`;
            }
        };

        envContent = updateEnvVar(envContent, 'GITHUB_REPO', repo);
        process.env.GITHUB_REPO = repo;

        if (token && token !== '***SERVER_CONFIGURED***') {
            envContent = updateEnvVar(envContent, 'GITHUB_TOKEN', token);
            process.env.GITHUB_TOKEN = token;
        }

        envContent = updateEnvVar(envContent, 'GITHUB_BRANCH', branch || 'master');
        process.env.GITHUB_BRANCH = branch || 'master';

        fs.writeFileSync(envPath, envContent, 'utf8');

        console.log("GitHub sync settings updated successfully in .env and memory.");
        res.json({ success: true, message: "Settings saved permanently to .env file!" });
    } catch (e) {
        console.error("Error saving GitHub settings:", e);
        res.status(500).send(`Server error saving settings: ${e.message}`);
    }
}

async function testGithubConnection(req, res) {
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
}

module.exports = {
    getSyncStatus,
    saveGithubSettings,
    testGithubConnection
};
