import { Stat } from '@/domain/Stat';
import { IStatRepository } from '@/domain/repositories/IStatRepository';
import { getInMemoryStats, setInMemoryStats } from './dataStore';

export class InMemoryStatRepository implements IStatRepository {
  async getAll(): Promise<Stat[]> {
    return Promise.resolve(getInMemoryStats());
  }

  async findById(id: string): Promise<Stat | null> {
    const stats = getInMemoryStats();
    const stat = stats.find(s => s.id === id) || null;
    return Promise.resolve(stat);
  }

  async update(statToUpdate: Stat): Promise<Stat | null> {
    let stats = getInMemoryStats();
    const index = stats.findIndex(s => s.id === statToUpdate.id);
    if (index !== -1) {
      stats[index] = statToUpdate;
      setInMemoryStats([...stats]); // 새로운 배열로 교체하여 변경 감지 용이하게 (필요시)
      return Promise.resolve(statToUpdate);
    }
    return Promise.resolve(null);
  }

  // updateValue와 같은 특정 업데이트 로직은 애플리케이션 서비스에서 처리하거나 여기에 추가할 수 있음
  async updateValue(id: string, increment: number): Promise<Stat | null> {
    let stats = getInMemoryStats();
    const index = stats.findIndex(s => s.id === id);
    if (index !== -1) {
      stats[index].value += increment;
      setInMemoryStats([...stats]);
      return Promise.resolve(stats[index]);
    }
    return Promise.resolve(null);
  }
} 