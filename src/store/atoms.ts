import { atom } from 'jotai';
import type { CategoryId } from '../constants/CategoryData';
// ===== 1224 유저 정보 문제 때문에 수정 (확인은 X) - 시작 =====
import { LOCAL_STORAGE_KEY } from '../constants/keys';

// localStorage의 accessToken을 확인하여 초기값 설정
// 문제: 기존에는 항상 false로 시작해서 새로고침 시 로그인 상태가 초기화됨
// 해결: localStorage에 토큰이 있으면 true로 시작
const getInitialAuthState = () => {
  try {
    const accessToken = window.localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    return !!accessToken;
  } catch {
    return false;
  }
};

export const isLoggedInAtom = atom<boolean>(getInitialAuthState());
// ===== 1224 유저 정보 문제 때문에 수정 (확인은 X) - 끝 =====

export interface QuizData {
  question: string;
  correctAnswer: string;
  explanation: string;
}

export const currentQuizAtom = atom<QuizData | null>(null);

export const quizSolvedAtom = atom<boolean>(false);

export const favoriteCategoriesAtom = atom<CategoryId[]>([]);
