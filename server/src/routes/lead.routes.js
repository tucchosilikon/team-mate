const express = require('express');
const router = express.Router();
const {
    getLeads,
    createLead,
    updateLead,
    updateLeadStatus,
} = require('../controllers/lead.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
    .get(protect, getLeads)
    .post(protect, createLead);

router.route('/:id')
    .put(protect, updateLead);

router.patch('/:id/status', protect, updateLeadStatus);

module.exports = router;
