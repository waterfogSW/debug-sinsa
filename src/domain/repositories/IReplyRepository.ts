import { Reply } from '../Reply';

export interface IReplyRepository {
  /** 특정 Problem에 달린 모든 Reply를 가져옵니다. */
  findByProblemId(problemId: string): Promise<Reply[]>;

  /** 전체 Reply 개수를 가져옵니다. */
  countAll(): Promise<number>;

  /** 새로운 Reply를 추가합니다. author는 내부적으로 결정됩니다. */
  add(replyData: Omit<Reply, 'id' | 'timestamp' | 'author'>): Promise<Reply>;
  
  // 필요에 따라 findById, update, delete 등 추가 가능
} 
