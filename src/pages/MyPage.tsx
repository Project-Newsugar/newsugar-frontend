import {
  MdLogout,
  MdEdit,
  MdClose,
  MdCheck,
} from "react-icons/md";
import { FaBell, FaLock } from "react-icons/fa";
import { useState, useMemo, type ChangeEvent, useEffect } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom"; // 페이지 이동용
import Modal from "../components/Modal"; // 공통 모달
// [추가] localStorage 유틸과 키 import
import { getLocalStorage } from "../utils/getLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/keys";
import CategoryGrid from "../components/home/CategoryGrid";
import { CATEGORIES } from "../constants/CategoryData";
import { getCategorySlug } from "../utils/getCategorySlug";
import { useAtom } from "jotai";
import { favoriteCategoriesAtom } from "../store/atoms";
import { useAddCategory, useDeleteCategory } from "../hooks/useCategoryQuery";
import { updateUserProfile, getMyProfile } from "../api/auth";
import { useQuizResult } from "../hooks/useNewsQuery";
import { useAuth } from "../hooks/useAuth";

// 1. 뱃지 마스터 데이터
const BADGE_MASTER_LIST = [
  { code: "MORNING", name: "갓생러", icon: "☀️", desc: "05~09시 접속" },
  { code: "DIVER", name: "뉴스 다독가", icon: "📚", desc: "3개 카테고리 섭렵" },
  {
    code: "PERFECT_SCORE",
    name: "퀴즈 마스터",
    icon: "💯",
    desc: "퀴즈 100점 달성",
  },
  { code: "NIGHT_OWL", name: "올빼미", icon: "🦉", desc: "심야 시간 활동" },
];

type BadgeCode = (typeof BADGE_MASTER_LIST)[number]["code"];

// 카테고리 한글명 -> ID 매핑 (백엔드 DB 기준)
// ⚠️ 주의: 이 ID는 백엔드 DB의 실제 카테고리 ID와 일치해야 합니다
// 백엔드 API 응답을 확인하여 정확한 ID를 설정하세요
const CATEGORY_ID_MAP: Record<string, number> = {
  정치: 1,
  경제: 2,
  "과학/기술": 3,
  스포츠: 4,
  문화: 5,
  국제: 6,
};

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // [추가] 컴포넌트 마운트 시 토큰 확인
  useEffect(() => {
    const accessToken = getLocalStorage(
      LOCAL_STORAGE_KEY.accessToken
    ).getItem();
    if (!accessToken) {
      // alert 제거 - 바로 로그인 페이지로 리다이렉트
      navigate("/login");
    }
  }, [navigate]);

  // 사용자 정보 상태
  const [user, setUser] = useState({
    name: "홍길동",
    nickname: "멋쟁이사자",
    email: "test@example.com",
    phone: "010-1234-5678" as string | null,
    score: 0,
  });

  // 유저 정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getMyProfile();
        if (response.success) {
          setUser({
            name: response.data.name,
            nickname: response.data.nickname,
            email: response.data.email,
            phone: response.data.phone,
            score: response.data.score,
          });
        }
      } catch (error: any) {
        console.error("유저 정보 불러오기 실패:", error);
        // 에러 처리 - 인증 오류 시 로그인 페이지로 리다이렉트
        if (error.response?.status === 401) {
          // alert 제거 - 바로 로그인 페이지로 리다이렉트
          navigate("/login");
        }
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // 편집 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    ...user,
    password: "", // 비밀번호 변경용 필드
  });

  // 모달 상태 (로그아웃 확인용)
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 즐겨찾기 전역 상태
  const [favorites, setFavorites] = useAtom(favoriteCategoriesAtom);

  // 카테고리 API 훅
  const addCategoryMutation = useAddCategory();
  const deleteCategoryMutation = useDeleteCategory();

  // 퀴즈 결과 조회 (임의의 quizId 1 사용 - 실제로는 사용자 통계를 반환)
  const { data: quizResultData } = useQuizResult(1);

  // 통계 데이터 - API에서 가져온 실제 데이터 사용
  const stats = useMemo(() => {
    const quizStats = quizResultData?.data;

    return {
      totalScore: quizStats?.correct ? quizStats.correct * 100 : 0, // 맞춘 퀴즈당 100점
      solvedCount: quizStats?.total || 0,
      correctCount: quizStats?.correct || 0,
      favoriteCategories: [
        { name: "경제", count: 42 },
        { name: "IT/과학", count: 28 },
        { name: "스포츠", count: 15 },
      ],
      readingStyle: "새벽형 스캐너",
    };
  }, [quizResultData]);

  // [임시] 뱃지 계산 - 목업 데이터
  const myBadgeCodes: BadgeCode[] = useMemo(() => {
    const badges: BadgeCode[] = ["MORNING", "PERFECT_SCORE"]; // 기본 뱃지
    return badges;
  }, []);


  // 최근 활동 데이터 (localStorage 기반)
  const [recentActivity, setRecentActivity] = useState<
    {
      date: string;
      result: "정답" | "오답";
    }[]
  >([]);

  // localStorage에서 퀴즈 히스토리 불러오기
  useEffect(() => {
    try {
      const activities: { date: string; result: "정답" | "오답" }[] = [];

      // localStorage의 모든 키를 순회하면서 quiz_state_ 로 시작하는 항목 찾기
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("quiz_state_")) {
          const stateStr = localStorage.getItem(key);
          if (stateStr) {
            try {
              const state = JSON.parse(stateStr);
              // isSolved가 true인 퀴즈만 포함
              if (state.isSolved && state.quizResults) {
                // 모든 문제를 맞췄는지 확인
                const allCorrect = state.quizResults.results?.every((r: boolean) => r === true);

                activities.push({
                  date: new Date().toISOString(), // 실제 날짜는 저장되어 있지 않으므로 현재 시간 사용
                  result: allCorrect ? "정답" : "오답",
                });
              }
            } catch (e) {
              // JSON 파싱 실패 시 무시
              continue;
            }
          }
        }
      }

      // 날짜 형식 변환
      const formattedActivity = activities.map((item) => {
        const dateObj = new Date(item.date);
        const formattedDate = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

        return {
          date: formattedDate,
          result: item.result,
        };
      });

      setRecentActivity(formattedActivity);
    } catch (error) {
      console.error("퀴즈 내역 불러오기 실패:", error);
      setRecentActivity([]);
    }
  }, []);

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

  // 즐겨찾기 토글 핸들러
  const handleToggleFavorite = async (category: string) => {
    const categoryId = CATEGORY_ID_MAP[category];

    if (!categoryId) {
      console.error("Invalid category:", category);
      return;
    }

    // 현재 즐겨찾기에 있는지 확인
    const existingCategory = favorites.find((fav) => fav.name === category);

    try {
      if (existingCategory) {
        // 이미 즐겨찾기에 있으면 삭제
        const response = await deleteCategoryMutation.mutateAsync(categoryId);
        if (response.success) {
          setFavorites((prev) => prev.filter((c) => c.name !== category));
        } else {
          throw new Error(response.message || "즐겨찾기 삭제에 실패했습니다.");
        }
      } else {
        // 없으면 추가
        const response = await addCategoryMutation.mutateAsync(categoryId);
        if (response.success && response.data) {
          setFavorites((prev) => [...prev, response.data]);
        } else {
          throw new Error(response.message || "즐겨찾기 추가에 실패했습니다.");
        }
      }
    } catch (error: any) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 min-h-screen pb-24">
      {/* 1. 프로필 섹션 */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-gray-900 mb-4">프로필</h2>
        <div className="bg-white border-l-4 border-blue-600 rounded p-6 shadow-sm">
          {isEditing ? (
            // 편집 모드 UI (생략 없이 유지)
            <div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">
                    이름
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">
                    닉네임
                  </label>
                  <input
                    type="text"
                    name="nickname"
                    value={editForm.nickname}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">
                    이메일
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-600 bg-gray-50"
                    disabled
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    * 이메일은 변경할 수 없습니다
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={editForm.password}
                    onChange={handleChange}
                    placeholder="변경하지 않으려면 비워두세요"
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    * 비밀번호를 변경하지 않으려면 입력하지 마세요
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">
                    휴대전화
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone || ""}
                    onChange={handlePhoneChange}
                    placeholder="010-1234-5678"
                    maxLength={13}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  <MdCheck size={18} /> 저장
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-medium text-sm"
                >
                  <MdClose size={18} /> 취소
                </button>
              </div>
            </div>
          ) : (
            // 조회 모드 UI
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {user.name}
                  </h3>
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
          {/* 점수 통계 카드 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
                퀴즈 진행 상황
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-center -mt-2">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-gray-900">
                  {user.score}
                </span>
                <span className="text-lg text-gray-500">점</span>
              </div>
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

          {/* 뱃지 카드 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
                보유 뱃지
              </span>
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

      {/* 3. 즐겨찾기 설정 섹션 */}
      <section className="mb-12">
        <CategoryGrid
          categories={[...CATEGORIES]}
          onCategoryClick={handleCategoryClick}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      </section>

      {/* 4. 최근 활동 섹션 */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-gray-900 mb-4">최근 활동</h2>
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-400 transition-colors"
              >
                <div className="flex gap-2 text-sm text-gray-500">
                  <span>{activity.date}</span>
                  <span>·</span>
                  <span>퀴즈 참여</span>
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
              <p className="text-gray-500 text-sm">
                최근 활동 내역이 없습니다.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 5. 설정 및 로그아웃 */}
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <button
          onClick={handleLogoutClick} // 👈 수정됨: alert 대신 모달 열기 핸들러 연결
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-red-600 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all font-medium mt-6"
        >
          <MdLogout size={20} />
          <span>로그아웃</span>
        </button>
      </section>

      {/* 👇 공통 모달 추가 */}
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
