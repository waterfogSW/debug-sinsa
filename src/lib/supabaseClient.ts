import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase URL or Anon Key is missing. Supabase client not initialized.');
  // 목업 환경에서는 null 클라이언트를 사용하거나, 아래와 같이 기본 객체를 제공할 수 있습니다.
  // 이 경우, 실제 Supabase 호출을 시도하는 코드에서 null 체크가 필요합니다.
  supabaseInstance = null; // 또는 new SupabaseClient("http://localhost:54321", "dummy_key") 같은 더미 인스턴스
}

export const supabase = supabaseInstance; 