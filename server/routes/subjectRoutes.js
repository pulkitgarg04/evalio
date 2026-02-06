const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const isAdmin = require('../middleware/isAdmin');

router.post('/', isAdmin, subjectController.createSubject);
router.get('/', subjectController.getAllSubjects);
router.delete('/:id', isAdmin, subjectController.deleteSubject);

module.exports = router;
