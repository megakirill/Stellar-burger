import { FC, ReactElement, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@services/store';
import {
  selectIsAuthChecked,
  selectIsAuthenticated,
  getUser
} from '@services/slices/auth';

interface ProtectedRouteProps {
  children: ReactElement;
  isAuthenticated: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  isAuthenticated,
  redirectTo = '/login'
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isAuthChecked = useAppSelector(selectIsAuthChecked);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};
