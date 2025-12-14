import { useState, useMemo, useEffect } from "react";
import { useNewsByCategory } from "../hooks/useNewsQuery";
import NewsSummaryCard from "../components/home/NewsSummaryCard";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { getCategorySlug } from "../utils/getCategorySlug";
import { FaStar } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../api/auth";
import { useQuizByTimeSlot, useQuizResult, useSubmitQuizAnswer } from '../hooks/useQuizQuery';
import QuizFeed from '../components/quiz/QuizFeed';
import type { SubmitQuizAnswerResponse } from '../types/quiz';
import { CATEGORIES } from '../constants/CategoryData';
import { useUserCategories } from '../hooks/useUserQuery';
import IndNewsFeed from '../components/news/IndNewsFeed';

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

  // 새로운 API 사용: 뉴스 목록을 가져와서 summary로 변환
//   const { data: newsListData, isLoading } = useNewsByCategory(null);


  // TODO: summaryId를 가져오는 API 구현 필요
  // 현재는 임시로 summaryId = 1을 사용하여 퀴즈가 없을 때 자동 생성
  // 추후 시간대별 summaryId를 반환하는 API가 구현되면 해당 값을 전달
  const summaryId: number | undefined = 1;

  // 선택한 시간대의 퀴즈 조회 (퀴즈가 없으면 summaryId로 생성)
  const { data: quiz, isLoading: isQuizLoading } = useQuizByTimeSlot(selectedTime, summaryId);

  // 퀴즈 ID 추출
  const quizId = quiz?.data?.id || 0;
  const submitAnswer = useSubmitQuizAnswer();

  // 퀴즈 결과 조회 (DB 기반 완료 여부 확인용)
  const { data: quizResultData } = useQuizResult(quizId);

//   const { data: quizResultData, isSuccess: isQuizResultSuccess } = useQuizResult(quizId);
  const { isLoggedIn } = useAuth();
  const [isSolved, setIsSolved] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizResults, setQuizResults] = useState<SubmitQuizAnswerResponse["data"] | null>(null);
  const { data: userCategories } = useUserCategories(isLoggedIn);
  const favorites = userCategories?.categoryIdList ?? [];

  const favoriteCategoryKeys = useMemo(() => {
    if (favorites.length === 0) return null;

    return favorites
      .map((id) => {
        const category = CATEGORIES.find((c) => c.id === Number(id));
        return category?.key;
      })
      .filter(Boolean) as string[];
  }, [favorites]);

  // 새로운 API 사용: 뉴스 목록을 가져와서 summary로 변환
  const { data: newsListData, isLoading } =
  useNewsByCategory(favoriteCategoryKeys);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "correct" | "incorrect" | null;
  }>({ isOpen: false, type: null });
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

  // 최신 뉴스 하나를 summary로 사용
  const newsSummary: { summary: string } | undefined = useMemo(() => {
    if (!newsListData || newsListData.length === 0) return undefined;
    const latestNews = newsListData[0];
    return { summary: latestNews.summary || "" };
  }, [newsListData]);

  // 퀴즈 변경 시 상태 초기화 (시간대 변경 시)
  useEffect(() => {
    setIsSolved(false);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizResults(null);
  }, [quizId, selectedTime]);

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
      return selectedTime === "06" || selectedTime === "12" || selectedTime === "18";
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
   */
  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    // 시간대 변경 시 상태 초기화
    setIsSolved(false);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizResults(null);
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
   * 퀴즈 답안 제출 핸들러
   * 정답 여부에 따라 모달을 표시하고 상태를 업데이트
   */
  const handleSubmit = async (answer: string, resetForm: () => void) => {
    if (!quiz?.data?.questions) return;

    // 사용자 입력은 1부터 시작하므로 0-based 인덱스로 변환
    const answerIndex = parseInt(answer) - 1;
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
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
          answers: newAnswers,
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

  const favoriteNews = useMemo(
    () => newsListData ?? [],
    [newsListData]
  );

  // 즐겨찾기가 2개 이상일 때 뉴스를 랜덤으로 섞기
  return (
    <div className="max-w-6xl mx-auto px-6 py-14 space-y-16">
      {/* 퀴즈 결과 모달 */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        title={modalState.type === "correct" ? "✓ 정답입니다!" : "✗ 틀렸습니다"}
        content={
          modalState.type === "correct"
            ? "축하합니다! 정답을 맞히셨습니다."
            : "틀렸습니다. 다음 퀴즈를 노려보세요"
        }
        type="alert"
      />

      {/* HERO SECTION */}
      <section className="text-center space-y-3">
        <h1 className="text-6xl font-bold text-gray-900">
          오늘의 뉴스, 간결하게
        </h1>
        <p className="text-gray-600 text-lg">
          AI가 선별하고 요약한 주요 뉴스를 확인하세요
        </p>
      </section>

      {/* SEARCH */}
      <section>
        <input
          type="text"
          placeholder="뉴스 검색"
          className="w-full px-5 py-3 border border-gray-200 rounded-xl
                     focus:outline-none focus:border-gray-400
                     shadow-sm transition-colors"
        />
      </section>

      {/* SUMMARY & QUIZ */}
      <NewsSummaryCard
        summary={newsSummary?.summary || ""}
        isLoading={isLoading}
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
              />
            ) : (
              <p className="text-center text-gray-500">오늘의 퀴즈를 불러오는데 실패했습니다.</p>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {favorites.length > 0 ? "즐겨찾기 뉴스" : "추천 뉴스"}
        </h2>

        {/* 즐겨찾기 카테고리 버튼 */}
        {favorites.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {favorites.map((categoryId) => {
              const category = CATEGORIES.find((c) => c.id === Number(categoryId));
              if (!category) return null;

              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.key)}
                  className="px-4 py-2 rounded-full border bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all font-medium flex items-center gap-1.5"
                >
                  <FaStar className="text-yellow-400" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        )}
        {/* 뉴스 리스트 */}
        <div className="space-y-4">
          {favoriteNews.length > 0 ? (
            favoriteNews.map((news) => (
              <IndNewsFeed key={news.id} news={news} category={news.sections[0]} />
            ))
          ) : (
            <div className="bg-white border border-gray-200 rounded p-12 text-center">
              <p className="text-gray-500">뉴스를 불러오는데 실패했습니다.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
