import { Reply } from '@/domain/Reply';
import { IReplyRepository } from '@/domain/repositories/IReplyRepository';
import { SupabaseReplyRepository } from '@/infrastructure/repositories/supabase/SupabaseReplyRepository';

export class ReplyService {
  private replyRepository: IReplyRepository;

  constructor() {
    this.replyRepository = new SupabaseReplyRepository();
  }

  async getRepliesByProblemId(problemId: string): Promise<Reply[]> {
    return this.replyRepository.findByProblemId(problemId);
  }

  async createReply(replyData: Omit<Reply, 'id' | 'timestamp' | 'author'>): Promise<Reply> {
    const newReply = await this.replyRepository.add(replyData);
    return newReply;
  }
}