const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH } = require('../config/env.config');

async function pushToGitHub(filePath, contentStr, commitMessage, isDelete = false) {
    if (!GITHUB_TOKEN || !GITHUB_REPO) return; // Silent if not configured

    try {
        const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
        
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

module.exports = {
    pushToGitHub
};
