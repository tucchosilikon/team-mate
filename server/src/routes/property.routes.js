const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const {
    getProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    uploadImage,
    getPublicProperties,
    getPublicProperty
} = require('../controllers/property.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public routes (no auth required)
router.get('/public', getPublicProperties);
router.get('/public/:id', getPublicProperty);

// Protected routes
router.route('/')
    .get(protect, getProperties)
    .post(protect, authorize('ADMIN', 'TEAM'), createProperty);

router.route('/:id')
    .get(protect, getProperty)
    .put(protect, authorize('ADMIN', 'TEAM'), updateProperty)
    .delete(protect, authorize('ADMIN'), deleteProperty);

router.route('/:id/images')
    .post(protect, authorize('ADMIN', 'TEAM'), upload.array('images', 10), uploadImage);

module.exports = router;
