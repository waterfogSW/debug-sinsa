import { Stat } from '@/domain/Stat';
import { Offering } from '@/domain/Offering';
import { OfferingId } from '@/common/enums/OfferingId';

export const DEFAULT_STATS: Stat[] = [
  { id: 'bugsFixed', value: 0, label: '보고된 버그 수', icon: '🐞' },
  { id: 'shrineVisits', value: 0, label: '신령 출몰 횟수', icon: '⛩️' },
  { id: 'offeringsMade', value: 0, label: '바친 공물 총계', icon: '🎁' },
];

export const DEFAULT_OFFERINGS: Offering[] = [
  { id: OfferingId.Coffee, name: '커피', icon: '☕', count: 0 },
  { id: OfferingId.PlannerSeal, name: '기획자 봉인 부적', icon: '📜', count: 0 },
  { id: OfferingId.EnergyDrink, name: '에너지 드링크', icon: '🥤', count: 0 },
  { id: OfferingId.Hair, name: '달아난 머리카락', icon: '💇', count: 0 },
  { id: OfferingId.Monitor, name: '모니터', icon: '🖥️', count: 0 },
]; 