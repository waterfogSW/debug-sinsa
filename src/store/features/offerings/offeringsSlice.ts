import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Offering } from '@/domain/Offering';
import { OfferingId } from '@/common/enums/OfferingId';
import { getOfferings as fetchOfferingsAPI, incrementOfferingCount as incrementOfferingAPI } from '@/services/api';
import { DEFAULT_OFFERINGS } from '@/common/constants/defaultValues';
import { RootState } from '@/store/store';
import { incrementStat, StatId } from '../stats/statsSlice';

interface OfferingsState {
  items: Offering[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // 데이터 가져오기 상태
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed'; // 개별 공물 업데이트 상태
  error: string | null;
  updateError: string | null;
}

const initialState: OfferingsState = {
  items: DEFAULT_OFFERINGS,
  status: 'idle',
  updateStatus: 'idle',
  error: null,
  updateError: null,
};

// 모든 공물 정보를 가져오는 thunk
export const fetchOfferings = createAsyncThunk('offerings/fetchOfferings', async () => {
  const response = await fetchOfferingsAPI();
  return response || [];
});

// 특정 공물의 카운트를 증가시키는 thunk
export const incrementOfferingCount = createAsyncThunk(
  'offerings/incrementOfferingCount',
  async (offeringId: OfferingId, { dispatch }) => {
    const updatedOffering = await incrementOfferingAPI(offeringId);
    if (updatedOffering) {
      const statIdToIncrement: StatId = 'offeringsMade';
      dispatch(incrementStat(statIdToIncrement));
      return updatedOffering;
    } else {
      throw new Error('Failed to increment offering count');
    }
  }
);

const offeringsSlice = createSlice({
  name: 'offerings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOfferings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOfferings.fulfilled, (state, action: PayloadAction<Offering[]>) => {
        state.status = 'succeeded';
        state.items = action.payload.length > 0 ? action.payload : DEFAULT_OFFERINGS;
        state.error = null;
      })
      .addCase(fetchOfferings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch offerings';
      })
      .addCase(incrementOfferingCount.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(incrementOfferingCount.fulfilled, (state, action: PayloadAction<Offering>) => {
        state.updateStatus = 'succeeded';
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(incrementOfferingCount.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.error.message || 'Failed to update offering';
      });
  },
});

export const selectAllOfferings = (state: RootState) => state.offerings.items;
export const selectOfferingsStatus = (state: RootState) => state.offerings.status;
export const selectOfferingsError = (state: RootState) => state.offerings.error;
export const selectOfferingsUpdateStatus = (state: RootState) => state.offerings.updateStatus;

export default offeringsSlice.reducer; 