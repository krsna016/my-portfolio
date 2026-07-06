const express = require('express');
const router = express.Router();
const configController = require('../controllers/config.controller');
const githubController = require('../controllers/github.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.post('/save-config', authenticateToken, configController.saveConfig);
router.get('/sync-status', githubController.getSyncStatus);
router.post('/save-github-settings', authenticateToken, githubController.saveGithubSettings);
router.get('/github-test', authenticateToken, githubController.testGithubConnection);

module.exports = router;
