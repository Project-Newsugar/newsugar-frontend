import { useGoogleLogin as useGoogleOAuth } from "@react-oauth/google";
import { googleLogin } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { isLoggedInAtom } from "../store/atoms";
import { getLocalStorage } from "../utils/getLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/keys";
import { useQueryClient } from "@tanstack/react-query";

export const useGoogleLogin = () => {
  const navigate = useNavigate();
  const setIsLoggedIn = useSetAtom(isLoggedInAtom);
  const queryClient = useQueryClient();

  return useGoogleOAuth({
    scope: "openid email profile",
    flow: "implicit",

    onSuccess: async (tokenResponse) => {
      try {
        const accessToken = tokenResponse.access_token;
        if (!accessToken) throw new Error("Google access token 없음");

        const res = await googleLogin(accessToken);

        if (!res.success) {
          throw new Error(res.message || "구글 로그인 실패");
        }

        queryClient.clear();

        const { setItem: setAccessToken } = getLocalStorage(
          LOCAL_STORAGE_KEY.accessToken
        );
        const { setItem: setRefreshToken } = getLocalStorage(
          LOCAL_STORAGE_KEY.refreshToken
        );

        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);

        setIsLoggedIn(true);

        navigate("/");
      } catch (error) {
        console.error("❌ 구글 로그인 실패:", error);
        alert("구글 로그인 중 문제가 발생했습니다.");
      }
    },

    onError: () => {
      alert("구글 로그인 실패");
    },
  });
};
