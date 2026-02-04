const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {LoginLimiter, SignupLimiter} = require("../middleware/RateLimiters");

router.post('/signup', SignupLimiter ,authController.signup);
router.post('/login', LoginLimiter, authController.login);
router.get('/verify/:token', authController.verifyMail);

module.exports = router;
