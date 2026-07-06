const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { rateLimitLogin } = require('../middlewares/rate-limiter.middleware');

router.post('/login', rateLimitLogin, authController.login);
router.get('/check-auth', authenticateToken, authController.checkAuth);

module.exports = router;
