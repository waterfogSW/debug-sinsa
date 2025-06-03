import { Reply } from '@/domain/Reply';
import { IReplyRepository } from '@/domain/repositories/IReplyRepository';
import { InMemoryReplyRepository } from '@/infrastructure/repositories/inMemory/InMemoryReplyRepository';
import { StatService } from './StatService';

export class ReplyService {
  private replyRepository: IReplyRepository;
  private statService: StatService;

  constructor() {
    this.replyRepository = new InMemoryReplyRepository();
    this.statService = new StatService();
  }

  async getRepliesByProblemId(problemId: string): Promise<Reply[]> {
    return this.replyRepository.findByProblemId(problemId);
  }

  async createReply(replyData: Omit<Reply, 'id' | 'timestamp' | 'author'>): Promise<Reply> {
    // author는 InMemoryReplyRepository에서 내부적으로 생성 ("신령 N호")
    const newReply = await this.replyRepository.add(replyData);

    // "신령 출몰 횟수" 통계 업데이트
    try {
      await this.statService.incrementStatValue('shrineVisits', 1);
    } catch (error) {
      console.error('Failed to update shrineVisits stat after creating reply:', error);
      // 에러가 발생해도 답글 생성 자체는 성공한 것으로 처리할 수 있음
    }

    return newReply;
  }
} 