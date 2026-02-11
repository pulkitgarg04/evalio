const Question = require('../models/Question');
const Test = require('../models/Test');
const TestSession = require('../models/TestSession');

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

        const questions = await Question.find({ questionId: { $in: test.questions } });
        const orderedQuestions = test.questions.map(id => questions.find(q => q.questionId === id)).filter(Boolean);

        const testObj = test.toObject();
        testObj.questions = orderedQuestions;

        res.json(testObj);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.startTestSession = async (req, res) => {
    try {
        const userId = req.userId;
        const testId = req.params.id;

        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: "Test not found" });
        }

        const existingSession = await TestSession.findOne({
            user: userId,
            test: testId,
            status: 'IN_PROGRESS'
        });

        if (existingSession) {
            const remaining = new Date(existingSession.endTime).getTime() - Date.now();

            if (remaining > 0) {
                return res.status(200).json({
                    message: "Resuming test session",
                    sessionId: existingSession._id,
                    startTime: existingSession.startTime,
                    endTime: existingSession.endTime,
                    remainingTime: Math.floor(remaining / 1000)
                });
            } else {
                existingSession.status = 'EXPIRED';
                await existingSession.save();
            }
        }

        const durationInMinutes = test.duration || 30;
        const endTime = new Date(Date.now() + durationInMinutes * 60000);

        const newSession = new TestSession({
            user: userId,
            test: testId,
            status: 'IN_PROGRESS',
            endTime: endTime
        });

        await newSession.save();

        res.status(201).json({
            message: "Test session started",
            sessionId: newSession._id,
            startTime: newSession.startTime,
            endTime: newSession.endTime,
            remainingTime: durationInMinutes * 60
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTestSession = async (req, res) => {
    try {
        const userId = req.userId;
        const testId = req.params.id;

        const session = await TestSession.findOne({
            user: userId,
            test: testId,
            status: 'active'
        });

        if (!session) {
            return res.status(404).json({ message: "No active session found" });
        }

        res.json(session);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
