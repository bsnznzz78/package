const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  handleContactForm,
  handleAppointmentForm,
  handleNewsletterSubscription,
  handleCollegeInquiry
} = require('../controllers/formsController');
const config = require('../config');

const router = express.Router();

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many form submissions. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/contact', formLimiter, handleContactForm);
router.post('/appointment', formLimiter, handleAppointmentForm);
router.post('/newsletter', formLimiter, handleNewsletterSubscription);
router.post('/college-inquiry', formLimiter, handleCollegeInquiry);

module.exports = router;
