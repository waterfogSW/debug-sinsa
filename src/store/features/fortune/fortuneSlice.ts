import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';

interface FortuneState {
  todayFortune: string | null;
  lastFetchedDate: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: FortuneState = {
  todayFortune: null,
  lastFetchedDate: null,
  isLoading: false,
  error: null,
};

const fortunes = [
  "오늘은 컴파일 에러가 당신을 피해갈 것입니다.",
  "새로운 라이브러리가 당신의 생산성을 극대화할 것입니다.",
  "뜻밖의 코드 리뷰 요청에 당황하지 마세요. 성장의 기회입니다.",
  "오래된 버그가 드디어 모습을 드러낼 징조입니다.",
  "Ctrl+S를 생활화하세요. 데이터 유실을 막을 수 있습니다.",
  "오늘은 코드보다는 문서 작업에 집중하는 것이 좋겠습니다.",
  "commit 메시지를 명확히 작성하면 미래의 당신에게 큰 도움이 됩니다.",
  "stackoverflow에서 완벽한 해답을 찾을 수 있을 것입니다.",
  "오늘은 예상치 못한 에러 로그와 마주할 수 있습니다. 침착하게 대응하세요.",
  "동료와의 페어 프로그래밍이 막힌 문제를 해결해 줄 것입니다.",
  "오늘은 당신의 코드가 한번에 빌드될 것입니다! ...아마도요.",
  "기획자의 변덕이 당신의 코드를 피해갈 것입니다.",
  "console.log() 없이도 모든 것이 명확해지는 하루입니다.",
  "오늘은 deprecated된 기술이 당신을 구원할지도 모릅니다.",
  "뜻밖의 야근 요청... 이 아니라 칼퇴근의 행운이 함께합니다!",
  "복사 붙여넣기 신공이 빛을 발하는 날입니다. (하지만 리팩토링도 잊지 마세요!)",
  "오늘은 주석 없이도 이해되는 코드를 작성하게 될 것입니다.",
  "무심코 닫았던 브라우저 탭에 해결의 실마리가 숨어있을 수 있습니다.",
  "새로운 단축키를 발견하여 개발 속도가 2배 빨라집니다.",
  "오늘은 '이게 왜 되지?'와 '이게 왜 안 되지?'의 무한 루프에 빠질 수 있습니다."
];

const fortuneSlice = createSlice({
  name: 'fortune',
  initialState,
  reducers: {
    loadFortuneFromStorage: (state) => {
      state.isLoading = true;
      try {
        const storedFortune = localStorage.getItem('debugSinsaFortune');
        if (storedFortune) {
          const { fortune, date } = JSON.parse(storedFortune);
          const today = new Date().toISOString().split('T')[0];
          if (date === today) {
            state.todayFortune = fortune;
            state.lastFetchedDate = date;
          } else {
            localStorage.removeItem('debugSinsaFortune');
            state.todayFortune = null;
            state.lastFetchedDate = null;
          }
        }
        state.isLoading = false;
      } catch (e) {
        state.error = '운세를 불러오는 데 실패했습니다.';
        state.isLoading = false;
      }
    },
    generateNewFortune: (state) => {
      state.isLoading = true;
      const today = new Date().toISOString().split('T')[0];
      const randomIndex = Math.floor(Math.random() * fortunes.length);
      const newFortune = fortunes[randomIndex];
      state.todayFortune = newFortune;
      state.lastFetchedDate = today;
      try {
        localStorage.setItem('debugSinsaFortune', JSON.stringify({ fortune: newFortune, date: today }));
        state.error = null;
      } catch (e) {
        state.error = '운세를 저장하는 데 실패했습니다.';
      }
      state.isLoading = false;
    },
    clearFortuneError: (state) => {
      state.error = null;
    }
  },
});

export const { loadFortuneFromStorage, generateNewFortune, clearFortuneError } = fortuneSlice.actions;

export const selectTodayFortune = (state: RootState) => state.fortune.todayFortune;
export const selectFortuneLastFetchedDate = (state: RootState) => state.fortune.lastFetchedDate;
export const selectFortuneIsLoading = (state: RootState) => state.fortune.isLoading;
export const selectFortuneError = (state: RootState) => state.fortune.error;

export default fortuneSlice.reducer; 
