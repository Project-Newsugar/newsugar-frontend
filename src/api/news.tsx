import type { NewsItem } from "../types/news";
import { axiosInstance } from "./axios";

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
    const { data } = await axiosInstance.get("/api/v1/news", { params });

    return data.data.data as NewsItem[];
  } catch (error) {
    console.error("뉴스 조회 실패:", error);
    throw error;
  }
};

export const getCategoryNewsSummary = async (
  category: string
): Promise<string> => {
  try {
    const { data } = await axiosInstance.get(
      `/api/v1/news/category-summary/${category}`
    );

    return data.data;
  } catch (error) {
    console.error("카테고리 뉴스 요약 조회 실패:", error);
    throw error;
  }
};

export const getMainSummary = async (hour: number) => {
  try {
    const { data } = await axiosInstance.get(
      `/api/v1/news/today-main-summary-by-time`,
      {
        params: { hour },
      }
    );
    console.log(data);
    return data.data;
  } catch (error) {
    console.error("주요 뉴스 요약 조회 실패: ", error);
    throw error;
  }
};
