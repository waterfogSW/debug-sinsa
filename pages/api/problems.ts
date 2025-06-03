import type { NextApiRequest, NextApiResponse } from 'next';
import { ProblemService } from '@/application/services/ProblemService';

const problemService = new ProblemService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const problems = await problemService.getAllProblems();
      res.status(200).json(problems);
    } catch (error) {
      console.error('[API Error] Failed to get problems:', error);
      res.status(500).json({ message: 'Failed to retrieve problems' });
    }
  } else if (req.method === 'POST') {
    const { content, author } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ message: 'Invalid request body: content (string) is required.' });
    }

    try {
      const result = await problemService.createProblem(content, author);
      // result에는 newProblem과 updatedStats가 포함됨
      // API 호출 결과로 통계가 업데이트 되었으므로, StatsSection 등에서 customStatUpdate 이벤트를 통해 re-fetch 하도록 함
      res.status(201).json(result);
    } catch (error) {
      console.error('[API Error] Failed to create problem:', error);
      res.status(500).json({ message: 'Failed to create problem' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 