import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addUserCategory, deleteUserCategory } from '../api/category';

// 카테고리 추가 훅
export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: number) => addUserCategory(categoryId),
    onSuccess: () => {
      // 카테고리 관련 쿼리 무효화 (필요시 추가)
      queryClient.invalidateQueries({ queryKey: ['userCategories'] });
    },
  });
};

// 카테고리 삭제 훅
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: number) => deleteUserCategory(categoryId),
    onSuccess: () => {
      // 카테고리 관련 쿼리 무효화 (필요시 추가)
      queryClient.invalidateQueries({ queryKey: ['userCategories'] });
    },
  });
};
