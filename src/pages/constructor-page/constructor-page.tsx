import { FC, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@services/store';
import {
  selectIngredientsLoading,
  fetchIngredients
} from '@services/slices/ingredients';

import styles from './constructor-page.module.css';

import { BurgerIngredients, BurgerConstructor } from '@components';
import { Preloader } from '@ui';

export const ConstructorPage: FC = () => {
  const dispatch = useAppDispatch();
  const isIngredientsLoading = useAppSelector(selectIngredientsLoading);

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
