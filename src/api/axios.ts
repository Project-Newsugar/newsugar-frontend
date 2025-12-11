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
      if (originalRequest.url === "/v1/auth/refresh") {
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

      if (!refreshPromise) {
        refreshPromise = (async () => {
          const { getItem: getRefreshToken } = getLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken
          );

          const refreshToken = getRefreshToken();

          const { data } = await axiosInstance.post("api/v1/users/refresh", {
            refresh: refreshToken,
          });

          const { setItem: setAccessToken } = getLocalStorage(
            LOCAL_STORAGE_KEY.accessToken
          );

          const { setItem: setRefreshToken } = getLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken
          );

          setAccessToken(data.data.accessToken);
          setRefreshToken(data.data.refreshToken);

          return data.data.accessToken;
        })()
          .catch((err) => {
            const { removeItem: removeAccessToken } = getLocalStorage(
              LOCAL_STORAGE_KEY.accessToken
            );
            const { removeItem: removeRefreshToken } = getLocalStorage(
              LOCAL_STORAGE_KEY.refreshToken
            );

            removeAccessToken();
            removeRefreshToken();
            window.location.replace("/login");

            console.error("accessToken 재발급 중 오류 발생 : ", err);
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

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
