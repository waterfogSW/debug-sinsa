import { Problem } from '@/domain/Problem';
import { IProblemRepository } from '@/domain/repositories/IProblemRepository';
import { InMemoryProblemRepository } from '@/infrastructure/repositories/inMemory/InMemoryProblemRepository';
import { StatService } from './StatService'; // StatService 임포트

export class ProblemService {
  private problemRepository: IProblemRepository;
  private statService: StatService; // StatService 의존성 추가

  constructor() {
    this.problemRepository = new InMemoryProblemRepository();
    this.statService = new StatService(); // StatService 인스턴스 생성
  }

  async getAllProblems(limit?: number): Promise<Problem[]> {
    const problems = await this.problemRepository.getAll();
    // 최신 고민이 위로 오도록 정렬 (timestamp 내림차순)
    const sortedProblems = problems.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return limit ? sortedProblems.slice(0, limit) : sortedProblems;
  }

  async createProblem(content: string, authorInput?: string): Promise<{ newProblem: Problem; updatedStats?: any }> {
    if (!content.trim()) {
      throw new Error('Content cannot be empty.');
    }
    const author = authorInput?.trim() || `익명의 나그네(${Math.floor(Math.random() * 1000)})`;
    
    const newProblemData: Omit<Problem, 'id' | 'timestamp'> = {
      content,
      author,
    };
    const newProblem = await this.problemRepository.add(newProblemData);

    // "신령 출몰 횟수" 통계 업데이트는 답변 기능으로 이동
    try {
      // await this.statService.incrementStatValue('shrineVisits', 1); // 이 부분 제거 또는 주석 처리
      // "보고된 버그 수" 통계만 업데이트
      await this.statService.incrementStatValue('bugsFixed', 1);
    } catch (error) {
      console.error('Failed to update stats after creating problem:', error);
      // 에러가 발생해도 고민 생성 자체는 성공한 것으로 처리할 수 있음
    }
    
    // updatedStats는 이제 ProblemService에서 직접 반환하지 않아도 됨.
    // StatService가 알아서 업데이트하고, 프론트엔드는 customStatUpdate 이벤트를 통해 StatsSection을 새로고침.
    return { newProblem };
  }
} 