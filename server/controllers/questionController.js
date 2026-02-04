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
