import { create } from 'zustand';

const buildQuestionsFromTest = (testData) => (
  testData.questions.map((question) => ({
    id: question._id,
    text: question.question,
    options: question.options,
    difficulty: question.difficulty,
    topic: question.topic,
    subTopic: question.subTopic
  }))
);

const buildQuestionsFromAnalysis = (resultAnalysis) => (
  resultAnalysis.map((question) => ({
    id: question.id,
    text: question.text,
    options: question.options,
    difficulty: question.difficulty,
    correctAnswer: question.correctAnswer,
    topic: question.topic,
    subTopic: question.subTopic
  }))
);

const buildAnswerMap = (sessionData) => {
  const initialAnswers = {};

  if (sessionData.resultAnalysis) {
    sessionData.resultAnalysis.forEach((question) => {
      if (question.selectedOption !== undefined && question.selectedOption !== null) {
        initialAnswers[question.id] = Number(question.selectedOption);
      }
    });
    return initialAnswers;
  }

  (sessionData.answers || []).forEach((answer) => {
    if (answer.selectedOption !== undefined && answer.selectedOption !== null) {
      initialAnswers[answer.question] = Number(answer.selectedOption);
    }
  });

  return initialAnswers;
};

const useTestStore = create((set, get) => ({
  activeTest: null,
  questions: [],
  answers: {},
  marked: [],
  topicAnalysis: [],
  difficultyAnalysis: [],
  weakTopics: [],
  summary: null,
  resultAnalysis: [],
  sessionMeta: null,
  currentQuestionIndex: 0,
  status: 'idle',
  timeLeft: 0,
  error: null,
  fullscreenDeadlineAt: null,
  fullscreenExitedAt: null,
  fullscreenWarnings: 0,

  hydrateSession: async (sessionId, testData) => {
    const sessionRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/sessions/${sessionId}`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    if (!sessionRes.ok) {
      const errData = await sessionRes.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to load session');
    }

    const sessionData = await sessionRes.json();
    const questions = sessionData.resultAnalysis
      ? buildQuestionsFromAnalysis(sessionData.resultAnalysis)
      : buildQuestionsFromTest(testData);
    const answers = buildAnswerMap(sessionData);
    const isCompleted = sessionData.session.status === 'SUBMITTED' || sessionData.session.status === 'EXPIRED';

    set({
      activeTest: {
        id: testData._id,
        title: testData.title,
        duration: testData.duration,
        subject: testData.subject,
        sessionId
      },
      questions,
      answers,
      marked: sessionData.state?.marked || [],
      topicAnalysis: sessionData.topicAnalysis || [],
      difficultyAnalysis: sessionData.difficultyAnalysis || [],
      weakTopics: sessionData.weakTopics || [],
      summary: sessionData.summary || null,
      resultAnalysis: sessionData.resultAnalysis || [],
      sessionMeta: {
        ...sessionData.session,
        timeTakenSeconds: sessionData.timeTakenSeconds ?? null
      },
      currentQuestionIndex: sessionData.state?.currentQuestionIndex || 0,
      status: isCompleted ? 'completed' : 'running',
      timeLeft: sessionData.remainingTime ?? (testData.duration || 30) * 60,
      error: null,
      fullscreenDeadlineAt: sessionData.state?.fullscreenDeadlineAt || null,
      fullscreenExitedAt: sessionData.state?.fullscreenExitedAt || null,
      fullscreenWarnings: sessionData.state?.fullscreenWarnings || 0
    });
  },

  loadSession: async (sessionId) => {
    try {
      set({ status: 'idle', error: null });

      const sessionRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/sessions/${sessionId}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!sessionRes.ok) throw new Error('Failed to load session');
      const sessionData = await sessionRes.json();

      const testId = sessionData.session.test;
      const testRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/tests/${testId}`);
      if (!testRes.ok) throw new Error('Failed to fetch test details');
      const testData = await testRes.json();

      const questions = sessionData.resultAnalysis
        ? buildQuestionsFromAnalysis(sessionData.resultAnalysis)
        : buildQuestionsFromTest(testData);

      set({
        activeTest: {
          id: testData._id,
          title: testData.title,
          duration: testData.duration,
          subject: testData.subject,
          sessionId
        },
        questions,
        answers: buildAnswerMap(sessionData),
        marked: sessionData.state?.marked || [],
        topicAnalysis: sessionData.topicAnalysis || [],
        difficultyAnalysis: sessionData.difficultyAnalysis || [],
        weakTopics: sessionData.weakTopics || [],
        summary: sessionData.summary || null,
        resultAnalysis: sessionData.resultAnalysis || [],
        sessionMeta: {
          ...sessionData.session,
          timeTakenSeconds: sessionData.timeTakenSeconds ?? null
        },
        currentQuestionIndex: sessionData.state?.currentQuestionIndex || 0,
        status: sessionData.session.status === 'SUBMITTED' || sessionData.session.status === 'EXPIRED'
          ? 'completed'
          : 'running',
        timeLeft: sessionData.remainingTime ?? 0,
        error: null,
        fullscreenDeadlineAt: sessionData.state?.fullscreenDeadlineAt || null,
        fullscreenExitedAt: sessionData.state?.fullscreenExitedAt || null,
        fullscreenWarnings: sessionData.state?.fullscreenWarnings || 0
      });
    } catch (err) {
      console.error(err);
      set({ status: 'error', error: err.message });
    }
  },

  loadReviewSession: async (sessionId) => {
    try {
      set({ status: 'idle', error: null });

      const sessionRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/sessions/${sessionId}/review`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!sessionRes.ok) {
        const errData = await sessionRes.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to load review');
      }

      const sessionData = await sessionRes.json();
      const review = sessionData.review || {};
      const reviewQuestions = Array.isArray(review.questions) ? review.questions : [];

      const mappedQuestions = reviewQuestions.map((question) => ({
        id: question.id,
        text: question.text,
        options: question.options,
        difficulty: question.difficulty,
        correctAnswer: question.correctAnswer,
        correctOptionIndex: question.correctOptionIndex,
        topic: question.topic,
        subTopic: question.subTopic,
        isCorrect: question.isCorrect,
        selectedOption: question.selectedOption,
        selectedValue: question.selectedValue
      }));

      const mappedAnswers = {};
      reviewQuestions.forEach((question) => {
        if (question.selectedOption !== undefined && question.selectedOption !== null) {
          mappedAnswers[question.id] = Number(question.selectedOption);
        }
      });

      set({
        activeTest: {
          id: review.test?.id,
          title: review.test?.title,
          duration: review.test?.duration,
          subject: review.test?.subject,
          sessionId
        },
        questions: mappedQuestions,
        answers: mappedAnswers,
        marked: sessionData.state?.marked || [],
        topicAnalysis: sessionData.topicAnalysis || [],
        difficultyAnalysis: sessionData.difficultyAnalysis || [],
        weakTopics: sessionData.weakTopics || [],
        summary: sessionData.summary || null,
        resultAnalysis: sessionData.resultAnalysis || [],
        sessionMeta: {
          ...sessionData.session,
          timeTakenSeconds: sessionData.timeTakenSeconds ?? null
        },
        currentQuestionIndex: 0,
        status: 'completed',
        timeLeft: 0,
        error: null,
        fullscreenDeadlineAt: null,
        fullscreenExitedAt: null,
        fullscreenWarnings: 0
      });
    } catch (err) {
      console.error(err);
      set({ status: 'error', error: err.message });
    }
  },

  startTest: async (testId) => {
    try {
      set({ status: 'idle', error: null });

      const startRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/tests/${testId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!startRes.ok) {
        const errData = await startRes.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to start test session');
      }

      const startData = await startRes.json();
      const testRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/tests/${testId}`);
      if (!testRes.ok) throw new Error('Failed to fetch test details');
      const testData = await testRes.json();

      await get().hydrateSession(startData.sessionId, testData);
    } catch (err) {
      console.error(err);
      set({ status: 'error', error: err.message });
    }
  },

  persistSessionState: async (partialState = {}) => {
    const {
      activeTest,
      status,
      currentQuestionIndex,
      marked,
      fullscreenExitedAt,
      fullscreenDeadlineAt,
      fullscreenWarnings
    } = get();

    if (!activeTest?.sessionId || status !== 'running') return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/sessions/${activeTest.sessionId}/state`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentQuestionIndex,
          marked,
          fullscreenExitedAt,
          fullscreenDeadlineAt,
          fullscreenWarnings,
          ...partialState
        })
      });

      if (!res.ok) {
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (data.status === 'SUBMITTED' || data.status === 'EXPIRED') {
        await get().loadSession(activeTest.sessionId);
      }
    } catch (err) {
      console.error('Failed to persist test state:', err);
    }
  },

  toggleMark: (questionId) => {
    let nextMarked = [];

    set((state) => {
      const isMarked = state.marked.includes(questionId);
      nextMarked = isMarked
        ? state.marked.filter((id) => id !== questionId)
        : [...state.marked, questionId];

      return { marked: nextMarked };
    });

    void get().persistSessionState({ marked: nextMarked });
  },

  selectAnswer: async (questionId, optionIndex) => {
    set((state) => {
      const nextAnswers = { ...state.answers };

      if (optionIndex === undefined || optionIndex === null) {
        delete nextAnswers[questionId];
      } else {
        nextAnswers[questionId] = optionIndex;
      }

      return { answers: nextAnswers };
    });

    const { activeTest, status } = get();
    if (!activeTest?.sessionId || status !== 'running') return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/sessions/${activeTest.sessionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          questionId,
          selectedOption: optionIndex ?? null
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to save answer');
      }
    } catch (err) {
      console.error('Failed to autosave answer:', err);
    }
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      set({ currentQuestionIndex: nextIndex });
      void get().persistSessionState({ currentQuestionIndex: nextIndex });
    }
  },

  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      const nextIndex = currentQuestionIndex - 1;
      set({ currentQuestionIndex: nextIndex });
      void get().persistSessionState({ currentQuestionIndex: nextIndex });
    }
  },

  jumpToQuestion: (index) => {
    set({ currentQuestionIndex: index });
    void get().persistSessionState({ currentQuestionIndex: index });
  },

  setFullscreenWarning: async ({ exitedAt, deadlineAt }) => {
    const nextExitedAt = exitedAt || new Date().toISOString();
    const nextDeadlineAt = deadlineAt || new Date(Date.now() + 30000).toISOString();
    const nextWarnings = (get().fullscreenWarnings || 0) + 1;

    set({
      fullscreenExitedAt: nextExitedAt,
      fullscreenDeadlineAt: nextDeadlineAt,
      fullscreenWarnings: nextWarnings
    });

    await get().persistSessionState({
      fullscreenExitedAt: nextExitedAt,
      fullscreenDeadlineAt: nextDeadlineAt,
      fullscreenWarnings: nextWarnings
    });
  },

  clearFullscreenWarning: async () => {
    set({
      fullscreenExitedAt: null,
      fullscreenDeadlineAt: null
    });

    await get().persistSessionState({
      fullscreenExitedAt: null,
      fullscreenDeadlineAt: null
    });
  },

  completeTest: async ({ forceExpire = false } = {}) => {
    const { activeTest } = get();
    if (!activeTest?.sessionId) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/sessions/${activeTest.sessionId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ forceExpire })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to submit test');
      }

      await get().loadSession(activeTest.sessionId);
    } catch (err) {
      console.error('Failed to submit test:', err);
      set({ status: 'error', error: err.message });
    }
  },

  resetTest: () => {
    set({
      activeTest: null,
      questions: [],
      answers: {},
      marked: [],
      topicAnalysis: [],
      difficultyAnalysis: [],
      weakTopics: [],
      summary: null,
      resultAnalysis: [],
      sessionMeta: null,
      currentQuestionIndex: 0,
      status: 'idle',
      timeLeft: 0,
      error: null,
      fullscreenDeadlineAt: null,
      fullscreenExitedAt: null,
      fullscreenWarnings: 0
    });
  },

  decrementTimer: () => {
    const { timeLeft, status } = get();
    if (status !== 'running') return;

    if (timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
      return;
    }

    void get().completeTest({ forceExpire: true });
  }
}));

export default useTestStore;
