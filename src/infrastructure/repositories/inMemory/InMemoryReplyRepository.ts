import { Reply } from '@/domain/Reply';
import { IReplyRepository } from '@/domain/repositories/IReplyRepository';
import { getInMemoryReplies, setInMemoryReplies, getNextShrineNumber } from './dataStore'; // dataStore 함수 임포트
import { v4 as uuidv4 } from 'uuid';

export class InMemoryReplyRepository implements IReplyRepository {
  async findByProblemId(problemId: string): Promise<Reply[]> {
    const replies = getInMemoryReplies();
    const problemReplies = replies.filter((reply: Reply) => reply.problemId === problemId);
    // 최신 답변이 먼저 보이도록 정렬 (timestamp 내림차순)
    return Promise.resolve(
      [...problemReplies].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    );
  }

  async add(replyData: Omit<Reply, 'id' | 'timestamp' | 'author'>): Promise<Reply> {
    const replies = getInMemoryReplies();
    const newReply: Reply = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      author: `신령 ${getNextShrineNumber()}호`, // 작성자 이름 내부 생성
      ...replyData,
    };
    setInMemoryReplies([...replies, newReply]);
    return Promise.resolve(newReply);
  }
} 