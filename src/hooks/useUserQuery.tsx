import { useQuery } from '@tanstack/react-query';
import { getMyProfile, getUserCategories } from '../api/auth';
import type { GetUserInfoResponseData, UserCategories } from '../types/user';

// ===== 1224 유저 정보 문제 때문에 수정 (확인은 X) - 시작 =====
// 문제: staleTime: 0으로 설정하면 매번 새로 fetch하여 캐시 충돌 발생
// 해결: staleTime 설정을 제거하고 App.tsx의 기본값(5분) 사용
export const useUserProfile = (isLoggedIn: boolean) => {
  return useQuery<GetUserInfoResponseData, Error>({
    queryKey: ["user", "profile"],
    queryFn: () => getMyProfile(),
    enabled: isLoggedIn, // 로그인한 경우에만 실행
    // staleTime: 0, // 제거 - App.tsx의 기본값 사용
    retry: 1, // 실패 시 재시도 횟수
  });
};
// ===== 1224 유저 정보 문제 때문에 수정 (확인은 X) - 끝 =====

// ===== 1224 유저 정보 문제 때문에 수정 (확인은 X) - 시작 =====
// 문제: staleTime: 0으로 설정하면 매번 새로 fetch하여 캐시 충돌 발생
// 해결: staleTime 설정을 제거하고 App.tsx의 기본값(5분) 사용
export const useUserCategories = (isLoggedIn: boolean) => {
  return useQuery<UserCategories, Error>({
    queryKey: ["user", "categories"],
    queryFn: async () => {
      const userCategories = await getUserCategories();
      return userCategories;
    },
    enabled: isLoggedIn, // 로그인한 경우에만 실행
    // staleTime: 0, // 제거 - App.tsx의 기본값 사용
    retry: 1, // 실패 시 재시도 횟수
  });
}
// ===== 1224 유저 정보 문제 때문에 수정 (확인은 X) - 끝 =====