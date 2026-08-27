export interface Post {
  postNumber: number;
  date: string;
  contentPillar: string;
  caption: string;
  visualDirection: string;
  hashtags: string[];
}

export interface GeneratedCalendar {
  industry: string;
  duration: string;
  totalPosts: number;
  posts: Post[];
}

export interface ReferenceFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string; // Extracted text content
  status: 'processing' | 'success' | 'error';
  errorMessage?: string;
  base64Data?: string;
}

export type DurationOption = '1week' | '2weeks' | '1month';

export type IndustryOption = 'realestate' | 'jewellery' | 'perfume' | 'food';
