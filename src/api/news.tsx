import type { NewsItem } from '../types/news';
import { axiosInstance } from './axios';

export const getNewsByCategory = async (
  category: string | null = null,
  page: number = 1,
  page_size: number = 10
): Promise<NewsItem[]> => {
  try {
    const params: Record<string, any> = {
      page,
      page_size,
    };

    if (category) {
      params.category = category;
    }
    const { data } = await axiosInstance.get('/api/v1/news', { params });

    return data.data.data as NewsItem[];
  } catch (error) {
    console.error("뉴스 조회 실패:", error);
    throw error;
  }
};