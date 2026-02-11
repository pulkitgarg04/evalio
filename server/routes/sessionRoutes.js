const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const isAuth = require('../middleware/Auth');

router.get('/stats', isAuth, sessionController.getUserStats);
router.get('/history', isAuth, sessionController.getUserHistory);
router.get('/:sessionId', isAuth, sessionController.getSession);
router.post('/:sessionId/answer', isAuth, sessionController.saveAnswer);
router.post('/:sessionId/submit', isAuth, sessionController.submitTest);

module.exports = router;
