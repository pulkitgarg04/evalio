const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const isAdmin = require('../middleware/isAdmin');

router.post('/', isAdmin, testController.createTest);
router.get('/', testController.getTests);

module.exports = router;
