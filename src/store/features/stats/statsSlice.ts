import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Stat } from '@/domain/Stat';
import { getStats as fetchStatsAPI } from '@/services/api'; // 기존 API 함수 import
import { DEFAULT_STATS } from '@/common/constants/defaultValues';
import { RootState } from '@/store/store'; // RootState 타입 import

// StatId 정의: DEFAULT_STATS에 정의된 ID들과 일치시킴.
// 'fortunesRead'는 DEFAULT_STATS에 없으므로 제거.
export type StatId = 'bugsFixed' | 'shrineVisits' | 'offeringsMade';

interface StatsState {
  items: Stat[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: StatsState = {
  items: DEFAULT_STATS, // 모든 기본 통계를 초기 상태로 설정
  status: 'idle',
  error: null,
};

// API에서 모든 통계 데이터를 가져온다고 가정 (필터링 X)
export const fetchStats = createAsyncThunk('stats/fetchStats', async () => {
  const response = await fetchStatsAPI();
  return response || []; // API가 null 반환 시 빈 배열로 처리
});

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    incrementStat: (state, action: PayloadAction<StatId>) => {
      const statToUpdate = state.items.find(stat => stat.id === action.payload);
      if (statToUpdate) {
        statToUpdate.value += 1;
      } else {
        console.warn(`Stat with id "${action.payload}" not found in state.items. Make sure it's in DEFAULT_STATS and StatId type.`);
      }
    },
    // 여러 통계 항목을 한 번에 업데이트하거나 특정 값으로 설정하는 리듀서 (필요시)
    // updateStats: (state, action: PayloadAction<Partial<Record<StatId, number>>>) => { ... }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStats.fulfilled, (state, action: PayloadAction<Stat[]>) => {
        state.status = 'succeeded';
        state.items = action.payload; // API 응답으로 전체 통계 업데이트
        state.error = null; 
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch stats';
      });
  },
});

export const { incrementStat } = statsSlice.actions;

// Selector: stats 상태를 쉽게 가져올 수 있도록 함
export const selectAllStats = (state: RootState) => state.stats.items;
export const selectStatsStatus = (state: RootState) => state.stats.status;
export const selectStatsError = (state: RootState) => state.stats.error;

// 리듀서 export
export default statsSlice.reducer; 