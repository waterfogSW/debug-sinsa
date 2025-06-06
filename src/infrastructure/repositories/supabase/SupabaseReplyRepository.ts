import { Reply } from '@/domain/Reply';
import { IReplyRepository } from '@/domain/repositories/IReplyRepository';
import { supabase } from '@/lib/supabaseClient';

export class SupabaseReplyRepository implements IReplyRepository {
  async findByProblemId(problemId: string): Promise<Reply[]> {
    try {
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }
      const { data, error } = await supabase
        .from('replies')
        .select('*')
        .eq('problem_id', problemId)
        .order('timestamp', { ascending: true });

      if (error) {
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error(`Unexpected error fetching replies for problem ${problemId}:`, error);
      throw error;
    }
  }

  async countAll(): Promise<number> {
    try {
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }
      const { count, error } = await supabase
        .from('replies')
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw error;
      }
      return count ?? 0;
    } catch (error) {
      console.error('Unexpected error counting replies:', error);
      throw error;
    }
  }

  async add(replyData: Omit<Reply, 'id' | 'timestamp' | 'author'>): Promise<Reply> {
    try {
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }
      const replyToInsert = {
        ...replyData,
        author: '신령', // 또는 다른 로직으로 저자 설정
        timestamp: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('replies')
        .insert([replyToInsert])
        .select()
        .single();

      if (error || !data) {
        throw new Error('Failed to create reply.');
      }
      return data;
    } catch (error) {
      console.error('Unexpected error creating reply:', error);
      throw error;
    }
  }
} 