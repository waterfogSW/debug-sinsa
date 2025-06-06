import { Problem } from '@/domain/Problem';
import { IProblemRepository } from '@/domain/repositories/IProblemRepository';
import { SupabaseProblemRepository } from '@/infrastructure/repositories/supabase/SupabaseProblemRepository';

export class ProblemService {
  private problemRepository: IProblemRepository;

  constructor() {
    this.problemRepository = new SupabaseProblemRepository();
  }

  async getAllProblems(options: { limit: number; cursor?: string }): Promise<{ problems: Problem[]; nextCursor: string | null }> {
    return this.problemRepository.getAll(options);
  }

  async createProblem(content: string, authorInput?: string): Promise<{ newProblem: Problem }> {
    if (!content.trim()) {
      throw new Error('Content cannot be empty.');
    }
    const author = authorInput?.trim() || `익명의 나그네(${Math.floor(Math.random() * 1000)})`;
    
    const newProblemData = {
      content,
      author,
    };
    const newProblem = await this.problemRepository.add(newProblemData);
    
    return { newProblem };
  }
}
