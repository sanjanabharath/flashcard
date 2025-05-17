export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  categoryId: string | null;
  createdAt: string;
  lastPracticed: string | null;
  correctCount: number;
  incorrectCount: number;
  isStarred: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface StudySession {
  id: string;
  date: string;
  categoryId: string | null;
  cardsStudied: number;
  correctCount: number;
  incorrectCount: number;
  duration: number; // in seconds
}