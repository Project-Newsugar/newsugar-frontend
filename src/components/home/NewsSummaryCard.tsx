import { useState, useEffect } from "react";
import LoadingSpinner from "../LoadingSpanner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useMainSummary } from "../../hooks/useNewsQuery";

interface NewsSummaryCardProps {
  isLoading?: boolean;
  quizSection?: React.ReactNode;
  onTimeChange?: (time: string) => void;
  selectedTime?: string;
}

export default function NewsSummaryCard({
  isLoading = false,
  quizSection,
  onTimeChange,
  selectedTime: initialSelectedTime,
}: NewsSummaryCardProps) {
  const [selectedTime, setSelectedTime] = useState<string>(
    initialSelectedTime || "06"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const timeOptions = ["06", "12", "18", "24"];

  // 부모 컴포넌트에서 selectedTime이 변경되면 동기화
  useEffect(() => {
    if (initialSelectedTime) {
      setSelectedTime(initialSelectedTime);
    }
  }, [initialSelectedTime]);

  // 현재 시간 기준으로 생성 가능한 시간대인지 확인
  const isTimeAvailable = (time: string): boolean => {
    const now = new Date();
    const currentHour = now.getHours();
    const targetHour = parseInt(time);

    // 24시는 자정(0시) 이후 ~ 다음날 오전 6시 전까지 볼 수 있음
    if (targetHour === 24) {
      return currentHour >= 0 && currentHour < 6;
    }

    // 다른 시간대는 해당 시간 이후부터 다음날 오전 6시 전까지 볼 수 있음
    // 오전 0~5시: 전날 뉴스들을 볼 수 있음
    if (currentHour < 6) {
      return true;
    }

    // 오전 6시 이후: 해당 시간이 지난 뉴스만 볼 수 있음
    return currentHour >= targetHour;
  };

  const handleTimeClick = (time: string) => {
    if (!isTimeAvailable(time)) {
      setModalMessage(`아직 ${time}시가 되지 않았습니다`);
      setIsModalOpen(true);
      return;
    }
    setSelectedTime(time);
    onTimeChange?.(time);
  };

  const selectedHour = Number(selectedTime);

  // 최신 뉴스 하나를 summary로 사용
  const { data: summary } = useMainSummary(selectedHour);

  const markdownWithHighlight = summary
    ? summary.replace(/==(.+?)==/g, '<span class="highlight">$1</span>')
    : "";

  return (
    <div className="relative">
      {/* 시간 미도달 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-lg p-6 shadow-xl border border-gray-200 max-w-sm mx-4 pointer-events-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-2">알림</h3>
            <p className="text-gray-700 mb-4">{modalMessage}</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-all"
            >
              확인
            </button>
          </div>
        </div>
      )}

      <div
        className={`transition-all duration-200 ${
          isModalOpen ? "blur-sm" : ""
        }`}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">오늘의 요약</h2>

        <div className="bg-white border border-gray-200 rounded p-4 sm:p-6 shadow-sm">
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {timeOptions.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeClick(time)}
                className={`px-4 py-2 min-h-[44px] rounded-md text-sm sm:text-base font-medium transition-all whitespace-nowrap ${
                  selectedTime === time
                    ? "bg-blue-500 text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {time}시
              </button>
            ))}
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
            {selectedTime}시 주요 뉴스
          </h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <LoadingSpinner size={40} />
            </div>
          ) : (
            <>
              <div className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {markdownWithHighlight}
                </ReactMarkdown>
              </div>

              {quizSection && (
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                  {quizSection}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
