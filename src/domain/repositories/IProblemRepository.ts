import { Problem } from '../Problem';

export interface IProblemRepository {
  getAll(options: { limit: number; cursor?: string }): Promise<{ problems: Problem[]; nextCursor: string | null }>;
  countAll(): Promise<number>;
  findById(id: string): Promise<Problem | null>;
  add(data: Omit<Problem, 'id' | 'timestamp' | 'replies'>): Promise<Problem>;
  update(id: string, data: Partial<Problem>): Promise<Problem | null>;
  delete(id: string): Promise<boolean>;
  // 필요에 따라 다른 메소드 추가
} 
