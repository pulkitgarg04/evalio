const TestSession = require('../models/TestSession');
const TestAnswer = require('../models/TestAnswer');
const Test = require('../models/Test');
const Question = require('../models/Question');

exports.getUserStats = async (req, res) => {
    try {
        const sessions = await TestSession.find({
            user: req.userId,
            status: 'SUBMITTED'
        }).populate('test', 'title subject');

        const totalTests = sessions.length;
        if (totalTests === 0) {
            return res.json({
                overview: { totalTests: 0, averageScore: 0, averageAccuracy: 0 },
                subjectAnalysis: []
            });
        }

        let totalScore = 0;
        let totalAccuracy = 0;
        const subjectMap = {};

        sessions.forEach(session => {
            totalScore += session.score || 0;
            const accuracy = (session.totalQuestions > 0) ? (session.correctAnswers / session.totalQuestions) * 100 : 0;
            totalAccuracy += accuracy;

            const subject = session.test?.subject || 'Uncategorized';
            if (!subjectMap[subject]) {
                subjectMap[subject] = { totalQuestions: 0, correctAnswers: 0, distinctTests: 0 };
            }
            subjectMap[subject].totalQuestions += (session.totalQuestions || 0);
            subjectMap[subject].correctAnswers += (session.correctAnswers || 0);
            subjectMap[subject].distinctTests += 1;
        });

        const subjectAnalysis = Object.keys(subjectMap).map(subject => {
            const data = subjectMap[subject];
            const accuracy = (data.totalQuestions > 0) ? Math.round((data.correctAnswers / data.totalQuestions) * 100) : 0;
            return {
                subject,
                accuracy,
                totalTests: data.distinctTests,
                weakness: accuracy < 60
            };
        }).sort((a, b) => a.accuracy - b.accuracy);

        res.json({
            overview: {
                totalTests,
                averageScore: Math.round(totalScore / totalTests),
                averageAccuracy: Math.round(totalAccuracy / totalTests)
            },
            subjectAnalysis
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserHistory = async (req, res) => {
    try {
        const sessions = await TestSession.find({
            user: req.userId,
            status: { $in: ['SUBMITTED', 'EXPIRED'] }
        })
            .sort({ updatedAt: -1 })
            .populate('test', 'title subject duration');

        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await TestSession.findById(sessionId);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        if (session.user.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized access to session" });
        }

        const remaining = new Date(session.endTime).getTime() - Date.now();
        if (remaining <= 0 && session.status === 'IN_PROGRESS') {
            session.status = 'EXPIRED';
            await session.save();
        }

        const answers = await TestAnswer.find({ session: sessionId });

        let resultAnalysis = null;
        if (session.status === 'SUBMITTED' || session.status === 'EXPIRED') {
            const test = await Test.findById(session.test);
            const questions = await Question.find({ questionId: { $in: test.questions } });

            const answerMap = {};
            answers.forEach(a => answerMap[a.question.toString()] = a);

            const questionMap = {};
            questions.forEach(q => questionMap[q.questionId] = q);

            const topicStats = {};
            const difficultyStats = {};

            resultAnalysis = test.questions.map(qIdString => {
                const question = questionMap[qIdString];
                if (!question) return null;

                const ans = answerMap[question._id.toString()];
                const selectedOption = ans ? ans.selectedOption : undefined;
                const isCorrect = selectedOption === question.correctAnswer;
                const isAnswered = selectedOption !== undefined;

                const topic = question.topic || 'Uncategorized';
                if (!topicStats[topic]) {
                    topicStats[topic] = { total: 0, correct: 0, incorrect: 0, unanswered: 0 };
                }
                topicStats[topic].total++;
                if (isCorrect) topicStats[topic].correct++;
                else if (isAnswered) topicStats[topic].incorrect++;
                else topicStats[topic].unanswered++;

                const difficulty = question.difficulty || 'Unknown';
                if (!difficultyStats[difficulty]) {
                    difficultyStats[difficulty] = { total: 0, correct: 0, incorrect: 0, unanswered: 0 };
                }
                difficultyStats[difficulty].total++;
                if (isCorrect) difficultyStats[difficulty].correct++;
                else if (isAnswered) difficultyStats[difficulty].incorrect++;
                else difficultyStats[difficulty].unanswered++;

                return {
                    id: question._id,
                    text: question.question,
                    options: question.options,
                    correctAnswer: question.correctAnswer,
                    selectedOption: selectedOption,
                    isCorrect: isCorrect,
                    difficulty: question.difficulty,
                    topic: question.topic,
                    subTopic: question.subTopic
                };
            }).filter(Boolean);

            const formatStats = (statsObj) => {
                return Object.entries(statsObj).map(([key, data]) => ({
                    name: key,
                    total: data.total,
                    correct: data.correct,
                    incorrect: data.incorrect,
                    unanswered: data.unanswered,
                    accuracy: Math.round((data.correct / data.total) * 100)
                })).sort((a, b) => a.accuracy - b.accuracy);
            };

            var topicAnalysis = formatStats(topicStats);
            var difficultyAnalysis = formatStats(difficultyStats);
        }

        res.json({
            session,
            remainingTime: Math.max(0, Math.floor(remaining / 1000)),
            answers,
            resultAnalysis,
            topicAnalysis,
            difficultyAnalysis
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.saveAnswer = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { questionId, selectedOption } = req.body;

        const session = await TestSession.findById(sessionId);

        if (!session || session.status !== 'IN_PROGRESS') {
            return res.status(400).json({ message: "Session not active" });
        }

        if (new Date(session.endTime).getTime() < Date.now()) {
            session.status = 'EXPIRED';
            await session.save();
            return res.status(400).json({ message: "Time expired" });
        }

        if (session.user.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await TestAnswer.findOneAndUpdate(
            { session: sessionId, question: questionId },
            { selectedOption },
            { upsert: true, new: true }
        );

        session.lastActiveAt = Date.now();
        await session.save();

        res.json({ message: "Saved" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.submitTest = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await TestSession.findById(sessionId);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        if (session.user.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (session.status === 'SUBMITTED') {
            return res.status(400).json({ message: "Test already submitted" });
        }

        const test = await Test.findById(session.test);
        const questions = await Question.find({ questionId: { $in: test.questions } });
        const answers = await TestAnswer.find({ session: sessionId });
        const questionMap = {};
        questions.forEach(q => {
            questionMap[q._id.toString()] = q;
        });

        let correct = 0;
        let incorrect = 0;

        answers.forEach(ans => {
            const question = questionMap[ans.question.toString()];
            if (question) {
                if (ans.selectedOption === question.correctAnswer) {
                    correct++;
                } else {
                    incorrect++;
                }
            }
        });

        const totalQuestions = test.questions.length;
        const unanswered = totalQuestions - (correct + incorrect);

        session.score = correct;
        session.totalQuestions = totalQuestions;
        session.correctAnswers = correct;
        session.incorrectAnswers = incorrect;
        session.unanswered = unanswered;

        if (new Date(session.endTime).getTime() < Date.now()) {
            session.status = 'EXPIRED';
        } else {
            session.status = 'SUBMITTED';
        }

        session.submittedAt = Date.now();
        await session.save();

        res.json({
            message: "Test submitted successfully",
            status: session.status,
            results: {
                score: correct,
                total: totalQuestions,
                correct,
                incorrect,
                unanswered
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
