export interface Problem {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  replies: { count: number }[];
} 