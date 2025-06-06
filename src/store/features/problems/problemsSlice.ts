import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Problem } from '@/domain/Problem';
import {
  getProblems as fetchProblemsAPI,
  createProblem as createProblemAPI 
} from '@/services/api';
import { RootState } from '@/store/store';
import { fetchStats } from '../stats/statsSlice';

type CreateProblemApiResponse = { newProblem: Problem } | null;

interface ProblemsState {
  items: Problem[];
  fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  fetchError: string | null;
  createError: string | null;
}

const initialState: ProblemsState = {
  items: [],
  fetchStatus: 'idle',
  createStatus: 'idle',
  fetchError: null,
  createError: null,
};

export const fetchProblems = createAsyncThunk(
  'problems/fetchProblems',
  async (limit?: number) => {
    const response = await fetchProblemsAPI(limit);
    return response || [];
  }
);

export const createProblem = createAsyncThunk<Problem, { content: string; author?: string }>(
  'problems/createProblem',
  async ({ content, author }, { dispatch }) => {
    const response: Problem | null = await createProblemAPI(content, author);

    if (response) {
      dispatch(fetchProblems());
      dispatch(fetchStats());
      return response;
    } else {
      throw new Error('Failed to create problem (API returned null or invalid response)');
    }
  }
);

const problemsSlice = createSlice({
  name: 'problems',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProblems.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(fetchProblems.fulfilled, (state, action: PayloadAction<Problem[]>) => {
        state.fetchStatus = 'succeeded';
        state.items = action.payload;
        state.fetchError = null;
      })
      .addCase(fetchProblems.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.fetchError = action.error.message || 'Failed to fetch problems';
      })
      .addCase(createProblem.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(createProblem.fulfilled, (state) => {
        state.createStatus = 'succeeded';
      })
      .addCase(createProblem.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.error.message || 'Failed to create problem';
      });
  },
});

export const selectAllProblems = (state: RootState) => state.problems.items;
export const selectProblemsFetchStatus = (state: RootState) => state.problems.fetchStatus;
export const selectProblemsFetchError = (state: RootState) => state.problems.fetchError;
export const selectProblemCreateStatus = (state: RootState) => state.problems.createStatus;
export const selectProblemCreateError = (state: RootState) => state.problems.createError;

export default problemsSlice.reducer;