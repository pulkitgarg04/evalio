const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { LoginLimiter, SignupLimiter } = require("../middleware/RateLimiters");
const Auth = require('../middleware/Auth');

router.post('/signup', SignupLimiter, authController.signup);
router.post('/login', LoginLimiter, authController.login);
router.get('/verify/:token', authController.verifyMail);
router.get('/users', require('../middleware/isAdmin'), authController.getAllUsers);
router.post('/resetPasswordToken', authController.resetPasswordMail);
router.post('/resetPassword/:token', authController.resetPassowrd);
router.get('/me', Auth, authController.me);

module.exports = router;