import { Offering } from '@/domain/Offering';
import { IOfferingRepository } from '@/domain/repositories/IOfferingRepository';
import { supabase } from '@/lib/supabaseClient';
import { OfferingId } from '@/common/enums/OfferingId';

export class SupabaseOfferingRepository implements IOfferingRepository {
  async getAll(): Promise<Offering[]> {
    try {
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }
      const { data, error } = await supabase.from('offerings').select('*');

      if (error) {
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching offerings:', error);
      throw error;
    }
  }

  async findById(id: OfferingId): Promise<Offering | null> {
    try {
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }
      const { data, error } = await supabase
        .from('offerings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        // 'data'가 null일 수 있으므로 'single()'에서는 에러로 처리하지 않을 수 있습니다.
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data;
    } catch (error) {
      console.error(`Unexpected error fetching offering by id ${id}:`, error);
      throw error;
    }
  }
  
  async update(offering: Offering): Promise<Offering | null> {
    try {
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }
      const { data, error } = await supabase
        .from('offerings')
        .update({ count: offering.count })
        .eq('id', offering.id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      console.error(`Unexpected error updating offering ${offering.id}:`, error);
      throw error;
    }
  }

  async getTotalCount(): Promise<number> {
    try {
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }
      const { data, error } = await supabase.from('offerings').select('count');

      if (error) {
        throw error;
      }

      return data?.reduce((acc, o) => acc + o.count, 0) || 0;
    } catch (error) {
      console.error('Unexpected error getting total offering count:', error);
      throw error;
    }
  }
} 