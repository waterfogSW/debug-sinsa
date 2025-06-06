import { Problem } from '@/domain/Problem';
import { IProblemRepository } from '@/domain/repositories/IProblemRepository';
import { supabase } from '@/lib/supabaseClient';

export class SupabaseProblemRepository implements IProblemRepository {
  async getAll(limit?: number): Promise<Problem[]> {
    try {
      if (!supabase) {
        console.error('Supabase client is not initialized');
        return [];
      }
      let query = supabase.from('problems').select('*').order('timestamp', { ascending: false });
      if (limit) {
        query = query.limit(limit);
      }
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching problems from Supabase:', error);
        throw error;
      }
      return data || [];
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

  async add(problemData: Omit<Problem, 'id' | 'timestamp'>): Promise<Problem> {
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