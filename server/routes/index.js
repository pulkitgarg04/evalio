const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');
const subjectRoutes = require('./subjectRoutes');
const testRoutes = require('./tests');
const questionRoutes = require('./questions');
const resourceRoutes = require('./resources');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/subjects', subjectRoutes);
router.use('/tests', testRoutes);
router.use('/questions', questionRoutes);
router.use('/resources', resourceRoutes);

module.exports = router;
