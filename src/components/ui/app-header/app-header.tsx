import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  const getLinkStyle = (path: string) =>
    `${styles.link} ${location.pathname === path ? styles.link_active : ''}`;

  const getIconType = (path: string) =>
    location.pathname === path ? 'primary' : 'secondary';

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link to='/' className={getLinkStyle('/')}>
            <BurgerIcon type={getIconType('/')} />
            <span className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </span>
          </Link>
          <Link to='/feed' className={getLinkStyle('/feed')}>
            <ListIcon type={getIconType('/feed')} />
            <span className='text text_type_main-default ml-2'>
              Лента заказов
            </span>
          </Link>
        </div>
        <Link to='/' className={styles.logo}>
          <Logo className={styles.logo_image} />
        </Link>
        <Link
          to='/profile'
          className={`${getLinkStyle('/profile')} ${styles.link_position_last}`}
        >
          <ProfileIcon type={getIconType('/profile')} />
          <span className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </span>
        </Link>
      </nav>
    </header>
  );
};
