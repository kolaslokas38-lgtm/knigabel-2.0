import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FiBook,
  FiUsers,
  FiBookOpen,
  FiPlay,
  FiCalendar,
  FiHeart,
  FiMessageSquare,
  FiAward,
  FiUser,
  FiSettings,
  FiBarChart2
} from 'react-icons/fi';
import { UserContext } from '../../context/UserContext';

const NavigationContainer = styled.nav`
  background: ${props => props.theme.navBackground};
  border-bottom: 1px solid ${props => props.theme.border};
  padding: 1rem 0;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const NavTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const NavButton = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text};
  min-width: 70px;
  text-decoration: none;

  &:hover {
    background: ${props => props.theme.accent};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &.active {
    background: ${props => props.theme.primary};
    color: white;
    border-color: ${props => props.theme.primary};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

const NavIcon = styled.div`
  font-size: 1.5rem;
`;

const NavText = styled.span`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const navItems = [
  { path: '/catalog', icon: FiBook, label: 'Каталог', id: 'catalog' },
  { path: '/authors', icon: FiUsers, label: 'Авторы', id: 'authors' },
  { path: '/education', icon: FiBookOpen, label: 'Обучение', id: 'education' },
  { path: '/games', icon: FiPlay, label: 'Игры', id: 'games' },
  { path: '/events', icon: FiCalendar, label: 'События', id: 'events' },
  { path: '/redbook', icon: FiHeart, label: 'Красная Книга', id: 'redbook' },
  { path: '/reviews', icon: FiMessageSquare, label: 'Отзывы', id: 'reviews' },
  { path: '/achievements', icon: FiAward, label: 'Достижения', id: 'achievements' },
  { path: '/analytics', icon: FiBarChart2, label: 'Аналитика', id: 'analytics' },
  { path: '/settings', icon: FiSettings, label: 'Настройки', id: 'settings' },
  { path: '/profile', icon: FiUser, label: 'Профиль', id: 'profile' },
];

const adminNavItems = [
  { path: '/admin', icon: FiSettings, label: 'Админ', id: 'admin' },
];

const Navigation = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);

  // Показываем админ панель только для администраторов
  const isAdmin = user?.role === 'Администратор' || user?.role === 'Владелец';

  const allNavItems = [...navItems, ...(isAdmin ? adminNavItems : [])];

  return (
    <NavigationContainer>
      <NavContainer>
        <NavTabs>
          {allNavItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.id} to={item.path} style={{ textDecoration: 'none' }}>
                <NavButton
                  className={isActive ? 'active' : ''}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <NavIcon>
                    <Icon />
                  </NavIcon>
                  <NavText>{item.label}</NavText>
                </NavButton>
              </Link>
            );
          })}
        </NavTabs>
      </NavContainer>
    </NavigationContainer>
  );
};

export default Navigation;