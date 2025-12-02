import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';
import { LibraryContext } from '../../context/LibraryContext';
import { FiMoon, FiSun, FiBook, FiSettings } from 'react-icons/fi';

const HeaderContainer = styled(motion.header)`
  background: ${props => props.theme.headerBackground};
  padding: 2rem 0;
  margin-bottom: 2rem;
  position: relative;
  border-bottom: 1px solid ${props => props.theme.border};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LogoIcon = styled(motion.div)`
  font-size: 2.5rem;
  color: ${props => props.theme.primary};
  padding: 12px;
  border-radius: 12px;
  background: ${props => props.theme.backgroundSecondary};
  border: 1px solid ${props => props.theme.border};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background: ${props => props.theme.accent};
  }
`;

const LogoText = styled.div`
  h1 {
    font-size: 2.2rem;
    font-weight: 700;
    margin: 0;
    color: ${props => props.theme.text};
    letter-spacing: -0.02em;
  }

  p {
    font-size: 0.95rem;
    color: ${props => props.theme.textLight};
    margin: 4px 0 0 0;
    font-weight: 400;
  }
`;

const HeaderFeatures = styled.div`
  display: flex;
  gap: 1rem;
  margin-left: auto;
`;

const FeatureItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${props => props.theme.backgroundSecondary};
  border-radius: 12px;
  padding: 12px 18px;
  border: 1px solid ${props => props.theme.border};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 1.8rem;
`;

const FeatureText = styled.div`
  text-align: center;
`;

const FeatureNumber = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: #fff;
  display: block;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const FeatureLabel = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ThemeToggle = styled.div``;

const SettingsButton = styled(motion.button)`
  background: ${props => props.theme.backgroundSecondary};
  border: 1px solid ${props => props.theme.border};
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.theme.text};
  font-weight: 500;
  text-decoration: none;

  &:hover {
    background: ${props => props.theme.accent};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ThemeButton = styled(motion.button)`
  background: ${props => props.theme.backgroundSecondary};
  border: 1px solid ${props => props.theme.border};
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.theme.text};
  font-weight: 500;

  &:hover {
    background: ${props => props.theme.accent};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { libraryData } = useContext(LibraryContext);

  const stats = libraryData?.stats || {
    totalBooks: 0,
    availableBooks: 0,
    totalGenres: 16
  };

  return (
    <HeaderContainer
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <HeaderContent>
        <LogoSection>
          <LogoIcon
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiBook />
          </LogoIcon>
          <LogoText>
            <h1>КнігаБел</h1>
            <p>Ваша цифровая библиотека</p>
          </LogoText>
        </LogoSection>

        <HeaderFeatures>
          <FeatureItem
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FeatureIcon>📖</FeatureIcon>
            <FeatureText>
              <FeatureNumber>{stats.totalBooks}</FeatureNumber>
              <FeatureLabel>книг</FeatureLabel>
            </FeatureText>
          </FeatureItem>

          <FeatureItem
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <FeatureIcon>⭐</FeatureIcon>
            <FeatureText>
              <FeatureNumber>{stats.availableBooks}</FeatureNumber>
              <FeatureLabel>доступно</FeatureLabel>
            </FeatureText>
          </FeatureItem>

          <FeatureItem
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <FeatureIcon>🏷️</FeatureIcon>
            <FeatureText>
              <FeatureNumber>{stats.totalGenres}</FeatureNumber>
              <FeatureLabel>жанров</FeatureLabel>
            </FeatureText>
          </FeatureItem>
        </HeaderFeatures>

        <HeaderActions>
          <SettingsButton
            as={Link}
            to="/settings"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiSettings />
            <span>Настройки</span>
          </SettingsButton>

          <ThemeToggle>
            <ThemeButton
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'light' ? <FiMoon /> : <FiSun />}
              <span className="theme-text">Тема</span>
            </ThemeButton>
          </ThemeToggle>
        </HeaderActions>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;