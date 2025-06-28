import {
  createSlice,
  createAsyncThunk,
  createSelector,
  SerializedError
} from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
import { getFeedsApi } from '@api';
import { RootState } from '../store';

export interface FeedState {
  data: TOrdersData | null;
  isLoading: boolean;
  error: SerializedError | null;
}

export const initialState: FeedState = {
  data: null,
  isLoading: false,
  error: null
};

export const fetchFeed = createAsyncThunk('feed/fetch', async () => {
  const response = await getFeedsApi();
  return response;
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
        state.data = null;
      });
  }
});

// Selectors
export const selectFeedData = (state: RootState) => state.feed.data;
export const selectFeedLoading = (state: RootState) => state.feed.isLoading;
export const selectFeedError = (state: RootState) => state.feed.error;

export const selectFeedOrders = createSelector(
  [selectFeedData],
  (feedData) => feedData?.orders ?? []
);

export default feedSlice.reducer;
