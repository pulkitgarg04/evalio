const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const isAuth = require('../middleware/Auth');

router.get('/stats', isAuth, sessionController.getUserStats);
router.get('/history', isAuth, sessionController.getUserHistory);
router.get('/:sessionId/review', isAuth, sessionController.getSessionReview);
router.get('/:sessionId', isAuth, sessionController.getSession);
router.post('/:sessionId/answer', isAuth, sessionController.saveAnswer);
router.put('/:sessionId/state', isAuth, sessionController.updateState);
router.post('/:sessionId/submit', isAuth, sessionController.submitTest);

module.exports = router;
