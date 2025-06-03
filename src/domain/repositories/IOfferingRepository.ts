import { Offering } from '../Offering';
import { OfferingId } from '@/common/enums/OfferingId';

export interface IOfferingRepository {
  getAll(): Promise<Offering[]>;
  findById(id: OfferingId): Promise<Offering | null>;
  update(offering: Offering): Promise<Offering | null>;
} 