import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { GoogleLogo } from '../assets';
import useForm from '../hooks/useForm';
import { loginSchema, type LoginForm } from '../schema/login.schema';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  // useForm 훅 + Zod 스키마 연동
  const { values, errors, touched, getInputProps } = useForm<LoginForm>({
    initialValue: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const result = loginSchema.safeParse(values);
      if (result.success) {
        return { email: '', password: '' };
      }

      const newErrors: Record<keyof LoginForm, string> = {
        email: '',
        password: '',
      };

      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof LoginForm;
        newErrors[key] = issue.message;
      });

      return newErrors;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 에러가 하나라도 있으면 중단 (간단 체크)
    if (Object.values(errors).some((msg) => msg)) return;

    console.log('🟢 로그인 시도:', values);
    // TODO: API 연결 예정
    alert('로그인 성공! (임시)');
    navigate('/');
  };

  const handleGoogleLogin = () => {
    alert('구글 로그인은 추후 GCP 설정 후 연동됩니다.');
  };

  // 스타일 헬퍼 (반복 제거)
  const inputClass = (hasError: boolean) =>
    clsx(
      'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
      hasError ? 'border-red-500' : 'border-slate-300',
    );

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Newsugar 로그인</h1>
        <p className="text-slate-500 text-sm mt-2">
          오늘의 뉴스를 가장 쉽고 빠르게 만나보세요.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* 이메일 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            이메일
          </label>
          <input
            {...getInputProps('email')}
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
            {...getInputProps('password')}
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
        아직 계정이 없으신가요?{' '}
        <Link
          to="/signup"
          className="text-blue-600 font-semibold hover:underline"
        >
          회원가입
        </Link>
      </div>
      <div className="mt-8 text-center">
        <Link 
          to="/" 
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors border-b border-transparent hover:border-slate-400 pb-0.5"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;