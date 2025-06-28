import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@services/store';
import {
  fetchFeed,
  selectFeedOrders,
  selectFeedLoading
} from '@services/slices/feed';
import { fetchIngredients } from '@services/slices/ingredients';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectFeedOrders);
  const isLoading = useAppSelector(selectFeedLoading);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeed())} />
  );
};
