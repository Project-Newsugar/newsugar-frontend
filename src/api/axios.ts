import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/keys";
import { getLocalStorage } from "../utils/getLocalStorage";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

export const axiosInstance = axios.create({
  // ===== 임시 수정: 프록시 사용을 위해 baseURL 제거 =====
  // 백엔드 CORS 해결 후 원래대로 복구: baseURL: import.meta.env.VITE_SERVER_API_URL,
  // baseURL: import.meta.env.VITE_SERVER_API_URL,
  // ===== 임시 수정 끝 =====
});

axiosInstance.interceptors.request.use(
  (config) => {
    const { getItem } = getLocalStorage(LOCAL_STORAGE_KEY.accessToken);

    const accessToken = getItem();

    if (accessToken) {
      console.log("accessToken !!");
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },

  (err) => Promise.reject(err)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalRequest: CustomInternalAxiosRequestConfig = err.config;

    if (
      err.response &&
      err.response.status === 401 &&
      !originalRequest._retry
    ) {
      console.log("401 !!!!!");
      if (originalRequest.url === "/api/v1/auth/refresh") {
        const { removeItem: removeAccessToken } = getLocalStorage(
          LOCAL_STORAGE_KEY.accessToken
        );
        const { removeItem: removeRefreshToken } = getLocalStorage(
          LOCAL_STORAGE_KEY.refreshToken
        );
        removeAccessToken();
        removeRefreshToken();
        window.location.replace("/login");

        return Promise.reject(err);
      }

      originalRequest._retry = true;
      // 토큰 재발급 로직
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const { getItem: getRefreshToken } = getLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken
          );
          const refreshToken = getRefreshToken();

          if (!refreshToken) {
            throw new Error("리프레시 토큰이 없습니다.");
          }
          console.log("토큰 재발급 시도...");

          const { data } = await axiosInstance.post("api/v1/users/refresh", {
            refreshToken: refreshToken,
          });

          // 응답 구조: { success: true, data: { accessToken: "...", refreshToken: "..." } }
          const newAccessToken = data.data.accessToken;
          const newRefreshToken = data.data.refreshToken;

          // 새 토큰 저장
          const { setItem: setAccessToken } = getLocalStorage(LOCAL_STORAGE_KEY.accessToken);
          const { setItem: setRefreshToken } = getLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
          
          setAccessToken(newAccessToken);
          // 리프레시 토큰도 갱신되면 같이 저장 (Rotation)
          if (newRefreshToken) {
             setRefreshToken(newRefreshToken);
          }

          return newAccessToken;
        })()
          .catch((err) => {
            console.error("❌ 토큰 재발급 실패:", err);
            const { removeItem: removeAccessToken } = getLocalStorage(
              LOCAL_STORAGE_KEY.accessToken
            );
            const { removeItem: removeRefreshToken } = getLocalStorage(
              LOCAL_STORAGE_KEY.refreshToken
            );

            removeAccessToken();
            removeRefreshToken();
            window.location.replace("/login");

            return Promise.reject(err);
          })
          .finally(() => {
            refreshPromise = null;
          });
      }
      // 재발급된 토큰으로 원래 요청 재시도
      return refreshPromise.then((newAccessToken) => {
        if (originalRequest.headers instanceof AxiosHeaders) {
          originalRequest.headers.set(
            "Authorization",
            `Bearer ${newAccessToken}`
          );
        } else {
          originalRequest.headers = new AxiosHeaders({
            Authorization: `Bearer ${newAccessToken}`,
          });
        }

        return axiosInstance.request(originalRequest);
      });
    }
    return Promise.reject(err);
  }
);
