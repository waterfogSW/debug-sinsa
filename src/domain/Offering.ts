import { OfferingId } from '@/common/enums/OfferingId';

export interface Offering {
  id: OfferingId;
  name: string;
  icon: string;
  count: number;
} 