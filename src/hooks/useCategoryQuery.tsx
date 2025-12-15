import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addUserCategory, deleteUserCategory } from '../api/category';

// 카테고리 추가
export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: number) => addUserCategory(categoryId),
    onSuccess: () => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", "categories"],
      });
    },
  });
};