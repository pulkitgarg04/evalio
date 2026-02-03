export const currentUser = {
  name: "Nil Yeager",
  role: "Student",
  stats: {
    testsTaken: 5,
    avgScore: 85,
    coursesInProgress: 3,
    forumDiscussions: 25
  }
};

export const categories = [
  { id: 'math', name: 'Mathematics', color: 'bg-blue-500' },
  { id: 'uiux', name: 'UI/UX Design', color: 'bg-amber-500' },
  { id: 'webdev', name: 'Web Dev', color: 'bg-emerald-500' },
  { id: 'marketing', name: 'Marketing', color: 'bg-rose-500' },
];

export const mockQuestions = [
  {
    id: 'q1',
    text: "What is the primary function of a 'div' tag in HTML?",
    options: [
      "To display an image",
      "To create a hyperlink",
      "To define a division or section",
      "To play a video"
    ],
    correctOption: 2,
    category: 'webdev',
    difficulty: 'Easy',
    tags: ['html', 'basics']
  },
  {
    id: 'q2',
    text: "Which property is used to change the background color in CSS?",
    options: [
      "color",
      "bgcolor",
      "background-color",
      "background"
    ],
    correctOption: 2,
    category: 'webdev',
    difficulty: 'Easy',
    tags: ['css', 'styling']
  },
  {
    id: 'q3',
    text: "What is 15% of 200?",
    options: [
      "20",
      "25",
      "30",
      "35"
    ],
    correctOption: 2,
    category: 'math',
    difficulty: 'Medium',
    tags: ['percentage', 'arithmetic']
  },
  {
    id: 'q4',
    text: "In UI Design, what does 'Whitespace' refer to?",
    options: [
      "The color white used in background",
      "Empty space around elements",
      "A loading state",
      "The space between letters"
    ],
    correctOption: 1,
    category: 'uiux',
    difficulty: 'Easy',
    tags: ['design', 'layout']
  },
  {
    id: 'q5',
    text: "Which hook is used for side effects in React?",
    options: [
      "useState",
      "useEffect",
      "useContext",
      "useReducer"
    ],
    correctOption: 1,
    category: 'webdev',
    difficulty: 'Medium',
    tags: ['react', 'hooks']
  }
];

export const premadeTests = [
  {
    id: 'test-1',
    title: "Web Development Basics",
    category: 'webdev',
    questionCount: 10,
    duration: 15,
    difficulty: 'Easy',
    image: 'bg-emerald-100'
  },
  {
    id: 'test-2',
    title: "UI/UX Principles",
    category: 'uiux',
    questionCount: 15,
    duration: 20,
    difficulty: 'Medium',
    image: 'bg-amber-100'
  },
  {
    id: 'test-3',
    title: "Advanced Math",
    category: 'math',
    questionCount: 20,
    duration: 30,
    difficulty: 'Hard',
    image: 'bg-blue-100'
  }
];
