/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  // 👇 여기에 플러그인 추가!
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}