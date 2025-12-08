import { MdLogout, MdEdit, MdOutlineTrendingUp, MdClose, MdCheck } from "react-icons/md";
import { FaAward, FaBell } from "react-icons/fa";
import { useState } from "react";

const MyPage = () => {
  const [user, setUser] = useState({
    name: '홍길동',
    nickname: '멋쟁이사자',
    email: 'test@example.com',
    phone: '010-1234-5678',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user);

  const quizStats = {
    totalScore: 120,
    solvedCount: 15,
  };

  const badges = [
    { name: '출석왕', icon: '🔥' },
    { name: '올빼미 탐독가', icon: '🦉' },
    { name: '뉴스 초보 탈출', icon: '📰' },
  ];

  const recentActivity = [
    { date: '2024.12.08', quiz: '경제 뉴스 퀴즈', result: '정답' },
    { date: '2024.12.07', quiz: '정치 뉴스 퀴즈', result: '정답' },
    { date: '2024.12.06', quiz: 'IT 뉴스 퀴즈', result: '오답' },
  ];

  const handleEditClick = () => {
    setIsEditing(true);
    setEditForm(user);
  };

  const handleSave = () => {
    setUser(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => { 
    setIsEditing(false);
    setEditForm(user);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-screen">
      {/* 프로필 섹션 */}
      <section className="mb-20">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          프로필
        </h2>
        <div className="bg-white border-l-4 border-blue-600 rounded p-6 shadow-sm">
          {isEditing ? (
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
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                    <p className="text-gray-600 text-xs mt-1">@{user.nickname}</p>
                    <p className="text-gray-500 text-xs mt-1">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleEditClick}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <MdEdit size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 mb-1">닉네임</p>
                  <p className="text-gray-900 font-medium">{user.nickname}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">휴대전화</p>
                  <p className="text-gray-900 font-medium">{user.phone}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 학습 기록 섹션 */}
      <section className="mb-20">
        <h2 className="text-lg font-bold text-gray-900 mb-4">학습 기록</h2>
        <div className="space-y-4">
          {/* 누적 점수 */}
          <div className="bg-white border border-gray-200 rounded p-6">
            <div className="flex items-center gap-3 mb-3">
              <MdOutlineTrendingUp className="text-blue-600" size={20} />
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                누적
              </span>
            </div>
            <p className="text-gray-600 text-xs mb-2">누적 점수</p>
            <p className="text-3xl font-bold text-gray-900">{quizStats.totalScore}</p>
            <p className="text-xs text-gray-500 mt-2">매일 풀어서 점수를 올려보세요</p>
          </div>

          {/* 해결한 퀴즈 */}
          <div className="bg-white border border-gray-200 rounded p-6">
            <div className="flex items-center gap-3 mb-3">
              <FaAward className="text-blue-600" size={20} />
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                진행중
              </span>
            </div>
            <p className="text-gray-600 text-xs mb-2">해결한 퀴즈</p>
            <p className="text-3xl font-bold text-gray-900">{quizStats.solvedCount}</p>
            <p className="text-xs text-gray-500 mt-2">계속해서 실력을 쌓아가고 있어요</p>
          </div>
        </div>
      </section>

      {/* 보유 뱃지 섹션 */}
      <section className="mb-20">
        <h2 className="text-lg font-bold text-gray-900 mb-4">보유 뱃지</h2>
        <div className="space-y-4">
          {badges.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {badges.map((badge) => (
                <article
                  key={badge.name}
                  className="bg-white border border-gray-200 rounded p-6 hover:border-blue-600 hover:shadow-md transition-all cursor-pointer text-center"
                >
                  <p className="text-5xl mb-3">{badge.icon}</p>
                  <p className="text-gray-900 font-semibold text-sm">{badge.name}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded p-12 text-center">
              <p className="text-gray-500">아직 획득한 뱃지가 없어요.<br />오늘의 퀴즈를 풀어 첫 번째 뱃지를 모아보세요!</p>
            </div>
          )}
        </div>
      </section>

      {/* 최근 활동 섹션 */}
      <section className="mb-20">
        <h2 className="text-lg font-bold text-gray-900 mb-4">최근 활동</h2>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, idx) => (
              <article
                key={idx}
                className="bg-white border border-gray-200 rounded p-4 hover:border-blue-600 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {activity.quiz}
                  </h4>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    activity.result === '정답' 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {activity.result}
                  </span>
                </div>
                <div className="flex gap-3 text-xs text-gray-500">
                  <span>{activity.date}</span>
                  <span>·</span>
                  <span>퀴즈</span>
                </div>
              </article>
            ))
          ) : (
            <div className="bg-white border border-gray-200 rounded p-12 text-center">
              <p className="text-gray-500">최근 활동이 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* 설정 섹션 */}
      <section className="mb-20">
        <h2 className="text-lg font-bold text-gray-900 mb-4">설정</h2>
        <button className="w-full flex items-center justify-between px-6 py-4 bg-white border border-gray-200 rounded hover:border-blue-600 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <FaBell size={20} className="text-gray-600" />
            <span className="text-gray-900 font-medium">알림 설정</span>
          </div>
          <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* 로그아웃 버튼 */}
      <div className="pb-20">
        <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-red-600 border border-gray-200 rounded hover:border-red-300 hover:bg-red-50 transition-all font-medium group">
          <MdLogout size={20} className="group-hover:translate-x-0.5 transition-transform" />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );
};

export default MyPage;