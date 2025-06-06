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
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 