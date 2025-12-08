import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000, // 1초 후 타임아웃 (빠르게 Mock 데이터로 전환)
});
