import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Stat } from '@/domain/Stat';
import { getStats as fetchStatsAPI } from '@/services/api';
import { DEFAULT_STATS } from '@/common/constants/defaultValues';
import { RootState } from '@/store/store';

export type StatId = 'bugsFixed' | 'shrineVisits' | 'offeringsMade';

interface StatsState {
  items: Stat[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: StatsState = {
  items: DEFAULT_STATS,
  status: 'idle',
  error: null,
};

export const fetchStats = createAsyncThunk('stats/fetchStats', async () => {
  const response = await fetchStatsAPI();
  return response || [];
});

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStats.fulfilled, (state, action: PayloadAction<Stat[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null; 
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch stats';
      });
  },
});

export const selectAllStats = (state: RootState) => state.stats.items;
export const selectStatsStatus = (state: RootState) => state.stats.status;
export const selectStatsError = (state: RootState) => state.stats.error;

export default statsSlice.reducer;