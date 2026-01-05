import { axiosInstance } from "./axios";
import type { LoginForm } from "../schema/login.schema";
import type {
  GetUserInfoResponseData,
  LoginResponseData,
  SignupRequest,
  SignupResponseData,
  UpdateUserRequest,
  UpdateUserResponseData,
  UserCategories,
  UserLoginResponse,
} from "../types/user";
import type { ApiResponse } from "../types/common";

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

export const getMyProfile = async () => {
  const { data } = await axiosInstance.get<
    ApiResponse<GetUserInfoResponseData>
  >("/api/v1/users/getInfo");
  return data.data;
};

export const updateUserProfile = async (userData: UpdateUserRequest) => {
  const { data } = await axiosInstance.patch<
    ApiResponse<UpdateUserResponseData>
  >("/api/v1/users/modify", userData);
  return data;
};

export const getUserCategories = async () => {
  const { data } = await axiosInstance.get<ApiResponse<UserCategories>>(
    "/api/v1/users/my-category"
  );
  console.log("getUserCategories data:", data);
  return data.data;
};

export const googleLogin = async (accessToken: string) => {
  const { data } = await axiosInstance.post<ApiResponse<UserLoginResponse>>(
    "/api/v1/users/google/login",
    { accessToken }
  );
  console.log("구글 로그인: ", data);
  return data;
};
