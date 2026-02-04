const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const questionRoutes = require('./questions');
const testRoutes = require('./tests');
const userRoutes = require('./user');

router.use('/auth', authRoutes);
router.use('/questions', questionRoutes);
router.use('/tests', testRoutes);
router.use('user', userRoutes);

module.exports = router;
