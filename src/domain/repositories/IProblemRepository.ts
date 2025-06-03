import { Problem } from '../Problem';

export interface IProblemRepository {
  getAll(): Promise<Problem[]>;
  findById(id: string): Promise<Problem | null>;
  add(data: Omit<Problem, 'id' | 'timestamp'>): Promise<Problem>;
  update(id: string, data: Partial<Problem>): Promise<Problem | null>;
  delete(id: string): Promise<boolean>;
  // 필요에 따라 다른 메소드 추가
} 