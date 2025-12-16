import {
  MdLogout,
} from "react-icons/md";
import { FaBell } from "react-icons/fa"; // FaLock 제거 (BadgeCard 내부에서 처리됨)
import { useState, useMemo, type ChangeEvent, useEffect } from "react";
import clsx from "clsx";
import { Navigate, useNavigate } from "react-router-dom"; // 페이지 이동용
import Modal from "../components/Modal"; // 공통 모달
import CategoryGrid from "../components/home/CategoryGrid";
import { CATEGORIES, type CategoryId } from "../constants/CategoryData";
import { getCategorySlug } from "../utils/getCategorySlug";
// 상태 관리
import { useAtom } from "jotai";
// API & Hooks
import { useAddCategory, useDeleteCategory } from "../hooks/useCategoryQuery";
import { updateUserProfile } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
// 뱃지 관련 컴포넌트 및 로직
import {
  BADGE_META,
  BadgeCard,
  getEarnedBadges,
  type BadgeGroup
} from "../components/badge";
import { useQuizStats, useRecentQuizActivity } from '../hooks/useQuizQuery';

import { useUserCategories, useUserProfile } from '../hooks/useUserQuery';
import { favoriteCategoriesAtom } from '../store/atoms';
import ProfileSection from '../components/myPage/Profile';
import { formatQuizDate } from '../utils/formatQuizDate';

const MyPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, checkAuth } = useAuth();
  const [favorites, setFavorites] = useAtom(favoriteCategoriesAtom);

  if (!checkAuth()) {
    return <Navigate to="/login" replace />; // 홈 페이지로 이동
  }

  const { data: userProfile, isLoading, error } = useUserProfile(isLoggedIn);
  const { data: userCategories, isLoading: isCategoriesLoading, error: isCategoriesError } = useUserCategories(isLoggedIn);

  const [user, setUser] = useState(() => ({
    name: userProfile?.name || "",
    nickname: userProfile?.nickname || "",
    email: userProfile?.email || "",
    phone: userProfile?.phone || null,
    score: userProfile?.score || 0,
  }));

  useEffect(() => {
    if (userProfile) {
      setUser({
        name: userProfile.name,
        nickname: userProfile.nickname,
        email: userProfile.email,
        phone: userProfile.phone,
        score: userProfile.score,
      });
    }
  }, [userProfile]);

  useEffect(() => {
    if (userCategories?.categoryIdList) {
      setFavorites(userCategories.categoryIdList as CategoryId[]);
    }
  }, [userCategories, navigate]);


  // 편집 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    ...user,
    password: "", // 비밀번호 변경용 필드
  });

  // 모달 상태 (로그아웃 확인용)
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 카테고리 API 훅
  const addCategoryMutation = useAddCategory();
  const deleteCategoryMutation = useDeleteCategory();

  // ======= 뱃지 및 통계 데이터 연동 로직
  // 퀴즈 통계 조회 (화면 표시용 + 배지 계산용)
  const { data: quizStatsResponse, isLoading: isResultLoading } = useQuizStats();

  // 최근 활동 내역 조회
  const { data: recentActivityData, isLoading: isActivityLoading } = useRecentQuizActivity();

  // 통계 데이터 가공 (화면 표시용)
  const stats = useMemo(() => {
    const apiStats = quizStatsResponse?.data;

    return {
      totalQuestions: apiStats?.totalQuestions || 0,
      totalCorrect: apiStats?.totalCorrect || 0,
      accuracyPercent: apiStats?.accuracyPercent || 0,
    };
  }, [quizStatsResponse]);
 
  // 뱃지 그룹 정의 (화면에 보여줄 순서와 제목)
  const BADGE_SECTIONS: { title: string; group: BadgeGroup }[] = [
    { title: "기자 배지", group: "기자등급" },
    { title: "부엉이 배지", group: "퀴즈풀이" },
    { title: "오답 배지", group: "오답" },
    { title: "점수 배지", group: "점수" },
  ];

  // 획득한 뱃지 목록 계산 (Memoization)
  const earnedSet = useMemo(() => {
    const isMember = true; // 로그인 된 상태이므로 true
    const apiStats = quizStatsResponse?.data;

    // API 데이터를 뱃지 로직용 통계로 변환
    const badgeStats = {
      quizCount: apiStats?.totalQuestions || 0,  // 총 문제 수
      wrongCount: Math.max(0, (apiStats?.totalQuestions || 0) - (apiStats?.totalCorrect || 0)),  // 총 문제 - 정답 = 오답
      totalScore: apiStats?.totalCorrect || 0,  // 정답 수 = 점수
      isMember,
    };

    // 로직을 통해 획득 뱃지 ID 목록 생성
    return new Set(getEarnedBadges(badgeStats));
  }, [quizStatsResponse]);
    // ======= 뱃지 및 통계 데이터 연동 로직 종료


  // --- 핸들러 함수들 ---

  const handleEditClick = () => {
    setIsEditing(true);
    setEditForm({
      ...user,
      password: "", // 편집 모드 진입 시 비밀번호 필드 초기화
    });
  };

  const handleSave = async () => {
    try {
      // API 호출 데이터 준비
      const updateData: any = {
        name: editForm.name,
        nickname: editForm.nickname,
        phone: editForm.phone || "",
      };

      // 비밀번호가 입력된 경우에만 추가
      if (editForm.password) {
        updateData.password = editForm.password;
      }

      // API 호출
      const response = await updateUserProfile(updateData);

      if (response.success) {
        // 성공 시 사용자 정보 업데이트 (password 제외)
        setUser({
          name: response.data.name,
          nickname: response.data.nickname,
          email: response.data.email,
          phone: response.data.phone,
          score: response.data.score,
        });
        setIsEditing(false);
        alert("프로필이 성공적으로 수정되었습니다.");
      }
    } catch (error: any) {
      console.error("프로필 수정 실패:", error);

      // 에러 메시지 처리
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("프로필 수정에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      ...user,
      password: "",
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 전화번호 자동 포맷팅 핸들러
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    let formatted = value;
    if (value.length > 3 && value.length <= 7) {
      formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      formatted = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(
        7,
        11
      )}`;
    }
    setEditForm((prev) => ({
      ...prev,
      phone: formatted,
    }));
  };

  // 1. 로그아웃 버튼 클릭 시 모달 열기
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // 2. 모달에서 '예' 클릭 시 실행될 실제 로그아웃 로직
  const handleConfirmLogout = () => {
    // useAuth의 logout 함수로 토큰 삭제 및 로그인 상태 해제
    logout();

    // 모달 닫고 홈페이지로 이동
    setShowLogoutModal(false);
    navigate("/");
  };

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (category: string) => {
    const slug = getCategorySlug(category);
    navigate(`/category/${slug}`);
  };

  // 즐겨찾기 토글
  const handleToggleFavorite = async (categoryId: CategoryId) => {
  try {
    if (favorites.includes(categoryId)) {
      const response = await deleteCategoryMutation.mutateAsync(categoryId);
      if (response.success) {
        setFavorites(prev => prev.filter(id => id !== categoryId));
      }
    } else {
      const response = await addCategoryMutation.mutateAsync(categoryId);
      if (response.success && response.data) {
        setFavorites(prev => [...prev, categoryId]);
      }
    }
  } catch (error) {
    console.error("즐겨찾기 토글 실패:", error);
  }
};

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>유저 정보를 불러오는데 실패했습니다.</p>;


  return (
    <div className="max-w-6xl mx-auto px-6 py-12 min-h-screen pb-24">
      {/* 1. 프로필 섹션 */}
      <ProfileSection
        user={user}
        editForm={editForm}
        isEditing={isEditing}
        onEditClick={handleEditClick}
        onSave={handleSave}
        onCancel={handleCancel}
        onChange={handleChange}
        onPhoneChange={handlePhoneChange}
      />
      {/* 2. 학습 리포트 + 뱃지 섹션 */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-gray-900 mb-4">학습 리포트</h2>

        {/* 점수 카드(3) + 배지 카드(7)를 한 flex 컨테이너 안에 배치 */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          {/* 점수 통계 카드 (약 30%) */}
          <div className="w-full lg:w-[32%] bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between shrink-0">
            <div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
                퀴즈 진행 상황
              </span>
            </div>
            <div className="flex flex-col items-center py-3">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-gray-900">
                  {user.score}
                </span>
                <span className="text-lg text-gray-500">점</span>
              </div>
              <p className="text-gray-500 text-sm mt-4">
                누적 풀이: <span className="font-semibold text-gray-900">{stats.totalQuestions}개</span>
                {" · "}누적 정답: <span className="font-semibold text-gray-900">{stats.totalCorrect}개</span>
                {" · "}정답률: <span className="font-semibold text-gray-900">{stats.accuracyPercent}%</span>
              </p>
              {/* <p className="text-gray-500 text-sm mt-4">
                정답 퀴즈:{" "}
                <span className="font-semibold text-gray-900">
                  {stats.correctCount}개
                </span>
                {" · "}푼 퀴즈:{" "}
                <span className="font-semibold text-gray-900">
                  {stats.solvedCount}개
                </span>
                {" · "}
                정답률:{" "}
                <span className="font-semibold text-gray-900">
                  {stats.solvedCount > 0
                    ? Math.round((stats.correctCount / stats.solvedCount) * 100)
                    : 0}
                  %
                </span>
              </p> */}
            </div>
          </div>
      

          {/* 뱃지 카드 섹션 (BadgeCard 컴포넌트 사용, 5칸 중 3칸 차지 (60%)) */}
        <div className="w-full lg:w-[68%] bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-gray-800">획득한 배지</h3>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                  COLLECTION
                </span>
              </div>
            </div>
            
            {/* 로딩 중일 때 표시 */}
            {isResultLoading && (
              <div className="flex-1 flex items-center justify-center min-h-[200px]">
                <p className="text-gray-400 text-sm animate-pulse">뱃지 정보를 불러오는 중...</p>
              </div>
            )}
            {/* 뱃지 그룹별 렌더링 */}
            {!isResultLoading && (
              <div className="space-y-8 max-h-[240px] overflow-y-auto pr-4 custom-scrollbar">
                {BADGE_SECTIONS.map((section) => {
                  const groupBadges = BADGE_META.filter(
                    (b) => b.group === section.group
                  );
                  if (groupBadges.length === 0) return null;

                  return (
                    <div key={section.title}>
                      {/* 그룹 타이틀 */}
                      <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <span className="w-1 h-4 bg-blue-500 rounded-full" />
                        {section.title}
                      </h3>

                      {/* 배지 그리드: 기본 3개, md 4개, lg 5개 */}
                      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                        {groupBadges.map((badge) => (
                          <BadgeCard
                            key={badge.id}
                            id={badge.id}
                            earned={earnedSet.has(badge.id)}
                            size="sm"
                            className="hover:scale-105 transition-transform duration-200"
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. 즐겨찾기 설정 섹션 */}
      <section className="mb-12">
        <CategoryGrid
          categories={CATEGORIES}
          onCategoryClick={handleCategoryClick}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      </section>

      {/* 4. 최근 활동 섹션 */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-gray-900 mb-4">최근 활동</h2>
        <div className="space-y-3">
          {isActivityLoading ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
              <p className="text-gray-400 text-sm animate-pulse">
                최근 활동을 불러오는 중...
              </p>
            </div>
          ) : recentActivityData && recentActivityData.length > 0 ? (
            recentActivityData.map((activity, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-400 transition-colors"
              >
                <div className="flex gap-2 text-sm text-gray-500">
                  <span>{formatQuizDate(activity.startAt)}</span>
                  <span>·</span>
                  <span>{activity.title}</span>
                </div>
                <span
                  className={clsx(
                    "text-xs font-bold px-3 py-1.5 rounded-full",
                    activity.isCorrect
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  )}
                >
                  {activity.isCorrect ? "정답" : "오답"}
                </span>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
              <p className="text-gray-500 text-sm">
                최근 활동 내역이 없습니다.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 5. 설정 및 로그아웃 */}
      <section className="mb-10 space-y-3">

        <button
          onClick={handleLogoutClick} // 수정됨: alert 대신 모달 열기 핸들러 연결
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-red-600 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all font-medium mt-6"
        >
          <MdLogout size={20} />
          <span>로그아웃</span>
        </button>
      </section>

      {/* 공통 모달 추가 */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        type="confirm"
        title="로그아웃"
        content="정말 로그아웃 하시겠습니까?"
        confirmText="로그아웃"
        cancelText="취소"
        onConfirm={handleConfirmLogout} // 실제 로그아웃 로직 실행
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
};

export default MyPage;
