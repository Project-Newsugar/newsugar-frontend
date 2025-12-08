import { axiosInstance } from './axios';
import type { LoginForm } from '../schema/login.schema';
import type { SignupForm } from '../schema/signup.schema';

// 1. 회원가입 API
export const registerUser = async (userData: SignupForm) => {
  const { data } = await axiosInstance.post('/auth/register', userData);
  return data;
};

// 2. 로그인 API
export const loginUser = async (userData: LoginForm) => {
  const { data } = await axiosInstance.post('/auth/login', userData);
  return data;
};

// 3. 내 정보 조회 API (마이페이지용)
export const getMyProfile = async () => {
  const { data } = await axiosInstance.get('/users/me');
  return data;
};

// 4. 닉네임 중복 체크 API (온보딩용)
export const checkNickname = async (nickname: string) => {
  const { data } = await axiosInstance.get(`/users/check-nickname?nickname=${nickname}`);
  return data; // { isAvailable: boolean } 형태 예상
};