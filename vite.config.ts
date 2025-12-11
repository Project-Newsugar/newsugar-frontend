import { defineConfig } from 'vite'
import svgr from "vite-plugin-svgr";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [svgr(), tailwindcss()],
  // ===== 임시 추가: CORS 문제 해결을 위한 프록시 설정 =====
  // 백엔드에서 CORS 헤더 설정이 완료되면 이 부분은 제거 가능합니다
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/v1': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
  // ===== 임시 추가 끝 =====
});