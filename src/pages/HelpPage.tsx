import { Link } from "react-router-dom";
import {
  FaNewspaper,
  FaQuestionCircle,
  FaUserCircle,
  FaStar,
  FaTrophy,
  FaBell,
} from "react-icons/fa";

export default function HelpPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* 헤더 */}
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-gray-900">
          NewSugar 사용 가이드
        </h1>
        <p className="text-gray-600 text-lg">
          AI가 요약한 뉴스와 퀴즈로 배우는 똑똑한 뉴스 서비스
        </p>
      </section>

      {/* 서비스 소개 */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">NewSugar란?</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          NewSugar는 매일 쏟아지는 뉴스를 AI가 자동으로 선별하고 요약하여 바쁜
          현대인들이 짧은 시간에 핵심 정보를 파악할 수 있도록 돕는 서비스입니다.
          또한 퀴즈를 통해 뉴스 내용을 재미있게 학습하고, 본인의 관심 분야에
          맞춰 뉴스를 구독할 수 있습니다.
        </p>
      </section>

      {/* 주요 기능 */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          주요 기능
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* AI 뉴스 요약 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaNewspaper className="text-blue-600 text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  AI 뉴스 요약
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  복잡한 뉴스를 AI가 자동으로 분석하고 핵심만 간추려 제공합니다.
                  긴 기사를 읽을 시간이 없다면 요약본으로 빠르게 파악하세요.
                </p>
              </div>
            </div>
          </div>

          {/* 오늘의 퀴즈 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaQuestionCircle className="text-green-600 text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  오늘의 퀴즈
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  매일 업데이트되는 뉴스 퀴즈로 배운 내용을 점검하세요. 정답을
                  맞히면 포인트를 획득하고 뱃지를 수집할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* 카테고리별 뉴스 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaStar className="text-purple-600 text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  카테고리별 뉴스
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  정치, 경제, 사회, 문화, IT, 스포츠 등 6가지 카테고리로 분류된
                  뉴스를 제공합니다. 관심 있는 카테고리를 즐겨찾기에
                  추가해보세요.
                </p>
              </div>
            </div>
          </div>

          {/* 마이페이지 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <FaUserCircle className="text-orange-600 text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  마이페이지
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  학습 기록, 누적 점수, 보유 뱃지를 확인하고 프로필을 관리할 수
                  있습니다. 나만의 학습 통계를 확인해보세요.
                </p>
              </div>
            </div>
          </div>

          {/* 뱃지 시스템 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FaTrophy className="text-yellow-600 text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  뱃지 시스템
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  퀴즈를 풀고 뉴스를 읽으면서 다양한 업적을 달성하면 특별한
                  뱃지를 획득할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* 알림 기능 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <FaBell className="text-red-600 text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  알림 기능
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  관심 카테고리의 주요 뉴스나 새로운 퀴즈가 올라오면 알림을 받아
                  놓치지 않고 확인할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 사용 방법 */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          사용 방법
        </h2>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="bg-white border-l-4 border-blue-600 rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  회원가입 및 로그인
                </h3>
                <p className="text-gray-600">
                  이메일로 간편하게 가입하거나 구글 계정으로 빠르게 시작하세요.
                  회원가입 시 관심 카테고리를 선택할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white border-l-4 border-blue-600 rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  홈에서 오늘의 뉴스 확인
                </h3>
                <p className="text-gray-600">
                  메인 페이지에서 AI가 요약한 주요 뉴스를 한눈에 확인하세요.
                  검색 기능을 통해 특정 주제의 뉴스를 찾을 수도 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white border-l-4 border-blue-600 rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  오늘의 퀴즈 풀기
                </h3>
                <p className="text-gray-600">
                  매일 제공되는 퀴즈를 풀고 정답을 맞혀 포인트를 획득하세요.
                  틀려도 괜찮습니다! 해설을 통해 다시 학습할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white border-l-4 border-blue-600 rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  카테고리별 뉴스 탐색
                </h3>
                <p className="text-gray-600">
                  관심 있는 카테고리를 선택하여 해당 분야의 뉴스를 모아보세요.
                  즐겨찾기를 설정하면 메인 페이지에서 빠르게 접근할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white border-l-4 border-blue-600 rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                5
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  마이페이지에서 학습 기록 확인
                </h3>
                <p className="text-gray-600">
                  누적 점수, 해결한 퀴즈 수, 획득한 뱃지를 확인하고 나의 학습
                  패턴을 분석해보세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          자주 묻는 질문 (FAQ)
        </h2>

        <div className="space-y-4">
          <details className="bg-white border border-gray-200 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 text-lg list-none flex justify-between items-center">
              <span>NewSugar는 무료인가요?</span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <p className="mt-3 text-gray-600 leading-relaxed">
              네, NewSugar의 기본 서비스는 완전히 무료입니다. 회원가입 후 모든
              뉴스 요약과 퀴즈를 자유롭게 이용하실 수 있습니다.
            </p>
          </details>

          <details className="bg-white border border-gray-200 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 text-lg list-none flex justify-between items-center">
              <span>퀴즈는 매일 업데이트되나요?</span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <p className="mt-3 text-gray-600 leading-relaxed">
              네, 매일 새로운 뉴스 기반 퀴즈가 제공됩니다. 오늘의 주요 뉴스를
              바탕으로 문제가 출제되므로 매일 방문하여 최신 이슈를 학습할 수
              있습니다.
            </p>
          </details>

          <details className="bg-white border border-gray-200 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 text-lg list-none flex justify-between items-center">
              <span>AI 요약의 정확도는 어느 정도인가요?</span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <p className="mt-3 text-gray-600 leading-relaxed">
              NewSugar는 최신 AI 기술을 활용하여 높은 정확도의 요약을
              제공합니다. 다만 중요한 결정을 내리기 전에는 원문 기사를 함께
              확인하시길 권장합니다. 각 요약에는 원문 링크가 제공됩니다.
            </p>
          </details>

          <details className="bg-white border border-gray-200 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 text-lg list-none flex justify-between items-center">
              <span>카테고리를 추가할 수 있나요?</span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <p className="mt-3 text-gray-600 leading-relaxed">
              현재는 정치, 경제, 사회, 문화, IT, 스포츠 6개의 카테고리를
              제공합니다. 향후 사용자 의견을 반영하여 추가 카테고리를 제공할
              계획입니다.
            </p>
          </details>

          <details className="bg-white border border-gray-200 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 text-lg list-none flex justify-between items-center">
              <span>뱃지는 어떻게 획득하나요?</span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <p className="mt-3 text-gray-600 leading-relaxed">
              퀴즈 정답률, 연속 출석일, 뉴스 읽은 개수 등 다양한 업적을 달성하면
              뱃지를 획득할 수 있습니다. 마이페이지에서 획득 조건을 확인하세요.
            </p>
          </details>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-10 text-center text-white space-y-4">
        <h2 className="text-3xl font-bold">지금 바로 시작하세요!</h2>
        <p className="text-lg text-blue-100">
          NewSugar와 함께 똑똑하게 뉴스를 소비하고 학습하세요
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link
            to="/signup"
            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            회원가입
          </Link>
          <Link
            to="/"
            className="px-8 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-colors"
          >
            홈으로 가기
          </Link>
        </div>
      </section>
    </div>
  );
}
