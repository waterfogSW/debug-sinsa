import { Stat } from '@/domain/Stat';
import { IStatRepository } from '@/domain/repositories/IStatRepository';
import { InMemoryStatRepository } from '@/infrastructure/repositories/inMemory/InMemoryStatRepository';

export class StatService {
  private statRepository: IStatRepository;

  constructor() {
    // 실제 애플리케이션에서는 DI 컨테이너를 통해 주입받는 것이 좋음
    this.statRepository = new InMemoryStatRepository();
  }

  async getAllStats(): Promise<Stat[]> {
    return this.statRepository.getAll();
  }

  async getStatById(id: string): Promise<Stat | null> {
    return this.statRepository.findById(id);
  }

  async incrementStatValue(id: string, increment: number): Promise<Stat | null> {
    const stat = await this.statRepository.findById(id);
    if (!stat) {
      // 혹은 에러를 던지거나, 특정 응답을 반환할 수 있음
      return null; 
    }
    // InMemoryStatRepository에 updateValue 메소드가 있다면 직접 호출 가능
    // 여기서는 findById 후 값을 변경하고 update를 호출하는 일반적인 방식을 따름
    // 또는 IStatRepository에 updateValue(id: string, increment: number) 같은 메소드를 추가할 수 있음
    // 현재 InMemoryStatRepository에는 updateValue가 있으므로 그것을 활용
    if (this.statRepository instanceof InMemoryStatRepository) { // 타입 체킹
        return this.statRepository.updateValue(id, increment);
    }
    // 일반적인 update 방식 (InMemoryStatRepository에 updateValue가 없다고 가정시)
    // stat.value += increment;
    // return this.statRepository.update(stat);
    return null; // InMemoryStatRepository가 아닐 경우에 대한 처리 (예시)
  }
} 