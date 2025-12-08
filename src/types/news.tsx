export type CategoryType = '정치' | '경제' | '과학/기술' | '스포츠' | '문화' | '국제';

export interface NewsItem {
  id: number;
  title: string;
  preview: string;
  date: string;
  source: string;
}
export interface NewsSummary {
  summary: string;
  date: string;
}
