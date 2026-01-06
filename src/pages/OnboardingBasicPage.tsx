import React from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx';
import useForm from '../hooks/useForm';
import { onboardingSchema, type OnboardingForm } from '../schema/onboarding.schema';

const OnboardingBasicPage: React.FC = () => {
  const navigate = useNavigate();

  const { values, errors, touched, getInputProps } = useForm<OnboardingForm>({
    initialValue: {
      nickname: '',
      phone: '',
    },
    validate: (values) => {
      const result = onboardingSchema.safeParse(values);

      if (result.success) return {
        nickname: '',
        phone: '',
      };

      const newErrors: Record<keyof OnboardingForm, string> = {
        nickname: '',
        phone: '',
      };

      result.error.issues.forEach((err) => {
        const key = err.path[0] as keyof OnboardingForm;
        newErrors[key] = err.message;
      });

      return newErrors;
    },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    let formatted = value;
    if (value.length > 3 && value.length <= 7) {
      formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      formatted = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🟢 Zod 검증 통과한 값:', values);
    alert(`환영합니다, ${values.nickname}님! 메인으로 이동합니다.`);
    navigate('/');
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

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* 닉네임 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            닉네임 <span className="text-red-500">*</span>
          </label>
          <input
            {...getInputProps('nickname')}
            placeholder="멋진 닉네임을 입력하세요"
            className={clsx(
              "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              touched.nickname && errors.nickname
                ? "border-red-500"
                : "border-slate-300"
            )}
          />
          {touched.nickname && errors.nickname && (
            <p className="text-red-500 text-xs mt-1">{errors.nickname}</p>
          )}
        </div>

        {/* 휴대전화 번호 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            휴대전화 번호 (선택)
          </label>
          <input
            type="tel"
            name="phone"
            value={values.phone}
            onChange={handlePhoneChange}
            onBlur={() => {}}
            placeholder="010-1234-5678"
            maxLength={13}
            className={clsx(
              "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              touched.phone && errors.phone
                ? "border-red-500"
                : "border-slate-300"
            )}
          />
          {touched.phone && errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            설정 완료하고 시작하기
          </button>
        </div>
      </form>
    </div>
  )
}

export default OnboardingBasicPage