const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const verifyToken = require('../middleware/Auth');

router.get('/:subjectId', verifyToken, resourceController.getResourcesBySubject);

module.exports = router;
