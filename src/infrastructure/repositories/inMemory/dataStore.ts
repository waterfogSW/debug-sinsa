import { Offering } from '@/domain/Offering';
import { Problem } from '@/domain/Problem';
import { Reply } from '@/domain/Reply';
import { OfferingId } from '@/common/enums/OfferingId';

let offerings: Offering[] = [
  { id: OfferingId.Coffee, name: '커피', icon: '☕', count: 0 },
  { id: OfferingId.PlannerSeal, name: '기획자 봉인 부적', icon: '📜', count: 0 },
  { id: OfferingId.EnergyDrink, name: '에너지 드링크', icon: '🥤', count: 0 },
  { id: OfferingId.Hair, name: '달아난 머리카락', icon: '💇', count: 0 },
  { id: OfferingId.Monitor, name: '모니터', icon: '🖥️', count: 0 },
];

let problems: Problem[] = [];
let replies: Reply[] = [];
let shrineNumber = 0;

export const getInMemoryOfferings = () => offerings;
export const setInMemoryOfferings = (newOfferings: Offering[]) => { offerings = newOfferings; };

export const getInMemoryProblems = () => problems;
export const setInMemoryProblems = (newProblems: Problem[]) => { problems = newProblems; };

export const getInMemoryReplies = () => replies;
export const setInMemoryReplies = (newReplies: Reply[]) => { replies = newReplies; };

export const getNextShrineNumber = () => {
  shrineNumber += 1;
  return shrineNumber;
}; 