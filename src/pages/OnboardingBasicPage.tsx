import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../components/Input';
import { Button } from '../components/Button';

// 1. 금지어 목록 (실제 서비스에선 더 방대하겠지만 예시로 추가)
const FORBIDDEN_WORDS = ['admin', 'root', '관리자', '운영자', '바보', '멍청이', 'badword'];

const OnboardingBasicPage: React.FC = () => {
  const navigate = useNavigate();

  // 입력값 상태
  const [formData, setFormData] = useState({ nickname: '', phone: '' });
  // 에러 메시지 상태
  const [errors, setErrors] = useState({ nickname: '', phone: '' });
  // 로딩 상태 (중복 검사할 때 버튼 비활성화용)
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    let formatted = value;
    if (value.length > 3 && value.length <= 7) {
      formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      formatted = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
    setFormData(prev => ({ ...prev, phone: formatted }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  };

  // 2. 가짜(Mock) 중복 검사 API 함수
  // 나중에 이 부분만 실제 axios 호출로 바꾸면 됩니다.
  const checkNicknameDuplicate = async (nickname: string): Promise<boolean> => {
    // 0.5초 동안 통신하는 척 기다림 (네트워크 지연 시뮬레이션)
    await new Promise(resolve => setTimeout(resolve, 500));

    // 예시: 'dupe'라는 닉네임만 이미 있다고 가정
    const FAKE_EXISTING_NICKS = ['newsugar', 'test', 'dupe'];
    
    // 이미 있는 닉네임이면 true(중복), 아니면 false(사용가능) 반환
    return FAKE_EXISTING_NICKS.includes(nickname);
  };

  const validate = () => {
    const newErrors = { nickname: '', phone: '' };
    let isValid = true;

    // 닉네임 기본 검사
    if (!formData.nickname.trim()) {
      newErrors.nickname = '닉네임은 필수입니다.';
      isValid = false;
    } else if (formData.nickname.length < 2) {
      newErrors.nickname = '닉네임은 2글자 이상이어야 합니다.';
      isValid = false;
    } 
    // 3. 욕설/금지어 필터링 적용
    else if (FORBIDDEN_WORDS.some(word => formData.nickname.includes(word))) {
      newErrors.nickname = '사용할 수 없는 단어가 포함되어 있습니다.';
      isValid = false;
    }

    // 휴대전화 검사
    if (formData.phone.trim().length > 0) {
      const phoneRegex = /^010-\d{3,4}-\d{4}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = '올바른 휴대전화 번호 형식이 아닙니다 (예: 010-1234-5678).';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1차: 기본 유효성 및 욕설 검사
    if (!validate()) return;

    // 2차: 서버 중복 검사 (비동기)
    setIsLoading(true); // 로딩 시작
    try {
      const isDuplicate = await checkNicknameDuplicate(formData.nickname);
      
      if (isDuplicate) {
        setErrors(prev => ({ ...prev, nickname: '이미 사용 중인 닉네임입니다.' }));
        setIsLoading(false); // 로딩 끝
        return;
      }

      // 모든 검사 통과!
      console.log('온보딩 완료:', formData);
      alert(`환영합니다, ${formData.nickname}님! 메인으로 이동합니다.`);
      navigate('/news');

    } catch (error) {
      alert('중복 검사 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">기본 정보 설정</h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          서비스에서 사용할 <span className="font-semibold text-slate-700">닉네임</span>을 설정해 주세요.<br />
          휴대전화 번호는 <span className="text-blue-600 font-medium">선택 사항</span>입니다.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input 
          label="닉네임" 
          name="nickname"
          placeholder="멋진 닉네임을 입력하세요" 
          value={formData.nickname}
          onChange={handleChange}
          error={errors.nickname}
          required 
          // 로딩 중엔 입력 못하게 막으면 더 좋음
          disabled={isLoading}
        />
        
        <Input 
          label="휴대전화 번호 (선택)" 
          name="phone"
          type="tel" 
          placeholder="010-1234-5678" 
          value={formData.phone}
          onChange={handlePhoneChange} 
          error={errors.phone}
          maxLength={13} 
          disabled={isLoading}
        />

        <div className="pt-4 space-y-2">
          {/* 로딩 중일 때 버튼 텍스트 변경 */}
          <Button type="submit" fullWidth variant="primary" disabled={isLoading}>
            {isLoading ? '확인 중...' : '설정 완료하고 시작하기'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default OnboardingBasicPage