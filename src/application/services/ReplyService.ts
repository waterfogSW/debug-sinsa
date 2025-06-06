import { Reply } from '@/domain/Reply';
import { IReplyRepository } from '@/domain/repositories/IReplyRepository';
import { InMemoryReplyRepository } from '@/infrastructure/repositories/inMemory/InMemoryReplyRepository';

export class ReplyService {
  private replyRepository: IReplyRepository;

  constructor() {
    this.replyRepository = new InMemoryReplyRepository();
  }

  async getRepliesByProblemId(problemId: string): Promise<Reply[]> {
    return this.replyRepository.findByProblemId(problemId);
  }

  async createReply(replyData: Omit<Reply, 'id' | 'timestamp' | 'author'>): Promise<Reply> {
    const newReply = await this.replyRepository.add(replyData);

    return newReply;
  }
}