import type { NextApiRequest, NextApiResponse } from 'next';
import { OfferingService } from '@/application/services/OfferingService';
import { OfferingId } from '@/common/enums/OfferingId';

const offeringService = new OfferingService(); 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const offerings = await offeringService.getAllOfferings();
      res.status(200).json(offerings);
    } catch (error) {
      console.error('[API Error] Failed to get offerings:', error);
      res.status(500).json({ message: 'Failed to retrieve offerings' });
    }
  } else if (req.method === 'POST') {
    const { id } = req.body; 

    if (!id || !Object.values(OfferingId).includes(id as OfferingId)) {
      return res.status(400).json({ message: 'Invalid request body: valid offering id (string from OfferingId enum) is required.' });
    }

    const offeringEnumId = id as OfferingId;

    try {
      const updatedOffering = await offeringService.incrementOffering(offeringEnumId);
      if (updatedOffering) {
        // API 호출 결과로 통계가 업데이트 되었으므로, StatsSection 등에서 customStatUpdate 이벤트를 통해 re-fetch 하도록 함
        // (이벤트 dispatch 로직은 프론트엔드 호출부에서 관리되거나, 여기서 특정 헤더/바디를 통해 신호를 줄 수 있음)
        res.status(200).json(updatedOffering);
      } else {
        res.status(404).json({ message: `Offering with id '${offeringEnumId}' not found or failed to update.` });
      }
    } catch (error) {
      console.error(`[API Error] Failed to increment offering ${offeringEnumId}:`, error);
      res.status(500).json({ message: `Failed to increment offering '${offeringEnumId}'` });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 