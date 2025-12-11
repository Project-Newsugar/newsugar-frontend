import { useState, useMemo } from "react";
import {
  useAllNews,
  useQuizById,
  useSubmitQuizAnswer,
} from "../hooks/useNewsQuery";
import NewsSummaryCard from "../components/home/NewsSummaryCard";
import QuizQuestion from "../components/quiz/QuizQuestion";
import QuizForm from "../components/quiz/QuizForm";
import QuizResult from "../components/quiz/QuizResult";
import QuizStatic from "../components/quiz/QuizStatic";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { getCategorySlug } from "../utils/getCategorySlug";
import { useAtom } from "jotai";
import { isLoggedInAtom, favoriteCategoriesAtom } from "../store/atoms";
import { FaStar } from "react-icons/fa";
import type { News } from "../types/news";
import AdBanner from "../components/home/AdBanner";

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
      .join('\n\n');

    return {
      summary: summaryText || "뉴스를 불러오는 중입니다...",
      date: new Date().toISOString(),
    };
  }, [newsListData]);

  // 시간대를 기반으로 퀴즈 ID 계산 (임시: 시간대별로 다른 퀴즈 ID)
  const quizId = useMemo(() => {
    const timeToId: { [key: string]: number } = {
      "06": 1,
      "12": 2,
      "18": 3,
      "24": 4,
    };
    return timeToId[selectedTime] || 1;
  }, [selectedTime]);

  const { data: quiz, isLoading: isQuizLoading } = useQuizById(quizId);
  const submitAnswer = useSubmitQuizAnswer();
  const [isSolved, setIsSolved] = useState(false);
  const [favorites] = useAtom(favoriteCategoriesAtom);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "correct" | "incorrect" | null;
  }>({ isOpen: false, type: null });
  const navigate = useNavigate();
  // const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);

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
    setIsSolved(false); // 시간대 변경 시 퀴즈 풀이 상태 초기화
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
    if (!quiz) return;
    try {
      // 새 API 형식에 맞게 변환
      const result = await submitAnswer.mutateAsync({
        quiz_id: quiz.data.id,
        user_id: 1, // TODO: 실제 로그인 사용자 ID 사용
        user_answer: parseInt(answer), // string을 number로 변환
      });

      // SubmitQuizAnswerResponse의 is_correct 확인
      if (result.data.is_correct) {
        setModalState({ isOpen: true, type: "correct" });
        setIsSolved(true);
      } else {
        setModalState({ isOpen: true, type: "incorrect" });
        resetForm();
      }
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
            : "틀렸습니다. 다시 시도해보세요!"
        }
        type="alert"
      />

      {/* 임시 로그인 토글 버튼 (개발용) */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          className={`px-4 py-2 rounded-lg font-medium shadow-lg transition-colors ${
            isLoggedIn
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-600 text-white hover:bg-gray-700"
          }`}
        >
          {isLoggedIn ? "🟢 로그인됨" : "⚪ 로그아웃됨"}
        </button>
      </div>

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
              ) : quiz?.data ? (
                <div className="space-y-4">
                  <QuizQuestion question={quiz.data.question} />

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
                      <QuizStatic
                        correctAnswer={quiz.data.correct_answer}
                        isRevealed={quiz.data.is_revealed}
                      />
                    </div>
                  ) : !isSolved ? (
                    <QuizForm
                      onSubmit={handleSubmit}
                      isSubmitting={submitAnswer.isPending}
                      isLoggedIn={isLoggedIn}
                    />
                  ) : (
                    <QuizResult
                      correctAnswer={quiz.data.correct_answer}
                      isRevealed={quiz.data.is_revealed}
                    />
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
