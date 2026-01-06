import { defineConfig, loadEnv } from 'vite' // [수정 1] loadEnv 추가
import svgr from "vite-plugin-svgr";
import tailwindcss from '@tailwindcss/vite'

// 설정을 함수형(({ mode }) => ...)으로 변경하여 환경 변수를 읽을 수 있게 함
export default defineConfig(({ mode }) => {
  // .env 파일들을 로드
  const env = loadEnv(mode, '.', '');
  
  // .env.local에 주소가 있으면 그걸 쓰고, 없으면 localhost 사용
  const target = env.VITE_API_TARGET || 'http://localhost:8080';

  return {
    plugins: [svgr(), tailwindcss()],
    // ===== 임시 추가: CORS 문제 해결을 위한 프록시 설정 =====
    // 백엔드에서 CORS 헤더 설정이 완료되면 이 부분은 제거 가능합니다
    server: {
      proxy: {
        '/api': {
          target: target, // 하드코딩된 주소 대신 변수 사용
          changeOrigin: true,
          secure: false,
        },
        '/v1': {
          target: target, // 변수 사용
          changeOrigin: true,
          secure: false,
        },
        '/auth': {
          target: target, //변수 사용
          changeOrigin: true,
          secure: false,
        }
      }
    }
    // ===== 임시 추가 끝 =====
  }
});
