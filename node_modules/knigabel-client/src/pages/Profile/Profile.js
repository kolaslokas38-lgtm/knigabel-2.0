import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../../context/UserContext';
import { FiSettings, FiBook, FiStar, FiTrendingUp, FiCalendar, FiHeart, FiMessageSquare, FiAward } from 'react-icons/fi';
import BookCard from '../../components/BookCard/BookCard';

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  align-items: center;
  flex-wrap: wrap;
`;

const AvatarSection = styled.div`
  position: relative;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  border: 4px solid ${props => props.theme.border};
  position: relative;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const LevelBadge = styled.div`
  position: absolute;
  bottom: -5px;
  right: -5px;
  background: ${props => props.theme.accent};
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: bold;
  border: 3px solid ${props => props.theme.card};
`;

const ProfileInfo = styled.div`
  flex: 1;
  min-width: 300px;
  position: relative;
`;

const SettingsButton = styled(Link)`
  position: absolute;
  top: 0;
  right: 0;
  background: ${props => props.theme.backgroundSecondary};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 0.5rem;
  color: ${props => props.theme.text};
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.accent};
    transform: scale(1.05);
  }
`;

const ProfileName = styled.h1`
  color: ${props => props.theme.text};
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProfileRole = styled.div`
  color: ${props => props.theme.secondary};
  font-size: 1.1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProfileStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.card};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.border};
  text-align: center;
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.primary};
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textLight};
`;

const LevelSection = styled.div`
  background: ${props => props.theme.card};
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid ${props => props.theme.border};
`;

const LevelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const LevelTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: 1.2rem;
  margin: 0;
`;

const LevelValue = styled.span`
  color: ${props => props.theme.primary};
  font-weight: bold;
  font-size: 1.1rem;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: ${props => props.theme.backgroundSecondary};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.accent});
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textLight};
  text-align: right;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme.border};
  padding-bottom: 1rem;
  overflow-x: auto;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: ${props => props.active ? props.theme.primaryDark : props.theme.accent};
  }
`;

const ContentSection = styled.div`
  background: ${props => props.theme.card};
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid ${props => props.theme.border};
`;

const SectionTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.textLight};
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const Profile = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: '📊' },
    { id: 'books', label: 'Мои книги', icon: '📚' },
    { id: 'favorites', label: 'Избранное', icon: '❤️' },
    { id: 'reviews', label: 'Отзывы', icon: '💬' },
    { id: 'achievements', label: 'Достижения', icon: '🏆' },
    { id: 'history', label: 'История', icon: '📖' },
  ];

  const getRoleIcon = (role) => {
    switch(role) {
      case 'Владелец': return <FaCrown color="#FFD700" />;
      case 'Администратор': return <FaTrophy color="#FF6B6B" />;
      case 'Модератор': return <FaMedal color="#4ECDC4" />;
      case 'VIP': return <FaStar color="#9B59B6" />;
      default: return null;
    }
  };

  const renderOverview = () => (
    <div>
      <ProfileStats>
        <StatCard>
          <StatIcon><FiBook /></StatIcon>
          <StatValue>{user?.stats?.totalRead || 0}</StatValue>
          <StatLabel>Прочитано книг</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon><FiStar /></StatIcon>
          <StatValue>{user?.stats?.reviewsWritten || 0}</StatValue>
          <StatLabel>Написано отзывов</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon><FiTrendingUp /></StatIcon>
          <StatValue>{user?.stats?.readingDays || 0}</StatValue>
          <StatLabel>Дней с нами</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon><FiAward /></StatIcon>
          <StatValue>{user?.achievements?.length || 0}</StatValue>
          <StatLabel>Достижений</StatLabel>
        </StatCard>
      </ProfileStats>

      <LevelSection>
        <LevelHeader>
          <LevelTitle>Уровень пользователя</LevelTitle>
          <LevelValue>{user?.level || 1}</LevelValue>
        </LevelHeader>
        <ProgressBar>
          <ProgressFill style={{
            width: user?.experience && user?.experienceToNext
              ? `${(user.experience % user.experienceToNext) / user.experienceToNext * 100}%`
              : '0%'
          }} />
        </ProgressBar>
        <ProgressText>
          {user?.experience ? user.experience % (user.experienceToNext || 100) : 0} / {user?.experienceToNext || 100} XP
        </ProgressText>
      </LevelSection>
    </div>
  );

  const renderBooks = () => (
    <div>
      <SectionTitle><FiBook /> Активные книги</SectionTitle>
      {user?.borrowedBooks?.length > 0 ? (
        <BooksGrid>
          {user.borrowedBooks.map(bookId => (
            <BookCard key={bookId} book={{ id: bookId, available: false }} />
          ))}
        </BooksGrid>
      ) : (
        <EmptyState>
          <EmptyIcon>📚</EmptyIcon>
          <p>У вас нет активных книг</p>
        </EmptyState>
      )}
    </div>
  );

  const renderFavorites = () => (
    <div>
      <SectionTitle><FiHeart /> Избранные книги</SectionTitle>
      {user?.favorites?.length > 0 ? (
        <BooksGrid>
          {user.favorites.map(bookId => (
            <BookCard key={bookId} book={{ id: bookId, available: true }} />
          ))}
        </BooksGrid>
      ) : (
        <EmptyState>
          <EmptyIcon>❤️</EmptyIcon>
          <p>У вас нет избранных книг</p>
        </EmptyState>
      )}
    </div>
  );

  const renderReviews = () => (
    <div>
      <SectionTitle><FiMessageSquare /> Мои отзывы</SectionTitle>
      {user?.myReviews?.length > 0 ? (
        <div>
          {user.myReviews.map(review => (
            <div key={review.id} style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>{review.bookTitle}</strong>
                <div>{'⭐'.repeat(review.rating)}</div>
              </div>
              <p>{review.comment}</p>
              <small style={{ color: '#666' }}>{review.date}</small>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState>
          <EmptyIcon>💬</EmptyIcon>
          <p>У вас пока нет отзывов</p>
        </EmptyState>
      )}
    </div>
  );

  const renderAchievements = () => (
    <div>
      <SectionTitle><FiAward /> Достижения</SectionTitle>
      {user?.achievements?.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {user.achievements.map(achievement => (
            <div key={achievement.id} style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '1rem',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{achievement.icon}</div>
              <h4>{achievement.name}</h4>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>{achievement.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState>
          <EmptyIcon>🏆</EmptyIcon>
          <p>У вас пока нет достижений</p>
        </EmptyState>
      )}
    </div>
  );

  const renderHistory = () => (
    <div>
      <SectionTitle><FiCalendar /> История чтения</SectionTitle>
      {user?.history?.length > 0 ? (
        <div>
          {user.history.map(entry => (
            <div key={entry.id} style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong>{entry.bookTitle}</strong>
                <p style={{ margin: '0.25rem 0', color: '#666' }}>{entry.date}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>{entry.pagesRead} стр.</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>{entry.timeSpent} мин</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState>
          <EmptyIcon>📖</EmptyIcon>
          <p>История чтения пуста</p>
        </EmptyState>
      )}
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return renderOverview();
      case 'books': return renderBooks();
      case 'favorites': return renderFavorites();
      case 'reviews': return renderReviews();
      case 'achievements': return renderAchievements();
      case 'history': return renderHistory();
      default: return renderOverview();
    }
  };

  if (!user) {
    return (
      <ProfileContainer>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Необходимо войти в систему</h2>
        </div>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <AvatarSection>
          <Avatar>
            {user.avatar || user.name?.[0]?.toUpperCase() || '👤'}
          </Avatar>
          <LevelBadge>{user.level || 1}</LevelBadge>
        </AvatarSection>

        <ProfileInfo>
          <SettingsButton to="/settings" title="Настройки">
            <FiSettings size={20} />
          </SettingsButton>
          <ProfileName>
            {user.name || 'Пользователь'}
            {getRoleIcon(user.role)}
          </ProfileName>
          <ProfileRole>
            {user.role || 'Активный пользователь'}
          </ProfileRole>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>
            Зарегистрирован: {user.registrationDate || 'Неизвестно'}
          </div>
        </ProfileInfo>
      </ProfileHeader>

      <TabsContainer>
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            <span style={{ marginRight: '0.5rem' }}>{tab.icon}</span>
            {tab.label}
          </Tab>
        ))}
      </TabsContainer>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ContentSection>
            {renderContent()}
          </ContentSection>
        </motion.div>
      </AnimatePresence>
    </ProfileContainer>
  );
};

export default Profile;