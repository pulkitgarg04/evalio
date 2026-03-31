const TestSession = require('../models/TestSession');
const {
    createReport,
    finalizeSession,
    getAnswerMapForSession,
    getQuestionsForTest
} = require('../utils/sessionLifecycle');

async function finalizeIfNeeded(session) {
    if (!session || session.status !== 'IN_PROGRESS') {
        return session;
    }

    if (new Date(session.endTime).getTime() > Date.now()) {
        return session;
    }

    await finalizeSession(session, { status: 'EXPIRED' });

    return TestSession.findById(session._id);
}

async function finalizeExpiredSessionsForUser(userId) {
    const expiredSessions = await TestSession.find({
        user: userId,
        status: 'IN_PROGRESS',
        endTime: { $lte: new Date() }
    });

    for (const session of expiredSessions) {
        await finalizeSession(session, { status: 'EXPIRED' });
    }
}

function convertAnswerMapToList(answerMap) {
    const answers = [];

    for (const questionId in answerMap) {
        answers.push({
            question: questionId,
            selectedOption: answerMap[questionId]
        });
    }

    return answers;
}

function createCompletedSessionPayload(session, answerMap, state, analysis) {
    const remainingMs = new Date(session.endTime).getTime() - Date.now();
    const startedAtMs = new Date(session.startTime).getTime();
    const endedAtMs = new Date(session.submittedAt || session.endTime).getTime();
    const timeTakenSeconds = Math.max(0, Math.floor((endedAtMs - startedAtMs) / 1000));
    const answers = convertAnswerMapToList(answerMap);

    return {
        session,
        remainingTime: Math.max(0, Math.floor(remainingMs / 1000)),
        timeTakenSeconds,
        answers,
        state: state ? {
            marked: state.marked,
            currentQuestionIndex: state.currentQuestionIndex
        } : null,
        resultAnalysis: analysis.resultAnalysis,
        summary: {
            totalQuestions: analysis.stats.totalQuestions,
            correctAnswers: analysis.stats.correctAnswers
        }
    };
}

exports.getUserStats = async (req, res) => {
    try {
        await finalizeExpiredSessionsForUser(req.userId);

        const sessions = await TestSession.find({
            user: req.userId,
            status: { $in: ['SUBMITTED', 'EXPIRED'] }
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
        const subjectStats = {};

        for (const session of sessions) {
            const totalQuestions = session.totalQuestions || 0;
            const correctAnswers = session.correctAnswers || 0;
            const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

            totalScore += session.score || 0;
            totalAccuracy += accuracy;

            const subjectName = session.test?.subject || 'Uncategorized';

            if (!subjectStats[subjectName]) {
                subjectStats[subjectName] = {
                    totalQuestions: 0,
                    correctAnswers: 0,
                    totalTests: 0
                };
            }

            subjectStats[subjectName].totalQuestions += totalQuestions;
            subjectStats[subjectName].correctAnswers += correctAnswers;
            subjectStats[subjectName].totalTests += 1;
        }

        const subjectAnalysis = [];

        for (const subjectName in subjectStats) {
            const subjectData = subjectStats[subjectName];
            const accuracy = subjectData.totalQuestions > 0 ? Math.round((subjectData.correctAnswers / subjectData.totalQuestions) * 100) : 0;

            subjectAnalysis.push({
                subject: subjectName,
                accuracy,
                totalTests: subjectData.totalTests,
                weakness: accuracy < 60
            });
        }

        subjectAnalysis.sort((a, b) => a.accuracy - b.accuracy);

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
        await finalizeExpiredSessionsForUser(req.userId);

        const sessions = await TestSession.find({
            user: req.userId,
            status: { $in: ['SUBMITTED', 'EXPIRED'] }
        })
            .sort({ submittedAt: -1, updatedAt: -1 })
            .populate('test', 'title subject duration');

        const sessionsWithLinks = sessions.map((session) => {
            const sessionObj = session.toObject();
            return {
                ...sessionObj,
                reviewPath: `/dashboard/review/${sessionObj._id}`,
                reviewApi: `/api/v1/sessions/${sessionObj._id}/review`
            };
        });

        res.json(sessionsWithLinks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        let session = await TestSession.findById(sessionId);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (session.user.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized access to session' });
        }

        session = await finalizeIfNeeded(session);

        const remainingMs = new Date(session.endTime).getTime() - Date.now();
        const { answerMap, state } = await getAnswerMapForSession(sessionId);

        if (session.status === 'SUBMITTED' || session.status === 'EXPIRED') {
            const { orderedQuestions } = await getQuestionsForTest(session.test);
            const analysis = createReport(orderedQuestions, answerMap);
            return res.json(createCompletedSessionPayload(session, answerMap, state, analysis));
        }

        const answers = convertAnswerMapToList(answerMap);
        const safeState = state || { marked: [], currentQuestionIndex: 0 };

        res.json({
            session,
            remainingTime: Math.max(0, Math.floor(remainingMs / 1000)),
            answers,
            state: {
                marked: safeState.marked || [],
                currentQuestionIndex: safeState.currentQuestionIndex || 0
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSessionReview = async (req, res) => {
    try {
        const { sessionId } = req.params;
        let session = await TestSession.findById(sessionId).populate('test', 'title subject duration');

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (session.user.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized access to session' });
        }

        session = await finalizeIfNeeded(session);

        if (session.status === 'IN_PROGRESS') {
            return res.status(400).json({ message: 'Review is available after test submission' });
        }

        const { answerMap, state } = await getAnswerMapForSession(sessionId);
        const { orderedQuestions } = await getQuestionsForTest(session.test._id || session.test);
        const analysis = createReport(orderedQuestions, answerMap);
        const payload = createCompletedSessionPayload(session, answerMap, state, analysis);

        payload.review = {
            sessionId: session._id,
            status: session.status,
            test: {
                id: session.test?._id,
                title: session.test?.title,
                subject: session.test?.subject,
                duration: session.test?.duration
            },
            submittedAt: session.submittedAt,
            questions: analysis.resultAnalysis
        };

        return res.json(payload);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.submitTest = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await TestSession.findById(sessionId);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (session.user.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        let clientAnswers = {};
        if (req.body && typeof req.body.answers === 'object' && req.body.answers !== null) {
            clientAnswers = req.body.answers;
        }

        const status = req.body?.forceExpire ? 'EXPIRED' : undefined;
        const analysis = await finalizeSession(session, {
            status,
            answerMap: clientAnswers
        });
        const refreshedSession = await TestSession.findById(sessionId);

        res.json({
            message: 'Test submitted successfully',
            status: refreshedSession.status,
            score: {
                correct: analysis.stats.correctAnswers,
                incorrect: analysis.stats.incorrectAnswers,
                unanswered: analysis.stats.unanswered
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
