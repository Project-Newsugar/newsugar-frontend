// 백엔드 명세에 맞춘 카테고리 타입
export type CategoryType =
  | "politics"
  | "economy"
  | "science-tech"
  | "sports"
  | "culture"
  | "international";

// 뉴스 아이템 (백엔드 API 명세 기준)
export interface News {
  id: number;
  title: string;
  summary: string;
  url: string;
  category: CategoryType;
  publishedAt: string;
}

// 로컬 더미 데이터용 타입 (향후 제거 예정)
export interface LocalNewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
  source: string;
  author?: string;
  imageUrl?: string;
  summary?: string;
  tags?: string;
  originalUrl?: string;
}

// 뉴스 전체 조회 Response (페이지네이션)
export interface NewsListResponse {
  content: News[];
  page: number;
  size: number;
  totalElements: number;
}

// 뉴스 저장 Request
export interface CreateNewsRequest {
  title: string;
  summary: string;
  url: string;
  category: CategoryType;
  publishedAt: string;
}

// 뉴스 저장 Response
export interface CreateNewsResponse {
  id: number;
  message: string;
}

// URL 중복 확인 Response
export interface NewsExistsResponse {
  exists: boolean;
}
