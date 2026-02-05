const Question = require('../models/Question');

exports.createQuestion = async (req, res) => {
    try {
        const { questionId, difficulty, question, options, subject, correctAnswer } = req.body;
        const newQuestion = new Question({
            questionId,
            difficulty,
            question,
            options,
            subject,
            correctAnswer
        });
        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.bulkCreateQuestions = async (req, res) => {
    try {
        const { questions } = req.body;

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: "No questions provided" });
        }

        const createdQuestions = await Question.insertMany(questions);

        res.status(201).json({
            message: "Bulk upload successful",
            count: createdQuestions.length,
            questions: createdQuestions
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Duplicate Question ID detected. Please ensure all IDs are unique." });
        }
        res.status(400).json({ error: error.message });
    }
};
