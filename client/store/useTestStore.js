import { create } from 'zustand';
import { mockQuestions, premadeTests } from '../lib/mockData';

const useTestStore = create((set, get) => ({
  activeTest: null,
  questions: [],
  answers: {},
  currentQuestionIndex: 0,
  status: 'idle',
  timeLeft: 0,

  startTest: async (testId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/tests/${testId}`);
      if (!res.ok) throw new Error("Failed to fetch test");
      const testData = await res.json();

      const mappedQuestions = testData.questions.map(q => ({
        id: q._id,
        text: q.question,
        options: q.options,
        difficulty: q.difficulty,
        correctAnswer: q.correctAnswer
      }));

      set({
        activeTest: {
          id: testData._id,
          title: testData.title,
          duration: testData.duration,
          subject: testData.subject
        },
        questions: mappedQuestions,
        answers: {},
        currentQuestionIndex: 0,
        status: 'running',
        timeLeft: (testData.duration || 30) * 60
      });

    } catch (err) {
      console.error(err);
    }
  },

  selectAnswer: (questionId, optionIndex) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: optionIndex
      }
    }));
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

  completeTest: () => {
    set({ status: 'completed' });
  },

  resetTest: () => {
    set({
      activeTest: null,
      questions: [],
      answers: {},
      currentQuestionIndex: 0,
      status: 'idle',
      timeLeft: 0
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
