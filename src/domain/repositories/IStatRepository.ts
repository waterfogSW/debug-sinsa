import { Stat } from '../Stat';

export interface IStatRepository {
  getAll(): Promise<Stat[]>;
  findById(id: string): Promise<Stat | null>;
  update(stat: Stat): Promise<Stat | null>; // 전체 Stat 객체를 받거나, ID와 업데이트할 값만 받을 수 있음
  // 필요에 따라 다른 메소드 추가 (예: updateValue(id: string, increment: number))
} 