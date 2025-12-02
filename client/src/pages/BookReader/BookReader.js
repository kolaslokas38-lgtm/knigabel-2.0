import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../../context/UserContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { FiChevronLeft, FiChevronRight, FiSettings, FiBookmark, FiShare2, FiHeart, FiStar, FiMessageSquare } from 'react-icons/fi';
import { FaHeart, FaBookmark } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ReaderContainer = styled.div`
  height: 100vh;
  background: ${props => props.theme.background};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ReaderHeader = styled.div`
  background: ${props => props.theme.card};
  border-bottom: 1px solid ${props => props.theme.border};
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
`;

const BookInfo = styled.div`
  flex: 1;
`;

const BookTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0;
  margin-bottom: 0.25rem;
`;

const BookAuthor = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.textLight};
  margin: 0;
`;

const ReaderActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background: ${props => props.theme.backgroundSecondary};
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.accent};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ReaderContent = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const TextContent = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  font-size: ${props => props.fontSize || '1.1rem'};
  line-height: ${props => props.lineHeight || '1.6'};
  color: ${props => props.theme.text};
  text-align: justify;
  hyphens: auto;
  word-wrap: break-word;
  overflow-y: auto;
  height: 100%;

  p {
    margin-bottom: 1.5rem;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.primary};
    font-weight: 600;
  }

  h1 { font-size: 2em; }
  h2 { font-size: 1.5em; }
  h3 { font-size: 1.2em; }
`;

const ReaderFooter = styled.div`
  background: ${props => props.theme.card};
  border-top: 1px solid ${props => props.theme.border};
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProgressBar = styled.div`
  flex: 1;
  margin: 0 1rem;
`;

const ProgressTrack = styled.div`
  height: 4px;
  background: ${props => props.theme.backgroundSecondary};
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.theme.primary};
  border-radius: 2px;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textLight};
  text-align: center;
  margin-top: 0.5rem;
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NavButton = styled(ActionButton)`
  width: 48px;
  height: 48px;
  font-size: 1.2rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;

    &:hover {
      background: ${props => props.theme.backgroundSecondary};
      transform: none;
    }
  }
`;

const SettingsPanel = styled(motion.div)`
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 300px;
`;

const SettingGroup = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingLabel = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

const SettingSlider = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 6px;
  border-radius: 3px;
  background: ${props => props.theme.backgroundSecondary};
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.primary};
    cursor: pointer;
  }
`;

const SettingValue = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.textLight};
  margin-left: 0.5rem;
`;

// Mock books data (same as in Catalog)
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

const BookReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useContext(UserContext);
  const contentRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bookContent, setBookContent] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(1.1);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Find book by ID
  const book = mockBooks.find(b => b.id === parseInt(id));

  useEffect(() => {
    if (book) {
      setIsFavorite(user?.favorites?.includes(book.id) || false);
      // Load reading progress
      const savedProgress = localStorage.getItem(`book-progress-${book.id}`);
      if (savedProgress) {
        setCurrentPage(parseInt(savedProgress));
      }

      // Generate mock content based on book
      const mockContent = generateBookContent(book);
      setBookContent(mockContent);

      // Split content into pages (simplified)
      const words = mockContent.split(' ');
      setTotalPages(Math.ceil(words.length / 300)); // ~300 words per page

      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [book, user]);

  useEffect(() => {
    // Update progress
    setReadingProgress((currentPage / totalPages) * 100);

    // Save progress
    if (book) {
      localStorage.setItem(`book-progress-${book.id}`, currentPage.toString());
    }
  }, [currentPage, totalPages, book]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Закладка удалена' : 'Закладка добавлена');
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      return;
    }

    const newFavorites = isFavorite
      ? (user.favorites || []).filter(bookId => bookId !== id)
      : [...(user.favorites || []), id];

    const updatedUser = {
      ...user,
      favorites: newFavorites
    };

    updateUser(updatedUser);
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Удалено из избранного' : 'Добавлено в избранное');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: book?.title,
          text: `Читаю "${book?.title}" автора ${book?.author}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Ссылка скопирована');
    }
  };

  const handleFinishBook = async () => {
    if (!user) return;

    try {
      // Update reading stats
      const updatedUser = {
        ...user,
        stats: {
          ...user.stats,
          totalRead: (user.stats.totalRead || 0) + 1,
          totalPagesRead: (user.stats.totalPagesRead || 0) + book?.pages,
        }
      };

      updateUser(updatedUser);

      // Show achievement notification
      toast.success('🎉 Книга прочитана! Получен опыт и достижения!');

      // Navigate back
      navigate('/catalog');
    } catch (error) {
      console.error('Error finishing book:', error);
    }
  };

  const handleSubmitReview = () => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      return;
    }

    if (!reviewComment.trim()) {
      toast.error('Введите текст отзыва');
      return;
    }

    // Load existing reviews
    const existingReviews = JSON.parse(localStorage.getItem('globalReviews') || '[]');

    // Check if user already reviewed this book
    const existingReview = existingReviews.find(review =>
      review.userId === user.id && review.bookId === book.id
    );

    if (existingReview) {
      toast.error('Вы уже писали отзыв на эту книгу');
      return;
    }

    // Create new review
    const newReview = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      rating: reviewRating,
      comment: reviewComment.trim(),
      date: new Date().toISOString().split('T')[0],
      likes: 0
    };

    // Add to reviews
    const updatedReviews = [...existingReviews, newReview];
    localStorage.setItem('globalReviews', JSON.stringify(updatedReviews));

    // Update book rating
    updateBookRating(book.id, reviewRating);

    // Reset form
    setReviewRating(5);
    setReviewComment('');
    setShowReviewModal(false);

    toast.success('Отзыв успешно опубликован!');
  };

  const updateBookRating = (bookId, newRating) => {
    // Find book in mockBooks and update rating
    const bookIndex = mockBooks.findIndex(b => b.id === bookId);
    if (bookIndex !== -1) {
      const book = mockBooks[bookIndex];
      const currentTotalRating = (book.rating || 0) * (book.reviewsCount || 0);
      const newTotalRating = currentTotalRating + newRating;
      const newReviewsCount = (book.reviewsCount || 0) + 1;
      const newAverageRating = Math.round((newTotalRating / newReviewsCount) * 10) / 10;

      mockBooks[bookIndex] = {
        ...book,
        rating: newAverageRating,
        reviewsCount: newReviewsCount
      };

      // Save updated books to localStorage
      localStorage.setItem('books', JSON.stringify(mockBooks));
    }
  };

  // Generate mock book content
  const generateBookContent = (book) => {
    const intro = `Книга "${book.title}" автора ${book.author}\n\n${book.description}\n\n`;
    const content = `Это демонстрационный текст книги. В реальном приложении здесь будет полный текст произведения.\n\n`;

    // Generate some paragraphs based on book pages
    const paragraphs = [];
    const numParagraphs = Math.max(5, Math.floor(book.pages / 50));

    for (let i = 0; i < numParagraphs; i++) {
      paragraphs.push(`Глава ${i + 1}\n\n${content.repeat(3)}\n\n`);
    }

    return intro + paragraphs.join('');
  };

  if (isLoading) {
    return <LoadingSpinner text="Загрузка книги..." />;
  }

  if (!book) {
    return (
      <ReaderContainer>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Книга не найдена</h2>
          <button onClick={() => navigate('/catalog')}>Вернуться к каталогу</button>
        </div>
      </ReaderContainer>
    );
  }

  return (
    <ReaderContainer>
      <ReaderHeader>
        <ActionButton onClick={() => navigate('/catalog')}>
          <FiChevronLeft />
        </ActionButton>

        <BookInfo>
          <BookTitle>{book.title}</BookTitle>
          <BookAuthor>{book.author}</BookAuthor>
        </BookInfo>

        <ReaderActions>
          <ActionButton onClick={handleFavorite}>
            {isFavorite ? <FaHeart color="#E53E3E" /> : <FiHeart />}
          </ActionButton>
          <ActionButton onClick={handleBookmark}>
            {isBookmarked ? <FaBookmark color="#3182CE" /> : <FiBookmark />}
          </ActionButton>
          <ActionButton onClick={handleShare}>
            <FiShare2 />
          </ActionButton>
          <ActionButton onClick={() => setShowReviewModal(true)}>
            <FiMessageSquare />
          </ActionButton>
          <ActionButton onClick={() => setShowSettings(!showSettings)}>
            <FiSettings />
          </ActionButton>
        </ReaderActions>
      </ReaderHeader>

      <ReaderContent>
        <TextContent
          ref={contentRef}
          fontSize={`${fontSize}rem`}
          lineHeight={lineHeight}
          dangerouslySetInnerHTML={{
            __html: bookContent ? bookContent.replace(/\n/g, '<br/>') : 'Содержимое книги загружается...'
          }}
        />

        <AnimatePresence>
          {showSettings && (
            <SettingsPanel
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <SettingGroup>
                <SettingLabel>
                  Размер шрифта: {fontSize}rem
                </SettingLabel>
                <SettingSlider
                  type="range"
                  min="0.8"
                  max="2.0"
                  step="0.1"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseFloat(e.target.value))}
                />
              </SettingGroup>

              <SettingGroup>
                <SettingLabel>
                  Межстрочный интервал: {lineHeight}
                </SettingLabel>
                <SettingSlider
                  type="range"
                  min="1.2"
                  max="2.0"
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                />
              </SettingGroup>
            </SettingsPanel>
          )}
        </AnimatePresence>
      </ReaderContent>

      <ReaderFooter>
        <NavigationButtons>
          <NavButton onClick={handlePreviousPage} disabled={currentPage <= 1}>
            <FiChevronLeft />
          </NavButton>
        </NavigationButtons>

        <ProgressBar>
          <ProgressTrack>
            <ProgressFill style={{ width: `${readingProgress}%` }} />
          </ProgressTrack>
          <ProgressText>
            {currentPage} / {totalPages} страниц ({Math.round(readingProgress)}%)
          </ProgressText>
        </ProgressBar>

        <NavigationButtons>
          <NavButton onClick={handleNextPage} disabled={currentPage >= totalPages}>
            <FiChevronRight />
          </NavButton>
        </NavigationButtons>
      </ReaderFooter>

      {currentPage === totalPages && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed',
            bottom: '120px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#4CAF50',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            cursor: 'pointer',
            zIndex: 1000,
          }}
          onClick={handleFinishBook}
        >
          🎉 Завершить книгу
        </motion.div>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000,
            }}
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ marginBottom: '1.5rem', color: '#1a202c' }}>✍️ Написать отзыв</h3>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a202c' }}>
                  Ваша оценка:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: star <= reviewRating ? '#FFD700' : '#e2e8f0',
                      }}
                    >
                      ★
                    </button>
                  ))}
                  <span style={{ marginLeft: '0.5rem', color: '#4a5568' }}>
                    {reviewRating}/5
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a202c' }}>
                  Ваш отзыв:
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Поделитесь своими впечатлениями о книге..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowReviewModal(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    background: 'white',
                    cursor: 'pointer',
                  }}
                >
                  Отмена
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={!reviewComment.trim()}
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '6px',
                    background: '#3182ce',
                    color: 'white',
                    cursor: reviewComment.trim() ? 'pointer' : 'not-allowed',
                    opacity: reviewComment.trim() ? 1 : 0.5,
                  }}
                >
                  Опубликовать
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ReaderContainer>
  );
};

export default BookReader;