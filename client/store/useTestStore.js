import { create } from 'zustand';

const useTestStore = create((set, get) => ({
  activeTest: null,
  questions: [],
  answers: {},
  marked: [],
  topicAnalysis: [],
  difficultyAnalysis: [],
  currentQuestionIndex: 0,
  status: 'idle',
  timeLeft: 0,

  toggleMark: (questionId) => {
    set((state) => {
      const isMarked = state.marked.includes(questionId);
      return {
        marked: isMarked
          ? state.marked.filter(id => id !== questionId)
          : [...state.marked, questionId]
      };
    });
  },

  loadSession: async (sessionId) => {
    try {
      const sessionRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/sessions/${sessionId}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!sessionRes.ok) throw new Error("Failed to load session");
      const sessionData = await sessionRes.json();

      const testId = sessionData.session.test;
      const testRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/tests/${testId}`);
      if (!testRes.ok) throw new Error("Failed to fetch test details");
      const testData = await testRes.json();

      let mappedQuestions = [];
      let initialAnswers = {};

      if (sessionData.resultAnalysis) {
        mappedQuestions = sessionData.resultAnalysis.map(q => ({
          id: q.id,
          text: q.text,
          options: q.options,
          difficulty: q.difficulty,
          correctAnswer: q.correctAnswer,
          topic: q.topic,
          subTopic: q.subTopic
        }));

        sessionData.resultAnalysis.forEach(q => {
          if (q.selectedOption !== undefined && q.selectedOption !== null) {
            initialAnswers[q.id] = Number(q.selectedOption);
          }
        });
      } else {
        mappedQuestions = testData.questions.map(q => ({
          id: q._id,
          text: q.question,
          options: q.options,
          difficulty: q.difficulty,
        }));
      }

      set({
        activeTest: {
          id: testData._id,
          title: testData.title,
          duration: testData.duration,
          subject: testData.subject,
          sessionId: sessionId
        },
        questions: mappedQuestions,
        answers: initialAnswers,
        topicAnalysis: sessionData.topicAnalysis || [],
        difficultyAnalysis: sessionData.difficultyAnalysis || [],
        currentQuestionIndex: 0,
        status: 'completed',
        timeLeft: 0,
        error: null
      });

    } catch (err) {
      console.error(err);
      set({ status: 'error', error: err.message });
    }
  },

  startTest: async (testId) => {
    try {
      const startRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/tests/${testId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!startRes.ok) {
        const errData = await startRes.json();
        throw new Error(errData.message || "Failed to start test session");
      }

      const startData = await startRes.json();
      const sessionId = startData.sessionId;

      const testRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/tests/${testId}`);
      if (!testRes.ok) throw new Error("Failed to fetch test details");
      const testData = await testRes.json();

      let mappedQuestions = testData.questions.map(q => ({
        id: q._id,
        text: q.question,
        options: q.options,
        difficulty: q.difficulty,
      }));

      const sessionRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/sessions/${sessionId}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      let initialAnswers = {};
      let remainingTime = (testData.duration || 30) * 60;
      let initialStatus = 'running';

      if (sessionRes.ok) {
        const sessionData = await sessionRes.json();
        if (sessionData.session.status === 'SUBMITTED' || sessionData.session.status === 'EXPIRED') {
          initialStatus = 'completed';
        }

        remainingTime = sessionData.remainingTime;

        if (sessionData.resultAnalysis) {
          mappedQuestions = sessionData.resultAnalysis.map(q => ({
            id: q.id,
            text: q.text,
            options: q.options,
            difficulty: q.difficulty,
            correctAnswer: q.correctAnswer
          }));

          sessionData.resultAnalysis.forEach(q => {
            if (q.selectedOption !== undefined && q.selectedOption !== null) {
              initialAnswers[q.id] = Number(q.selectedOption);
            }
          });
        } else if (sessionData.answers) {
          sessionData.answers.forEach(ans => {
            initialAnswers[ans.question] = Number(ans.selectedOption);
          });
        }
      }

      set({
        activeTest: {
          id: testData._id,
          title: testData.title,
          duration: testData.duration,
          subject: testData.subject,
          sessionId: sessionId
        },
        questions: mappedQuestions,
        answers: initialAnswers,
        currentQuestionIndex: 0,
        status: initialStatus,
        timeLeft: remainingTime,
        error: null
      });

    } catch (err) {
      console.error(err);
      set({ status: 'error', error: err.message });
    }
  },

  selectAnswer: async (questionId, optionIndex) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: optionIndex
      }
    }));

    const { activeTest } = get();
    if (!activeTest?.sessionId) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/sessions/${activeTest.sessionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          questionId,
          selectedOption: optionIndex
        })
      });
    } catch (err) {
      console.error("Failed to autosave answer:", err);
    }
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  jumpToQuestion: (index) => {
    set({ currentQuestionIndex: index });
  },

  completeTest: async () => {
    const { activeTest } = get();
    if (!activeTest?.sessionId) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/sessions/${activeTest.sessionId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error("Failed to submit test");
      }

      sessionStorage.removeItem(`test_session_${activeTest.id}`);

      set({ status: 'completed' });
    } catch (err) {
      console.error('Failed to submit test:', err);
    }
  },

  resetTest: () => {
    const { activeTest } = get();
    if (activeTest?.id) {
      sessionStorage.removeItem(`test_session_${activeTest.id}`);
    }
    set({
      activeTest: null,
      questions: [],
      answers: {},
      topicAnalysis: [],
      difficultyAnalysis: [],
      currentQuestionIndex: 0,
      status: 'idle',
      timeLeft: 0,
      error: null
    });
  },

  decrementTimer: () => {
    const { timeLeft, status, completeTest } = get();
    if (status === 'running') {
      if (timeLeft > 0) {
        set({ timeLeft: timeLeft - 1 });
      } else {
        completeTest();
      }
    }
  }
}));

export default useTestStore;
