import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@services/store';
import {
  selectUserOrders,
  fetchUserOrders,
  selectOrderLoading
} from '@services/slices/order';
import { ProfileOrdersUI } from '@ui-pages';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectUserOrders);
  const isLoading = useAppSelector(selectOrderLoading);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
