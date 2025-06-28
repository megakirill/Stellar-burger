import { FC } from 'react';
import { useAppSelector } from '@services/store';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { selectFeedData, selectFeedOrders } from '@services/slices/feed';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders = useAppSelector(selectFeedOrders) ?? [];
  const feed = useAppSelector(selectFeedData) ?? {
    total: 0,
    totalToday: 0
  };

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
