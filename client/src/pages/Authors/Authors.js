import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBook, FiCalendar, FiMapPin, FiAward, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const Container = styled.div`
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

const AuthorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const AuthorCard = styled(motion.div)`
  background: ${props => props.theme.card};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.border};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.theme.primary};
  }
`;

const AuthorHeader = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const AuthorAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.theme.backgroundSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
`;

const AuthorInfo = styled.div`
  flex: 1;
`;

const AuthorName = styled.h3`
  color: ${props => props.theme.text};
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
`;

const AuthorDates = styled.p`
  color: ${props => props.theme.textLight};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const AuthorCountry = styled.p`
  color: ${props => props.theme.secondary};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const AuthorBio = styled.p`
  color: ${props => props.theme.textLight};
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const AuthorStats = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: ${props => props.theme.textLight};
`;

const ExpandButton = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.primaryDark};
  }
`;

const ExpandedContent = styled(motion.div)`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.border};
`;

const BooksSection = styled.div`
  margin-bottom: 1.5rem;
`;

const BooksTitle = styled.h4`
  color: ${props => props.theme.text};
  font-size: 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BooksList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const BookTag = styled.span`
  background: ${props => props.theme.backgroundSecondary};
  color: ${props => props.theme.text};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  border: 1px solid ${props => props.theme.border};
`;

const AchievementsSection = styled.div``;

const AchievementsTitle = styled.h4`
  color: ${props => props.theme.text};
  font-size: 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AchievementsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const AchievementItem = styled.li`
  color: ${props => props.theme.textLight};
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:before {
    content: '🏆';
    font-size: 0.8rem;
  }
`;

const authorsData = [
  {
    id: 1,
    name: "Лев Толстой",
    avatar: "👴",
    birthDate: "1828",
    deathDate: "1910",
    country: "Россия",
    bio: "Великий русский писатель, мыслитель и философ. Автор эпических произведений 'Война и мир' и 'Анна Каренина'. Один из самых влиятельных писателей в мировой литературе.",
    books: ["Война и мир", "Анна Каренина", "Воскресение", "Смерть Ивана Ильича"],
    achievements: [
      "Нобелевская премия по литературе (номинация)",
      "Член Российской академии наук",
      "Международное признание"
    ]
  },
  {
    id: 2,
    name: "Федор Достоевский",
    avatar: "🧔",
    birthDate: "1821",
    deathDate: "1881",
    country: "Россия",
    bio: "Русский писатель, философ и публицист. Мастер психологического романа. Его произведения исследуют глубины человеческой души и моральные дилеммы.",
    books: ["Преступление и наказание", "Братья Карамазовы", "Идиот", "Бесы"],
    achievements: [
      "Мировое признание психологического романа",
      "Влияние на экзистенциализм",
      "Классик русской литературы"
    ]
  },
  {
    id: 3,
    name: "Михаил Булгаков",
    avatar: "🎭",
    birthDate: "1891",
    deathDate: "1940",
    country: "Россия",
    bio: "Русский писатель и драматург. Автор знаменитого романа 'Мастер и Маргарита'. Его произведения сочетают сатиру, фантастику и глубокий философский подтекст.",
    books: ["Мастер и Маргарита", "Собачье сердце", "Белая гвардия", "Театральный роман"],
    achievements: [
      "Посмертное признание",
      "Экранизации произведений",
      "Культовая фигура в русской литературе"
    ]
  },
  {
    id: 4,
    name: "Антон Чехов",
    avatar: "🎭",
    birthDate: "1860",
    deathDate: "1904",
    country: "Россия",
    bio: "Русский писатель, драматург и врач. Мастер короткого рассказа и психологической драмы. Его пьесы стали классикой мирового театра.",
    books: ["Чайка", "Дядя Ваня", "Три сестры", "Вишневый сад"],
    achievements: [
      "Мировое признание драматургии",
      "Влияние на современный театр",
      "Медицинское образование"
    ]
  },
  {
    id: 5,
    name: "Александр Пушкин",
    avatar: "👑",
    birthDate: "1799",
    deathDate: "1837",
    country: "Россия",
    bio: "Великий русский поэт, драматург и прозаик. Основоположник современного русского литературного языка. Автор 'Евгения Онегина' и многих шедевров.",
    books: ["Евгений Онегин", "Капитанская дочка", "Полтава", "Медный всадник"],
    achievements: [
      "Основатель русского литературного языка",
      "Национальный поэт России",
      "Влияние на всю русскую литературу"
    ]
  },
  {
    id: 6,
    name: "Максим Горький",
    avatar: "⚒️",
    birthDate: "1868",
    deathDate: "1936",
    country: "Россия",
    bio: "Русский писатель, публицист и общественный деятель. Основатель социалистического реализма в литературе. Автор автобиографической трилогии.",
    books: ["Мать", "На дне", "Детство", "В людях"],
    achievements: [
      "Основатель социалистического реализма",
      "Ленинская премия",
      "Международное признание"
    ]
  }
];

const Authors = () => {
  const [expandedAuthors, setExpandedAuthors] = useState(new Set());

  const toggleExpanded = (authorId) => {
    setExpandedAuthors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(authorId)) {
        newSet.delete(authorId);
      } else {
        newSet.add(authorId);
      }
      return newSet;
    });
  };

  return (
    <Container>
      <Header>
        <Title>
          <FiBook />
          Знаменитые авторы
        </Title>
        <Subtitle>
          Познакомьтесь с великими писателями русской и мировой литературы.
          Узнайте об их жизни, творчестве и вкладе в развитие литературы.
        </Subtitle>
      </Header>

      <AuthorsGrid>
        {authorsData.map((author, index) => (
          <AuthorCard
            key={author.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <AuthorHeader>
              <AuthorAvatar>{author.avatar}</AuthorAvatar>
              <AuthorInfo>
                <AuthorName>{author.name}</AuthorName>
                <AuthorDates>{author.birthDate} - {author.deathDate}</AuthorDates>
                <AuthorCountry>
                  <FiMapPin size={14} />
                  {author.country}
                </AuthorCountry>
              </AuthorInfo>
            </AuthorHeader>

            <AuthorBio>{author.bio}</AuthorBio>

            <AuthorStats>
              <StatItem>
                <FiBook size={14} />
                {author.books.length} книг
              </StatItem>
              <StatItem>
                <FiAward size={14} />
                {author.achievements.length} достижений
              </StatItem>
            </AuthorStats>

            <ExpandButton onClick={() => toggleExpanded(author.id)}>
              {expandedAuthors.has(author.id) ? (
                <>
                  <FiChevronUp size={14} />
                  Свернуть
                </>
              ) : (
                <>
                  <FiChevronDown size={14} />
                  Подробнее
                </>
              )}
            </ExpandButton>

            <AnimatePresence>
              {expandedAuthors.has(author.id) && (
                <ExpandedContent
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BooksSection>
                    <BooksTitle>
                      <FiBook size={16} />
                      Известные произведения
                    </BooksTitle>
                    <BooksList>
                      {author.books.map((book, bookIndex) => (
                        <BookTag key={bookIndex}>{book}</BookTag>
                      ))}
                    </BooksList>
                  </BooksSection>

                  <AchievementsSection>
                    <AchievementsTitle>
                      <FiAward size={16} />
                      Достижения и признание
                    </AchievementsTitle>
                    <AchievementsList>
                      {author.achievements.map((achievement, achIndex) => (
                        <AchievementItem key={achIndex}>
                          {achievement}
                        </AchievementItem>
                      ))}
                    </AchievementsList>
                  </AchievementsSection>
                </ExpandedContent>
              )}
            </AnimatePresence>
          </AuthorCard>
        ))}
      </AuthorsGrid>
    </Container>
  );
};

export default Authors;