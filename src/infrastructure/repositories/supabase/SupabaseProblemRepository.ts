import { Problem } from '@/domain/Problem';
import { IProblemRepository } from '@/domain/repositories/IProblemRepository';
import { supabase } from '@/lib/supabaseClient';

export class SupabaseProblemRepository implements IProblemRepository {
  async getAll(options: { limit: number; cursor?: string }): Promise<{ problems: Problem[]; nextCursor: string | null }> {
    try {
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }

      let query = supabase
        .from('problems')
        .select('*, replies(count)')
        .order('timestamp', { ascending: false })
        .limit(options.limit);

      if (options.cursor) {
        query = query.lt('timestamp', options.cursor);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const problems = data || [];
      let nextCursor: string | null = null;
      if (problems.length === options.limit) {
        nextCursor = problems[problems.length - 1].timestamp;
      }

      return { problems, nextCursor };
    } catch (error) {
      console.error('Unexpected error fetching problems:', error);
      throw error;
    }
  }

  async countAll(): Promise<number> {
    try {
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }
      const { count, error } = await supabase
        .from('problems')
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw error;
      }
      return count ?? 0;
    } catch (error) {
      console.error('Unexpected error counting problems:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Problem | null> {
    // TODO: Implement findById
    throw new Error('Method not implemented.');
  }

  async add(problemData: Omit<Problem, 'id' | 'timestamp' | 'replies'>): Promise<Problem> {
    try {
      if (!supabase) {
        console.error('Supabase client is not initialized');
        throw new Error('Supabase client is not initialized');
      }
      const problemToInsert = {
        ...problemData,
        timestamp: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('problems')
        .insert([problemToInsert])
        .select()
        .single();

      if (error || !data) {
        console.error('Error creating problem in Supabase:', error);
        throw new Error('Failed to create problem.');
      }
      return data;
    } catch (error) {
      console.error('Unexpected error creating problem:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Problem>): Promise<Problem | null> {
    // TODO: Implement update
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<boolean> {
    // TODO: Implement delete
    throw new Error('Method not implemented.');
  }
} 