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
        const { difficulty, question, options, subject, correctAnswer, topic, subTopic } = req.body;

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
            correctAnswer,
            topic,
            subTopic
        });
        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.generateQuestions = async (req, res) => {
    try {
        const { subject, topic, subTopic, difficultyCounts, excludeUsed } = req.body;

        if (!subject) return res.status(400).json({ error: "Subject is required" });

        let baseQuery = { subject: new RegExp(`^${subject}$`, 'i') };
        if (topic) baseQuery.topic = new RegExp(topic, 'i');
        if (subTopic) baseQuery.subTopic = new RegExp(subTopic, 'i');

        if (excludeUsed) {
            const Test = require('../models/Test');
            const allTests = await Test.find({}, 'questions');
            const usedQuestionIds = allTests.reduce((acc, test) => {
                return acc.concat(test.questions);
            }, []);
            baseQuery.questionId = { $nin: usedQuestionIds };
        }

        let selectedQuestions = [];

        for (const [level, count] of Object.entries(difficultyCounts || {})) {
            const needed = parseInt(count);
            if (needed > 0) {
                const pipeline = [
                    { $match: { ...baseQuery, difficulty: new RegExp(`^${level}$`, 'i') } },
                    { $sample: { size: needed } }
                ];

                const randomBatch = await Question.aggregate(pipeline);

                selectedQuestions = [...selectedQuestions, ...randomBatch];
            }
        }

        res.json(selectedQuestions);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAvailableCounts = async (req, res) => {
    try {
        const { subject, topic, subTopic, excludeUsed } = req.body;

        if (!subject) return res.status(400).json({ error: "Subject is required" });

        let baseQuery = { subject: new RegExp(`^${subject}$`, 'i') };
        if (topic) baseQuery.topic = new RegExp(topic, 'i');
        if (subTopic) baseQuery.subTopic = new RegExp(subTopic, 'i');

        if (excludeUsed) {
            const Test = require('../models/Test');
            const allTests = await Test.find({}, 'questions');
            const usedQuestionIds = allTests.reduce((acc, test) => {
                return acc.concat(test.questions);
            }, []);
            baseQuery.questionId = { $nin: usedQuestionIds };
        }

        const counts = await Question.aggregate([
            { $match: baseQuery },
            { $group: { _id: { $toLower: "$difficulty" }, count: { $sum: 1 } } }
        ]);

        const result = { Easy: 0, Medium: 0, Hard: 0 };
        counts.forEach(item => {
            const diff = item._id ? (item._id.charAt(0).toUpperCase() + item._id.slice(1)) : 'Unknown';
            if (result[diff] !== undefined) {
                result[diff] = item.count;
            }
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getQuestions = async (req, res) => {
    try {
        const { excludeUsed } = req.query;
        let query = {};

        if (excludeUsed === 'true') {
            const Test = require('../models/Test');
            const allTests = await Test.find({}, 'questions');
            const usedQuestionIds = allTests.reduce((acc, test) => {
                return acc.concat(test.questions);
            }, []);

            query.questionId = { $nin: usedQuestionIds };
        }

        const questions = await Question.find(query);
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
