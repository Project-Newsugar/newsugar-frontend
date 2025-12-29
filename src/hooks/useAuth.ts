import { useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import { isLoggedInAtom } from '../store/atoms';
import { LOCAL_STORAGE_KEY } from '../constants/keys';
import { getLocalStorage } from '../utils/getLocalStorage';
// ===== 1224 유저 정보 문제 때문에 수정 (확인은 X) - 시작 =====
import { useQueryClient } from '@tanstack/react-query';
// ===== 1224 유저 정보 문제 때문에 수정 (확인은 X) - 끝 =====

/**
 * 인증 상태를 관리하는 커스텀 훅
 * localStorage의 accessToken을 기반으로 로그인 상태를 판단합니다.
 */
export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  // ===== 1224 유저 정보 문제 때문에 수정 (확인은 X) - 시작 =====
  const queryClient = useQueryClient(); // React Query 캐시 초기화용
  // ===== 1224 유저 정보 문제 때문에 수정 (확인은 X) - 끝 =====

  // localStorage의 accessToken 확인
  const checkAuth = useCallback(() => {
    const accessToken = getLocalStorage(LOCAL_STORAGE_KEY.accessToken).getItem();
    const isAuthenticated = !!accessToken;
    setIsLoggedIn(isAuthenticated);
    return isAuthenticated;
  }, [setIsLoggedIn]);

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 로그인 처리
  const login = useCallback((accessToken: string, refreshToken: string) => {
    getLocalStorage(LOCAL_STORAGE_KEY.accessToken).setItem(accessToken);
    getLocalStorage(LOCAL_STORAGE_KEY.refreshToken).setItem(refreshToken);
    setIsLoggedIn(true);
  }, [setIsLoggedIn]);

  // 로그아웃 처리
  const logout = useCallback(() => {
    // ===== 1224 유저 정보 문제 때문에 수정 (확인은 X) - 시작 =====
    // 문제: 로그아웃 시 이전 유저의 React Query 캐시가 남아있음
    // 해결: 로그아웃 시 모든 캐시를 초기화하여 다음 로그인 시 깨끗한 상태로 시작
    queryClient.clear();
    console.log("🧹 로그아웃 시 유저 캐시 초기화 완료");
    // ===== 1224 유저 정보 문제 때문에 수정 (확인은 X) - 끝 =====

    getLocalStorage(LOCAL_STORAGE_KEY.accessToken).removeItem();
    getLocalStorage(LOCAL_STORAGE_KEY.refreshToken).removeItem();
    setIsLoggedIn(false);
  }, [setIsLoggedIn, queryClient]);

  return {
    isLoggedIn,
    login,
    logout,
    checkAuth,
  };
};
