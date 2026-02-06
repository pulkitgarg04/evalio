const Test = require('../models/Test');

exports.createTest = async (req, res) => {
    try {
        const { title, subject, description, duration, questions } = req.body;
        const newTest = new Test({
            title,
            subject,
            description,
            duration,
            questions
        });
        await newTest.save();
        res.status(201).json(newTest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTests = async (req, res) => {
    try {
        const { subject } = req.query;
        let query = {};
        if (subject) {
            query.subject = subject;
        }
        const tests = await Test.find(query);
        res.json(tests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTestById = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        res.json(test);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
