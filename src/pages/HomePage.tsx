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
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ["정치", "경제", "스포츠", "연예", "IT", "선행"];

export default function HomePage() {
  const { data: newsSummary, isLoading } = useNewsSummary();
  const { data: quiz, isLoading: isQuizLoading } = useTodayQuiz();
  const submitAnswer = useSubmitQuizAnswer();
  const [isSolved, setIsSolved] = useState(false);
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    console.log(`${category} 카테고리 클릭`);
  };

  const handleSubmit = async (answer: string) => {
    if (!quiz) return;
    try {
      const result = await submitAnswer.mutateAsync({
        quizId: quiz.id,
        userAnswer: answer,
      });

      if (result.isCorrect) {
        alert("정답입니다!");
        setIsSolved(true);
      } else {
        alert("틀렸습니다. 다시 시도해보세요!");
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
      alert("답안 제출 실패");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-14 space-y-16">
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

      {/* SUMMARY */}
      <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">오늘의 주요 뉴스</h2>
        <NewsSummaryCard
          summary={newsSummary?.summary || ""}
          isLoading={isLoading}
        />
      </section>

      {/* QUIZ */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">오늘의 퀴즈</h2>

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
      <section className="pb-12">
        <CategoryGrid
          categories={CATEGORIES}
          onCategoryClick={handleCategoryClick}
        />
      </section>
    </div>
  );
}