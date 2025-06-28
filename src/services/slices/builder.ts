import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { RootState } from '../store';

interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderData: any | null;
}

export const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderData: null
};

const builderSlice = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    setBun: {
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: crypto.randomUUID()
        } as TConstructorIngredient
      }),
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.bun = action.payload;
      }
    },
    addIngredient: {
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: crypto.randomUUID()
        } as TConstructorIngredient
      }),
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const dragItem = state.ingredients[dragIndex];
      const newIngredients = [...state.ingredients];
      newIngredients.splice(dragIndex, 1);
      newIngredients.splice(hoverIndex, 0, dragItem);
      state.ingredients = newIngredients;
    },
    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },
    setOrderData: (state, action: PayloadAction<any>) => {
      state.orderData = action.payload;
    },
    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      state.orderData = null;
      state.orderRequest = false;
    }
  }
});

export const {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  setOrderRequest,
  setOrderData,
  resetConstructor
} = builderSlice.actions;

export const selectConstructorBun = (state: RootState) => state.builder.bun;
export const selectConstructorIngredients = (state: RootState) =>
  state.builder.ingredients;
export const selectOrderRequest = (state: RootState) =>
  state.builder.orderRequest;
export const selectOrderData = (state: RootState) => state.builder.orderData;

export default builderSlice.reducer;
