import { Offering } from '../Offering';
import { OfferingId } from '../OfferingId';

export interface IOfferingRepository {
  getAll(): Promise<Offering[]>;
  findById(id: OfferingId): Promise<Offering | null>;
  update(offering: Offering): Promise<Offering | null>;
  // 필요에 따라 다른 메소드 추가 (예: incrementCount(id: OfferingId))
} 