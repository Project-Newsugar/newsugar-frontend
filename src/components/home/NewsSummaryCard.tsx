import { useState } from "react";

interface NewsSummaryCardProps {
  summary: string;
  isLoading?: boolean;
  quizSection?: React.ReactNode;
  onTimeChange?: (time: string) => void;
}

export default function NewsSummaryCard({
  summary,
  isLoading = false,
  quizSection,
  onTimeChange,
}: NewsSummaryCardProps) {
  const [selectedTime, setSelectedTime] = useState<string>("00");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const timeOptions = ["00", "06", "12", "18"];

  // 현재 시간 기준으로 생성 가능한 시간대인지 확인
  const isTimeAvailable = (time: string): boolean => {
    const now = new Date();
    const currentHour = now.getHours();
    const targetHour = parseInt(time);
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

      <div className={`transition-all duration-200 ${isModalOpen ? "blur-sm" : ""}`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Daily Brief</h2>

        <div className="bg-white border border-gray-200 rounded p-6 shadow-sm">
        <div className="flex gap-2 mb-4">
          {timeOptions.map((time) => (
            <button
              key={time}
              onClick={() => handleTimeClick(time)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                selectedTime === time
                  ? "bg-blue-500 text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {time}시
            </button>
          ))}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-4">
          The {selectedTime}:00 News
        </h3>

          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {summary}
              </p>

              {quizSection && (
                <div className="mt-8 pt-8 border-t border-gray-200">
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
