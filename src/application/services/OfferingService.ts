import { Offering } from '@/domain/Offering';
import { OfferingId } from '@/common/enums/OfferingId';
import { IOfferingRepository } from '@/domain/repositories/IOfferingRepository';
import { InMemoryOfferingRepository } from '@/infrastructure/repositories/inMemory/InMemoryOfferingRepository';

export class OfferingService {
  private offeringRepository: IOfferingRepository;

  constructor() {
    this.offeringRepository = new InMemoryOfferingRepository();
  }

  async getAllOfferings(): Promise<Offering[]> {
    return this.offeringRepository.getAll();
  }

  async getOfferingById(id: OfferingId): Promise<Offering | null> {
    return this.offeringRepository.findById(id);
  }

  async incrementOffering(id: OfferingId): Promise<Offering | null> {
    let updatedOffering: Offering | null = null;
    if (this.offeringRepository instanceof InMemoryOfferingRepository) {
        updatedOffering = await this.offeringRepository.incrementCount(id);
    } else {
        const offering = await this.offeringRepository.findById(id);
        if (offering) {
            offering.count += 1;
            updatedOffering = await this.offeringRepository.update(offering);
        } else {
            return null;
        }
    }

    if (!updatedOffering) {
        return null;
    }

    return updatedOffering;
  }
}