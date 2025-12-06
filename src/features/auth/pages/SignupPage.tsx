import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  // 1. 입력값 상태 (비밀번호 확인 추가됨)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  // 2. 에러 메시지 상태
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  // 3. 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 에러 메시지 초기화
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 4. 유효성 검사 (핵심 로직)
  const validate = () => {
    const newErrors = { email: '', password: '', confirmPassword: '' };
    let isValid = true;

    // 이메일
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
      isValid = false;
    }

    // 비밀번호
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
      isValid = false;
    }

    // 비밀번호 확인 (공백 + 일치 여부)
		if (!formData.confirmPassword) {
		  newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
		  isValid = false;
		} else if (formData.confirmPassword !== formData.password) {
		  newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
		  isValid = false;
		}

    setErrors(newErrors);
    return isValid;
  };

  // 5. 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      console.log('회원가입 시도:', formData);
      // TODO: 백엔드 API 연동 (회원가입 요청)
      
      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      navigate('/login');
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">회원가입</h1>
        <p className="text-slate-500 text-sm mt-2">
          NewSugar의 다양한 뉴스 서비스를 즐겨보세요.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input 
          label="이메일" 
          name="email"
          type="email" 
          placeholder="you@example.com" 
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required 
        />
        
        <Input 
          label="비밀번호" 
          name="password"
          type="password" 
          placeholder="8자 이상 입력해주세요" 
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required 
        />
        
        <Input 
          label="비밀번호 확인" 
          name="confirmPassword"
          type="password" 
          placeholder="비밀번호를 다시 입력해주세요" 
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required 
        />

        <Button type="submit" fullWidth variant="primary">
          가입하고 시작하기
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        이미 계정이 있으신가요?{' '}
        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
          로그인
        </Link>
      </div>
    </div>
  )
}

export default SignupPage