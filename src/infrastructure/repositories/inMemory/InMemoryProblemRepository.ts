import { Problem } from '@/domain/Problem';
import { IProblemRepository } from '@/domain/repositories/IProblemRepository';
import { getInMemoryProblems, setInMemoryProblems } from './dataStore';
import { v4 as uuidv4 } from 'uuid';

export class InMemoryProblemRepository implements IProblemRepository {
  async getAll(): Promise<Problem[]> {
    const problems = getInMemoryProblems();
    return Promise.resolve(
      [...problems].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    );
  }

  async findById(id: string): Promise<Problem | null> {
    const problems = getInMemoryProblems();
    const problem = problems.find(p => p.id === id) || null;
    return Promise.resolve(problem);
  }

  async add(problemData: Omit<Problem, 'id' | 'timestamp'>): Promise<Problem> {
    const problems = getInMemoryProblems();
    const newProblem: Problem = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      ...problemData,
    };
    setInMemoryProblems([...problems, newProblem]);
    return Promise.resolve(newProblem);
  }

  async update(id: string, data: Partial<Omit<Problem, 'id' | 'timestamp'>>): Promise<Problem | null> {
    let problems = getInMemoryProblems();
    const index = problems.findIndex(p => p.id === id);
    if (index !== -1) {
      const originalProblem = problems[index];
      problems[index] = {
        ...originalProblem,
        ...data,
        id: originalProblem.id, 
        timestamp: originalProblem.timestamp 
      };
      setInMemoryProblems([...problems]);
      return Promise.resolve(problems[index]);
    }
    return Promise.resolve(null);
  }

  async delete(id: string): Promise<boolean> {
    let problems = getInMemoryProblems();
    const initialLength = problems.length;
    const filteredProblems = problems.filter(p => p.id !== id);
    if (filteredProblems.length < initialLength) {
      setInMemoryProblems(filteredProblems);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
} 