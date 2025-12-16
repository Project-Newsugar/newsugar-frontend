export type NewsItem = {
  id: string;
  sections: string[];
  title: string;
  publisher: string;
  summary: string;
  image_url?: string | null;
  content_url: string;
  published_at: string;
};
