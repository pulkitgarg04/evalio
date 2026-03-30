const Test = require('../models/Test');
const Question = require('../models/Question');
const TestAnswer = require('../models/TestAnswer');
const TestSession = require('../models/TestSession');

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

function normalizeAnswerMap(rawAnswers = {}) {
    const answerMap = {};

    for (const questionId in rawAnswers) {
        const option = Number(rawAnswers[questionId]);
        if (Number.isInteger(option)) {
            answerMap[questionId] = option;
        }
    }

    return answerMap;
}

async function getAnswerMapForSession(sessionId) {
    const savedAnswers = await TestAnswer.find({ session: sessionId });
    const answerMap = {};

    for (const answer of savedAnswers) {
        answerMap[answer.question.toString()] = Number(answer.selectedOption);
    }

    return { state: null, answerMap };
}

function buildQuestionAnalysis(orderedQuestions, answerMap) {
    let correct = 0;
    let incorrect = 0;

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

        return {
            id: question._id,
            text: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
            correctOptionIndex: question.options.indexOf(question.correctAnswer),
            selectedValue,
            selectedOption,
            isCorrect
        };
    });

    const totalQuestions = orderedQuestions.length;
    const unanswered = totalQuestions - (correct + incorrect);

    return {
        resultAnalysis,
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

    let answerMap = {};

    if (session.status === 'SUBMITTED' || session.status === 'EXPIRED') {
        const saved = await getAnswerMapForSession(session._id);
        answerMap = saved.answerMap;
        const { orderedQuestions } = await getOrderedQuestionsForTest(session.test);
        return buildQuestionAnalysis(orderedQuestions, answerMap);
    }

    if (options.answerMap && typeof options.answerMap === 'object') {
        answerMap = normalizeAnswerMap(options.answerMap);
    } else {
        const saved = await getAnswerMapForSession(session._id);
        answerMap = saved.answerMap;
    }

    const { orderedQuestions } = await getOrderedQuestionsForTest(session.test);
    const analysis = buildQuestionAnalysis(orderedQuestions, answerMap);

    await TestAnswer.deleteMany({ session: session._id });

    const answerDocs = [];
    for (const questionId in answerMap) {
        answerDocs.push({
            session: session._id,
            question: questionId,
            selectedOption: answerMap[questionId]
        });
    }

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
    session.status = options.status || (expiredByTime ? 'EXPIRED' : 'SUBMITTED');

    await session.save();

    return analysis;
}

module.exports = {
    buildQuestionAnalysis,
    finalizeSession,
    getAnswerMapForSession,
    getOrderedQuestionsForTest
};