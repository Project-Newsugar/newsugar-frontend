import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

// 구글 아이콘 (SVG) - 외부 라이브러리 없이 가볍게 사용
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.52 12.29C23.52 11.43 23.44 10.6 23.3 9.8H12V14.4H18.45C18.18 15.87 17.33 17.14 16.06 18V20.98H19.93C22.19 18.89 23.52 15.82 23.52 12.29Z" fill="#4285F4"/>
    <path d="M12 24C15.24 24 17.96 22.92 19.93 20.98L16.06 18C15 18.72 13.62 19.14 12 19.14C8.88 19.14 6.23 17.03 5.29 14.19H1.28V17.3C3.25 21.2 7.32 24 12 24Z" fill="#34A853"/>
    <path d="M5.29 14.19C5.05 13.31 4.92 12.4 4.92 11.5C4.92 10.6 5.05 9.69 5.29 8.81V5.7H1.28C0.46 7.33 0 9.14 0 11.5C0 13.86 0.46 15.67 1.28 17.3L5.29 14.19Z" fill="#FBBC05"/>
    <path d="M12 3.86C13.76 3.86 15.34 4.47 16.59 5.66L20.01 2.24C17.96 0.32 15.24 0 12 0C7.32 0 3.25 2.8 1.28 6.7L5.29 9.81C6.23 6.97 8.88 3.86 12 3.86Z" fill="#EA4335"/>
  </svg>
)

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  // 1. 입력값 상태 관리 (State)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // 2. 에러 메시지 상태 관리
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  // 3. 입력 핸들러: 글자를 칠 때마다 state 업데이트
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 타이핑 시작하면 해당 필드의 에러 메시지 삭제 (UX 향상)
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 4. 유효성 검사 (Validation)
  const validate = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    // 이메일 검사 (간단한 정규식)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
      isValid = false;
    }

    // 비밀번호 검사
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // 5. 로그인 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 새로고침 방지

    // 유효성 검사 통과 시에만 실행
    if (validate()) {
      console.log('로그인 시도:', formData);
      // TODO: 나중에 여기서 실제 API 호출 (axios)
      
      // 임시: 성공했다고 치고 온보딩으로 이동
      alert('로그인 성공! (임시)');
      navigate('/onboarding');
    }
  };

  // 6. 구글 로그인 핸들러 (임시)
  const handleGoogleLogin = () => {
    alert('구글 로그인은 추후 GCP 설정 후 연동됩니다.');
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Newsugar 로그인
        </h1>
        <p className="text-slate-500 text-sm mt-2">
          오늘의 뉴스를 가장 쉽고 빠르게 만나보세요.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input 
          label="이메일" 
          name="email" // handleChange에서 식별하기 위해 필요
          type="email" 
          placeholder="you@example.com" 
          value={formData.email} // 상태 연결
          onChange={handleChange} // 핸들러 연결
          error={errors.email} // 에러 메시지 연결
        />
        
        <Input 
          label="비밀번호" 
          name="password"
          type="password" 
          placeholder="••••••••" 
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Button type="submit" fullWidth variant="primary">
          로그인하기
        </Button>
      </form>

      {/* 구분선과 소셜 로그인 */}
      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="mx-4 text-xs text-slate-400">또는</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <Button 
        type="button" 
        fullWidth 
        variant="outline" 
        onClick={handleGoogleLogin}
      >
        <GoogleIcon />
        Google로 계속하기
      </Button>

      <div className="mt-6 text-center text-sm text-slate-500">
        아직 계정이 없으신가요?{' '}
        <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
          회원가입
        </Link>
      </div>
    </div>
  )
}

export default LoginPage