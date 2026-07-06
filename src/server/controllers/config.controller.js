const fs = require('fs');
const path = require('path');
const { pushToGitHub } = require('../utils/github');

async function saveConfig(req, res) {
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
        const fullLocalPath = path.join(__dirname, '../../', filePath);
        fs.writeFileSync(fullLocalPath, contentStr, 'utf8');
        
        await pushToGitHub(filePath, contentStr, commitMessage);
        
        res.send("Success");
    } catch (e) {
        res.status(500).send(`Server error saving config: ${e.message}`);
    }
}

module.exports = {
    saveConfig
};
