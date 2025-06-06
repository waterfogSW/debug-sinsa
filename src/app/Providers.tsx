'use client'; // 클라이언트 컴포넌트로 명시

import { Provider } from 'react-redux';
import { store } from '@/store/store'; // 생성한 Redux 스토어 import
 
export function ReduxProviders({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
} 
