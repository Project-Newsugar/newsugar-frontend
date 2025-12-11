import { atom } from 'jotai';
import type { UserCategory } from '../types/category';

export const isLoggedInAtom = atom<boolean>(false);

export interface QuizData {
  question: string;
  correctAnswer: string;
  explanation: string;
}

export const currentQuizAtom = atom<QuizData | null>(null);

export const quizSolvedAtom = atom<boolean>(false);

export const favoriteCategoriesAtom = atom<UserCategory[]>([]);
