import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import "./App.css";
import router from "./Router";
import { BadgeSprite } from "./components/badge";
import { checkHealth } from "./api/health";
import { GoogleOAuthProvider } from "@react-oauth/google";

// ===== 1224 유저 정보 문제 때문에 수정 (확인은 X) - 시작 =====
// 문제: staleTime이 0이면 모든 쿼리가 즉시 stale 상태가 되어 매번 새로 fetch
//       → 여러 사용자가 동시 접속 시 캐시 충돌 및 race condition 발생 가능
// 해결:
//   1. staleTime을 5분으로 설정하여 불필요한 refetch 방지
//   2. refetchOnMount: 'always'로 페이지 이동 시 항상 새로고침
//   3. 로그인/로그아웃 시 queryClient.clear()로 캐시 초기화하므로 안전
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분 (기존: 0)
      refetchOnMount: "always", // 페이지 이동 시 항상 새로고침 (기존: true)
      // retry: 1,
      retry: false, // API 실패 시 재시도 안 함 (Mock 데이터로 빠르게 전환)
    },
  },
});
// ===== 1224 유저 정보 문제 때문에 수정 (확인은 X) - 끝 =====

function App() {
  useEffect(() => {
    // 앱 시작 시 헬스 체크
    checkHealth()
      .then((response) => {
        console.log("✅ 서버 상태:", response);
      })
      .catch((error) => {
        console.error("❌ 서버 연결 실패:", error);
        // 필요시 사용자에게 알림 표시
      });
  }, []);

  console.log(
    "ENV CHECK:",
    import.meta.env,
    import.meta.env.VITE_GOOGLE_CLIENT_ID
  );

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <BadgeSprite />
        <RouterProvider router={router} />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
