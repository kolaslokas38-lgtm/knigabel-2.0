import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { LibraryContext } from '../../context/LibraryContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import BookCard from '../../components/BookCard/BookCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import GenreFilter from '../../components/GenreFilter/GenreFilter';

const CatalogContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SectionTitle = styled.h1`
  color: ${props => props.theme.text};
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
`;

const BooksCount = styled.span`
  color: ${props => props.theme.textLight};
  font-size: 1rem;
  background: ${props => props.theme.borderLight};
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-weight: 500;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
`;

const BooksGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const EmptyState = styled(motion.div)`
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
  margin-bottom: 2rem;
`;

const ClearButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.primaryDark};
    transform: translateY(-2px);
  }
`;

const Catalog = () => {
  const { libraryData } = useContext(LibraryContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock books data - расширенный каталог
  const mockBooks = [
    {
      id: 1,
      title: "Война и мир",
      author: "Лев Толстой",
      genre: "Роман-эпопея",
      description: "Монументальный роман-эпопея, описывающий русское общество в эпоху войн против Наполеона.",
      available: true,
      icon: "📖",
      pages: 1225,
      rating: 4.8,
      reviewsCount: 156
    },
    {
      id: 2,
      title: "Преступление и наказание",
      author: "Федор Достоевский",
      genre: "Психологический роман",
      description: "История бывшего студента Родиона Раскольникова, совершившего убийство.",
      available: true,
      icon: "🔪",
      pages: 672,
      rating: 4.7,
      reviewsCount: 89
    },
    {
      id: 3,
      title: "Мастер и Маргарита",
      author: "Михаил Булгаков",
      genre: "Фантастика",
      description: "Роман о дьяволе, пришедшем в Москву, и о вечной борьбе между добром и злом.",
      available: true,
      icon: "🧙‍♂️",
      pages: 480,
      rating: 4.9,
      reviewsCount: 203
    },
    {
      id: 4,
      title: "Анна Каренина",
      author: "Лев Толстой",
      genre: "Роман",
      description: "История любви Анны Карениной и ее трагической судьбы в свете моральных норм общества.",
      available: true,
      icon: "💔",
      pages: 864,
      rating: 4.6,
      reviewsCount: 134
    },
    {
      id: 5,
      title: "Братья Карамазовы",
      author: "Федор Достоевский",
      genre: "Философский роман",
      description: "Семейная сага о братьях Карамазовых и их духовных поисках.",
      available: true,
      icon: "👥",
      pages: 1016,
      rating: 4.8,
      reviewsCount: 167
    },
    {
      id: 6,
      title: "Доктор Живаго",
      author: "Борис Пастернак",
      genre: "Роман",
      description: "История жизни доктора Юрия Живаго на фоне революционных событий в России.",
      available: true,
      icon: "🏥",
      pages: 592,
      rating: 4.5,
      reviewsCount: 98
    },
    {
      id: 7,
      title: "Тихий Дон",
      author: "Михаил Шолохов",
      genre: "Роман-эпопея",
      description: "Эпопея о жизни донского казачества в период революций и гражданской войны.",
      available: true,
      icon: "🐎",
      pages: 1616,
      rating: 4.7,
      reviewsCount: 145
    },
    {
      id: 8,
      title: "1984",
      author: "Джордж Оруэлл",
      genre: "Антиутопия",
      description: "Дистопия о тоталитарном обществе и потере индивидуальности.",
      available: true,
      icon: "👁️",
      pages: 328,
      rating: 4.6,
      reviewsCount: 234
    },
    {
      id: 9,
      title: "Убийство в Восточном экспрессе",
      author: "Агата Кристи",
      genre: "Детектив",
      description: "Знаменитый детектив Эркюль Пуаро расследует убийство в поезде.",
      available: true,
      icon: "🚂",
      pages: 256,
      rating: 4.4,
      reviewsCount: 189
    },
    {
      id: 10,
      title: "Гарри Поттер и философский камень",
      author: "Джоан Роулинг",
      genre: "Фэнтези",
      description: "Первая книга о приключениях юного волшебника Гарри Поттера.",
      available: true,
      icon: "⚡",
      pages: 336,
      rating: 4.8,
      reviewsCount: 567
    },
    {
      id: 11,
      title: "Шерлок Холмс: Этюд в багровых тонах",
      author: "Артур Конан Дойл",
      genre: "Детектив",
      description: "Первая история о великом сыщике Шерлоке Холмсе и докторе Ватсоне.",
      available: true,
      icon: "🕵️‍♂️",
      pages: 128,
      rating: 4.3,
      reviewsCount: 156
    },
    {
      id: 12,
      title: "Властелин колец: Братство кольца",
      author: "Джон Р. Р. Толкин",
      genre: "Фэнтези",
      description: "Первая часть эпической саги о Средиземье и борьбе со злом.",
      available: true,
      icon: "💍",
      pages: 576,
      rating: 4.9,
      reviewsCount: 423
    },
    {
      id: 13,
      title: "Девушка с татуировкой дракона",
      author: "Стиг Ларссон",
      genre: "Триллер",
      description: "Журналист и хакер расследуют исчезновение девушки 40 лет назад.",
      available: true,
      icon: "🐉",
      pages: 592,
      rating: 4.5,
      reviewsCount: 312
    },
    {
      id: 14,
      title: "Сто лет одиночества",
      author: "Габриэль Гарсия Маркес",
      genre: "Магический реализм",
      description: "Семейная сага рода Буэндиа в вымышленном городе Макондо.",
      available: true,
      icon: "🌪️",
      pages: 448,
      rating: 4.7,
      reviewsCount: 278
    },
    {
      id: 15,
      title: "Маленький принц",
      author: "Антуан де Сент-Экзюпери",
      genre: "Сказка",
      description: "Философская сказка о маленьком принце, путешествующем по планетам.",
      available: true,
      icon: "👑",
      pages: 96,
      rating: 4.8,
      reviewsCount: 345
    },
    {
      id: 16,
      title: "Алиса в Стране чудес",
      author: "Льюис Кэрролл",
      genre: "Сказка",
      description: "Приключения девочки Алисы в волшебной стране чудес.",
      available: true,
      icon: "🐰",
      pages: 272,
      rating: 4.2,
      reviewsCount: 267
    },
    {
      id: 17,
      title: "Гордость и предубеждение",
      author: "Джейн Остин",
      genre: "Роман",
      description: "История любви Элизабет Беннет и мистера Дарси в английском обществе XIX века.",
      available: true,
      icon: "💃",
      pages: 432,
      rating: 4.6,
      reviewsCount: 198
    },
    {
      id: 18,
      title: "Дон Кихот",
      author: "Мигель де Сервантес",
      genre: "Роман",
      description: "История дворянина, сошедшего с ума от чтения рыцарских романов.",
      available: true,
      icon: "🏇",
      pages: 1024,
      rating: 4.4,
      reviewsCount: 167
    },
    {
      id: 19,
      title: "Фауст",
      author: "Иоганн Вольфганг Гёте",
      genre: "Трагедия",
      description: "История доктора Фауста, продавшего душу дьяволу.",
      available: true,
      icon: "🎭",
      pages: 512,
      rating: 4.3,
      reviewsCount: 134
    },
    {
      id: 20,
      title: "Ромео и Джульетта",
      author: "Уильям Шекспир",
      genre: "Трагедия",
      description: "Вечная история любви двух молодых людей из враждующих семей.",
      available: true,
      icon: "💕",
      pages: 336,
      rating: 4.5,
      reviewsCount: 289
    },
    {
      id: 21,
      title: "Герой нашего времени",
      author: "Михаил Лермонтов",
      genre: "Роман",
      description: "Психологический роман о сложном характере Печорина в эпоху романтизма.",
      available: true,
      icon: "🌊",
      pages: 224,
      rating: 4.3,
      reviewsCount: 156
    },
    {
      id: 22,
      title: "Евгений Онегин",
      author: "Александр Пушкин",
      genre: "Роман в стихах",
      description: "Энциклопедия русской жизни в форме романа в стихах.",
      available: true,
      icon: "📜",
      pages: 384,
      rating: 4.6,
      reviewsCount: 203
    },
    {
      id: 23,
      title: "Обломов",
      author: "Иван Гончаров",
      genre: "Роман",
      description: "История о ленивом дворянине Обломове и его жизненной философии.",
      available: true,
      icon: "🛏️",
      pages: 448,
      rating: 4.4,
      reviewsCount: 134
    },
    {
      id: 24,
      title: "Отцы и дети",
      author: "Иван Тургенев",
      genre: "Роман",
      description: "Роман о конфликте поколений и новых идеях в русской обществе.",
      available: true,
      icon: "🌱",
      pages: 352,
      rating: 4.5,
      reviewsCount: 178
    },
    {
      id: 25,
      title: "Вишневый сад",
      author: "Антон Чехов",
      genre: "Пьеса",
      description: "Классическая пьеса о закате дворянских усадеб и переменах в России.",
      available: true,
      icon: "🌸",
      pages: 128,
      rating: 4.7,
      reviewsCount: 245
    },
    {
      id: 26,
      title: "Чайка",
      author: "Антон Чехов",
      genre: "Пьеса",
      description: "Пьеса о театральной жизни и неразделенной любви.",
      available: true,
      icon: "🦅",
      pages: 96,
      rating: 4.3,
      reviewsCount: 167
    },
    {
      id: 27,
      title: "Дядя Ваня",
      author: "Антон Чехов",
      genre: "Пьеса",
      description: "Пьеса о разочаровании в жизни и несбывшихся мечтах.",
      available: true,
      icon: "🌳",
      pages: 80,
      rating: 4.4,
      reviewsCount: 189
    },
    {
      id: 28,
      title: "Три сестры",
      author: "Антон Чехов",
      genre: "Пьеса",
      description: "Пьеса о трех сестрах, мечтающих вернуться в Москву.",
      available: true,
      icon: "👭",
      pages: 112,
      rating: 4.5,
      reviewsCount: 198
    },
    {
      id: 29,
      title: "Иванов",
      author: "Антон Чехов",
      genre: "Пьеса",
      description: "Пьеса о душевном кризисе интеллигента Иванова.",
      available: true,
      icon: "😔",
      pages: 88,
      rating: 4.2,
      reviewsCount: 145
    },
    {
      id: 30,
      title: "Белая гвардия",
      author: "Михаил Булгаков",
      genre: "Роман",
      description: "Роман о семье Турбиных во времена гражданской войны на Украине.",
      available: true,
      icon: "🏛️",
      pages: 352,
      rating: 4.6,
      reviewsCount: 223
    },
    {
      id: 31,
      title: "Роковые яйца",
      author: "Михаил Булгаков",
      genre: "Сатира",
      description: "Сатирическая повесть о научном эксперименте с яйцами динозавров.",
      available: true,
      icon: "🥚",
      pages: 96,
      rating: 4.1,
      reviewsCount: 134
    },
    {
      id: 32,
      title: "Собачье сердце",
      author: "Михаил Булгаков",
      genre: "Сатира",
      description: "Сатирическая повесть о профессоре, превратившем собаку в человека.",
      available: true,
      icon: "🐕",
      pages: 112,
      rating: 4.4,
      reviewsCount: 267
    },
    {
      id: 33,
      title: "Записки юного врача",
      author: "Михаил Булгаков",
      genre: "Автобиография",
      description: "Рассказы о первых годах работы молодого врача в российской глубинке.",
      available: true,
      icon: "⚕️",
      pages: 224,
      rating: 4.5,
      reviewsCount: 189
    },
    {
      id: 34,
      title: "Театральный роман",
      author: "Михаил Булгаков",
      genre: "Роман",
      description: "Роман о театральной жизни и борьбе драматурга за постановку своей пьесы.",
      available: true,
      icon: "🎪",
      pages: 288,
      rating: 4.3,
      reviewsCount: 156
    },
    {
      id: 35,
      title: "Мертвые души",
      author: "Николай Гоголь",
      genre: "Поэма",
      description: "Поэма о странствующем Чичикове, покупающем мертвые души.",
      available: true,
      icon: "👻",
      pages: 352,
      rating: 4.7,
      reviewsCount: 234
    },
    {
      id: 36,
      title: "Ревизор",
      author: "Николай Гоголь",
      genre: "Комедия",
      description: "Комедия о чиновниках, принявших молодого человека за ревизора.",
      available: true,
      icon: "👮",
      pages: 128,
      rating: 4.6,
      reviewsCount: 198
    },
    {
      id: 37,
      title: "Шинель",
      author: "Николай Гоголь",
      genre: "Повесть",
      description: "Повесть о скромном чиновнике Башмачкине и его шинели.",
      available: true,
      icon: "🧥",
      pages: 64,
      rating: 4.4,
      reviewsCount: 167
    },
    {
      id: 38,
      title: "Нос",
      author: "Николай Гоголь",
      genre: "Повесть",
      description: "Фантастическая повесть о носе майора Ковалёва, сбежавшем от хозяина.",
      available: true,
      icon: "👃",
      pages: 48,
      rating: 4.2,
      reviewsCount: 145
    },
    {
      id: 39,
      title: "Вий",
      author: "Николай Гоголь",
      genre: "Повесть",
      description: "Ужасная повесть о студенте, столкнувшемся с ведьмой и Вием.",
      available: true,
      icon: "👹",
      pages: 56,
      rating: 4.3,
      reviewsCount: 178
    },
    {
      id: 40,
      title: "Капитанская дочка",
      author: "Александр Пушкин",
      genre: "Повесть",
      description: "Историческая повесть о событиях пугачевского бунта.",
      available: true,
      icon: "⚔️",
      pages: 192,
      rating: 4.5,
      reviewsCount: 189
    },
    {
      id: 41,
      title: "Пиковая дама",
      author: "Александр Пушкин",
      genre: "Повесть",
      description: "Психологическая повесть о карточной игре и таинственной старухе.",
      available: true,
      icon: "🃏",
      pages: 64,
      rating: 4.4,
      reviewsCount: 156
    },
    {
      id: 42,
      title: "Повести Белкина",
      author: "Александр Пушкин",
      genre: "Повести",
      description: "Цикл из пяти повестей, рассказанных вымышленным Белкиным.",
      available: true,
      icon: "📚",
      pages: 224,
      rating: 4.3,
      reviewsCount: 134
    },
    {
      id: 43,
      title: "Медный всадник",
      author: "Александр Пушкин",
      genre: "Поэма",
      description: "Поэма о Петербурге, Петре I и судьбе маленького человека.",
      available: true,
      icon: "🏇",
      pages: 48,
      rating: 4.6,
      reviewsCount: 167
    },
    {
      id: 44,
      title: "Полтава",
      author: "Александр Пушкин",
      genre: "Поэма",
      description: "Историческая поэма о Полтавской битве и любви Мазепы.",
      available: true,
      icon: "⚔️",
      pages: 64,
      rating: 4.2,
      reviewsCount: 123
    },
    {
      id: 45,
      title: "Борис Годунов",
      author: "Александр Пушкин",
      genre: "Трагедия",
      description: "Историческая трагедия о царе Борисе Годунове.",
      available: true,
      icon: "👑",
      pages: 192,
      rating: 4.4,
      reviewsCount: 145
    },
    {
      id: 46,
      title: "Скупой рыцарь",
      author: "Александр Пушкин",
      genre: "Трагедия",
      description: "Маленькая трагедия о скупом бароне и его сыновьях.",
      available: true,
      icon: "💰",
      pages: 32,
      rating: 4.1,
      reviewsCount: 98
    },
    {
      id: 47,
      title: "Моцарт и Сальери",
      author: "Александр Пушкин",
      genre: "Трагедия",
      description: "Трагедия о зависти Сальери к гениальному Моцарту.",
      available: true,
      icon: "🎼",
      pages: 24,
      rating: 4.3,
      reviewsCount: 134
    },
    {
      id: 48,
      title: "Каменный гость",
      author: "Александр Пушкин",
      genre: "Трагедия",
      description: "Трагедия о Дон Гуане и статуе командора.",
      available: true,
      icon: "🗿",
      pages: 32,
      rating: 4.2,
      reviewsCount: 112
    },
    {
      id: 49,
      title: "Пир во время чумы",
      author: "Александр Пушкин",
      genre: "Трагедия",
      description: "Трагедия о пире во время эпидемии чумы.",
      available: true,
      icon: "🍽️",
      pages: 24,
      rating: 4.0,
      reviewsCount: 89
    },
    {
      id: 50,
      title: "Русалка",
      author: "Александр Пушкин",
      genre: "Трагедия",
      description: "Незаконченная трагедия о любви мельника к русалке.",
      available: true,
      icon: "🧜‍♀️",
      pages: 40,
      rating: 4.1,
      reviewsCount: 76
    }
  ];

  // Update filtered books when data changes
  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      let books = mockBooks;

      // Load updated books from localStorage (with updated ratings)
      const storedBooks = localStorage.getItem('books');
      if (storedBooks) {
        try {
          const parsedBooks = JSON.parse(storedBooks);
          if (parsedBooks && parsedBooks.length > 0) {
            books = parsedBooks;
          }
        } catch (error) {
          console.error('Error loading books from localStorage:', error);
        }
      }

      if (libraryData?.books && libraryData.books.length > 0) {
        books = libraryData.books;
      }

      // Filter by search query
      if (searchQuery) {
        books = books.filter(book =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.genre.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by genre
      if (selectedGenre && selectedGenre !== 'Все жанры') {
        books = books.filter(book => book.genre === selectedGenre);
      }

      setFilteredBooks(books);
      setIsLoading(false);
    }, 500); // Simulate loading delay
  }, [searchQuery, selectedGenre, libraryData]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleGenreFilter = (genre) => {
    setSelectedGenre(genre);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
  };

  if (isLoading) {
    return <LoadingSpinner text="Загрузка каталога..." />;
  }


  return (
    <CatalogContainer>
      <SectionHeader>
        <SectionTitle>Каталог книг</SectionTitle>
        <BooksCount>{filteredBooks.length} книг</BooksCount>
      </SectionHeader>

      <FiltersContainer>
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Поиск по названию, автору или жанру..."
        />
        <GenreFilter
          value={selectedGenre}
          onChange={handleGenreFilter}
          genres={['Роман-эпопея', 'Психологический роман', 'Фантастика', 'Роман', 'Философский роман', 'Антиутопия', 'Детектив', 'Фэнтези', 'Триллер', 'Магический реализм', 'Сказка', 'Трагедия']}
        />
      </FiltersContainer>

      <AnimatePresence mode="wait">
        {filteredBooks.length > 0 ? (
          <BooksGrid
            key="books-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </BooksGrid>
        ) : (
          <EmptyState
            key="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <EmptyIcon>📚</EmptyIcon>
            <EmptyTitle>Книги не найдены</EmptyTitle>
            <EmptyText>
              {searchQuery || selectedGenre
                ? 'Попробуйте изменить поисковый запрос или фильтр'
                : 'Каталог пока пуст'}
            </EmptyText>
            {(searchQuery || selectedGenre) && (
              <ClearButton onClick={clearFilters}>
                Сбросить фильтры
              </ClearButton>
            )}
          </EmptyState>
        )}
      </AnimatePresence>
    </CatalogContainer>
  );
};

export default Catalog;