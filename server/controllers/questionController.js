const Question = require('../models/Question');
const Subject = require('../models/Subject');

const generateQuestionId = async (subjectName) => {
    const subject = await Subject.findOneAndUpdate(
        { name: subjectName },
        { $inc: { questionCount: 1 } },
        { new: true }
    );

    if (!subject) {
        throw new Error(`Subject '${subjectName}' not found. Please create the subject first.`);
    }

    return `${subject.name.replace(/\s+/g, '')}-${subject.questionCount}`;
};

exports.createQuestion = async (req, res) => {
    try {
        const { difficulty, question, options, subject, correctAnswer } = req.body;

        if (!subject) {
            return res.status(400).json({ error: "Subject is required" });
        }

        const questionId = await generateQuestionId(subject);

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

        const questionsBySubject = {};
        for (const q of questions) {
            if (!q.subject) {
                return res.status(400).json({ error: "Subject is required for all questions" });
            }
            if (!questionsBySubject[q.subject]) {
                questionsBySubject[q.subject] = [];
            }
            questionsBySubject[q.subject].push(q);
        }

        const finalQuestions = [];

        for (const [subjectName, subjectQuestions] of Object.entries(questionsBySubject)) {
            const count = subjectQuestions.length;
            const subject = await Subject.findOneAndUpdate(
                { name: subjectName },
                { $inc: { questionCount: count } },
                { new: true }
            );

            if (!subject) {
                return res.status(400).json({ error: `Subject '${subjectName}' not found.` });
            }

            let currentId = subject.questionCount - count + 1;
            for (const q of subjectQuestions) {
                q.questionId = `${subject.name.replace(/\s+/g, '')}-${currentId}`;
                finalQuestions.push(q);
                currentId++;
            }
        }

        const createdQuestions = await Question.insertMany(finalQuestions);

        res.status(201).json({
            message: "Bulk upload successful",
            count: createdQuestions.length,
            questions: createdQuestions
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Duplicate Question ID detected." });
        }
        res.status(400).json({ error: error.message });
    }
};
