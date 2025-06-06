import { Problem } from '@/domain/Problem';
import { IProblemRepository } from '@/domain/repositories/IProblemRepository';
import { SupabaseProblemRepository } from '@/infrastructure/repositories/supabase/SupabaseProblemRepository';

export class ProblemService {
  private problemRepository: IProblemRepository;

  constructor() {
    this.problemRepository = new SupabaseProblemRepository();
  }

  async getAllProblems(limit?: number): Promise<Problem[]> {
    const problems = await this.problemRepository.getAll(limit);
    const sortedProblems = problems.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return sortedProblems;
  }

  async createProblem(content: string, authorInput?: string): Promise<{ newProblem: Problem }> {
    if (!content.trim()) {
      throw new Error('Content cannot be empty.');
    }
    const author = authorInput?.trim() || `익명의 나그네(${Math.floor(Math.random() * 1000)})`;
    
    const newProblemData: Omit<Problem, 'id' | 'timestamp'> = {
      content,
      author,
    };
    const newProblem = await this.problemRepository.add(newProblemData);
    
    return { newProblem };
  }
}