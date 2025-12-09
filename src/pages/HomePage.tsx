import { useState } from "react";
import {
  useNewsSummary,
  useTodayQuiz,
  useSubmitQuizAnswer,
} from "../hooks/useNewsQuery";
import NewsSummaryCard from "../components/home/NewsSummaryCard";
import CategoryGrid from "../components/home/CategoryGrid";
import QuizCard from "../components/quiz/QuizCard";
import QuizQuestion from "../components/quiz/QuizQuestion";
import QuizForm from "../components/quiz/QuizForm";
import QuizResult from "../components/quiz/QuizResult";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../constants/CategoryData";
import { getCategorySlug } from "../utils/getCategorySlug";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "../store/atoms";
import { FaStar } from "react-icons/fa";

export default function HomePage() {
  const { data: newsSummary, isLoading } = useNewsSummary();
  const { data: quiz, isLoading: isQuizLoading } = useTodayQuiz();
  const submitAnswer = useSubmitQuizAnswer();
  const [isSolved, setIsSolved] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'correct' | 'incorrect' | null;
  }>({ isOpen: false, type: null });
  const navigate = useNavigate();
  // const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);

  const handleCategoryClick = (category: string) => {
    const slug = getCategorySlug(category);
    navigate(`/category/${slug}`);
  };

  const handleToggleFavorite = (category: string) => {
    setFavorites((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (answer: string, resetForm: () => void) => {
    if (!quiz) return;
    try {
      const result = await submitAnswer.mutateAsync({
        quizId: quiz.id,
        userAnswer: answer,
      });

      if (result.isCorrect) {
        setModalState({ isOpen: true, type: 'correct' });
        setIsSolved(true);
      } else {
        setModalState({ isOpen: true, type: 'incorrect' });
        resetForm();
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
      alert("답안 제출 실패");
    }
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, type: null });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-14 space-y-16">
      {/* 퀴즈 결과 모달 */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        title={modalState.type === 'correct' ? '✓ 정답입니다!' : '✗ 틀렸습니다'}
        content={
          modalState.type === 'correct'
            ? '축하합니다! 정답을 맞히셨습니다.'
            : '틀렸습니다. 다시 시도해보세요!'
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

        {/* 즐겨찾기 카테고리 */}
        {favorites.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {favorites.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="px-4 py-2 rounded-full border bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all font-medium flex items-center gap-1.5"
              >
                <FaStar className="text-yellow-400" />
                <span>{category}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* SUMMARY */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          오늘의 주요 뉴스
        </h2>
        <NewsSummaryCard
          summary={newsSummary?.summary || ""}
          isLoading={isLoading}
        />
      </section>

      {/* QUIZ & CATEGORY - 로그인 필요 영역 */}
      <div className="relative space-y-16">
        <div
          className={
            isLoggedIn ? "" : "blur-sm pointer-events-none select-none"
          }
        >
          {/* QUIZ */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              오늘의 퀴즈
            </h2>

            <QuizCard>
              {isQuizLoading ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : quiz ? (
                <>
                  <QuizQuestion question={quiz.question} />

                  {!isSolved ? (
                    <QuizForm
                      onSubmit={handleSubmit}
                      isSubmitting={submitAnswer.isPending}
                    />
                  ) : (
                    <QuizResult
                      correctAnswer={quiz.correctAnswer}
                      explanation={quiz.explanation}
                    />
                  )}
                </>
              ) : (
                <p className="text-center text-gray-500">
                  오늘의 퀴즈를 불러오는데 실패했습니다.
                </p>
              )}
            </QuizCard>
          </section>

          {/* CATEGORY GRID */}
          <section className="mt-12 pb-12">
            <CategoryGrid
              categories={CATEGORIES}
              onCategoryClick={handleCategoryClick}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </section>
        </div>

        {!isLoggedIn && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white px-8 py-6 rounded-2xl shadow-lg border border-gray-200 text-center">
              <p className="text-gray-700 font-semibold mb-3">
                로그인이 필요한 서비스입니다
              </p>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                로그인하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
