import type { ApiResponse } from './common';

// 뉴스 카테고리 타입
export type NewsCategory =
  | "politics"
  | "economy"
  | "society"
  | "culture"
  | "world"
  | "tech"
  | "entertainment"
  | "opinion";

// 카테고리 한글 매핑
export const CATEGORY_LABELS: Record<NewsCategory, string> = {
  politics: "정치",
  economy: "경제",
  society: "사회",
  culture: "문화",
  world: "해외",
  tech: "과학/기술",
  entertainment: "엔터테인먼트",
  opinion: "오피니언",
};

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
