import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '../api/auth';
import type { GetUserInfoResponseData } from '../types/user';

export const useUserProfile = (isLoggedIn: boolean) => {
  return useQuery<GetUserInfoResponseData, Error>({
    queryKey: ["user", "profile"],
    queryFn: () => getMyProfile(),
    enabled: isLoggedIn, // 로그인한 경우에만 실행
    staleTime: 5 * 60 * 1000, // 5분 캐싱
    retry: 1, // 실패 시 재시도 횟수
  });
};