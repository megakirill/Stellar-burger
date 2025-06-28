import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import feedReducer from './slices/feed';
import ingredientsReducer from './slices/ingredients';
import builderReducer from './slices/builder';
import authReducer from './slices/auth';
import orderReducer from './slices/order';

const rootReducer = {
  feed: feedReducer,
  ingredients: ingredientsReducer,
  builder: builderReducer,
  auth: authReducer,
  order: orderReducer
};

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => dispatchHook<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = selectorHook;
