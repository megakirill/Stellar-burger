import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@services/store';
import { selectFeedOrders } from '@services/slices/feed';
import { selectIngredients } from '@services/slices/ingredients';
import {
  getOrderByNumber,
  selectSelectedOrder,
  selectOrderLoading
} from '@services/slices/order';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectFeedOrders);
  const selectedOrder = useAppSelector(selectSelectedOrder);
  const ingredients = useAppSelector(selectIngredients);
  const loading = useAppSelector(selectOrderLoading);

  useEffect(() => {
    if (id) {
      dispatch(getOrderByNumber(parseInt(id)));
    }
  }, [dispatch, id]);

  const orderData =
    selectedOrder || orders.find((order) => order.number.toString() === id);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (loading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
