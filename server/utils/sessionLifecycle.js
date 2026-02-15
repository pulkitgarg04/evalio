const Test = require('../models/Test');
const Question = require('../models/Question');
const TestAnswer = require('../models/TestAnswer');
const TestSession = require('../models/TestSession');
const TestSessionState = require('../models/TestSessionState');
const config = require('../config/config');
const { getRedisClient } = require('./redisClient');

const SESSION_STATE_TTL_MS = 24 * 60 * 60 * 1000;

function getSessionStateKey(sessionId) {
    return `session:${sessionId}`;
}

function getSessionStateTtlSeconds(session) {
    const bufferMs = (Number(config.REDIS_SESSION_BUFFER_MINUTES) || 10) * 60 * 1000;
    const ttlMs = (new Date(session.endTime).getTime() + bufferMs) - Date.now();
    return Math.max(60, Math.ceil(ttlMs / 1000));
}

function buildDefaultState(session) {
    return {
        user: session.user?.toString(),
        test: session.test?.toString(),
        answers: {},
        marked: [],
        currentQuestionIndex: 0,
        fullscreenExitedAt: null,
        fullscreenDeadlineAt: null,
        fullscreenWarnings: 0,
        lastActiveAt: new Date().toISOString()
    };
}

function mapStateDocumentToObject(state) {
    if (!state) {
        return null;
    }

    return {
        user: state.user?.toString(),
        test: state.test?.toString(),
        answers: Object.fromEntries(
            Array.from(state.answers.entries()).map(([questionId, selectedOption]) => [
                questionId,
                Number(selectedOption)
            ])
        ),
        marked: Array.isArray(state.marked) ? state.marked : [],
        currentQuestionIndex: Number.isInteger(state.currentQuestionIndex)
            ? state.currentQuestionIndex
            : 0,
        fullscreenExitedAt: state.fullscreenExitedAt || null,
        fullscreenDeadlineAt: state.fullscreenDeadlineAt || null,
        fullscreenWarnings: Number(state.fullscreenWarnings) || 0,
        lastActiveAt: state.updatedAt || null
    };
}

async function getStateFromRedis(sessionId) {
    const client = await getRedisClient();
    if (!client) {
        return null;
    }

    const raw = await client.get(getSessionStateKey(sessionId));
    if (!raw) {
        return null;
    }

    try {
        const parsed = JSON.parse(raw);
        return {
            user: parsed.user || null,
            test: parsed.test || null,
            answers: parsed.answers && typeof parsed.answers === 'object' ? parsed.answers : {},
            marked: Array.isArray(parsed.marked) ? parsed.marked : [],
            currentQuestionIndex: Number.isInteger(parsed.currentQuestionIndex)
                ? parsed.currentQuestionIndex
                : 0,
            fullscreenExitedAt: parsed.fullscreenExitedAt || null,
            fullscreenDeadlineAt: parsed.fullscreenDeadlineAt || null,
            fullscreenWarnings: Number(parsed.fullscreenWarnings) || 0,
            lastActiveAt: parsed.lastActiveAt || null
        };
    } catch (error) {
        return null;
    }
}

async function saveStateToRedis(session, state) {
    const client = await getRedisClient();
    if (!client) {
        return false;
    }

    const key = getSessionStateKey(session._id.toString());
    await client.set(key, JSON.stringify(state), {
        EX: getSessionStateTtlSeconds(session)
    });

    return true;
}

async function ensureMongoSessionState(session) {
    const expiresAt = new Date(new Date(session.endTime).getTime() + SESSION_STATE_TTL_MS);

    return TestSessionState.findOneAndUpdate(
        { session: session._id },
        {
            $setOnInsert: {
                user: session.user,
                test: session.test,
                answers: {},
                marked: [],
                currentQuestionIndex: 0
            },
            $set: {
                user: session.user,
                test: session.test,
                expiresAt
            }
        },
        {
            upsert: true,
            new: true
        }
    );
}

async function getOrderedQuestionsForTest(testId) {
    const test = await Test.findById(testId);
    if (!test) {
        throw new Error('Test not found');
    }

    const questions = await Question.find({ questionId: { $in: test.questions } });
    const questionMap = new Map(questions.map((question) => [question.questionId, question]));
    const orderedQuestions = test.questions
        .map((questionId) => questionMap.get(questionId))
        .filter(Boolean);

    return { test, orderedQuestions };
}

async function ensureSessionState(session) {
    const redisState = await getStateFromRedis(session._id.toString());
    const state = redisState || buildDefaultState(session);

    state.user = session.user?.toString();
    state.test = session.test?.toString();

    const wroteToRedis = await saveStateToRedis(session, state);
    if (wroteToRedis) {
        return state;
    }

    const dbState = await ensureMongoSessionState(session);
    return mapStateDocumentToObject(dbState);
}

async function getSessionStateForSession(sessionId) {
    const redisState = await getStateFromRedis(sessionId.toString());
    if (redisState) {
        return redisState;
    }

    const state = await TestSessionState.findOne({ session: sessionId });
    if (!state) {
        return null;
    }

    return mapStateDocumentToObject(state);
}

async function getAnswerMapForSession(sessionId) {
    const state = await getSessionStateForSession(sessionId);

    if (state) {
        return {
            state,
            answerMap: Object.fromEntries(
                Object.entries(state.answers).map(([questionId, selectedOption]) => [
                    questionId,
                    Number(selectedOption)
                ])
            )
        };
    }

    const savedAnswers = await TestAnswer.find({ session: sessionId });
    const answerMap = {};
    savedAnswers.forEach((answer) => {
        answerMap[answer.question.toString()] = Number(answer.selectedOption);
    });

    return { state: null, answerMap };
}

async function upsertAnswerInSessionState(session, questionId, selectedOption) {
    const state = await ensureSessionState(session);
    const nextState = {
        ...state,
        answers: {
            ...(state.answers || {})
        },
        lastActiveAt: new Date().toISOString()
    };

    if (selectedOption === undefined || selectedOption === null || selectedOption === '') {
        delete nextState.answers[questionId];
    } else {
        nextState.answers[questionId] = Number(selectedOption);
    }

    const wroteToRedis = await saveStateToRedis(session, nextState);
    if (wroteToRedis) {
        return nextState;
    }

    const dbState = await ensureMongoSessionState(session);
    if (selectedOption === undefined || selectedOption === null || selectedOption === '') {
        dbState.answers.delete(questionId);
    } else {
        dbState.answers.set(questionId, Number(selectedOption));
    }
    await dbState.save();
    return mapStateDocumentToObject(dbState);
}

async function updateSessionState(session, partialState = {}) {
    const state = await ensureSessionState(session);
    const nextState = {
        ...state,
        ...partialState,
        answers: state.answers || {},
        lastActiveAt: new Date().toISOString()
    };

    const wroteToRedis = await saveStateToRedis(session, nextState);
    if (wroteToRedis) {
        return nextState;
    }

    const dbState = await ensureMongoSessionState(session);

    if (partialState.currentQuestionIndex !== undefined) {
        dbState.currentQuestionIndex = partialState.currentQuestionIndex;
    }

    if (partialState.marked !== undefined) {
        dbState.marked = partialState.marked;
    }

    if (partialState.fullscreenExitedAt !== undefined) {
        dbState.fullscreenExitedAt = partialState.fullscreenExitedAt;
    }

    if (partialState.fullscreenDeadlineAt !== undefined) {
        dbState.fullscreenDeadlineAt = partialState.fullscreenDeadlineAt;
    }

    if (partialState.fullscreenWarnings !== undefined) {
        dbState.fullscreenWarnings = partialState.fullscreenWarnings;
    }

    await dbState.save();
    return mapStateDocumentToObject(dbState);
}

async function clearSessionState(sessionId) {
    const client = await getRedisClient();
    if (client) {
        await client.del(getSessionStateKey(sessionId.toString()));
    }

    await TestSessionState.deleteOne({ session: sessionId });
}

function buildQuestionAnalysis(orderedQuestions, answerMap) {
    let correct = 0;
    let incorrect = 0;

    const topicStats = {};
    const difficultyStats = {};

    const resultAnalysis = orderedQuestions.map((question) => {
        const selectedOption = answerMap[question._id.toString()];
        const hasAnswer = Number.isInteger(selectedOption);
        const selectedValue = hasAnswer ? question.options[selectedOption] : undefined;
        const isCorrect = hasAnswer && selectedValue === question.correctAnswer;

        if (isCorrect) {
            correct += 1;
        } else if (hasAnswer) {
            incorrect += 1;
        }

        const topic = question.topic || 'Uncategorized';
        if (!topicStats[topic]) {
            topicStats[topic] = { total: 0, correct: 0, incorrect: 0, unanswered: 0 };
        }
        topicStats[topic].total += 1;
        if (isCorrect) topicStats[topic].correct += 1;
        else if (hasAnswer) topicStats[topic].incorrect += 1;
        else topicStats[topic].unanswered += 1;

        const difficulty = question.difficulty || 'Unknown';
        if (!difficultyStats[difficulty]) {
            difficultyStats[difficulty] = { total: 0, correct: 0, incorrect: 0, unanswered: 0 };
        }
        difficultyStats[difficulty].total += 1;
        if (isCorrect) difficultyStats[difficulty].correct += 1;
        else if (hasAnswer) difficultyStats[difficulty].incorrect += 1;
        else difficultyStats[difficulty].unanswered += 1;

        return {
            id: question._id,
            text: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
            correctOptionIndex: question.options.indexOf(question.correctAnswer),
            selectedValue,
            selectedOption,
            isCorrect,
            difficulty: question.difficulty,
            topic: question.topic,
            subTopic: question.subTopic
        };
    });

    const totalQuestions = orderedQuestions.length;
    const unanswered = totalQuestions - (correct + incorrect);

    const formatStats = (statsObj) => Object.entries(statsObj).map(([name, data]) => ({
        name,
        total: data.total,
        correct: data.correct,
        incorrect: data.incorrect,
        unanswered: data.unanswered,
        accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
    })).sort((a, b) => a.accuracy - b.accuracy);

    return {
        resultAnalysis,
        topicAnalysis: formatStats(topicStats),
        difficultyAnalysis: formatStats(difficultyStats),
        weakTopics: formatStats(topicStats).filter((topic) => topic.incorrect > 0),
        stats: {
            score: correct,
            totalQuestions,
            correctAnswers: correct,
            incorrectAnswers: incorrect,
            unanswered
        }
    };
}

async function finalizeSession(session, options = {}) {
    if (!session) {
        throw new Error('Session not found');
    }

    const latestSession = await TestSession.findById(session._id);
    if (!latestSession) {
        throw new Error('Session not found');
    }

    session = latestSession;

    if (session.status === 'SUBMITTED' || session.status === 'EXPIRED') {
        const { answerMap } = await getAnswerMapForSession(session._id);
        const { orderedQuestions } = await getOrderedQuestionsForTest(session.test);
        return buildQuestionAnalysis(orderedQuestions, answerMap);
    }

    const { state, answerMap } = await getAnswerMapForSession(session._id);
    const { orderedQuestions } = await getOrderedQuestionsForTest(session.test);
    const analysis = buildQuestionAnalysis(orderedQuestions, answerMap);

    await TestAnswer.deleteMany({ session: session._id });

    const answerDocs = Object.entries(answerMap)
        .filter(([, selectedOption]) => Number.isInteger(selectedOption))
        .map(([questionId, selectedOption]) => ({
            session: session._id,
            question: questionId,
            selectedOption
        }));

    if (answerDocs.length > 0) {
        await TestAnswer.insertMany(answerDocs);
    }

    const now = new Date();
    const expiredByTime = new Date(session.endTime).getTime() <= now.getTime();

    session.score = analysis.stats.score;
    session.totalQuestions = analysis.stats.totalQuestions;
    session.correctAnswers = analysis.stats.correctAnswers;
    session.incorrectAnswers = analysis.stats.incorrectAnswers;
    session.unanswered = analysis.stats.unanswered;
    session.submittedAt = now;
    session.lastActiveAt = now;
    session.status = options.status
        || (expiredByTime ? 'EXPIRED' : 'SUBMITTED');

    await session.save();
    await clearSessionState(session._id);

    return analysis;
}

module.exports = {
    buildQuestionAnalysis,
    clearSessionState,
    ensureSessionState,
    finalizeSession,
    getAnswerMapForSession,
    getOrderedQuestionsForTest,
    getSessionStateForSession,
    updateSessionState,
    upsertAnswerInSessionState
};
