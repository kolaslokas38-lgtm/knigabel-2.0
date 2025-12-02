import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { UserContext } from '../../context/UserContext';
import { LibraryContext } from '../../context/LibraryContext';
import { FiTrendingUp, FiUsers, FiBookOpen, FiStar, FiClock, FiTarget, FiBarChart2 } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AnalyticsContainer = styled.div`
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.card};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.border};
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
  font-size: 2rem;
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

const StatChange = styled.div`
  font-size: 0.8rem;
  color: ${props => props.change > 0 ? '#10B981' : props.change < 0 ? '#EF4444' : props.theme.textLight};
  margin-top: 0.5rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ChartCard = styled(motion.div)`
  background: ${props => props.theme.card};
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid ${props => props.theme.border};
`;

const ChartTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ChartContainer = styled.div`
  height: 300px;
  width: 100%;
`;

const InsightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const InsightCard = styled(motion.div)`
  background: ${props => props.theme.card};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.border};
`;

const InsightTitle = styled.h4`
  color: ${props => props.theme.text};
  font-size: 1.1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InsightText = styled.p`
  color: ${props => props.theme.textLight};
  font-size: 0.9rem;
  line-height: 1.5;
`;

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

const Analytics = () => {
  const { user } = useContext(UserContext);
  const { libraryData } = useContext(LibraryContext);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    // Generate mock analytics data
    const generateAnalyticsData = () => {
      const now = new Date();
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (29 - i));
        return {
          date: date.toISOString().split('T')[0],
          booksRead: Math.floor(Math.random() * 5) + 1,
          pagesRead: Math.floor(Math.random() * 50) + 10,
          timeSpent: Math.floor(Math.random() * 120) + 30,
          reviews: Math.random() > 0.8 ? 1 : 0
        };
      });

      const genreStats = [
        { name: 'Фантастика', value: 35, color: '#8884d8' },
        { name: 'Роман', value: 25, color: '#82ca9d' },
        { name: 'Детектив', value: 20, color: '#ffc658' },
        { name: 'Фэнтези', value: 15, color: '#ff7c7c' },
        { name: 'Другие', value: 5, color: '#8dd1e1' }
      ];

      const readingStats = {
        totalBooks: user?.stats?.totalRead || 0,
        totalPages: user?.totalPagesRead || 0,
        totalTime: user?.stats?.readingDays ? user.stats.readingDays * 60 : 0, // minutes
        averageRating: 4.2,
        favoriteGenre: 'Фантастика',
        streakDays: user?.stats?.readingDays || 0,
        reviewsCount: user?.stats?.reviewsWritten || 0
      };

      return {
        dailyStats: last30Days,
        genreStats,
        readingStats,
        trends: {
          booksThisWeek: last30Days.slice(-7).reduce((sum, day) => sum + day.booksRead, 0),
          booksLastWeek: last30Days.slice(-14, -7).reduce((sum, day) => sum + day.booksRead, 0),
          pagesThisWeek: last30Days.slice(-7).reduce((sum, day) => sum + day.pagesRead, 0),
          pagesLastWeek: last30Days.slice(-14, -7).reduce((sum, day) => sum + day.pagesRead, 0)
        }
      };
    };

    setAnalyticsData(generateAnalyticsData());
  }, [user]);

  if (!analyticsData) {
    return <div>Загрузка аналитики...</div>;
  }

  const { dailyStats, genreStats, readingStats, trends } = analyticsData;

  const calculateChange = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <AnalyticsContainer>
      <Header>
        <Title>
          <FiBarChart3 />
          Аналитика чтения
        </Title>
        <Subtitle>
          Отслеживайте свой прогресс и получайте insights о привычках чтения
        </Subtitle>
      </Header>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatIcon><FiBookOpen /></StatIcon>
          <StatValue>{readingStats.totalBooks}</StatValue>
          <StatLabel>Прочитано книг</StatLabel>
          <StatChange change={calculateChange(trends.booksThisWeek, trends.booksLastWeek)}>
            {calculateChange(trends.booksThisWeek, trends.booksLastWeek) > 0 ? '+' : ''}
            {calculateChange(trends.booksThisWeek, trends.booksLastWeek)}% за неделю
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatIcon><FiTrendingUp /></StatIcon>
          <StatValue>{readingStats.totalPages}</StatValue>
          <StatLabel>Прочитано страниц</StatLabel>
          <StatChange change={calculateChange(trends.pagesThisWeek, trends.pagesLastWeek)}>
            {calculateChange(trends.pagesThisWeek, trends.pagesLastWeek) > 0 ? '+' : ''}
            {calculateChange(trends.pagesThisWeek, trends.pagesLastWeek)}% за неделю
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatIcon><FiClock /></StatIcon>
          <StatValue>{Math.floor(readingStats.totalTime / 60)}ч</StatValue>
          <StatLabel>Времени чтения</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatIcon><FiTarget /></StatIcon>
          <StatValue>{readingStats.streakDays}</StatValue>
          <StatLabel>Дней подряд</StatLabel>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ChartTitle>Активность чтения (последние 30 дней)</ChartTitle>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString('ru-RU')}
                  formatter={(value, name) => [value, name === 'booksRead' ? 'Книг' : name === 'pagesRead' ? 'Страниц' : 'Минут']}
                />
                <Line
                  type="monotone"
                  dataKey="booksRead"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Книг"
                />
                <Line
                  type="monotone"
                  dataKey="pagesRead"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Страниц"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        <ChartCard
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ChartTitle>Любимые жанры</ChartTitle>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genreStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genreStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>
      </ChartsGrid>

      <InsightsGrid>
        <InsightCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <InsightTitle>
            <FiStar />
            Ваш любимый жанр
          </InsightTitle>
          <InsightText>
            Вы предпочитаете читать <strong>{readingStats.favoriteGenre}</strong>.
            Это составляет {genreStats.find(g => g.name === readingStats.favoriteGenre)?.value || 0}% от всего вашего чтения.
          </InsightText>
        </InsightCard>

        <InsightCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <InsightTitle>
            <FiTrendingUp />
            Прогресс чтения
          </InsightTitle>
          <InsightText>
            Вы читаете в среднем <strong>{Math.round(readingStats.totalPages / Math.max(readingStats.totalBooks, 1))}</strong> страниц на книгу.
            {trends.booksThisWeek > trends.booksLastWeek
              ? ' Отличная динамика! Вы читаете больше, чем на прошлой неделе.'
              : ' Попробуйте читать больше книг на этой неделе!'}
          </InsightText>
        </InsightCard>

        <InsightCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <InsightTitle>
            <FiUsers />
            Социальная активность
          </InsightTitle>
          <InsightText>
            Вы написали <strong>{readingStats.reviewsCount}</strong> отзывов.
            Активные читатели пишут отзывы и помогают другим выбрать хорошие книги!
          </InsightText>
        </InsightCard>
      </InsightsGrid>
    </AnalyticsContainer>
  );
};

export default Analytics;