export interface Reply {
  id: string; // UUID
  problemId: string; // 어떤 Problem에 대한 답글인지
  author: string; // 예: "신령 1호", "신령 2호"
  content: string;
  timestamp: string; // ISO 8601 형식의 날짜 문자열
} 