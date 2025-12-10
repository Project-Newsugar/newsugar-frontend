import { useState } from "react";
import {
  useNewsSummary,
  useTodayQuiz,
  useSubmitQuizAnswer,
} from "../hooks/useNewsQuery";
import NewsSummaryCard from "../components/home/NewsSummaryCard";
import CategoryGrid from "../components/home/CategoryGrid";
import QuizQuestion from "../components/quiz/QuizQuestion";
import QuizForm from "../components/quiz/QuizForm";
import QuizResult from "../components/quiz/QuizResult";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { CATEGORIES, NEWS_DATA } from "../constants/CategoryData";
import { getCategorySlug } from "../utils/getCategorySlug";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "../store/atoms";
import { FaStar } from "react-icons/fa";
import type { NewsItem } from "../types/news";

export default function HomePage() {
  const { data: newsSummary, isLoading } = useNewsSummary();
  const { data: quiz, isLoading: isQuizLoading } = useTodayQuiz();
  const submitAnswer = useSubmitQuizAnswer();
  const [isSolved, setIsSolved] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "correct" | "incorrect" | null;
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

  const handleCloseModal = () => {
    setModalState({ isOpen: false, type: null });
  };

  // 즐겨찾기한 카테고리의 뉴스들 필터링
  const filteredNews: NewsItem[] =
    favorites.length > 0
      ? NEWS_DATA.filter((news) => favorites.includes(news.tags))
      : [...NEWS_DATA].sort(() => Math.random() - 0.5).slice(0, 5);

  // 즐겨찾기가 2개 이상일 때 뉴스를 랜덤으로 섞기
  const favoriteNews: NewsItem[] =
    favorites.length >= 2
      ? [...filteredNews].sort(() => Math.random() - 0.5)
      : filteredNews;

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
          quizSection={
            <>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quiz</h3>
              {isQuizLoading ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : quiz ? (
                <div className="space-y-4">
                  <QuizQuestion question={quiz.question} />

                  {!isSolved ? (
                    <QuizForm
                      onSubmit={handleSubmit}
                      isSubmitting={submitAnswer.isPending}
                      isLoggedIn={isLoggedIn}
                      options={quiz.options}
                    />
                  ) : (
                    <QuizResult
                      correctAnswer={quiz.correctAnswer}
                      explanation={quiz.explanation}
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
                  {news.content}
                </p>
                <div className="flex gap-3 text-xs text-gray-500">
                  <span>{news.date}</span>
                  <span>·</span>
                  <span>{news.source}</span>
                </div>
              </article>
            ))
          ) : (
            <div className="bg-white border border-gray-200 rounded p-12 text-center">
              <p className="text-gray-500">
                뉴스를 불러오는데 실패했습니다.
              </p>
            </div>
          )}
        </div>
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
  );
}
