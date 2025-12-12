import { useState, useMemo, useEffect } from "react";
import {
  useAllNews,
  useLatestQuiz,
  useSubmitQuizAnswer,
  useQuizResult,
} from "../hooks/useNewsQuery";
import NewsSummaryCard from "../components/home/NewsSummaryCard";
import QuizQuestion from "../components/quiz/QuizQuestion";
import QuizForm from "../components/quiz/QuizForm";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { getCategorySlug } from "../utils/getCategorySlug";
import { useAtom } from "jotai";
import { favoriteCategoriesAtom } from "../store/atoms";
import { FaStar } from "react-icons/fa";
import type { News } from "../types/news";
import AdBanner from "../components/home/AdBanner";
import { useAuth } from "../hooks/useAuth";

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
  const { data: newsListData, isLoading } = useAllNews(0, 20);

  // 뉴스 목록을 summary 형태로 가공
  const newsSummary = useMemo(() => {
    if (!newsListData?.content) return null;

    // 각 뉴스의 summary를 합쳐서 전체 summary로 만들기
    const summaryText = newsListData.content
      .map((news, index) => `${index + 1}. ${news.title}\n${news.summary}`)
      .join("\n\n");

    return {
      summary: summaryText || "뉴스를 불러오는 중입니다...",
      date: new Date().toISOString(),
    };
  }, [newsListData]);

  // 최신 퀴즈 조회 (시간대와 무관하게 가장 최근에 생성된 퀴즈 사용)
  const { data: quiz, isLoading: isQuizLoading } = useLatestQuiz();

  // 퀴즈 ID 추출 (localStorage 키 등에서 사용)
  const quizId = quiz?.data?.id || 0;
  const submitAnswer = useSubmitQuizAnswer();

  // 퀴즈 결과 조회 (DB 기반 완료 여부 확인용)
  const { data: quizResultData } = useQuizResult(quizId);

  const [isSolved, setIsSolved] = useState(false);
  const [favorites] = useAtom(favoriteCategoriesAtom);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizResults, setQuizResults] = useState<{
    total: number;
    correct: number;
    results: boolean[];
  } | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "correct" | "incorrect" | null;
  }>({ isOpen: false, type: null });
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // localStorage 키: 퀴즈 완료 상태 저장 (시간대별로 구분) - 백업용
  const QUIZ_STATE_KEY = `quiz_state_${quizId}_${selectedTime}`;

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

  // DB 기반 퀴즈 완료 여부 확인 (API 응답이 있을 때)
  useEffect(() => {
    if (!quizResultData?.data || !quiz?.data) return;

    const isCompleted = isQuizCompletedToday(
      quizResultData.timestamp,
      quiz.data.startAt
    );

    if (isCompleted && quizResultData.data.results.length > 0) {
      // DB에서 가져온 결과로 상태 설정
      setIsSolved(true);
      setQuizResults({
        total: quizResultData.data.total,
        correct: quizResultData.data.correct,
        results: quizResultData.data.results,
      });
    } else {
      // 아직 풀지 않았으면 초기 상태로 설정
      setIsSolved(false);
      setQuizResults(null);
      setUserAnswers([]);
      setCurrentQuestionIndex(0);
    }
  }, [quizResultData, quiz?.data]);

  // localStorage 백업 상태 복구 (API 실패 시 대체용)
  useEffect(() => {
    if (quizResultData) return; // API 데이터가 있으면 localStorage 사용 안 함

    const savedState = localStorage.getItem(QUIZ_STATE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setIsSolved(parsedState.isSolved);
        setQuizResults(parsedState.quizResults);
        setUserAnswers(parsedState.userAnswers);
        setCurrentQuestionIndex(parsedState.currentQuestionIndex || 0);
      } catch (error) {
        console.error("Failed to parse saved quiz state:", error);
      }
    }
  }, [QUIZ_STATE_KEY, quizResultData]);

  // 퀴즈 상태를 localStorage에 저장
  useEffect(() => {
    if (isSolved && quizResults) {
      const stateToSave = {
        isSolved,
        quizResults,
        userAnswers,
        currentQuestionIndex,
      };
      localStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(stateToSave));
    }
  }, [
    isSolved,
    quizResults,
    userAnswers,
    currentQuestionIndex,
    QUIZ_STATE_KEY,
  ]);

  // 현재 시간대 확인
  const currentTimeSlot = getCurrentTimeSlot();

  // 선택한 시간대가 현재 시간대인지 확인
  const isCurrentTimeSlot = selectedTime === currentTimeSlot;

  /**
   * 시간대 변경 핸들러
   * 선택한 시간대의 뉴스와 퀴즈를 불러옴
   */
  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    // 시간대 변경 시 상태 초기화
    setIsSolved(false);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizResults(null);

    // 변경된 시간대의 localStorage 상태 불러오기
    const newQuizStateKey = `quiz_state_${quizId}_${time}`;
    const savedState = localStorage.getItem(newQuizStateKey);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setIsSolved(parsedState.isSolved);
        setQuizResults(parsedState.quizResults);
        setUserAnswers(parsedState.userAnswers);
        setCurrentQuestionIndex(parsedState.currentQuestionIndex || 0);
      } catch (error) {
        console.error("Failed to parse saved quiz state:", error);
      }
    }
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
          userId: 1, // TODO: 실제 로그인 사용자 ID 사용
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

  // 즐겨찾기한 카테고리의 뉴스들 필터링 (실제 API 데이터 사용)
  const filteredNews: News[] = useMemo(() => {
    if (!newsListData?.content) return [];

    if (favorites.length > 0) {
      // UserCategory 객체 배열에서 name 필드를 추출하여 비교
      const favoriteCategoryNames = favorites.map((fav) => fav.name);
      return newsListData.content.filter((news) =>
        favoriteCategoryNames.includes(news.category)
      );
    }

    // 즐겨찾기가 없으면 최신 뉴스 5개 표시
    return newsListData.content.slice(0, 5);
  }, [newsListData, favorites]);

  // 즐겨찾기가 2개 이상일 때 뉴스를 랜덤으로 섞기
  const favoriteNews: News[] = useMemo(() => {
    if (favorites.length >= 2) {
      return [...filteredNews].sort(() => Math.random() - 0.5);
    }
    return filteredNews;
  }, [filteredNews, favorites]);

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
      <section>
        <NewsSummaryCard
          summary={newsSummary?.summary || ""}
          isLoading={isLoading}
          onTimeChange={handleTimeChange}
          selectedTime={selectedTime}
          quizSection={
            <>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quiz</h3>
              {isQuizLoading ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : quiz?.data?.questions && quiz.data.questions.length > 0 ? (
                <div className="space-y-4">
                  <QuizQuestion
                    question={
                      quiz.data.questions[currentQuestionIndex]?.text ||
                      quiz.data.questions[0].text
                    }
                  />

                  {/* 현재 시간대가 아닌 경우 정적으로 표시 */}
                  {!isCurrentTimeSlot ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-2">
                          ⏰ 이 시간대의 퀴즈는 이미 지나갔습니다.
                        </p>
                        <p className="text-sm text-gray-500">
                          정답과 해설만 확인할 수 있습니다.
                        </p>
                      </div>
                      {/* 모든 문제의 정답 표시 */}
                      <div className="space-y-3">
                        {quiz.data.questions.map((question, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-lg border bg-blue-50 border-blue-200"
                          >
                            <p className="text-sm text-gray-600 mb-1">
                              문제 {idx + 1} 정답
                            </p>
                            <p className="font-medium text-gray-900">
                              {question.correctIndex + 1}번:{" "}
                              {question.options[question.correctIndex]}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              {question.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : !isSolved ? (
                    <div className="space-y-4">
                      {/* 옵션 표시 */}
                      <div className="space-y-2">
                        {quiz.data.questions[currentQuestionIndex]?.options.map(
                          (option, idx) => (
                            <div
                              key={idx}
                              className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              {idx + 1}. {option}
                            </div>
                          )
                        )}
                      </div>
                      <QuizForm
                        onSubmit={handleSubmit}
                        isSubmitting={submitAnswer.isPending}
                        isLoggedIn={isLoggedIn}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* 퀴즈 결과 표시 */}
                      <div className="p-5 rounded-lg border bg-blue-50 border-blue-200">
                        <p className="mb-2 font-medium text-blue-900">
                          점수: {quizResults?.correct} / {quizResults?.total}
                        </p>
                      </div>
                      {/* 각 문제별 결과 */}
                      <div className="space-y-3">
                        {quiz.data.questions.map((question, idx) => (
                          <div
                            key={idx}
                            className={`p-4 rounded-lg border ${
                              quizResults?.results[idx]
                                ? "bg-green-50 border-green-200"
                                : "bg-red-50 border-red-200"
                            }`}
                          >
                            <p className="text-sm text-gray-600 mb-1">
                              문제 {idx + 1}:{" "}
                              {quizResults?.results[idx] ? "✓ 정답" : "✗ 오답"}
                            </p>
                            <p className="font-medium text-gray-900">
                              정답: {question.correctIndex + 1}번 -{" "}
                              {question.options[question.correctIndex]}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              {question.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => navigate("/mypage")}
                        className="w-full py-3 px-6 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                      >
                        현재 총점수는? 마이페이지로 이동
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  오늘의 퀴즈를 불러오는데 실패했습니다.
                </p>
              )}
            </>
          }
        />
      </section>

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
            {favorites.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className="px-4 py-2 rounded-full border bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all font-medium flex items-center gap-1.5"
              >
                <FaStar className="text-yellow-400" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* 뉴스 리스트 */}
        <div className="space-y-4">
          {favoriteNews.length > 0 ? (
            favoriteNews.map((news) => (
              <article
                key={news.id}
                className="bg-white border border-gray-200 rounded p-6 hover:border-blue-600 hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate(`/news/${news.id}`)}
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {news.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                  {news.summary}
                </p>
                <div className="flex gap-3 text-xs text-gray-500">
                  <span>{new Date(news.publishedAt).toLocaleDateString()}</span>
                  <span>·</span>
                  <span>{news.category}</span>
                </div>
              </article>
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
