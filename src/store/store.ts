import { configureStore } from '@reduxjs/toolkit';
// 생성한 statsSlice의 리듀서를 import 합니다.
import statsReducer from './features/stats/statsSlice';
// 생성한 offeringsSlice의 리듀서를 import 합니다.
import offeringsReducer from './features/offerings/offeringsSlice';
// 나중에 생성할 slice들의 리듀서를 여기에 import 합니다.
import problemsReducer from './features/problems/problemsSlice';
import repliesReducer from './features/replies/repliesSlice';
import fortuneReducer from './features/fortune/fortuneSlice';

export const store = configureStore({
  reducer: {
    // stats slice의 리듀서를 추가합니다.
    stats: statsReducer,
    // offerings slice의 리듀서를 추가합니다.
    offerings: offeringsReducer,
    problems: problemsReducer,
    replies: repliesReducer,
    fortune: fortuneReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), // 필요시 미들웨어 추가 (예: logger)
});

// 스토어의 전체 상태에 대한 타입 (RootState)
export type RootState = ReturnType<typeof store.getState>;
// 디스패치할 수 있는 액션들의 타입 (AppDispatch)
export type AppDispatch = typeof store.dispatch; 
