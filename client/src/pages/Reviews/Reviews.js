import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../../context/UserContext';
import { LibraryContext } from '../../context/LibraryContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { FiStar, FiThumbsUp, FiMessageSquare, FiFilter } from 'react-icons/fi';
import { FaStar, FaThumbsUp } from 'react-icons/fa';
import toast from 'react-hot-toast';

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
`;

const Subtitle = styled.p`
  color: ${props => props.theme.textLight};
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.card};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const ReviewsGrid = styled.div`
  display: grid;
  gap: 2rem;
`;

const ReviewCard = styled(motion.div)`
  background: ${props => props.theme.card};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.cardShadow};
  border: 1px solid ${props => props.theme.border};
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
`;

const UserDetails = styled.div``;

const UserName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const ReviewDate = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.textLight};
`;

const BookInfo = styled.div`
  text-align: right;
`;

const BookTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.primary};
  margin-bottom: 0.25rem;
`;

const BookAuthor = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textLight};
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const Star = styled(FiStar)`
  font-size: 1rem;
  color: ${props => props.filled ? '#FFD700' : props.theme.textLight};
`;

const RatingValue = styled.span`
  font-weight: 600;
  color: ${props => props.theme.accent};
`;

const ReviewText = styled.p`
  color: ${props => props.theme.text};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ReviewActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LikeButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background: ${props => props.theme.backgroundSecondary};
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: ${props => props.theme.accent};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LikeCount = styled.span`
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textLight};
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
`;

const Reviews = () => {
  const { user } = useContext(UserContext);
  const { libraryData } = useContext(LibraryContext);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [filterByBook, setFilterByBook] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Mock reviews data - in real app this would come from API
  const mockReviews = [
    {
      id: 1,
      userId: 'user1',
      userName: 'Анна Петрова',
      userAvatar: '👩‍🎓',
      bookId: 1,
      bookTitle: 'Война и мир',
      bookAuthor: 'Лев Толстой',
      rating: 5,
      comment: 'Потрясающее произведение! Толстой мастерски описывает эпоху и характеры персонажей. Обязательно к прочтению для каждого образованного человека.',
      date: '2024-12-01',
      likes: 12
    },
    {
      id: 2,
      userId: 'user2',
      userName: 'Михаил Сидоров',
      userAvatar: '👨‍💼',
      bookId: 2,
      bookTitle: 'Преступление и наказание',
      bookAuthor: 'Федор Достоевский',
      rating: 4,
      comment: 'Очень глубокий психологический роман. Раскольников - сложный и противоречивый персонаж. Достоевский заставляет задуматься о многих философских вопросах.',
      date: '2024-11-28',
      likes: 8
    },
    {
      id: 3,
      userId: 'user3',
      userName: 'Елена Козлова',
      userAvatar: '👩‍🎨',
      bookId: 3,
      bookTitle: 'Мастер и Маргарита',
      userAvatar: '👩‍🎨',
      rating: 5,
      comment: 'Любимая книга! Воланд, Маргарита, Мастер - все персонажи незабываемы. Булгаков создал настоящий шедевр сатиры и фантастики.',
      date: '2024-11-25',
      likes: 15
    },
    {
      id: 4,
      userId: 'user4',
      userName: 'Дмитрий Иванов',
      userAvatar: '👨‍🎓',
      bookId: 4,
      bookTitle: 'Анна Каренина',
      bookAuthor: 'Лев Толстой',
      rating: 4,
      comment: 'История любви и трагедии. Анна - яркий и трагический персонаж. Толстой показывает, как общественные нормы могут разрушить жизнь человека.',
      date: '2024-11-20',
      likes: 6
    },
    {
      id: 5,
      userId: 'user5',
      userName: 'Ольга Смирнова',
      userAvatar: '👩‍💻',
      bookId: 10,
      bookTitle: 'Гарри Поттер и философский камень',
      bookAuthor: 'Джоан Роулинг',
      rating: 5,
      comment: 'Волшебная история! Даже взрослому интересно читать. Джоан Роулинг создала удивительный мир, в который хочется возвращаться снова и снова.',
      date: '2024-11-18',
      likes: 20
    }
  ];

  useEffect(() => {
    // Load reviews from localStorage or use mock data
    const loadReviews = () => {
      const storedReviews = localStorage.getItem('globalReviews');
      if (storedReviews) {
        try {
          const parsedReviews = JSON.parse(storedReviews);
          setReviews(parsedReviews);
          setFilteredReviews(parsedReviews);
        } catch (error) {
          console.error('Error loading reviews:', error);
          setReviews(mockReviews);
          setFilteredReviews(mockReviews);
        }
      } else {
        setReviews(mockReviews);
        setFilteredReviews(mockReviews);
        // Save mock reviews to localStorage
        localStorage.setItem('globalReviews', JSON.stringify(mockReviews));
      }
      setIsLoading(false);
    };

    loadReviews();
  }, []);

  useEffect(() => {
    let filtered = [...reviews];

    // Filter by book
    if (filterByBook) {
      filtered = filtered.filter(review => review.bookId === parseInt(filterByBook));
    }

    // Sort reviews
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'rating-high':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-low':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'most-liked':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      default:
        break;
    }

    setFilteredReviews(filtered);
  }, [reviews, sortBy, filterByBook]);

  const handleLike = (reviewId) => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      return;
    }

    const updatedReviews = reviews.map(review => {
      if (review.id === reviewId) {
        return { ...review, likes: review.likes + 1 };
      }
      return review;
    });

    setReviews(updatedReviews);
    localStorage.setItem('globalReviews', JSON.stringify(updatedReviews));
    toast.success('Лайк добавлен!');
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} filled={i <= rating} />
      );
    }
    return stars;
  };

  const getBookOptions = () => {
    if (!libraryData?.books) return [];
    return libraryData.books.map(book => (
      <option key={book.id} value={book.id}>
        {book.title} - {book.author}
      </option>
    ));
  };

  if (isLoading) {
    return <LoadingSpinner text="Загрузка отзывов..." />;
  }

  return (
    <Container>
      <Header>
        <Title>💬 Отзывы читателей</Title>
        <Subtitle>
          Читайте мнения других пользователей и делитесь своими впечатлениями о прочитанных книгах
        </Subtitle>
      </Header>

      <FiltersContainer>
        <FilterSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Сначала новые</option>
          <option value="oldest">Сначала старые</option>
          <option value="rating-high">Высокий рейтинг</option>
          <option value="rating-low">Низкий рейтинг</option>
          <option value="most-liked">Больше всего лайков</option>
        </FilterSelect>

        <FilterSelect value={filterByBook} onChange={(e) => setFilterByBook(e.target.value)}>
          <option value="">Все книги</option>
          {getBookOptions()}
        </FilterSelect>
      </FiltersContainer>

      <AnimatePresence mode="wait">
        {filteredReviews.length > 0 ? (
          <ReviewsGrid>
            {filteredReviews.map((review, index) => (
              <ReviewCard
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <ReviewHeader>
                  <UserInfo>
                    <UserAvatar>{review.userAvatar}</UserAvatar>
                    <UserDetails>
                      <UserName>{review.userName}</UserName>
                      <ReviewDate>{new Date(review.date).toLocaleDateString('ru-RU')}</ReviewDate>
                    </UserDetails>
                  </UserInfo>
                  <BookInfo>
                    <BookTitle>{review.bookTitle}</BookTitle>
                    <BookAuthor>{review.bookAuthor}</BookAuthor>
                  </BookInfo>
                </ReviewHeader>

                <RatingContainer>
                  <Stars>
                    {renderStars(review.rating)}
                  </Stars>
                  <RatingValue>{review.rating}/5</RatingValue>
                </RatingContainer>

                <ReviewText>{review.comment}</ReviewText>

                <ReviewActions>
                  <LikeButton
                    onClick={() => handleLike(review.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaThumbsUp />
                    <LikeCount>{review.likes}</LikeCount>
                  </LikeButton>
                </ReviewActions>
              </ReviewCard>
            ))}
          </ReviewsGrid>
        ) : (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyTitle>Отзывов пока нет</EmptyTitle>
            <EmptyText>
              Будьте первым, кто поделится мнением о прочитанных книгах!
            </EmptyText>
          </EmptyState>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default Reviews;