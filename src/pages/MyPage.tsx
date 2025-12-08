import React from 'react';
import { Button } from '../components/Button';

const MyPage: React.FC = () => {
  // TODO: 나중에 getMyProfile() + 별도 API로 실제 데이터 가져오기
  const user = {
    name: '홍길동',
    nickname: '멋쟁이사자',
    email: 'test@example.com',
    phone: '010-1234-5678', // 👇 온보딩에서 입력받은 정보 추가
  };

  // 퀴즈/뱃지 정보 Mock Data
  const quizStats = {
    totalScore: 120,   // 누적 점수
    solvedCount: 15,   // 푼 퀴즈 수
  };

  const badges: string[] = [
    '출석왕',
    '올빼미 탐독가',
    '뉴스 초보 탈출',
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">마이페이지</h1>

      {/* 1. 기본 정보 섹션 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-700">기본 정보</h2>
        
        <div className="space-y-3">
          {/* 이름 */}
          <div>
            <p className="text-xs text-slate-500 mb-1">이름</p>
            <p className="px-4 py-3 rounded-lg bg-slate-50 text-sm text-slate-700">
              {user.name}
            </p>
          </div>

          {/* 이메일 */}
          <div>
            <p className="text-xs text-slate-500 mb-1">이메일</p>
            <p className="px-4 py-3 rounded-lg bg-slate-50 text-sm text-slate-700">
              {user.email}
            </p>
          </div>

          {/* 닉네임 */}
          <div>
            <p className="text-xs text-slate-500 mb-1">닉네임</p>
            <p className="px-4 py-3 rounded-lg bg-slate-50 text-sm text-slate-700">
              {user.nickname}
            </p>
          </div>

          {/* 휴대전화 번호 (추가됨) */}
          <div>
            <p className="text-xs text-slate-500 mb-1">휴대전화 번호</p>
            <p className="px-4 py-3 rounded-lg bg-slate-50 text-sm text-slate-700">
              {user.phone || '미등록'}
            </p>
          </div>
        </div>
      </section>

      {/* 2. 퀴즈 기록 섹션 (New!) */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-700">퀴즈 기록</h2>
        <div className="grid grid-cols-2 gap-3">
          {/* 누적 점수 카드 */}
          <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">누적 점수</p>
            <p className="text-xl font-bold text-blue-600">
              {quizStats.totalScore}
              <span className="text-sm font-medium text-slate-500 ml-1">점</span>
            </p>
          </div>
          {/* 푼 퀴즈 수 카드 */}
          <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">해결한 퀴즈</p>
            <p className="text-xl font-bold text-slate-900">
              {quizStats.solvedCount}
              <span className="text-sm font-medium text-slate-500 ml-1">개</span>
            </p>
          </div>
        </div>
      </section>

      {/* 3. 보유 뱃지 섹션 (New!) */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-700">보유 뱃지</h2>

        {badges.length === 0 ? (
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              아직 획득한 뱃지가 없어요.<br/>오늘의 퀴즈를 풀어 첫 번째 뱃지를 모아보세요!
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700 shadow-sm"
              >
                🏅 {badge}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* 4. 설정 섹션 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-700">설정</h2>
        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
          <span className="text-sm text-slate-600">알림 설정</span>
          <Button variant="ghost" className="text-xs h-8 px-3 bg-white border border-slate-200">
            변경
          </Button>
        </div>
      </section>

      {/* 로그아웃 */}
      <div className="pt-4 pb-8">
        <Button
          variant="ghost"
          className="w-full border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200"
        >
          로그아웃
        </Button>
      </div>
    </div>
  );
};

export default MyPage;