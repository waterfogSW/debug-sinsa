import { Offering } from '@/domain/Offering';
import { OfferingId } from '@/common/enums/OfferingId';
import { IOfferingRepository } from '@/domain/repositories/IOfferingRepository';
import { SupabaseOfferingRepository } from '@/infrastructure/repositories/supabase/SupabaseOfferingRepository';

export class OfferingService {
  private offeringRepository: IOfferingRepository;

  constructor() {
    this.offeringRepository = new SupabaseOfferingRepository();
  }

  async getAllOfferings(): Promise<Offering[]> {
    return this.offeringRepository.getAll();
  }

  async getOfferingById(id: OfferingId): Promise<Offering | null> {
    return this.offeringRepository.findById(id);
  }

  async incrementOffering(id: OfferingId): Promise<Offering | null> {
    const offering = await this.offeringRepository.findById(id);
    if (!offering) {
      // 또는 특정 에러를 던질 수 있습니다.
      return null;
    }

    offering.count += 1;
    
    return this.offeringRepository.update(offering);
  }
}
