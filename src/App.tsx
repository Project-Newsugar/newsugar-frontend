import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect } from "react";
import "./App.css";
import router from "./Router";
import { BadgeSprite } from "./components/badge";
import { checkHealth } from "./api/health";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      // retry: 1,
      retry: false, // API 실패 시 재시도 안 함 (Mock 데이터로 빠르게 전환)
    },
  },
});

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

  return (
    <QueryClientProvider client={queryClient}>
      <BadgeSprite />
      <RouterProvider router={router} />
      {import.meta.env.DEV &&
        <ReactQueryDevtools initialIsOpen={false} />
      }
    </QueryClientProvider>
  );
}

export default App;
