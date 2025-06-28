import orderSlice, {
  createOrder,
  fetchUserOrders,
  clearOrder,
  initialState as orderInitialState
} from '../order';
import { TOrder } from '@utils-types';
import * as api from '@api';

jest.mock('@api');

describe('order slice', () => {
  const mockOrder: TOrder = {
    _id: '1',
    number: 1234,
    name: 'Test Order',
    status: 'done',
    ingredients: ['ing1', 'ing2'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle initial state', () => {
    expect(orderSlice(undefined, { type: 'unknown' })).toEqual(orderInitialState);
  });

  it('should handle clearOrder', () => {
    const initialState = {
      currentOrder: mockOrder,
      userOrders: [],
      isLoading: false,
      error: { message: 'Some error' },
      selectedOrder: mockOrder
    };
    expect(orderSlice(initialState, clearOrder())).toEqual(orderInitialState);
  });

  describe('async thunks', () => {
    it('should handle successful order creation', async () => {
      const ingredients = ['ing1', 'ing2'];
      
      (api.orderBurgerApi as jest.Mock).mockResolvedValue({
        success: true,
        order: mockOrder
      });

      const dispatch = jest.fn();
      const thunk = createOrder(ingredients);
      await thunk(dispatch, () => ({}), {});

      const actionTypes = dispatch.mock.calls.map(call => call[0].type);
      expect(actionTypes).toContain('order/create/pending');
      expect(actionTypes).toContain('order/create/fulfilled');
    });

    // Add more async thunk tests...
  });
});