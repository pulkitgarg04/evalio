const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const questionRoutes = require('./questions');
const testRoutes = require('./tests');
const userRoutes = require('./user');
const subjectRoutes = require('./subjectRoutes');

router.use('/auth', authRoutes);
router.use('/questions', questionRoutes);
router.use('/tests', testRoutes);
router.use('/user', userRoutes);
router.use('/subjects', subjectRoutes);

module.exports = router;
