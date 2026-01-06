import { useState, useMemo, useEffect } from "react";
import { useMainSummary, useNewsByCategory } from "../hooks/useNewsQuery";
import NewsSummaryCard from "../components/home/NewsSummaryCard";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { getCategorySlug } from "../utils/getCategorySlug";
import { FaStar } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../api/auth";
import {
  useQuizByTimeSlot,
  useQuizResult,
  useSubmitQuizAnswer,
} from "../hooks/useQuizQuery";
import QuizFeed from "../components/quiz/QuizFeed";
import type { SubmitQuizAnswerResponse } from "../types/quiz";
import { CATEGORIES, type CategoryId } from "../constants/CategoryData";
import { useUserCategories } from "../hooks/useUserQuery";
import IndNewsFeed from "../components/news/IndNewsFeed";
import IndNewsFeedSkeleton from "../components/news/IndNewsFeedSkeleton";
import { useAddCategory, useDeleteCategory } from "../hooks/useCategoryQuery";
import CategoryGrid from "../components/home/CategoryGrid";

export default function HomePage() {
  // 현재 시간대 계산 함수 (오전 6시 기준으로 하루가 시작됨)
  const getCurrentTimeSlot = (): string => {
    const hour = new Date().getHours();
    // 오전 0~6시: 전날 24시 카드가 가장 최신
    if (hour >= 0 && hour < 6) return "24";
    if (hour >= 6 && hour < 12) return "06";
    if (hour >= 12 && hour < 18) return "12";
    return "18";
  };

  // 초기값을 현재 시간대로 설정
  const [selectedTime, setSelectedTime] = useState<string>(
    getCurrentTimeSlot()
  );

  // 선택한 시간대의 퀴즈 조회 (백엔드 스케줄러가 자동으로 생성)
  const { data: quiz, isLoading: isQuizLoading } =
    useQuizByTimeSlot(selectedTime);

  // 퀴즈 ID 추출
  const quizId = quiz?.data?.id || 0;
  const submitAnswer = useSubmitQuizAnswer();

  //   const { data: quizResultData, isSuccess: isQuizResultSuccess } = useQuizResult(quizId);
  const { isLoggedIn } = useAuth();

  // 퀴즈 결과 조회 (DB 기반 완료 여부 확인용 - 로그인 상태에서만)
  const { data: quizResultData } = useQuizResult(quizId, isLoggedIn);
  const [isSolved, setIsSolved] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizResults, setQuizResults] = useState<
    SubmitQuizAnswerResponse["data"] | null
  >(null);
  const { data: userCategories, refetch: refetchUserCategories } =
    useUserCategories(isLoggedIn);
  const favorites = (userCategories?.categoryIdList ?? []) as CategoryId[];

  // 즐겨찾기 API 훅
  const addCategoryMutation = useAddCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const favoriteCategoryKeys = useMemo(() => {
    if (favorites.length === 0) return null;

    return favorites
      .map((id) => {
        const category = CATEGORIES.find((c) => c.id === Number(id));
        return category?.key;
      })
      .filter(Boolean) as string[];
  }, [favorites]);

  const { data: newsListData, isLoading: isLoadingFavoriteNews } =
    useNewsByCategory(favoriteCategoryKeys);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "correct" | "incorrect" | null;
  }>({ isOpen: false, type: null });
  const [loginRequiredModalOpen, setLoginRequiredModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // 사용자 정보 조회 (로그인한 경우에만)
  const { data: userProfile } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => getMyProfile(),
    enabled: isLoggedIn,
  });

  /**
   * timestamp 기반으로 현재 퀴즈를 풀었는지 확인하는 함수
   * 퀴즈 결과의 timestamp가 현재 퀴즈의 시작 시간대와 일치하는지 확인
   */
  const isQuizCompletedToday = (
    resultTimestamp: string | undefined,
    quizStartAt: string | undefined
  ): boolean => {
    if (!resultTimestamp || !quizStartAt) return false;

    const resultDate = new Date(resultTimestamp);
    const quizDate = new Date(quizStartAt);

    // 같은 날짜이고 같은 시간대인지 확인
    const isSameDate =
      resultDate.getFullYear() === quizDate.getFullYear() &&
      resultDate.getMonth() === quizDate.getMonth() &&
      resultDate.getDate() === quizDate.getDate();

    // 퀴즈 시작 시간 이후에 제출되었는지 확인
    const isAfterQuizStart = resultDate >= quizDate;

    return isSameDate && isAfterQuizStart;
  };

  // 퀴즈 변경 시 상태는 DB 기반 useEffect(140-176번 줄)에서 처리됨
  // 시간대 변경 시 불필요한 초기화를 하지 않아야 이미 푼 퀴즈 상태가 유지됨

  // 로그인 상태 변경 시 퀴즈 상태 초기화 (로그아웃 시)
  useEffect(() => {
    if (!isLoggedIn) {
      setIsSolved(false);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setQuizResults(null);
    }
  }, [isLoggedIn]);

  // DB 기반 퀴즈 완료 여부 확인 (API 응답이 있을 때)
  useEffect(() => {
    if (!quizResultData?.data || !quiz?.data) return;

    const isCompleted = isQuizCompletedToday(
      quizResultData.timestamp,
      quiz.data.startAt
    );

    console.log("🔍 Quiz completion check:", {
      quizId: quiz.data.id,
      isCompleted,
      timestamp: quizResultData.timestamp,
      startAt: quiz.data.startAt,
      resultsLength: quizResultData.data.results.length,
      results: quizResultData.data.results,
    });

    if (isCompleted && quizResultData.data.results.length > 0) {
      // DB에서 가져온 결과로 상태 설정
      console.log("✅ 퀴즈 완료 상태로 설정 (DB)");
      setIsSolved(true);
      setQuizResults({
        total: quizResultData.data.total,
        correct: quizResultData.data.correct,
        results: quizResultData.data.results,
        userId: quizResultData.data.userId,
      });
    } else {
      // 아직 풀지 않았으면 초기 상태로 설정
      console.log("❌ 퀴즈 미완료 상태로 설정");
      setIsSolved(false);
      setQuizResults(null);
      setUserAnswers([]);
      setCurrentQuestionIndex(0);
    }
  }, [quizResultData, quiz?.data]);

  // 선택한 시간대가 과거인지 확인
  const isPastTimeSlot = useMemo(() => {
    const hour = new Date().getHours();

    // 현재 시간대별 비교
    if (hour >= 0 && hour < 6) {
      // 새벽 0~6시: 24시가 현재, 06/12/18시는 과거
      return (
        selectedTime === "06" || selectedTime === "12" || selectedTime === "18"
      );
    } else if (hour >= 6 && hour < 12) {
      // 오전 6~12시: 06시가 현재, 12/18/24시는 미래
      return false; // 모두 미래이거나 현재
    } else if (hour >= 12 && hour < 18) {
      // 오후 12~18시: 12시가 현재, 06시는 과거, 18/24시는 미래
      return selectedTime === "06";
    } else {
      // 오후 18~24시: 18시가 현재, 06/12시는 과거, 24시는 미래
      return selectedTime === "06" || selectedTime === "12";
    }
  }, [selectedTime]);

  /**
   * 시간대 변경 핸들러
   * 선택한 시간대의 퀴즈를 불러옴
   * 상태 초기화는 DB 기반 useEffect에서 자동으로 처리됨
   */
  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  /**
   * 카테고리 클릭 핸들러
   * 선택한 카테고리의 상세 페이지로 이동
   */
  const handleCategoryClick = (category: string) => {
    const slug = getCategorySlug(category);
    navigate(`/category/${slug}`);
  };

  /**
   * 즐겨찾기 토글 핸들러
   */
  const handleToggleFavorite = async (categoryId: CategoryId) => {
    if (!isLoggedIn) {
      setLoginRequiredModalOpen(true);
      return;
    }

    try {
      if (favorites.includes(categoryId)) {
        await deleteCategoryMutation.mutateAsync(categoryId);
      } else {
        await addCategoryMutation.mutateAsync(categoryId);
      }
      // 즐겨찾기 변경 후 카테고리 목록 다시 불러오기
      await refetchUserCategories();
    } catch (error) {
      console.error("즐겨찾기 토글 실패:", error);
    }
  };

  /**
   * 퀴즈 답안 제출 핸들러 (현재 미사용 - QuizFeed에서 직접 처리)
   * 정답 여부에 따라 모달을 표시하고 상태를 업데이트
   */
  const handleSubmit = async (answer: string, resetForm: () => void) => {
    if (!quiz?.data?.questions) return;

    // 사용자 입력은 1-base (1, 2, 3, 4)
    const answerNumber = parseInt(answer);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerNumber;
    setUserAnswers(newAnswers);

    // 마지막 문제가 아니면 다음 문제로
    if (currentQuestionIndex < quiz.data.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetForm();
      return;
    }

    // 모든 문제를 풀었으면 답안 제출
    try {
      const result = await submitAnswer.mutateAsync({
        id: quiz.data.id,
        answerData: {
          userId: userProfile?.id || 1, // 로그인한 사용자 ID 사용, 없으면 1
          answers: newAnswers, // 1-base 배열 전송
        },
      });

      // API 응답 구조 수정: response -> data
      setQuizResults(result.data);

      // API 응답의 results 배열을 사용하여 정답 여부 확인
      // results는 현재 제출한 퀴즈의 각 문제별 정답 여부를 담고 있음
      const allCorrect = result.data.results.every(
        (isCorrect: boolean) => isCorrect === true
      );

      if (allCorrect) {
        setModalState({ isOpen: true, type: "correct" });
      } else {
        setModalState({ isOpen: true, type: "incorrect" });
      }
      setIsSolved(true);
    } catch (error) {
      console.error("Failed to submit answer:", error);
      alert("답안 제출 실패");
    }
  };

  /**
   * 모달 닫기 핸들러
   * 퀴즈 결과 모달을 닫음
   */
  const handleCloseModal = () => {
    setModalState({ isOpen: false, type: null });
  };

  /**
   * 검색 핸들러
   * 검색어를 입력하고 Enter를 누르면 검색 페이지로 이동
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const favoriteNews = useMemo(() => newsListData ?? [], [newsListData]);

  // Wave Effect 컴포넌트
  const WaveEffect = () => {
    return (
      <div
        className="absolute top-0 left-0 right-0 overflow-hidden pointer-events-none"
        style={{ height: "270px", zIndex: 0 }}
      >
        <svg
          className="absolute top-0 h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{
            transform: "scaleY(-1)",
            width: "calc(100% + 50px)",
            left: "-25px",
          }}
        >
          <path
            fill="rgba(59, 130, 246, 0.08)"
            d="M0,160L48,149.3C96,139,192,117,288,122.7C384,128,480,160,576,165.3C672,171,768,149,864,128C960,107,1056,85,1152,90.7C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="animate-wave"
          />
          <path
            fill="rgba(147, 197, 253, 0.08)"
            d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,192C960,171,1056,149,1152,154.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="animate-wave-slow"
          />
        </svg>
        <style>{`
          @keyframes wave {
            0% { transform: translateX(0) translateY(0); }
            50% { transform: translateX(-25px) translateY(-5px); }
            100% { transform: translateX(0) translateY(0); }
          }
          @keyframes wave-slow {
            0% { transform: translateX(0) translateY(0); }
            50% { transform: translateX(-15px) translateY(5px); }
            100% { transform: translateX(0) translateY(0); }
          }
          .animate-wave {
            animation: wave 10s ease-in-out infinite;
          }
          .animate-wave-slow {
            animation: wave-slow 15s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  };

  // 즐겨찾기가 2개 이상일 때 뉴스를 랜덤으로 섞기
  return (
    <>
      <WaveEffect />
      {/* Confetti 효과 테스트 */}
      {/* <ConfettiEffect isActive={showConfetti} duration={5000} /> */}

      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14 space-y-8 sm:space-y-12 lg:space-y-16 relative"
        style={{ zIndex: 1 }}
      >
        {/* 퀴즈 결과 모달 */}
        <Modal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          title={
            modalState.type === "correct" ? "✓ 정답입니다!" : "✗ 틀렸습니다"
          }
          content={
            modalState.type === "correct"
              ? "축하합니다! 정답을 맞히셨습니다."
              : "틀렸습니다. 다음 퀴즈를 노려보세요"
          }
          type="alert"
        />

        {/* 로그인 유도 모달 */}
        <Modal
          isOpen={loginRequiredModalOpen}
          onClose={() => setLoginRequiredModalOpen(false)}
          title="로그인 필요"
          content="카테고리 즐겨찾기는 로그인이 필요한 기능입니다"
          type="alert"
          showActionButton={true}
          actionButtonText="로그인"
          onActionButtonClick={() => navigate("/login")}
        />

        {/* HERO SECTION */}
        <section className="text-center space-y-2 sm:space-y-3 relative">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 relative z-10">
            오늘의 뉴스, 간결하게
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg relative z-10">
            AI가 선별하고 요약한 주요 뉴스를 확인하세요
          </p>

          {/* Confetti 테스트 버튼
          <button
            onClick={() => setShowConfetti(true)}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            🎉 Confetti 효과 테스트
          </button> */}
        </section>

        {/* SEARCH */}
        <form onSubmit={handleSearch} className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="뉴스 검색"
            className="w-full px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl
                     focus:outline-none focus:border-gray-400
                     shadow-sm transition-colors"
          />
        </form>

        {/* 즐겨찾기 설정 섹션 */}
        <div>
          <CategoryGrid
            categories={CATEGORIES}
            onCategoryClick={handleCategoryClick}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            variant="compact"
          />
          <p className="text-xs text-gray-400 mt-2">
            별 모양을 누르면 즐겨찾기가 됩니다
          </p>
        </div>

        {/* SUMMARY & QUIZ */}
        <NewsSummaryCard
          isLoading={isLoadingFavoriteNews} // TODO : Loading 변수 수정 필요
          onTimeChange={handleTimeChange}
          selectedTime={selectedTime}
          quizSection={
            <>
              <h3 className="text-xl font-bold text-gray-900 mb-4">퀴즈</h3>
              {isQuizLoading ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : quiz?.data ? (
                <QuizFeed
                  quiz={quiz.data}
                  quizResult={quizResults}
                  submitAnswer={submitAnswer}
                  isSolved={isSolved}
                  setIsSolved={setIsSolved}
                  setQuizResults={setQuizResults}
                  userProfile={userProfile?.id ? userProfile : undefined}
                  isPastTimeSlot={isPastTimeSlot}
                  isLoggedIn={isLoggedIn}
                />
              ) : (
                <p className="text-center text-gray-500">
                  {selectedTime}시 퀴즈가 아직 생성되지 않았습니다.
                </p>
              )}
            </>
          }
        />

        {/* AD BANNER */}
        {/* <div className="-mt-12 mb-2">
        <AdBanner />
      </div> */}

        {/* 뉴스 섹션 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            {favorites.length > 0 ? "즐겨찾기 뉴스" : "추천 뉴스"}
          </h2>

          {/* 즐겨찾기 카테고리 버튼 */}
          {favorites.length > 0 && (
            <div className="mb-4 sm:mb-6 flex flex-wrap gap-2">
              {favorites.map((categoryId) => {
                const category = CATEGORIES.find(
                  (c) => c.id === Number(categoryId)
                );
                if (!category) return null;

                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.key)}
                    className="px-3 sm:px-4 py-2 text-sm sm:text-base rounded-full border bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all font-medium flex items-center gap-1.5"
                  >
                    <FaStar className="text-yellow-400 text-sm sm:text-base" />
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>
          )}
          <div className="space-y-4">
            {isLoadingFavoriteNews ? (
              // 로딩 중일 때 스켈레톤 5개 보여주기
              <>
                {Array.from({ length: 5 }).map((_, index) => (
                  <IndNewsFeedSkeleton key={index} />
                ))}
              </>
            ) : favoriteNews.length > 0 ? (
              favoriteNews.map((news) => (
                <IndNewsFeed
                  key={news.id}
                  news={news}
                  category={news.sections[0]}
                />
              ))
            ) : (
              <div className="bg-white border border-gray-200 rounded p-12 text-center">
                <p className="text-gray-500">뉴스를 불러오는데 실패했습니다.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
