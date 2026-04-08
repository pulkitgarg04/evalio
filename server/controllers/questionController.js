const Question = require('../models/Question');
const Subject = require('../models/Subject');
const Test = require('../models/Test');

const generateQuestionId = async (subjectName) => {
    const subject = await Subject.findOneAndUpdate(
        { name: subjectName },
        { $inc: { questionCount: 1 } },
        { new: true } // return the updated document
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

        const filter = { subject };
        if (topic) filter.topic = topic;
        if (subTopic) filter.subTopic = subTopic;

        if (excludeUsed) {
            const tests = await Test.find({}, 'questions');
            const usedIds = [];

            for (const test of tests) {
                usedIds.push(...test.questions);
            }

            filter.questionId = { $nin: usedIds }; // nin: not in
        }

        const allQuestions = [];

        for (const difficulty of ['Easy', 'Medium', 'Hard']) {
            const count = difficultyCounts[difficulty] || 0;
            if (count > 0) {
                const questions = await Question.aggregate([
                    { $match: { ...filter, difficulty } },
                    { $sample: { size: count } }
                ]);

                allQuestions.push(...questions);
            }
        }

        res.json(allQuestions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAvailableCounts = async (req, res) => {
    try {
        const { subject, topic, subTopic, excludeUsed } = req.body;

        if (!subject) return res.status(400).json({ error: "Subject is required" });

        const filter = { subject };
        if (topic) filter.topic = topic;
        if (subTopic) filter.subTopic = subTopic;

        if (excludeUsed) {
            const tests = await Test.find({}, 'questions');
            const usedIds = [];

            for (const test of tests) {
                usedIds.push(...test.questions);
            }

            filter.questionId = { $nin: usedIds };
        }

        const counts = await Question.aggregate([
            { $match: filter },
            { $group: { _id: '$difficulty', count: { $sum: 1 } } }
        ]);

        const result = { Easy: 0, Medium: 0, Hard: 0 };

        for (const item of counts) {
            if (item._id === 'Easy') result.Easy = item.count;
            if (item._id === 'Medium') result.Medium = item.count;
            if (item._id === 'Hard') result.Hard = item.count;
        }

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

        const grouped = {};

        for (const item of questions) {
            if (!item.subject) {
                return res.status(400).json({ error: "Subject is required for all questions" });
            }

            if (!grouped[item.subject]) {
                grouped[item.subject] = [];
            }

            grouped[item.subject].push(item);
        }

        const finalQuestions = [];

        for (const subjectName in grouped) {
            const subjectQuestions = grouped[subjectName];
            const count = subjectQuestions.length;

            const subject = await Subject.findOneAndUpdate(
                { name: subjectName },
                { $inc: { questionCount: count } },
                { new: true }
            );

            if (!subject) {
                return res.status(400).json({ error: `Subject '${subjectName}' not found.` });
            }

            let nextId = subject.questionCount - count + 1;

            for (const q of subjectQuestions) {
                q.questionId = `${subject.name.replace(/\s+/g, '')}-${nextId}`;
                finalQuestions.push(q);
                nextId++;
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

exports.getQuestionBank = async (req, res) => {
    try {
        const { subject, topic, subTopic, page = 1, limit = 50, excludeUsed } = req.query;
        const query = {};

        if (subject) {
            query.subject = subject;
        }

        if (topic) {
            query.topic = topic;
        }

        if (subTopic) {
            query.subTopic = subTopic;
        }

        if (excludeUsed === 'true') {
            const tests = await Test.find({}, 'questions').lean();
            const usedIds = [];

            for (const test of tests) {
                usedIds.push(...(test.questions || []));
            }

            query.questionId = { $nin: usedIds };
        }

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        const total = await Question.countDocuments(query);
        const questions = await Question.find(query)
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber) // no. of documents to skip = (page - 1) * limit
            .limit(limitNumber);

        res.json({
            questions,
            totalPages: Math.ceil(total / limitNumber),
            currentPage: pageNumber,
            total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
