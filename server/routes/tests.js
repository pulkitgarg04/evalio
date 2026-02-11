const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const isAdmin = require('../middleware/isAdmin');
const isAuth = require('../middleware/Auth');

router.post('/', isAdmin, testController.createTest);
router.get('/', testController.getTests);

router.get('/:id/session', isAuth, testController.getTestSession);
router.post('/:id/start', isAuth, testController.startTestSession);
router.get('/:id', testController.getTestById);



module.exports = router;
