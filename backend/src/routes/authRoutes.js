const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  register,
  login,
  logout,
  getCurrentAdmin,
  requestPasswordReset,
  resetPassword
} = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const config = require('../config');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.loginMax,
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentAdmin);
router.post('/password/request-reset', requestPasswordReset);
router.post('/password/reset', resetPassword);

module.exports = router;
