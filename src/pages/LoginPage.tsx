import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { GoogleLogo } from "../assets";
import useForm from "../hooks/useForm";
import { loginSchema, type LoginForm } from "../schema/login.schema";

import { loginUser } from "../api/auth";
import { isAxiosError } from "axios";
import { getLocalStorage } from "../utils/getLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/keys";

import { useSetAtom } from "jotai";
import { isLoggedInAtom } from "../store/atoms"; // 전역 상태
import { useAuth } from "../hooks/useAuth";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const setIsLoggedIn = useSetAtom(isLoggedInAtom); // 로그인 상태 업데이트용
  const [serverError, setServerError] = useState<string | null>(null);

  // 이미 로그인된 사용자는 홈으로 리다이렉트
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // useForm 훅 + Zod 스키마 연동
  const { values, errors, touched, getInputProps } = useForm<LoginForm>({
    initialValue: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const result = loginSchema.safeParse(values);
      if (result.success) {
        return { email: "", password: "" };
      }

      const newErrors: Record<keyof LoginForm, string> = {
        email: "",
        password: "",
      };

      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof LoginForm;
        newErrors[key] = issue.message;
      });

      return newErrors;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // 에러가 하나라도 있으면 중단 (간단 체크)
    if (Object.values(errors).some((msg) => msg)) return;

    try {
      console.log("🟢 로그인 시도:", values);

      // 1. 백엔드 로그인 API 호출
      const response = await loginUser(values);

      // 2. 성공 여부 체크
      if (response.success) {
        // 3. 토큰을 로컬스토리지에 저장
        const { setItem: setAccessToken } = getLocalStorage(
          LOCAL_STORAGE_KEY.accessToken
        );
        const { setItem: setRefreshToken } = getLocalStorage(
          LOCAL_STORAGE_KEY.refreshToken
        );

        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);

        // 4. Jotai 전역 상태 업데이트 (헤더가 바로 바뀌도록 함)
        setIsLoggedIn(true);

        // 5. 홈으로 이동
        // alert('환영합니다!'); // 필요 시 주석 해제
        // window.location.href = "/";
        navigate("/");
      } else {
        // 성공 응답이지만 success: false인 경우 에러 처리
        throw new Error(response.message || "로그인에 실패했습니다.");
      }
    } catch (error: any) {
      // [추가] 에러 핸들링 로직
      console.error("❌ 로그인 실패:", error);
      let message = "서버와 통신할 수 없습니다.";

      if (isAxiosError(error) && error.response) {
        // 백엔드가 보낸 구체적인 에러 메시지가 있다면 사용
        message =
          error.response.data?.message ||
          "이메일 또는 비밀번호를 확인해주세요.";
      } else if (error instanceof Error) {
        message = error.message;
      }

      // UI에 에러 표시
      setServerError(message);
    }
  };

  // 구글 로그인 핸들러 (백엔드 리다이렉트 URL 연결)
  const handleGoogleLogin = () => {
    // .env 파일에 정의된 백엔드 주소 + 구글 로그인 경로
    window.location.href = `${
      import.meta.env.VITE_SERVER_API_URL
    }/v1/oauth2/google/login`;
  };

  // 스타일 헬퍼 (반복 제거)
  const inputClass = (hasError: boolean) =>
    clsx(
      "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      hasError ? "border-red-500" : "border-slate-300"
    );

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Newsugar 로그인</h1>
        <p className="text-slate-500 text-sm mt-2">
          오늘의 뉴스를 가장 쉽고 빠르게 만나보세요.
        </p>
      </div>

      {/* 서버 에러 메시지 블록 */}
      {serverError && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
          ⚠️ {serverError}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* 이메일 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            이메일
          </label>
          <input
            {...getInputProps("email")}
            type="email"
            placeholder="you@example.com"
            className={inputClass(!!(touched.email && errors.email))}
          />
          {touched.email && errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            비밀번호
          </label>
          <input
            {...getInputProps("password")}
            type="password"
            placeholder="••••••••"
            className={inputClass(!!(touched.password && errors.password))}
          />
          {touched.password && errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          로그인하기
        </button>
      </form>

      {/* 구분선 */}
      <div className="my-6 flex items-center">
        <div className="grow border-t border-slate-200" />
        <span className="mx-4 text-xs text-slate-400">또는</span>
        <div className="grow border-t border-slate-200" />
      </div>

      {/* 구글 로그인 */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
      >
        <GoogleLogo className="w-5 h-5" />
        <span className="text-slate-700">Google로 계속하기</span>
      </button>

      <div className="mt-6 text-center text-sm text-slate-500">
        아직 계정이 없으신가요?{" "}
        <a
          href="/signup"
          className="text-blue-600 font-semibold hover:underline"
        >
          회원가입
        </a>
      </div>
      <div className="mt-8 text-center">
        <a
          href="/"
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors border-b border-transparent hover:border-slate-400 pb-0.5"
        >
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
