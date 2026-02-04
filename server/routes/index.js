const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const questionRoutes = require('./questions');
const testRoutes = require('./tests');

router.use('/auth', authRoutes);
router.use('/questions', questionRoutes);
router.use('/tests', testRoutes);

module.exports = router;
