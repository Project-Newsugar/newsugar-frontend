// 공통 API Response 타입
export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string | null;
  data: T;
  timestamp: string;
}

// 뉴스 카테고리 타입 (getCategorySlug에 맞춤)
export type NewsCategory = "politics" | "economy" | "science-tech" | "sports" | "culture" | "international";

// 카테고리 한글 매핑
export const CATEGORY_LABELS: Record<NewsCategory, string> = {
  politics: "정치",
  economy: "경제",
  "science-tech": "과학/기술",
  sports: "스포츠",
  culture: "문화",
  international: "국제",
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
