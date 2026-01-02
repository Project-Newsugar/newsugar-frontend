import { useGoogleLogin as useGoogleOAuth } from "@react-oauth/google";
import { googleLogin } from "../api/auth";

export const useGoogleLogin = () => {
  return useGoogleOAuth({
    scope: "openid email profile",

    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;

      const res = await googleLogin(accessToken);
      console.log("구글 로그인 성공:", res.data);
    },

    onError: () => {
      alert("구글 로그인 실패");
    },
  });
};
