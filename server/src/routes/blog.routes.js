const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { getBlogs, getBlog, createBlog, updateBlog, deleteBlog } = require('../controllers/blog.controller');

// Public routes
router.get('/', getBlogs);
router.get('/:id', getBlog);

// Protected routes (admin/team only)
router.post('/', protect, authorize('ADMIN', 'TEAM'), createBlog);
router.put('/:id', protect, authorize('ADMIN', 'TEAM'), updateBlog);
router.delete('/:id', protect, authorize('ADMIN', 'TEAM'), deleteBlog);

module.exports = router;
