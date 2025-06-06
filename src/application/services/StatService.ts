import { Stat } from '@/domain/Stat';
import { IProblemRepository } from '@/domain/repositories/IProblemRepository';
import { IReplyRepository } from '@/domain/repositories/IReplyRepository';
import { IOfferingRepository } from '@/domain/repositories/IOfferingRepository';
import { SupabaseProblemRepository } from '@/infrastructure/repositories/supabase/SupabaseProblemRepository';
import { SupabaseReplyRepository } from '@/infrastructure/repositories/supabase/SupabaseReplyRepository';
import { SupabaseOfferingRepository } from '@/infrastructure/repositories/supabase/SupabaseOfferingRepository';
import { DEFAULT_STATS } from '@/common/constants/defaultValues';

export class StatService {
  private problemRepository: IProblemRepository;
  private replyRepository: IReplyRepository;
  private offeringRepository: IOfferingRepository;

  constructor() {
    this.problemRepository = new SupabaseProblemRepository();
    this.replyRepository = new SupabaseReplyRepository();
    this.offeringRepository = new SupabaseOfferingRepository();
  }

  async getLiveStats(): Promise<Stat[]> {
    try {
      const [bugsFixed, shrineVisits, offeringsMade] = await Promise.all([
        this.problemRepository.countAll(),
        this.replyRepository.countAll(),
        this.offeringRepository.getTotalCount(),
      ]);

      const statsMap: Record<string, number> = {
        bugsFixed,
        shrineVisits,
        offeringsMade,
      };

      return DEFAULT_STATS.map(stat => ({
        ...stat,
        value: statsMap[stat.id] ?? 0,
      }));

    } catch (error) {
      console.error('Unexpected error fetching live stats:', error);
      // 에러 발생 시 기본 통계 값을 반환하여 UI 깨짐 방지
      return DEFAULT_STATS;
    }
  }
} 