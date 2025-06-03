import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Problem } from '@/domain/Problem';
// import { Stat } from '@/domain/Stat'; // createProblemAPI가 updatedStats를 반환하지 않으므로 Stat import 불필요
import {
  getProblems as fetchProblemsAPI,
  createProblem as createProblemAPI 
} from '@/services/api';
import { RootState } from '@/store/store';
import { incrementStat, StatId } from '../stats/statsSlice'; // incrementStat 액션 및 StatId 타입 import
// import { fetchStats } from '../stats/statsSlice'; // Stats 업데이트를 위해 필요시 import

// createProblemAPI의 실제 반환 타입에 맞춘 정의
// 성공: { newProblem: Problem }
// 실패: null
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

// fetchProblems thunk가 limit 파라미터(선택적)를 받도록 수정
export const fetchProblems = createAsyncThunk(
  'problems/fetchProblems',
  async (limit?: number) => { // limit 파라미터 추가
    const response = await fetchProblemsAPI(limit); // API 호출 시 limit 전달
    return response || [];
  }
);

export const createProblem = createAsyncThunk<Problem, { content: string; author?: string }>(
  'problems/createProblem',
  async ({ content, author }, { dispatch }) => {
    console.log('[Thunk createProblem] API 호출 직전:', { content, author });
    const response: Problem | null = await createProblemAPI(content, author);

    // =================================================================
    // 이 부분이 가장 중요합니다.
    // 브라우저 개발자 도구 콘솔에서 이 로그들을 반드시 확인해주세요.
    // =================================================================
    console.log('[Thunk createProblem] API 응답 수신 (response 변수 실제 값):', response);
    console.log('[Thunk createProblem] typeof response:', typeof response);
    // 만약 response가 객체라면, 그 내용을 더 자세히 볼 수 있도록 펼쳐서 로깅
    if (response && typeof response === 'object') {
      console.log('[Thunk createProblem] response 객체 내용:', JSON.stringify(response, null, 2));
    }
    // =================================================================

    if (response) {
      console.log('[Thunk createProblem] "if (response)" 조건 통과. response.id:', response.id);
      dispatch(fetchProblems());
      const statIdToIncrement: StatId = 'bugsFixed';
      dispatch(incrementStat(statIdToIncrement));
      return response;
    } else {
      console.error('[Thunk createProblem] "if (response)" 조건 실패. response가 falsy였습니다. 실제 response 값:', response);
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
      // fetchProblems thunk 상태 처리
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
      // createProblem thunk 상태 처리
      .addCase(createProblem.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null; // 에러 초기화
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