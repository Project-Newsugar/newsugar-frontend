import type { NewsItem } from '../types/news';
import { axiosInstance } from './axios';

export const getNewsByCategory = async (
  category: string | null = null, 
  page: number | null = null,
  page_size: number | null = null
): Promise<NewsItem[]> => {
  try {
    // params 객체 생성
    const params: Record<string, any> = {};
    if (category) params.category = category;
    if (page !== null) params.page = page;
    if (page_size !== null) params.page_size = page_size;

    const { data } = await axiosInstance.get('/api/v1/news', { params });
    console.log("뉴스 조회 성공:", data.data as NewsItem[]);

    return data.data.data as NewsItem[];
  } catch (error: any) {
    console.error("뉴스 조회 실패:", error);
    throw error;
  }
};