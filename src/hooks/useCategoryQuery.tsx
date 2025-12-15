import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUserCategory, deleteUserCategory } from "../api/category";
import type { UserCategories } from "../types/user";

// 카테고리 추가
export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: number) => addUserCategory(categoryId),
    // 낙관적 업데이트: 서버 응답 전에 UI 즉시 업데이트
    onMutate: async (categoryId: number) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["user", "categories"] });

      // 이전 데이터 백업
      const previousCategories = queryClient.getQueryData<UserCategories>([
        "user",
        "categories",
      ]);

      // 낙관적 업데이트
      if (previousCategories) {
        queryClient.setQueryData<UserCategories>(["user", "categories"], {
          ...previousCategories,
          categoryIdList: [...previousCategories.categoryIdList, categoryId],
        });
      }

      // 롤백용으로 이전 데이터 반환
      return { previousCategories };
    },
    // 에러 발생 시 롤백
    onError: (_err, _categoryId, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(
          ["user", "categories"],
          context.previousCategories
        );
      }
    },
    // 성공/실패 후 최종 데이터 동기화
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", "categories"],
      });
    },
  });
};

// 카테고리 삭제
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: number) => deleteUserCategory(categoryId),
    // 낙관적 업데이트: 서버 응답 전에 UI 즉시 업데이트
    onMutate: async (categoryId: number) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["user", "categories"] });

      // 이전 데이터 백업
      const previousCategories = queryClient.getQueryData<UserCategories>([
        "user",
        "categories",
      ]);

      // 낙관적 업데이트
      if (previousCategories) {
        queryClient.setQueryData<UserCategories>(["user", "categories"], {
          ...previousCategories,
          categoryIdList: previousCategories.categoryIdList.filter(
            (id) => id !== categoryId
          ),
        });
      }

      // 롤백용으로 이전 데이터 반환
      return { previousCategories };
    },
    // 에러 발생 시 롤백
    onError: (_err, _categoryId, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(
          ["user", "categories"],
          context.previousCategories
        );
      }
    },
    // 성공/실패 후 최종 데이터 동기화
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", "categories"],
      });
    },
  });
};
