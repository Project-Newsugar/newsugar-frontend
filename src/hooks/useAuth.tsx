import { useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import { isLoggedInAtom } from '../store/atoms';
import { LOCAL_STORAGE_KEY } from '../constants/keys';
import { getLocalStorage } from '../utils/getLocalStorage';

/**
 * 인증 상태를 관리하는 커스텀 훅
 * localStorage의 accessToken을 기반으로 로그인 상태를 판단합니다.
 */
export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);

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
    getLocalStorage(LOCAL_STORAGE_KEY.accessToken).removeItem();
    getLocalStorage(LOCAL_STORAGE_KEY.refreshToken).removeItem();
    setIsLoggedIn(false);
  }, [setIsLoggedIn]);

  return {
    isLoggedIn,
    login,
    logout,
    checkAuth,
  };
};
