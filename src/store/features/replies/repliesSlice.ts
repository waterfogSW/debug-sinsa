import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Reply } from '@/domain/Reply';
import { RootState } from '@/store/store';
import { fetchStats } from '../stats/statsSlice';

interface RepliesState {
  itemsByProblemId: Record<string, Reply[]>; // 문제 ID별 답변 목록 저장
  fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  fetchError: string | null;
  createError: string | null;
  currentProblemId: string | null; // 현재 로드/생성 중인 문제 ID
}

const initialState: RepliesState = {
  itemsByProblemId: {},
  fetchStatus: 'idle',
  createStatus: 'idle',
  fetchError: null,
  createError: null,
  currentProblemId: null,
};

// 특정 문제에 대한 답변 목록을 가져오는 thunk
export const fetchReplies = createAsyncThunk(
  'replies/fetchReplies',
  async (problemId: string) => {
    const response = await fetch(`/api/replies?problemId=${encodeURIComponent(problemId)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch replies');
    }
    const replies = await response.json();
    return { problemId, replies: replies || [] };
  }
);

// 새로운 답변을 생성하는 thunk
export const createReply = createAsyncThunk(
  'replies/createReply',
  async ({ problemId, content }: { problemId: string; content: string }, { dispatch }) => {
    const response = await fetch('/api/replies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problemId, content }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create reply');
    }
    
    const newReply = await response.json();

    dispatch(fetchReplies(problemId));
    dispatch(fetchStats());
    return newReply;
  }
);

const repliesSlice = createSlice({
  name: 'replies',
  initialState,
  reducers: {
    clearRepliesForProblem: (state, action: PayloadAction<string>) => {
      if (state.itemsByProblemId[action.payload]) {
        delete state.itemsByProblemId[action.payload];
      }
    },
    resetCreateStatus: (state) => {
      state.createStatus = 'idle';
      state.createError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchReplies thunk 상태 처리
      .addCase(fetchReplies.pending, (state, action) => {
        state.fetchStatus = 'loading';
        state.currentProblemId = action.meta.arg;
        state.fetchError = null;
      })
      .addCase(fetchReplies.fulfilled, (state, action: PayloadAction<{ problemId: string; replies: Reply[] }>) => {
        state.fetchStatus = 'succeeded';
        state.itemsByProblemId[action.payload.problemId] = action.payload.replies;
        if (state.currentProblemId === action.payload.problemId) {
          state.currentProblemId = null; 
        }
      })
      .addCase(fetchReplies.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        if (state.currentProblemId === action.meta.arg) {
            state.fetchError = action.error.message || 'Failed to fetch replies';
            state.currentProblemId = null;
        }
      })
      // createReply thunk 상태 처리
      .addCase(createReply.pending, (state, action) => {
        state.createStatus = 'loading';
        state.currentProblemId = action.meta.arg.problemId;
        state.createError = null;
      })
      .addCase(createReply.fulfilled, (state, action: PayloadAction<Reply, string, { arg: { problemId: string; content: string } }>) => {
        state.createStatus = 'succeeded';
        if (state.currentProblemId === action.meta.arg.problemId) {
            state.currentProblemId = null;
        }
      })
      .addCase(createReply.rejected, (state, action) => {
        state.createStatus = 'failed';
        if (state.currentProblemId === action.meta.arg.problemId) {
            state.createError = action.error.message || 'Failed to create reply';
            state.currentProblemId = null;
        }
      });
  },
});

export const { clearRepliesForProblem, resetCreateStatus } = repliesSlice.actions;

// 특정 문제 ID에 대한 답변 목록을 선택하는 selector
export const selectRepliesByProblemId = (state: RootState, problemId: string) => state.replies.itemsByProblemId[problemId] || [];
export const selectRepliesFetchStatus = (state: RootState) => state.replies.fetchStatus;
export const selectRepliesFetchError = (state: RootState) => state.replies.fetchError;
export const selectRepliesCreateStatus = (state: RootState) => state.replies.createStatus;
export const selectRepliesCreateError = (state: RootState) => state.replies.createError;
export const selectCurrentProblemIdForReplies = (state: RootState) => state.replies.currentProblemId;

export default repliesSlice.reducer; 
