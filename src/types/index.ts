export interface Post {
  postNumber: number;
  date: string;
  contentPillar: string;
  caption: string;
  visualDirection: string;
  hashtags: string[];
  usedQuotaFallback?: boolean;
}

export interface GeneratedCalendar {
  industry: string;
  duration: string;
  totalPosts: number;
  posts: Post[];
  usedQuotaFallback?: boolean;
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
  originalSize?: number;
  optimizedSize?: number;
  isCompressed?: boolean;
  usedQuotaFallback?: boolean;
}

export type DurationOption = '1week' | '2weeks' | '1month';

export type IndustryOption = 'realestate' | 'jewellery' | 'perfume' | 'food';
