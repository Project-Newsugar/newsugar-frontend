import { axiosInstance } from "./axios";
import type { LoginForm } from "../schema/login.schema";

// 1. 백엔드 공통 응답 타입 정의 (API 명세 기준)
export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string | null;
  data: T;
  timestamp: string;
}

// 2. 회원가입 응답 데이터 타입
export interface SignupResponseData {
  id: number;
  name: string;
  email: string;
  nickname: string;
  phone: string | null;
}

// 1. 회원가입 API
// 회원가입 요청 데이터 타입 (passwordCheck 제외)
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  nickname: string;
  phone: string | null; // 여기서 null 허용
}
// 로그인 응답 데이터 토큰 정보
export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  grantType: string; // Bearer 등
  expiresIn: number; // 3600 (초 단위 만료 시간)
}
// 프로필 수정 요청 타입 (MyPage용)
export interface UpdateProfileRequest {
  name?: string;
  nickname?: string;
  phone?: string | null;
  password?: string;
}
// --- API 함수들 ---

export const registerUser = async (userData: SignupRequest) => {
  const { data } = await axiosInstance.post<ApiResponse<SignupResponseData>>(
    "api/v1/users/signup",
    userData
  );
  return data;
};

// 2. 로그인 API
export const loginUser = async (userData: LoginForm) => {
  const { data } = await axiosInstance.post<ApiResponse<LoginResponseData>>(
    "api/v1/users/login",
    userData
  );
  return data;
};

// 닉네임 중복 체크 (기존 유지)
export const checkNickname = async (nickname: string) => {
  const { data } = await axiosInstance.get(
    `/users/check-nickname?nickname=${nickname}`
  );
  return data;
};

// 3. 내 정보 조회 API (마이페이지용)
export interface GetUserInfoResponseData {
  id: number;
  name: string;
  email: string;
  nickname: string;
  phone: string | null;
  score: number;
}

export const getMyProfile = async () => {
  const { data } = await axiosInstance.get<
    ApiResponse<GetUserInfoResponseData>
  >("/api/v1/users/getInfo");
  return data;
};

// 4. 유저 정보 수정 API
export interface UpdateUserRequest {
  name: string;
  password: string;
  nickname: string;
  phone: string;
}

export interface UpdateUserResponseData {
  id: number;
  name: string;
  email: string;
  nickname: string;
  phone: string;
  score: number;
}

export const updateUserProfile = async (userData: UpdateUserRequest) => {
  const { data } = await axiosInstance.patch<
    ApiResponse<UpdateUserResponseData>
  >("/api/v1/users/modify", userData);
  return data;
};
