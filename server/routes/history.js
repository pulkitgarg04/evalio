const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const Auth = require('../middleware/Auth');

router.post('/', Auth, historyController.submitTestResult);
router.get('/', Auth, historyController.getUserHistory);
router.get('/stats', Auth, historyController.getUserStats);

module.exports = router;
