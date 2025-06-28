import {
  createSlice,
  createAsyncThunk,
  SerializedError
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi, getOrdersApi, getOrderByNumberApi } from '@api';
import { RootState } from '../store';
import { resetConstructor } from './builder';

interface OrderState {
  currentOrder: TOrder | null;
  userOrders: TOrder[];
  selectedOrder: TOrder | null;
  isLoading: boolean;
  error: SerializedError | null;
}

export const initialState: OrderState = {
  currentOrder: null,
  userOrders: [],
  selectedOrder: null,
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredients: string[], { dispatch }) => {
    const response = await orderBurgerApi(ingredients);
    if (response.success) {
      dispatch(resetConstructor());
      return response.order;
    }
    return Promise.reject(response);
  }
);

export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    if (response.success) {
      return response.orders[0];
    }
    return Promise.reject(response);
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
      state.selectedOrder = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
        state.userOrders = [];
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
        state.selectedOrder = null;
      });
  }
});

export const { clearOrder } = orderSlice.actions;

export const selectCurrentOrder = (state: RootState) =>
  state.order.currentOrder;
export const selectUserOrders = (state: RootState) => state.order.userOrders;
export const selectOrderLoading = (state: RootState) => state.order.isLoading;
export const selectOrderError = (state: RootState) => state.order.error;
export const selectSelectedOrder = (state: RootState) =>
  state.order.selectedOrder;

export default orderSlice.reducer;
