export interface SignupResponseData {
  id: number;
  name: string;
  email: string;
  nickname: string;
  phone: string | null;
}

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

export interface GetUserInfoResponseData {
  id: number;
  name: string;
  email: string;
  nickname: string;
  phone: string | null;
  score: number;
}