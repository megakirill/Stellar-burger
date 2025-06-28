import feedSlice, { 
  fetchFeed,
  initialState as feedInitialState 
} from '../feed';
import { TOrdersData } from '@utils-types';
import * as api from '@api';

jest.mock('@api');

describe('feed slice', () => {
  const mockFeedData: TOrdersData = {
    orders: [],
    total: 0,
    totalToday: 0
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle initial state', () => {
    expect(feedSlice(undefined, { type: 'unknown' })).toEqual(feedInitialState);
  });

  describe('async thunks', () => {
    it('should handle successful feed fetch', async () => {
      (api.getFeedsApi as jest.Mock).mockResolvedValue({
        success: true,
        orders: [],
        total: 0,
        totalToday: 0
      });

      const dispatch = jest.fn();
      const thunk = fetchFeed();
      await thunk(dispatch, () => ({}), {});

      const [start, end] = dispatch.mock.calls.map(call => call[0].type);
      expect(start).toBe('feed/fetch/pending');
      expect(end).toBe('feed/fetch/fulfilled');
    });
  });
});