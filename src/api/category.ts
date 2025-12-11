import { axiosInstance } from './axios';
import type {
  AddCategoryRequest,
  AddCategoryResponse,
  DeleteCategoryResponse
} from '../types/category';

// 카테고리 추가 API
export const addUserCategory = async (categoryId: number): Promise<AddCategoryResponse> => {
  const requestBody: AddCategoryRequest = { categoryId };
  const { data } = await axiosInstance.post<AddCategoryResponse>(
    '/api/v1/users/category',
    requestBody
  );
  return data;
};

// 카테고리 삭제 API
export const deleteUserCategory = async (categoryId: number): Promise<DeleteCategoryResponse> => {
  const { data } = await axiosInstance.delete<DeleteCategoryResponse>(
    `/api/v1/users/category/${categoryId}`
  );
  return data;
};
