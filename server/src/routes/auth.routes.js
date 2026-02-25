const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

router.put('/profile', protect, require('../controllers/auth.controller').updateProfile);
router.put('/password', protect, require('../controllers/auth.controller').changePassword);

// User Management Routes
router.get('/users', protect, require('../controllers/auth.controller').getUsers);
router.post('/users/invite', protect, require('../controllers/auth.controller').inviteUser);
router.put('/users/:id/role', protect, require('../controllers/auth.controller').updateUserRole);
router.patch('/users/:id/status', protect, require('../controllers/auth.controller').updateUserStatus);
router.delete('/users/:id', protect, require('../controllers/auth.controller').deleteUser);

module.exports = router;
