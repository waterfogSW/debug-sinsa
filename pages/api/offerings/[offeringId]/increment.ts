import type { NextApiRequest, NextApiResponse } from 'next';
import { OfferingService } from '@/application/services/OfferingService';
import { OfferingId } from '@/common/enums/OfferingId';

const offeringService = new OfferingService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { offeringId } = req.query;

  if (!offeringId || typeof offeringId !== 'string' || !Object.values(OfferingId).includes(offeringId as OfferingId)) {
    return res.status(400).json({ message: 'Invalid offering ID.' });
  }

  const offeringEnumId = offeringId as OfferingId;

  try {
    const updatedOffering = await offeringService.incrementOffering(offeringEnumId);
    if (updatedOffering) {
      res.status(200).json(updatedOffering);
    } else {
      res.status(404).json({ message: `Offering with id '${offeringEnumId}' not found or failed to update.` });
    }
  } catch (error) {
    console.error(`[API Error] Failed to increment offering ${offeringEnumId}:`, error);
    res.status(500).json({ message: `Failed to increment offering '${offeringEnumId}'` });
  }
} 