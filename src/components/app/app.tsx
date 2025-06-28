import { FC, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@services/store';
import { selectIsAuthenticated } from '@services/slices/auth';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import styles from './app.module.css';
import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route/protected-route';
import { fetchIngredients } from '@services/slices/ingredients';

const App: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();

  const handleModalClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        {/* Public routes */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        {/* Details pages */}
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:id' element={<OrderInfo />} />
        <Route path='/profile/orders/:id' element={<OrderInfo />} />

        {/* Protected Profile routes */}
        <Route
          path='/profile/*'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProfileRoutes />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Modal windows */}
      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:id'
            element={
              <Modal title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:id'
            element={
              <Modal title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

const ProfileRoutes: FC = () => (
  <Routes>
    <Route path='/' element={<Profile />} />
    <Route path='/orders' element={<ProfileOrders />} />
    <Route path='/orders/:id' element={<OrderInfo />} />
  </Routes>
);

export default App;
