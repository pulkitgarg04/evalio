const TestAttempt = require('../models/TestAttempt');
const Test = require('../models/Test');

exports.submitTestResult = async (req, res) => {
    try {
        const userId = req.userId;
        const { testId, answers, timeTaken } = req.body;

        if (!testId || !answers) {
            return res.status(400).json({ message: "Test ID and answers are required" });
        }

        const test = await Test.findById(testId).populate('questions');
        if (!test) {
            return res.status(404).json({ message: "Test not found" });
        }

        let correctAnswers = 0;
        const processedAnswers = [];

        for (const question of test.questions) {
            const userAnswer = answers[question._id];
            const isCorrect = userAnswer !== undefined && userAnswer === question.correctAnswer;

            if (isCorrect) correctAnswers++;

            processedAnswers.push({
                questionId: question._id,
                selectedOption: userAnswer !== undefined ? userAnswer : -1,
                isCorrect
            });
        }

        const totalQuestions = test.questions.length;
        const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

        const testAttempt = new TestAttempt({
            user: userId,
            test: testId,
            score,
            totalQuestions,
            correctAnswers,
            answers: processedAnswers,
            timeTaken: timeTaken || 0
        });

        await testAttempt.save();

        res.status(201).json({
            message: "Test result saved successfully",
            attempt: {
                id: testAttempt._id,
                score,
                correctAnswers,
                totalQuestions
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserHistory = async (req, res) => {
    try {
        const userId = req.userId;
        const { limit = 20, page = 1 } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const attempts = await TestAttempt.find({ user: userId })
            .populate('test', 'title subject duration')
            .sort({ completedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await TestAttempt.countDocuments({ user: userId });

        res.status(200).json({
            attempts,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserStats = async (req, res) => {
    try {
        const userId = req.userId;

        const attempts = await TestAttempt.find({ user: userId })
            .populate('test', 'title subject')
            .sort({ completedAt: -1 });

        if (attempts.length === 0) {
            return res.status(200).json({
                totalTests: 0,
                averageScore: 0,
                bestScore: 0,
                totalQuestions: 0,
                totalCorrect: 0,
                recentAttempts: [],
                subjectStats: {}
            });
        }

        const totalTests = attempts.length;
        const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
        const averageScore = Math.round(totalScore / totalTests);
        const bestScore = Math.max(...attempts.map(a => a.score));
        const totalQuestions = attempts.reduce((sum, a) => sum + a.totalQuestions, 0);
        const totalCorrect = attempts.reduce((sum, a) => sum + a.correctAnswers, 0);

        const subjectStats = {};
        for (const attempt of attempts) {
            const subject = attempt.test?.subject || 'Unknown';
            if (!subjectStats[subject]) {
                subjectStats[subject] = { count: 0, totalScore: 0 };
            }
            subjectStats[subject].count++;
            subjectStats[subject].totalScore += attempt.score;
        }

        for (const subject in subjectStats) {
            subjectStats[subject].averageScore = Math.round(
                subjectStats[subject].totalScore / subjectStats[subject].count
            );
        }

        const recentAttempts = attempts.slice(0, 5).map(a => ({
            id: a._id,
            testTitle: a.test?.title || 'Unknown Test',
            subject: a.test?.subject || 'Unknown',
            score: a.score,
            completedAt: a.completedAt
        }));

        res.status(200).json({
            totalTests,
            averageScore,
            bestScore,
            totalQuestions,
            totalCorrect,
            recentAttempts,
            subjectStats
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
