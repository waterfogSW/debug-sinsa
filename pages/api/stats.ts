import type { NextApiRequest, NextApiResponse } from 'next';
import { StatService } from '@/application/services/StatService';
// import { Stat } from '@/domain/Stat'; // Stat 타입은 서비스 응답에 포함되므로 직접 사용 안 할 수 있음

const statService = new StatService(); // 실제로는 요청마다 생성하거나 싱글톤으로 관리

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const stats = await statService.getAllStats();
      res.status(200).json(stats);
    } catch (error) {
      console.error('[API Error] Failed to get stats:', error);
      res.status(500).json({ message: 'Failed to retrieve stats' });
    }
  } else if (req.method === 'POST') {
    const { id, increment } = req.body;

    if (!id || typeof increment !== 'number') {
      return res.status(400).json({ message: 'Invalid request body: id and increment (number) are required.' });
    }

    try {
      const updatedStat = await statService.incrementStatValue(id, increment);
      if (updatedStat) {
        res.status(200).json(updatedStat);
      } else {
        res.status(404).json({ message: `Stat with id '${id}' not found or failed to update.` });
      }
    } catch (error) {
      console.error(`[API Error] Failed to update stat ${id}:`, error);
      res.status(500).json({ message: `Failed to update stat '${id}'` });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 