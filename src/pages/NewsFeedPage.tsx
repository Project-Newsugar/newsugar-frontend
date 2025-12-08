// src/pages/NewsFeedPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

const NewsFeedPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoLogin = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200 max-w-sm w-full mx-4">
        <h2 className="text-xl font-bold text-slate-700 mb-2">
          🚧 뉴스 피드 준비 중
        </h2>
        <p className="text-slate-500 mb-6 text-sm">
          열심히 뉴스를 나르고 있습니다.
          <br />
          비로그인 사용자도 볼 수 있는 메인 화면입니다.
        </p>

        {/* 로그인 버튼 */}
        <Button
          variant="ghost"         // or 기본 버튼이면 이 줄 생략
          className="w-full h-10" // fullWidth 대신 className으로 폭 지정
          onClick={handleGoLogin}
        >
          로그인하러 가기
        </Button>
      </div>
    </div>
  );
};

export default NewsFeedPage;
