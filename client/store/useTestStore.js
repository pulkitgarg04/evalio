import { create } from 'zustand';
import { mockQuestions, premadeTests } from '../lib/mockData';

const useTestStore = create((set, get) => ({
  activeTest: null,
  questions: [],
  answers: {},
  currentQuestionIndex: 0,
  status: 'idle',
  timeLeft: 0,
  
  startTest: (testId, customSettings = null) => {
    const questions = [...mockQuestions].sort(() => 0.5 - Math.random()).slice(0, 5);
    const test = premadeTests.find(t => t.id === testId) || { ...customSettings, id: 'custom' };
    
    set({
      activeTest: test,
      questions: questions,
      answers: {},
      currentQuestionIndex: 0,
      status: 'running',
      timeLeft: test.duration * 60
    });
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
