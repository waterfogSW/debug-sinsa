import { Offering } from '@/domain/Offering';
import { OfferingId } from '@/common/enums/OfferingId';
import { IOfferingRepository } from '@/domain/repositories/IOfferingRepository';
import { InMemoryOfferingRepository } from '@/infrastructure/repositories/inMemory/InMemoryOfferingRepository';
import { StatService } from './StatService'; // StatService 주입 (통계 업데이트용)

// 기존 pages/api/offerings.ts 에 있던 매핑 로직
// "보고된 버그 수"와 "신령 출몰 횟수"는 공물과 직접 연관되지 않으므로, 이 맵은 비워둡니다.
const offeringToStatIdMap: Partial<Record<OfferingId, string>> = {
  // [OfferingId.Coffee]: 'coffeeConsumed', // 삭제
  // [OfferingId.RubberDuck]: 'rubberDucks', // 삭제
  // [OfferingId.EnergyDrink]: 'energyDrinks', // 삭제
  // [OfferingId.Monitor]: 'monitors', // 삭제
};

export class OfferingService {
  private offeringRepository: IOfferingRepository;
  private statService: StatService; // StatService 의존성 추가

  constructor() {
    this.offeringRepository = new InMemoryOfferingRepository();
    this.statService = new StatService(); // 직접 생성 (DI 컨테이너 사용 권장)
  }

  async getAllOfferings(): Promise<Offering[]> {
    return this.offeringRepository.getAll();
  }

  async getOfferingById(id: OfferingId): Promise<Offering | null> {
    return this.offeringRepository.findById(id);
  }

  async incrementOffering(id: OfferingId): Promise<Offering | null> {
    // InMemoryOfferingRepository에 incrementCount가 있으므로 활용
    let updatedOffering: Offering | null = null;
    if (this.offeringRepository instanceof InMemoryOfferingRepository) {
        updatedOffering = await this.offeringRepository.incrementCount(id);
    } else {
        // 일반적인 update 방식 (incrementCount가 없다고 가정시)
        const offering = await this.offeringRepository.findById(id);
        if (offering) {
            offering.count += 1;
            updatedOffering = await this.offeringRepository.update(offering);
        } else {
            return null; // 존재하지 않는 공물
        }
    }

    if (!updatedOffering) {
        return null;
    }

    // 연관된 통계 업데이트
    const statIdToUpdate = offeringToStatIdMap[id];
    if (statIdToUpdate) {
      // StatService를 통해 통계 업데이트
      await this.statService.incrementStatValue(statIdToUpdate, 1);
    } else {
      // 매핑되는 statId가 없을 경우, 예를 들어 OfferingId.Hair는 stat과 연결되지 않음.
      // 이 경우에는 아무 작업도 하지 않거나 로깅 등을 할 수 있습니다.
      // console.log(`No stat mapping found for offering ID: ${id}`);
    }

    return updatedOffering;
  }
} 