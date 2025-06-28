import { FC, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@services/store';
import {
  selectConstructorBun,
  selectConstructorIngredients
} from '@services/slices/builder';
import { selectIsAuthenticated } from '@services/slices/auth';
import {
  createOrder,
  clearOrder,
  selectCurrentOrder,
  selectOrderLoading
} from '@services/slices/order';
import { TConstructorIngredient } from '@utils-types';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const bun = useAppSelector(selectConstructorBun);
  const ingredients = useAppSelector(selectConstructorIngredients) ?? [];
  const orderLoading = useAppSelector(selectOrderLoading);
  const currentOrder = useAppSelector(selectCurrentOrder);

  const constructorItems = {
    bun,
    ingredients
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      (constructorItems.ingredients?.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ) ?? 0),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderLoading}
      constructorItems={constructorItems}
      orderModalData={currentOrder}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
