import { FC, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@services/store';
import { selectUser, getUser } from '@services/slices/auth';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  return <AppHeaderUI userName={user?.name} />;
};
