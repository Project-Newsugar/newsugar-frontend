import React from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import useForm from "../hooks/useForm";
import { signupSchema, type SignupForm } from "../schema/signup.schema";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const { values, errors, touched, getInputProps, handleChange } = useForm<SignupForm>({
    // 1. 초기값에 nickname 추가
    initialValue: {
      name: "",
      nickname: "",
      phone: "",
      email: "",
      password: "",
      passwordCheck: "",
    },

    validate: (values) => {
      const result = signupSchema.safeParse(values);

      if (result.success) {
        return {
          email: "",
          name: "",
          phone: "",
          nickname: "",
          password: "",
          passwordCheck: "",
        };
      }

      const newErrors: Record<keyof SignupForm, string> = {
        email: "",
        name: "",
        phone: "",
        nickname: "",
        password: "",
        passwordCheck: "",
      };

      result.error.issues.forEach((err) => {
        const key = err.path[0] as keyof SignupForm;
        newErrors[key] = err.message;
      });

      return newErrors;
    },
  });
  // 휴대전화 자동 하이픈 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    let formatted = value;
    if (value.length > 3 && value.length <= 7) {
      formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      formatted = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
    // useForm의 handleChange를 직접 호출하여 상태 업데이트
    handleChange("phone", formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 에러 체크 (하나라도 있으면 중단)
    if (Object.values(errors).some((msg) => msg)) return;

    console.log("🟢 회원가입 시도:", values);
    // TODO: 백엔드 API 연동 (values에 nickname 포함됨)
    
    alert(`환영합니다, ${values.nickname}님! 회원가입이 완료되었습니다.`);
    navigate("/login");
  };

  // 스타일 헬퍼
  const inputClass = (hasError: boolean) =>
    clsx(
      "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      hasError ? "border-red-500" : "border-slate-300"
    );

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Newsugar 회원가입
        </h1>
        <p className="text-slate-500 text-sm mt-2">
          오늘의 뉴스를 가장 쉽고 빠르게 만나보세요.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* 이름 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            이름
          </label>
          <input
            {...getInputProps("name")}
            placeholder="홍길동"
            className={inputClass(!!(touched.name && errors.name))}
          />
          {touched.name && errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* 닉네임 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            닉네임
          </label>
          <input
            {...getInputProps("nickname")}
            placeholder="멋쟁이사자"
            className={inputClass(!!(touched.nickname && errors.nickname))}
          />
          {touched.nickname && errors.nickname && (
            <p className="text-red-500 text-xs mt-1">{errors.nickname}</p>
          )}
        </div>

        {/* 휴대전화 (신규 추가) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">휴대전화 번호 (선택)</label>
          <input
            {...getInputProps("phone")}
            onChange={handlePhoneChange} // 덮어쓰기
            placeholder="010-1234-5678"
            maxLength={13}
            className={inputClass(!!(touched.phone && errors.phone))}
          />
          {touched.phone && errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* 이메일 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            이메일
          </label>
          <input
            {...getInputProps("email")}
            placeholder="you@example.com"
            type="email"
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
            placeholder="8자 이상 입력해주세요"
            type="password"
            className={inputClass(!!(touched.password && errors.password))}
          />
          {touched.password && errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            비밀번호 확인
          </label>
          <input
            {...getInputProps("passwordCheck")}
            placeholder="비밀번호를 다시 입력해주세요"
            type="password"
            className={inputClass(!!(touched.passwordCheck && errors.passwordCheck))}
          />
          {touched.passwordCheck && errors.passwordCheck && (
            <p className="text-red-500 text-xs mt-1">{errors.passwordCheck}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          회원가입하기
        </button>

        <div className="mt-6 text-center text-sm text-slate-500">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            로그인
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;