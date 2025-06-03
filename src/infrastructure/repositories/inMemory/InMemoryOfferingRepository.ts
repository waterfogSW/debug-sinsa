import { Offering } from '@/domain/Offering';
import { OfferingId } from '@/common/enums/OfferingId';
import { IOfferingRepository } from '@/domain/repositories/IOfferingRepository';
import { getInMemoryOfferings, setInMemoryOfferings } from './dataStore';

export class InMemoryOfferingRepository implements IOfferingRepository {
  async getAll(): Promise<Offering[]> {
    return Promise.resolve(getInMemoryOfferings());
  }

  async findById(id: OfferingId): Promise<Offering | null> {
    const offerings = getInMemoryOfferings();
    const offering = offerings.find(o => o.id === id) || null;
    return Promise.resolve(offering);
  }

  async update(offeringToUpdate: Offering): Promise<Offering | null> {
    let offerings = getInMemoryOfferings();
    const index = offerings.findIndex(o => o.id === offeringToUpdate.id);
    if (index !== -1) {
      offerings[index] = offeringToUpdate;
      setInMemoryOfferings([...offerings]);
      return Promise.resolve(offeringToUpdate);
    }
    return Promise.resolve(null);
  }

  async incrementCount(id: OfferingId): Promise<Offering | null> {
    let offerings = getInMemoryOfferings();
    const index = offerings.findIndex(o => o.id === id);
    if (index !== -1) {
      offerings[index].count += 1;
      setInMemoryOfferings([...offerings]);
      return Promise.resolve(offerings[index]);
    }
    return Promise.resolve(null);
  }
} 