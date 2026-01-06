import type { ApiResponse } from './common';

// 카테고리 추가 Request
export interface AddCategoryRequest {
  categoryId: number;
}

// 카테고리 데이터
export interface UserCategory {
  id: number;
  userId: number;
  categoryId: number;
  name: string;
}

// 카테고리 추가 Response
export type AddCategoryResponse = ApiResponse<UserCategory>;

// 카테고리 삭제 Response
export type DeleteCategoryResponse = ApiResponse<string>;
