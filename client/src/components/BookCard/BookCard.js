import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { UserContext } from '../../context/UserContext';
import { FiHeart, FiBookOpen, FiStar, FiShare2, FiMessageSquare } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

const Card = styled(motion.div)`
  background: ${props => props.theme.card};
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: ${props => props.theme.cardShadow};
  border: 1px solid ${props => props.theme.border};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.theme.primary};
  }
`;

const BookHeader = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const BookCover = styled.div`
  flex-shrink: 0;
`;

const BookIcon = styled.div`
  width: 70px;
  height: 90px;
  background: ${props => props.theme.backgroundSecondary};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: ${props => props.theme.primary};
  transition: all 0.3s ease;

  ${Card}:hover & {
    background: ${props => props.theme.accent};
    transform: scale(1.05);
  }
`;

const BookInfo = styled.div`
  flex: 1;
`;

const BookTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BookAuthor = styled.p`
  color: ${props => props.theme.secondary};
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
`;

const BookMeta = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.textLight};
  background: ${props => props.theme.backgroundSecondary};
  padding: 0.25rem 0.5rem;
  border-radius: 0.75rem;
  border: 1px solid ${props => props.theme.border};
`;

const BookRating = styled.div`
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
  font-size: 0.9rem;
  color: ${props => props.filled ? '#FFD700' : props.theme.textLight};
`;

const RatingValue = styled.span`
  font-weight: 600;
  color: ${props => props.theme.accent};
  font-size: 0.9rem;
`;

const ReviewsCount = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.textLight};
`;

const BookActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const SocialActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${props => props.theme.border};
`;

const SocialButton = styled(motion.button)`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  background: ${props => props.theme.backgroundSecondary};
  color: ${props => props.theme.text};

  &:hover {
    background: ${props => props.theme.accent};
    transform: translateY(-1px);
  }
`;

const ActionButton = styled(motion.button)`
  padding: 0.5rem 0.6rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;

  ${props => props.primary ? `
    background: ${props.theme.primary};
    color: white;
    border-color: ${props.theme.primary};

    &:hover:not(:disabled) {
      background: ${props.theme.primaryDark};
      transform: translateY(-1px);
    }
  ` : `
    background: ${props.theme.backgroundSecondary};
    color: ${props.theme.text};

    &:hover {
      background: ${props.theme.accent};
      transform: translateY(-1px);
    }
  `}

  &:disabled {
    background: ${props => props.theme.backgroundSecondary};
    color: ${props => props.theme.textLight};
    cursor: not-allowed;
    transform: none;
  }
`;

const FavoriteButton = styled(motion.button)`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: ${props => props.theme.backgroundSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.isFavorite ? '#E53E3E' : props.theme.textLight};
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.border};

  &:hover {
    background: ${props => props.theme.accent};
    transform: scale(1.05);
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  ${props => props.available ? `
    background: #F0FFF4;
    color: #22543D;
    border: 1px solid #C6F6D5;
  ` : `
    background: #FFF5F5;
    color: #742A2A;
    border: 1px solid #FEB2B2;
  `}
`;

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(UserContext);
  const [isFavorite, setIsFavorite] = useState(
    user?.favorites?.includes(book.id) || false
  );

  const handleCardClick = () => {
    navigate(`/book/${book.id}`);
  };

  const handleReadOnline = (e) => {
    e.stopPropagation();
    navigate(`/book/${book.id}`);
  };

  const handleBorrow = (e) => {
    e.stopPropagation();

    if (!user) {
      alert('Необходимо войти в систему');
      return;
    }

    // Simple mock borrowing
    const updatedUser = {
      ...user,
      borrowedBooks: [...(user.borrowedBooks || []), book.id]
    };
    updateUser(updatedUser);

    alert(`Книга "${book.title}" добавлена в ваши книги! Читать онлайн можно в любое время.`);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    alert(`Скачивание книги "${book.title}" пока недоступно. Используйте функцию "Читать онлайн".`);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();

    if (!user) {
      alert('Необходимо войти в систему');
      return;
    }

    const newFavorites = isFavorite
      ? (user.favorites || []).filter(id => id !== book.id)
      : [...(user.favorites || []), book.id];

    const updatedUser = {
      ...user,
      favorites: newFavorites
    };

    updateUser(updatedUser);
    setIsFavorite(!isFavorite);

    alert(isFavorite ? 'Удалено из избранного' : 'Добавлено в избранное');
  };

  const handleShare = (e) => {
    e.stopPropagation();

    const url = `${window.location.origin}/book/${book.id}`;
    navigator.clipboard.writeText(url);
    alert('Ссылка скопирована в буфер обмена!');
  };

  const handleComments = (e) => {
    e.stopPropagation();
    navigate('/reviews');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} filled />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} filled />);
      } else {
        stars.push(<Star key={i} />);
      }
    }

    return stars;
  };

  return (
    <Card
      onClick={handleCardClick}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <StatusBadge available={book.available}>
        {book.available ? 'Доступно' : 'Занято'}
      </StatusBadge>

      <FavoriteButton
        isFavorite={isFavorite}
        onClick={handleFavorite}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isFavorite ? <FaHeart /> : <FiHeart />}
      </FavoriteButton>

      <BookHeader>
        <BookCover>
          <BookIcon>
            {book.icon || '📖'}
          </BookIcon>
        </BookCover>

        <BookInfo>
          <BookTitle>{book.title}</BookTitle>
          <BookAuthor>{book.author}</BookAuthor>

          <BookMeta>
            <MetaItem>{book.year}</MetaItem>
            <MetaItem>{book.genre}</MetaItem>
            <MetaItem>{book.pages} стр.</MetaItem>
          </BookMeta>

          <BookRating>
            <Stars>
              {renderStars(book.rating || 0)}
            </Stars>
            <RatingValue>{book.rating || 0}</RatingValue>
            <ReviewsCount>({book.reviewsCount || 0})</ReviewsCount>
          </BookRating>
        </BookInfo>
      </BookHeader>

      <BookActions>
        <ActionButton
          primary
          onClick={handleReadOnline}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiBookOpen />
          Читать онлайн
        </ActionButton>
        <ActionButton
          onClick={handleBorrow}
          disabled={!book.available}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          📚
          {book.available ? 'Взять книгу' : 'Занято'}
        </ActionButton>
        <ActionButton
          onClick={handleDownload}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ⬇️
          Скачать
        </ActionButton>
      </BookActions>

      <SocialActions>
        <SocialButton
          onClick={handleShare}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiShare2 size={14} />
          Поделиться
        </SocialButton>
        <SocialButton
          onClick={handleComments}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiMessageSquare size={14} />
          Отзывы ({book.reviewsCount || 0})
        </SocialButton>
      </SocialActions>
    </Card>
  );
};

export default BookCard;