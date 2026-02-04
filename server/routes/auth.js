const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {LoginLimiter, SignupLimiter} = require("../middleware/RateLimiters");

router.post('/signup', SignupLimiter ,authController.signup);
router.post('/login', LoginLimiter, authController.login);
router.get('/verify/:token', authController.verifyMail);
router.post('/resetPasswordToken', authController.resetPasswordMail);
router.post('/resetPassword/:token', authController.resetPassowrd);

module.exports = router;