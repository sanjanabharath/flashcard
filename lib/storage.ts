import { Flashcard, Category, StudySession } from './types';

// Default categories
const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Mathematics', color: '#ef4444' },
  { id: '2', name: 'Science', color: '#3b82f6' },
  { id: '3', name: 'Languages', color: '#10b981' },
  { id: '4', name: 'History', color: '#f59e0b' },
  { id: '5', name: 'Geography', color: '#8b5cf6' },
];

// Sample flashcards
const SAMPLE_FLASHCARDS: Flashcard[] = [
  {
    id: '1',
    question: 'What is the capital of France?',
    answer: 'Paris',
    categoryId: '4',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastPracticed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    correctCount: 3,
    incorrectCount: 1,
    isStarred: true,
  },
  {
    id: '2',
    question: 'What is 2 + 2?',
    answer: '4',
    categoryId: '1',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastPracticed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    correctCount: 5,
    incorrectCount: 0,
    isStarred: false,
  },
  {
    id: '3',
    question: 'What is the chemical symbol for water?',
    answer: 'H₂O',
    categoryId: '2',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    lastPracticed: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    correctCount: 2,
    incorrectCount: 1,
    isStarred: false,
  },
  {
    id: '4',
    question: 'What is the Spanish word for "hello"?',
    answer: 'Hola',
    categoryId: '3',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastPracticed: null,
    correctCount: 0,
    incorrectCount: 0,
    isStarred: false,
  },
  {
    id: '5',
    question: 'What is the largest continent?',
    answer: 'Asia',
    categoryId: '5',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lastPracticed: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    correctCount: 1,
    incorrectCount: 1,
    isStarred: true,
  },
];

// Sample study sessions
const SAMPLE_STUDY_SESSIONS: StudySession[] = [
  {
    id: '1',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    categoryId: null,
    cardsStudied: 5,
    correctCount: 3,
    incorrectCount: 2,
    duration: 300,
  },
  {
    id: '2',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    categoryId: '1',
    cardsStudied: 3,
    correctCount: 3,
    incorrectCount: 0,
    duration: 180,
  },
  {
    id: '3',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    categoryId: '2',
    cardsStudied: 2,
    correctCount: 1,
    incorrectCount: 1,
    duration: 120,
  },
  {
    id: '4',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    categoryId: '4',
    cardsStudied: 4,
    correctCount: 3,
    incorrectCount: 1,
    duration: 240,
  },
];

// Load flashcards from storage or use sample data
export const loadFlashcards = (): Flashcard[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('flashcards');
  
  if (stored) {
    return JSON.parse(stored);
  } else {
    localStorage.setItem('flashcards', JSON.stringify(SAMPLE_FLASHCARDS));
    return SAMPLE_FLASHCARDS;
  }
};

// Load categories from storage or use defaults
export const loadCategories = (): Category[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('categories');
  
  if (stored) {
    return JSON.parse(stored);
  } else {
    localStorage.setItem('categories', JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }
};

// Load study sessions from storage or use sample data
export const loadStudySessions = (): StudySession[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('studySessions');
  
  if (stored) {
    return JSON.parse(stored);
  } else {
    localStorage.setItem('studySessions', JSON.stringify(SAMPLE_STUDY_SESSIONS));
    return SAMPLE_STUDY_SESSIONS;
  }
};

// Save a new study session
export const saveStudySession = (session: StudySession): void => {
  if (typeof window === 'undefined') return;
  
  const sessions = loadStudySessions();
  sessions.push(session);
  localStorage.setItem('studySessions', JSON.stringify(sessions));
};