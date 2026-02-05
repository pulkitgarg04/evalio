const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const isAdmin = require('../middleware/isAdmin');

router.post('/', isAdmin, questionController.createQuestion);
router.post('/bulk', isAdmin, questionController.bulkCreateQuestions);
router.get('/', questionController.getQuestions);

module.exports = router;
