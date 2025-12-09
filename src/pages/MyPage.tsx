import {
  MdLogout,
  MdEdit,
  MdOutlineTrendingUp,
  MdClose,
  MdCheck,
} from "react-icons/md";
import { FaAward, FaBell, FaLock } from "react-icons/fa";
import { useState, type ChangeEvent } from "react";
import clsx from "clsx";

// 1. 뱃지 마스터 데이터 (문서 기준 정의)
const BADGE_MASTER_LIST = [
  { code: "MORNING", name: "갓생러", icon: "☀️", desc: "05~09시 접속" },
  { code: "DIVER", name: "뉴스 다독가", icon: "📚", desc: "3개 카테고리 섭렵" },
  { code: "PERFECT_SCORE", name: "퀴즈 마스터", icon: "💯", desc: "퀴즈 100점 달성" },
  { code: "NIGHT_OWL", name: "올빼미", icon: "🦉", desc: "심야 시간 활동" }, // 미구현 예시
];

type BadgeCode = (typeof BADGE_MASTER_LIST)[number]["code"];

const MyPage = () => {
  // TODO: 추후 백엔드 API 연동 시 이 부분을 교체합니다.
  const [user, setUser] = useState({
    name: "홍길동",
    nickname: "멋쟁이사자",
    email: "test@example.com",
    phone: "010-1234-5678",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user);

  // 2. 통계 데이터 (강사님 제안 반영: 카테고리별 조회수 추가)
  const stats = {
    totalScore: 120,
    solvedCount: 15,
    // 단순 문자열 배열 대신 조회수를 포함한 객체로 변경
    favoriteCategories: [
      { name: "경제", count: 42 },
      { name: "IT/과학", count: 28 },
      { name: "스포츠", count: 15 },
    ],
    readingStyle: "새벽형 스캐너", // 추후 분석 로직으로 도출될 키워드
  };

  // 3. 유저가 획득한 뱃지 코드 목록 (API에서 받아올 값)
  const myBadgeCodes: BadgeCode[] = ["MORNING", "PERFECT_SCORE"];

  // 4. 최근 7일 활동 (정답 여부 + 점수 시각화용)
  const weeklyActivity = [
    { day: "월", score: 100, solved: true },
    { day: "화", score: 80, solved: true },
    { day: "수", score: 0, solved: false },
    { day: "목", score: 100, solved: true },
    { day: "금", score: 40, solved: true },
    { day: "토", score: 0, solved: false },
    { day: "일", score: 100, solved: true },
  ];

  // 5. 최근 활동 내역
  const recentActivity = [
    { date: "2024.12.08", quiz: "경제 뉴스 퀴즈", result: "정답" },
    { date: "2024.12.07", quiz: "정치 뉴스 퀴즈", result: "정답" },
    { date: "2024.12.06", quiz: "IT 뉴스 퀴즈", result: "오답" },
  ];

  const handleEditClick = () => {
    setIsEditing(true);
    setEditForm(user);
  };

  const handleSave = () => {
    // TODO: 백엔드 PATCH API 호출
    setUser(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(user);
  };

  // React.ChangeEvent 타입을 사용하여 타입 에러 방지
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    alert("로그아웃 되었습니다. (임시)");
    // TODO: 로그아웃 처리 후 로그인 페이지로 이동
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 min-h-screen pb-24">
      {/* 1. 프로필 섹션 */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-gray-900 mb-4">프로필</h2>
        <div className="bg-white border-l-4 border-blue-600 rounded p-6 shadow-sm">
          {isEditing ? (
            // 편집 모드
            <div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">이름</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">닉네임</label>
                  <input
                    type="text"
                    name="nickname"
                    value={editForm.nickname}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">이메일</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">휴대전화</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  <MdCheck size={18} />
                  저장
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-medium text-sm"
                >
                  <MdClose size={18} />
                  취소
                </button>
              </div>
            </div>
          ) : (
            // 조회 모드
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                  <p className="text-gray-600 text-xs mt-1">@{user.nickname}</p>
                  <p className="text-gray-500 text-xs mt-1">{user.email}</p>
                  <p className="text-gray-500 text-xs mt-1">{user.phone}</p>
                </div>
                <button
                  onClick={handleEditClick}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <MdEdit size={20} />
                </button>
              </div>

              {/* 읽기 성향 및 선호 카테고리 태그 */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-2">나의 읽기 성향</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
                    #{stats.readingStyle}
                  </span>
                  {stats.favoriteCategories.map((cat) => (
                    <span
                      key={cat.name}
                      className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs border border-gray-200"
                    >
                      #{cat.name}{" "}
                      <span className="text-gray-400 text-[10px] ml-1">
                        ({cat.count}회)
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. 학습 리포트 + 뱃지 섹션 */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-gray-900 mb-4">학습 리포트</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 2-1. 점수 + 7일 그래프 카드 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MdOutlineTrendingUp className="text-blue-600" size={20} />
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                  퀴즈 진행 상황
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-gray-900">
                  {stats.totalScore}
                </span>
                <span className="text-xs text-gray-500">점 (누적)</span>
              </div>
              <p className="text-gray-500 text-xs mt-1">
                총 해결한 퀴즈:{" "}
                <span className="font-semibold text-gray-900">
                  {stats.solvedCount}개
                </span>
              </p>
            </div>

            {/* 7일 막대 그래프 */}
            <div className="mt-6">
              <p className="text-gray-400 text-[10px] mb-2 text-right">최근 7일 정답률</p>
              <div className="flex justify-between items-end h-24 border-b border-gray-100 pb-1">
                {weeklyActivity.map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1 group w-full mx-1">
                    <div className="relative w-full bg-gray-100 rounded-t-sm h-full flex items-end overflow-hidden">
                      <div
                        style={{ height: `${day.solved ? day.score : 0}%` }}
                        className={clsx(
                          "w-full transition-all duration-500",
                          day.score === 100 ? "bg-blue-500" : "bg-blue-300",
                          !day.solved && "h-0"
                        )}
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2-2. 뱃지 컬렉션 카드 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-900 font-bold text-sm">보유 뱃지</span>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {myBadgeCodes.length} / {BADGE_MASTER_LIST.length}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {BADGE_MASTER_LIST.map((badge) => {
                const isAcquired = myBadgeCodes.includes(badge.code);

                return (
                  <div
                    key={badge.code}
                    className={clsx(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all",
                      isAcquired
                        ? "bg-white border-blue-100 shadow-sm"
                        : "bg-gray-50 border-dashed border-gray-200 opacity-60"
                    )}
                  >
                    <div
                      className={clsx(
                        "w-10 h-10 flex items-center justify-center rounded-full text-xl shrink-0",
                        isAcquired ? "bg-blue-50" : "bg-gray-100"
                      )}
                    >
                      {isAcquired ? (
                        badge.icon
                      ) : (
                        <FaLock size={14} className="text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={clsx(
                          "text-sm font-bold truncate",
                          isAcquired ? "text-gray-900" : "text-gray-500"
                        )}
                      >
                        {badge.name}
                      </p>
                      <p className="text-[10px] text-gray-400 leading-tight mt-0.5 truncate">
                        {badge.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. 최근 활동 섹션 */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-gray-900 mb-4">최근 활동</h2>
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-400 transition-colors cursor-pointer"
              >
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">
                    {activity.quiz}
                  </h4>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>{activity.date}</span>
                    <span>·</span>
                    <span>퀴즈 참여</span>
                  </div>
                </div>
                <span
                  className={clsx(
                    "text-xs font-bold px-3 py-1.5 rounded-full",
                    activity.result === "정답"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  )}
                >
                  {activity.result}
                </span>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
              <p className="text-gray-500 text-sm">최근 활동 내역이 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. 설정 및 로그아웃 */}
      <section className="mb-10 space-y-3">
        <button className="w-full flex items-center justify-between px-6 py-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
          <div className="flex items-center gap-3">
            <FaBell size={20} className="text-gray-600" />
            <span className="text-gray-900 font-medium">알림 설정</span>
          </div>
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-red-600 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all font-medium mt-6"
        >
          <MdLogout size={20} />
          <span>로그아웃</span>
        </button>
      </section>
    </div>
  );
};

export default MyPage;