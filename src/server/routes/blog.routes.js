const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.get('/data', blogController.getData);
router.post('/posts', authenticateToken, blogController.createOrUpdatePost);
router.post('/blog-config', authenticateToken, blogController.updateBlogConfig);
router.delete('/posts/:id', authenticateToken, blogController.deletePost);

module.exports = router;
