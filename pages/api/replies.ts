import type { NextApiRequest, NextApiResponse } from 'next';
import { ReplyService } from '@/application/services/ReplyService';
import { Reply } from '@/domain/Reply';

const replyService = new ReplyService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { problemId } = req.query;
    if (typeof problemId !== 'string') {
      return res.status(400).json({ message: 'Problem ID must be a string.' });
    }
    try {
      const replies = await replyService.getRepliesByProblemId(problemId);
      res.status(200).json(replies);
    } catch (error) {
      console.error(`[API Error] Failed to get replies for problem ${problemId}:`, error);
      res.status(500).json({ message: 'Failed to retrieve replies' });
    }
  } else if (req.method === 'POST') {
    const { problemId, content } = req.body;

    if (typeof problemId !== 'string' || !problemId.trim()) {
      return res.status(400).json({ message: 'Valid Problem ID is required.' });
    }
    if (typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ message: 'Content cannot be empty.' });
    }

    try {
      const replyData = {
        problem_id: problemId,
        content,
      };
      const newReply = await replyService.createReply(replyData);
      // 답변 생성 성공 시, 관련 통계(shrineVisits)가 업데이트 되었으므로
      // 프론트엔드에서 customStatUpdate 이벤트를 발생시켜 StatsSection을 업데이트 하도록 유도할 수 있음
      // (이벤트 dispatch는 프론트엔드 호출부에서 관리)
      res.status(201).json(newReply);
    } catch (error) {
      console.error('[API Error] Failed to create reply:', error);
      res.status(500).json({ message: 'Failed to create reply' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 
