const Test = require('../models/Test');
const Question = require('../models/Question');
const TestAnswer = require('../models/TestAnswer');
const TestSession = require('../models/TestSession');

async function getQuestionsForTest(testId) {
    const test = await Test.findById(testId);
    if (!test) {
        throw new Error('Test not found');
    }

    const questions = await Question.find({ questionId: { $in: test.questions } });
    const questionsById = new Map(questions.map((q) => [q.questionId, q]));
    
    const orderedQuestions = test.questions
        .map((questionId) => questionsById.get(questionId))
        .filter(Boolean);

    return { test, orderedQuestions };
}

function normalizeAnswerMap(rawAnswers = {}) {
    const answers = {};
    const questionIds = Object.keys(rawAnswers);

    for (let i = 0; i < questionIds.length; i += 1) {
        const questionId = questionIds[i];
        const selectedOption = Number(rawAnswers[questionId]);

        if (Number.isInteger(selectedOption)) {
            answers[questionId] = selectedOption;
        }
    }

    return answers;
}

async function getAnswerMapForSession(sessionId) {
    const savedAnswers = await TestAnswer.find({ session: sessionId });
    const answerMap = {};

    for (const answer of savedAnswers) {
        answerMap[answer.question.toString()] = Number(answer.selectedOption);
    }

    return { state: null, answerMap };
}

function createReport(orderedQuestions, answerMap) {
    let correct = 0;
    let incorrect = 0;

    const resultAnalysis = orderedQuestions.map((question) => {
        const selectedOption = answerMap[question._id.toString()];
        const hasAnswer = Number.isInteger(selectedOption);
        let selectedValue;
        let isCorrect = false;

        if (hasAnswer) {
            selectedValue = question.options[selectedOption];

            if (selectedValue === question.correctAnswer) {
                isCorrect = true;
            }
        }

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

    const currentSession = await TestSession.findById(session._id);
    if (!currentSession) {
        throw new Error('Session not found');
    }

    let answers = {};

    if (currentSession.status === 'SUBMITTED' || currentSession.status === 'EXPIRED') {
        const savedAnswers = await getAnswerMapForSession(currentSession._id);
        const testData = await getQuestionsForTest(currentSession.test);
        
        return createReport(testData.orderedQuestions, savedAnswers.answerMap);
    }

    if (options.answerMap && typeof options.answerMap === 'object') {
        answers = normalizeAnswerMap(options.answerMap);
    } else {
        const savedAnswers = await getAnswerMapForSession(currentSession._id);
        answers = savedAnswers.answerMap;
    }

    const testData = await getQuestionsForTest(currentSession.test);
    const analysis = createReport(testData.orderedQuestions, answers);

    await TestAnswer.deleteMany({ session: currentSession._id });

    const answerDocs = [];
    for (const questionId in answers) {
        answerDocs.push({
            session: currentSession._id,
            question: questionId,
            selectedOption: answers[questionId]
        });
    }

    if (answerDocs.length > 0) {
        await TestAnswer.insertMany(answerDocs);
    }

    const now = new Date();
    const isExpired = new Date(currentSession.endTime).getTime() <= now.getTime();

    currentSession.score = analysis.stats.score;
    currentSession.totalQuestions = analysis.stats.totalQuestions;
    currentSession.correctAnswers = analysis.stats.correctAnswers;
    currentSession.incorrectAnswers = analysis.stats.incorrectAnswers;
    currentSession.unanswered = analysis.stats.unanswered;
    currentSession.submittedAt = now;
    currentSession.lastActiveAt = now;

    if (options.status) {
        currentSession.status = options.status;
    } else if (isExpired) {
        currentSession.status = 'EXPIRED';
    } else {
        currentSession.status = 'SUBMITTED';
    }

    await currentSession.save();

    return analysis;
}

module.exports = {
    createReport,
    finalizeSession,
    getAnswerMapForSession,
    getQuestionsForTest
};