import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../../context/UserContext';
import { FiStar, FiTrendingUp, FiAward, FiTarget, FiCalendar, FiZap, FiGift } from 'react-icons/fi';
import { FaFire, FaTrophy, FaMedal, FaCrown } from 'react-icons/fa';
import toast from 'react-hot-toast';

const GamesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: ${props => props.theme.text};
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.textLight};
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.card};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.border};
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.accent});
  }
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.primary};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textLight};
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

const QuestsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const QuestCard = styled(motion.div)`
  background: ${props => props.theme.backgroundSecondary};
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.border};
  position: relative;

  ${props => props.completed && `
    background: linear-gradient(135deg, #10B981, #059669);
    color: white;
    border-color: #10B981;
  `}
`;

const QuestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const QuestIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const QuestTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
`;

const QuestDescription = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.textLight};
  margin-bottom: 1rem;
`;

const QuestProgress = styled.div`
  margin-bottom: 1rem;
`;

const ProgressBar = styled.div`
  height: 6px;
  background: ${props => props.theme.backgroundSecondary};
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.theme.primary};
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.textLight};
  text-align: right;
`;

const QuestReward = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${props => props.theme.accent};
  font-weight: 500;
`;

const CompleteButton = styled(motion.button)`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  background: ${props => props.theme.primary};
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: ${props => props.theme.primaryDark};
    transform: translateY(-1px);
  }

  &:disabled {
    background: ${props => props.theme.backgroundSecondary};
    color: ${props => props.theme.textLight};
    cursor: not-allowed;
    transform: none;
  }
`;

const AchievementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const AchievementCard = styled(motion.div)`
  background: ${props => props.theme.backgroundSecondary};
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.border};
  text-align: center;
  position: relative;

  ${props => props.unlocked && `
    background: linear-gradient(135deg, #F59E0B, #D97706);
    color: white;
    border-color: #F59E0B;
  `}
`;

const AchievementIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const AchievementTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const AchievementDescription = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const LockedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
`;

const Games = () => {
  const { user, updateUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('daily');

  const dailyQuests = [
    {
      id: 1,
      title: 'Прочитать 10 страниц',
      description: 'Прочитайте минимум 10 страниц любой книги',
      progress: user?.stats?.totalPagesRead || 0,
      target: 10,
      reward: { type: 'xp', amount: 50 },
      completed: (user?.stats?.totalPagesRead || 0) >= 10,
      icon: '📖'
    },
    {
      id: 2,
      title: 'Добавить книгу в избранное',
      description: 'Добавьте хотя бы одну книгу в избранное',
      progress: user?.favorites?.length || 0,
      target: 1,
      reward: { type: 'xp', amount: 25 },
      completed: (user?.favorites?.length || 0) >= 1,
      icon: '❤️'
    },
    {
      id: 3,
      title: 'Написать отзыв',
      description: 'Оставьте отзыв на прочитанную книгу',
      progress: user?.stats?.reviewsWritten || 0,
      target: 1,
      reward: { type: 'xp', amount: 30 },
      completed: (user?.stats?.reviewsWritten || 0) >= 1,
      icon: '💬'
    }
  ];

  const weeklyChallenges = [
    {
      id: 1,
      title: 'Читатель недели',
      description: 'Прочитайте 100 страниц за неделю',
      progress: user?.stats?.totalPagesRead || 0,
      target: 100,
      reward: { type: 'coins', amount: 100 },
      completed: (user?.stats?.totalPagesRead || 0) >= 100,
      icon: '📚'
    },
    {
      id: 2,
      title: 'Критик',
      description: 'Напишите 5 отзывов',
      progress: user?.stats?.reviewsWritten || 0,
      target: 5,
      reward: { type: 'coins', amount: 75 },
      completed: (user?.stats?.reviewsWritten || 0) >= 5,
      icon: '⭐'
    }
  ];

  const achievements = [
    {
      id: 1,
      title: 'Первый шаг',
      description: 'Прочитайте первую книгу',
      unlocked: (user?.stats?.totalRead || 0) >= 1,
      icon: '📖'
    },
    {
      id: 2,
      title: 'Книголюб',
      description: 'Прочитайте 10 книг',
      unlocked: (user?.stats?.totalRead || 0) >= 10,
      icon: '📚'
    },
    {
      id: 3,
      title: 'Критик',
      description: 'Напишите 5 отзывов',
      unlocked: (user?.stats?.reviewsWritten || 0) >= 5,
      icon: '⭐'
    },
    {
      id: 4,
      title: 'Мастер чтения',
      description: 'Достичь 50 уровня',
      unlocked: (user?.level || 1) >= 50,
      icon: '👑'
    }
  ];

  const completeQuest = (questId, type) => {
    if (!user) return;

    const quest = type === 'daily' ?
      dailyQuests.find(q => q.id === questId) :
      weeklyChallenges.find(q => q.id === questId);

    if (!quest || quest.completed) return;

    // Обновляем прогресс пользователя
    const updatedUser = { ...user };

    if (quest.reward.type === 'xp') {
      updatedUser.experience = (updatedUser.experience || 0) + quest.reward.amount;
    } else if (quest.reward.type === 'coins') {
      updatedUser.coins = (updatedUser.coins || 0) + quest.reward.amount;
    }

    updateUser(updatedUser);
    toast.success(`Задание выполнено! +${quest.reward.amount} ${quest.reward.type === 'xp' ? 'XP' : 'монет'}`);
  };

  const renderQuests = (quests, type) => (
    <QuestsGrid>
      {quests.map((quest, index) => (
        <QuestCard
          key={quest.id}
          completed={quest.completed}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <QuestHeader>
            <div>
              <QuestIcon>{quest.icon}</QuestIcon>
              <QuestTitle>{quest.title}</QuestTitle>
            </div>
            {quest.completed && <FaTrophy color="#FFD700" size={24} />}
          </QuestHeader>

          <QuestDescription>{quest.description}</QuestDescription>

          <QuestProgress>
            <ProgressBar>
              <ProgressFill style={{ width: `${Math.min((quest.progress / quest.target) * 100, 100)}%` }} />
            </ProgressBar>
            <ProgressText>{quest.progress} / {quest.target}</ProgressText>
          </QuestProgress>

          <QuestReward>
            <FiGift />
            +{quest.reward.amount} {quest.reward.type === 'xp' ? 'XP' : 'монет'}
          </QuestReward>

          <CompleteButton
            onClick={() => completeQuest(quest.id, type)}
            disabled={quest.completed}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {quest.completed ? 'Выполнено ✓' : 'Выполнить'}
          </CompleteButton>
        </QuestCard>
      ))}
    </QuestsGrid>
  );

  const renderAchievements = () => (
    <AchievementGrid>
      {achievements.map((achievement, index) => (
        <AchievementCard
          key={achievement.id}
          unlocked={achievement.unlocked}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <AchievementIcon>{achievement.icon}</AchievementIcon>
          <AchievementTitle>{achievement.title}</AchievementTitle>
          <AchievementDescription>{achievement.description}</AchievementDescription>

          {!achievement.unlocked && (
            <LockedOverlay>
              🔒 Заблокировано
            </LockedOverlay>
          )}
        </AchievementCard>
      ))}
    </AchievementGrid>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'daily':
        return (
          <div>
            <SectionTitle><FiTarget /> Ежедневные задания</SectionTitle>
            {renderQuests(dailyQuests, 'daily')}
          </div>
        );
      case 'weekly':
        return (
          <div>
            <SectionTitle><FiCalendar /> Недельные челленджи</SectionTitle>
            {renderQuests(weeklyChallenges, 'weekly')}
          </div>
        );
      case 'achievements':
        return (
          <div>
            <SectionTitle><FiAward /> Достижения</SectionTitle>
            {renderAchievements()}
          </div>
        );
      default:
        return renderQuests(dailyQuests, 'daily');
    }
  };

  if (!user) {
    return (
      <GamesContainer>
        <Header>
          <Title>🎮 Игровые механики</Title>
          <Subtitle>Необходимо войти в систему для доступа к игровым функциям</Subtitle>
        </Header>
      </GamesContainer>
    );
  }

  return (
    <GamesContainer>
      <Header>
        <Title>
          🎮 Игровые механики
          <FaFire color="#FF6B6B" />
        </Title>
        <Subtitle>
          Выполняйте задания, получайте достижения и поднимайтесь по уровням!
        </Subtitle>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatIcon><FiStar /></StatIcon>
          <StatValue>{user.level || 1}</StatValue>
          <StatLabel>Уровень</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon><FiZap /></StatIcon>
          <StatValue>{user.experience || 0}</StatValue>
          <StatLabel>Опыт</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon><FiTrendingUp /></StatIcon>
          <StatValue>{user.coins || 0}</StatValue>
          <StatLabel>Монеты</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon><FiAward /></StatIcon>
          <StatValue>{achievements.filter(a => a.unlocked).length}</StatValue>
          <StatLabel>Достижений</StatLabel>
        </StatCard>
      </StatsGrid>

      <TabsContainer>
        <Tab active={activeTab === 'daily'} onClick={() => setActiveTab('daily')}>
          📅 Ежедневные
        </Tab>
        <Tab active={activeTab === 'weekly'} onClick={() => setActiveTab('weekly')}>
          📊 Недельные
        </Tab>
        <Tab active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')}>
          🏆 Достижения
        </Tab>
      </TabsContainer>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ContentSection>
            {renderContent()}
          </ContentSection>
        </motion.div>
      </AnimatePresence>
    </GamesContainer>
  );
};

export default Games;