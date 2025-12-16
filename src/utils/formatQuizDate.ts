/**
 * 시간대를 기준으로 퀴즈 타임슬롯 계산
 * 06~12시: 06시 퀴즈
 * 12~18시: 12시 퀴즈
 * 18~24시: 18시 퀴즈
 * 00~06시: 24시 퀴즈
 */
const getQuizTimeSlot = (hour: number): string => {
  if (hour >= 6 && hour < 12) return "06";
  if (hour >= 12 && hour < 18) return "12";
  if (hour >= 18 && hour < 24) return "18";
  return "24"; // 00~06시
};

/**
 * 퀴즈 시작 시간을 "날짜 + 몇 시의 퀴즈" 형식으로 포맷팅
 * 예: "12월 15일 06시 뉴스 퀴즈", "12월 16일 18시 뉴스 퀴즈"
 */
export const formatQuizDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();

  const timeSlot = getQuizTimeSlot(hour);

  return `${month}월 ${day}일 ${timeSlot}시 뉴스 퀴즈`;
};

/**
 * ISO 날짜 문자열을 간단한 날짜 형식으로 포맷팅
 * 예: "2024-12-15" → "12월 15일"
 */
export const formatSimpleDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${month}월 ${day}일`;
};
