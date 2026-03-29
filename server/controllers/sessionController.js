const TestSession = require('../models/TestSession');
const {
    buildQuestionAnalysis,
    ensureSessionState,
    finalizeSession,
    getAnswerMapForSession,
    getOrderedQuestionsForTest,
    updateSessionState,
    upsertAnswerInSessionState
} = require('../utils/sessionLifecycle');

async function finalizeIfNeeded(session) {
    if (!session || session.status !== 'IN_PROGRESS') {
        return session;
    }

    const now = Date.now();
    const testExpired = new Date(session.endTime).getTime() <= now;

    if (testExpired) {
        await finalizeSession(session, { status: 'EXPIRED' });
        return TestSession.findById(session._id);
    }

    return session;
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

function buildCompletedSessionPayload(session, answerMap, state, analysis) {
    const remaining = new Date(session.endTime).getTime() - Date.now();
    const startedAtMs = new Date(session.startTime).getTime();
    const endedAtMs = new Date(session.submittedAt || session.endTime).getTime();
    const timeTakenSeconds = Math.max(0, Math.floor((endedAtMs - startedAtMs) / 1000));

    return {
        session,
        remainingTime: Math.max(0, Math.floor(remaining / 1000)),
        timeTakenSeconds,
        answers: Object.entries(answerMap).map(([question, selectedOption]) => ({
            question,
            selectedOption
        })),
        state: state ? {
            marked: state.marked,
            currentQuestionIndex: state.currentQuestionIndex
        } : null,
        resultAnalysis: analysis.resultAnalysis,
        topicAnalysis: analysis.topicAnalysis,
        difficultyAnalysis: analysis.difficultyAnalysis,
        weakTopics: analysis.weakTopics,
        summary: analysis.stats
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
        const subjectMap = {};

        sessions.forEach((session) => {
            const accuracy = session.totalQuestions > 0
                ? (session.correctAnswers / session.totalQuestions) * 100
                : 0;

            totalScore += session.score || 0;
            totalAccuracy += accuracy;

            const subject = session.test?.subject || 'Uncategorized';
            if (!subjectMap[subject]) {
                subjectMap[subject] = {
                    totalQuestions: 0,
                    correctAnswers: 0,
                    distinctTests: 0
                };
            }

            subjectMap[subject].totalQuestions += session.totalQuestions || 0;
            subjectMap[subject].correctAnswers += session.correctAnswers || 0;
            subjectMap[subject].distinctTests += 1;
        });

        const subjectAnalysis = Object.keys(subjectMap).map((subject) => {
            const data = subjectMap[subject];
            const accuracy = data.totalQuestions > 0
                ? Math.round((data.correctAnswers / data.totalQuestions) * 100)
                : 0;

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

        const remaining = new Date(session.endTime).getTime() - Date.now();
        const { answerMap, state } = await getAnswerMapForSession(sessionId);

        if (session.status === 'SUBMITTED' || session.status === 'EXPIRED') {
            const { orderedQuestions } = await getOrderedQuestionsForTest(session.test);
            const analysis = buildQuestionAnalysis(orderedQuestions, answerMap);
            return res.json(buildCompletedSessionPayload(session, answerMap, state, analysis));
        }

        const ensuredState = state || await ensureSessionState(session);

        res.json({
            session,
            remainingTime: Math.max(0, Math.floor(remaining / 1000)),
            answers: Object.entries(answerMap).map(([question, selectedOption]) => ({
                question,
                selectedOption
            })),
            state: {
                marked: ensuredState?.marked || [],
                currentQuestionIndex: ensuredState?.currentQuestionIndex || 0
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
        const { orderedQuestions } = await getOrderedQuestionsForTest(session.test._id || session.test);
        const analysis = buildQuestionAnalysis(orderedQuestions, answerMap);

        return res.json({
            ...buildCompletedSessionPayload(session, answerMap, state, analysis),
            review: {
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
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.saveAnswer = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { questionId, selectedOption } = req.body;

        if (!questionId) {
            return res.status(400).json({ message: 'questionId is required' });
        }

        let session = await TestSession.findById(sessionId);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (session.user.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        session = await finalizeIfNeeded(session);
        if (session.status !== 'IN_PROGRESS') {
            return res.status(400).json({ message: 'Session not active' });
        }

        await upsertAnswerInSessionState(session, questionId, selectedOption);

        session.lastActiveAt = Date.now();
        await session.save();

        res.json({ saved: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateState = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const {
            currentQuestionIndex,
            marked
        } = req.body;

        let session = await TestSession.findById(sessionId);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (session.user.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        session = await finalizeIfNeeded(session);
        if (session.status !== 'IN_PROGRESS') {
            return res.status(400).json({ message: 'Session not active' });
        }

        const nextStatePatch = {};

        if (Number.isInteger(currentQuestionIndex)) {
            nextStatePatch.currentQuestionIndex = currentQuestionIndex;
        }

        if (Array.isArray(marked)) {
            nextStatePatch.marked = [...new Set(marked)];
        }

        await updateSessionState(session, nextStatePatch);

        session.lastActiveAt = Date.now();
        await session.save();

        session = await finalizeIfNeeded(session);
        if (session.status !== 'IN_PROGRESS') {
            return res.status(200).json({
                message: 'Session auto-submitted',
                status: session.status
            });
        }

        res.json({ message: 'State updated' });
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

        const status = req.body?.forceExpire ? 'EXPIRED' : undefined;
        const analysis = await finalizeSession(session, { status });
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
