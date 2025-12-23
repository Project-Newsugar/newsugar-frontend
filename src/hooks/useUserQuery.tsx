import { useQuery } from '@tanstack/react-query';
import { getMyProfile, getUserCategories } from '../api/auth';
import type { GetUserInfoResponseData, UserCategories } from '../types/user';

export const useUserProfile = (isLoggedIn: boolean) => {
  return useQuery<GetUserInfoResponseData, Error>({
    queryKey: ["user", "profile"],
    queryFn: () => getMyProfile(),
    enabled: isLoggedIn, // 로그인한 경우에만 실행
    staleTime: 0,
    retry: 1, // 실패 시 재시도 횟수
  });
};

export const useUserCategories = (isLoggedIn: boolean) => {
  return useQuery<UserCategories, Error>({
    queryKey: ["user", "categories"],
    queryFn: async () => {
      const userCategories = await getUserCategories();
      return userCategories;
    },
    enabled: isLoggedIn, // 로그인한 경우에만 실행
    staleTime: 0,
    retry: 1, // 실패 시 재시도 횟수
  });
}