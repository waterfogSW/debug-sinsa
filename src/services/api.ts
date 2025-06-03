import { Stat } from '@/domain/Stat';
import { Offering } from '@/domain/Offering';
import { Problem } from '@/domain/Problem';
import { OfferingId } from '@/common/enums/OfferingId';
import { Reply } from '@/domain/Reply';
import { supabase } from '@/lib/supabaseClient'; // Supabase 클라이언트 import

const API_BASE_URL = '/api';

// Stats API
export const getStats = async (): Promise<Stat[]> => {
  try {
    const { data, error } = await supabase.from('stats').select('*');

    if (error) {
      console.error('Error fetching stats from Supabase:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching stats:', error);
    return [];
  }
};

export const updateStat = async (id: string, value: number): Promise<Stat | null> => {
  try {
    const { data, error } = await supabase
      .from('stats')
      .update({ value })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating stat in Supabase:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Unexpected error updating stat:', error);
    return null;
  }
};

// Offerings API
export const getOfferings = async (): Promise<Offering[]> => {
  try {
    const { data, error } = await supabase.from('offerings').select('*');

    if (error) {
      console.error('Error fetching offerings from Supabase:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching offerings:', error);
    return [];
  }
};

export const incrementOfferingCount = async (id: OfferingId): Promise<Offering | null> => {
  try {
    const { data: currentOffering, error: fetchError } = await supabase
      .from('offerings')
      .select('count')
      .eq('id', id)
      .single();

    if (fetchError || !currentOffering) {
      console.error('Error fetching current offering count from Supabase:', fetchError);
      return null;
    }

    const newCount = currentOffering.count + 1;

    const { data: updatedData, error: updateError } = await supabase
      .from('offerings')
      .update({ count: newCount })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error incrementing offering count in Supabase:', updateError);
      return null;
    }
    return updatedData;
  } catch (error) {
    console.error('Unexpected error incrementing offering count:', error);
    return null;
  }
};

// Problems API
export const getProblems = async (limit?: number): Promise<Problem[]> => {
  try {
    let query = supabase.from('problems').select('*').order('timestamp', { ascending: false });
    if (limit) {
      query = query.limit(limit);
    }
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching problems from Supabase:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching problems:', error);
    return [];
  }
};

export const createProblem = async (content: string, author?: string): Promise<Problem | null> => {
  try {
    const problemToInsert = {
      content,
      author: author || '익명의 나그네',
      timestamp: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('problems')
      .insert([problemToInsert])
      .select()
      .single();

    if (error) {
      console.error('Error creating problem in Supabase:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Unexpected error creating problem:', error);
    return null;
  }
};

/** 특정 고민에 대한 답변 목록을 가져옵니다. */
export const getReplies = async (problemId: string): Promise<Reply[]> => {
  try {
    const response = await fetch(`/api/replies?problemId=${encodeURIComponent(problemId)}`);
    if (!response.ok) {
      console.error('Failed to fetch replies:', response.status, await response.text());
      return [];
    }
    const data = await response.json();
    return data as Reply[];
  } catch (error) {
    console.error('Error fetching replies:', error);
    return [];
  }
};

/** 새로운 답변을 생성합니다. */
export const createReply = async (problemId: string, content: string): Promise<Reply | null> => {
  try {
    const response = await fetch('/api/replies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ problemId, content }),
    });
    if (!response.ok) {
      console.error('Failed to create reply:', response.status, await response.text());
      return null;
    }
    const newReply = await response.json();
    return newReply as Reply;
  } catch (error) {
    console.error('Error creating reply:', error);
    return null;
  }
}; 