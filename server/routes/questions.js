const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const isAdmin = require('../middleware/isAdmin');

router.post('/', isAdmin, questionController.createQuestion);
router.post('/bulk', isAdmin, questionController.bulkCreateQuestions);
router.post('/generate', isAdmin, questionController.generateQuestions);
router.post('/available-counts', isAdmin, questionController.getAvailableCounts);
router.get('/', questionController.getQuestions);

module.exports = router;
