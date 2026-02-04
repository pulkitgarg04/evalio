const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const Auth = require('../middleware/Auth');

router.get('/profile',Auth, userController.profileInfo);

module.exports = router;