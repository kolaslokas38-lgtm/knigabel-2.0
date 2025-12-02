import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../../context/UserContext';
import { FiBookOpen, FiPlay, FiCheckCircle, FiClock, FiStar, FiChevronRight, FiAward, FiTrendingUp } from 'react-icons/fi';

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

const NavigationTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const TabButton = styled.button`
  padding: 1rem 2rem;
  border: none;
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.active ? props.theme.primaryDark : props.theme.accent};
  }
`;

const ContentArea = styled.div`
  min-height: 600px;
`;

const ProgressCard = styled.div`
  background: ${props => props.theme.card};
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid ${props => props.theme.border};
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ProgressTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProgressStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textLight};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.backgroundSecondary};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  border-radius: 4px;
  width: ${props => props.percentage}%;
  transition: width 0.5s ease;
`;

const LessonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const LessonCard = styled(motion.div)`
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

const LessonHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const LessonIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: ${props => props.completed ? props.theme.success : props.theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
`;

const LessonStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: ${props => props.completed ? props.theme.success : props.theme.textLight};
`;

const LessonTitle = styled.h4`
  color: ${props => props.theme.text};
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const LessonDescription = styled.p`
  color: ${props => props.theme.textLight};
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
`;

const LessonMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: ${props => props.theme.textLight};
`;

const QuizCard = styled(motion.div)`
  background: ${props => props.theme.card};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.border};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.theme.secondary};
  }
`;

const QuizHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const QuizIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: ${props => props.completed ? '#48bb78' : '#ed8936'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
`;

const QuizScore = styled.div`
  text-align: right;
`;

const QuizBestScore = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.theme.secondary};
`;

const QuizAttempts = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.textLight};
`;

const QuizTitle = styled.h4`
  color: ${props => props.theme.text};
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const QuizDescription = styled.p`
  color: ${props => props.theme.textLight};
  font-size: 0.9rem;
  line-height: 1.4;
`;

const AuthorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const AuthorCard = styled(motion.div)`
  background: ${props => props.theme.card};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.border};
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.theme.accent};
  }
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
  margin: 0 auto 1rem;
`;

const AuthorName = styled.h4`
  color: ${props => props.theme.text};
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const AuthorPeriod = styled.p`
  color: ${props => props.theme.textLight};
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const AuthorBooks = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.secondary};
  font-weight: 500;
`;

const lessonsData = [
  {
    id: 1,
    title: "Введение в русскую литературу",
    description: "Основные этапы развития русской литературы от древности до наших дней.",
    duration: "15 мин",
    difficulty: "Начинающий",
    completed: false,
    content: `
      <h2>Введение в русскую литературу</h2>
      <p>Русская литература - одна из самых богатых и влиятельных литератур мира. Она развивалась на протяжении многих веков, от древних летописей до современных произведений.</p>

      <h3>Основные этапы развития:</h3>
      <ul>
        <li><strong>Древнерусская литература (XI-XVII вв.)</strong> - летописи, жития святых, "Слово о полку Игореве"</li>
        <li><strong>Литература XVIII века</strong> - классицизм, сентиментализм, первые романы</li>
        <li><strong>Золотой век (первая половина XIX в.)</strong> - Пушкин, Лермонтов, Гоголь</li>
        <li><strong>Реализм второй половины XIX в.</strong> - Толстой, Достоевский, Тургенев</li>
        <li><strong>Серебряный век (конец XIX - начало XX в.)</strong> - символизм, акмеизм, футуризм</li>
        <li><strong>Советская литература (1917-1991)</strong> - социалистический реализм</li>
        <li><strong>Современная литература</strong> - разнообразие стилей и направлений</li>
      </ul>

      <p>Русская литература всегда отличалась глубоким психологизмом, философским подтекстом и вниманием к социальным проблемам общества.</p>
    `
  },
  {
    id: 2,
    title: "Александр Сергеевич Пушкин",
    description: "Жизнь и творчество основателя русского литературного языка.",
    duration: "20 мин",
    difficulty: "Средний",
    completed: false,
    content: `
      <h2>Александр Сергеевич Пушкин (1799-1837)</h2>
      <p>Великий русский поэт, драматург и прозаик, основатель современного русского литературного языка.</p>

      <h3>Жизнь и творчество:</h3>
      <ul>
        <li>Родился в Москве в дворянской семье</li>
        <li>Учился в Царскосельском лицее</li>
        <li>Написал более 800 произведений</li>
        <li>Создал русский литературный язык</li>
        <li>Погиб на дуэли в возрасте 37 лет</li>
      </ul>

      <h3>Главные произведения:</h3>
      <ul>
        <li><strong>"Евгений Онегин"</strong> - роман в стихах</li>
        <li><strong>"Капитанская дочка"</strong> - историческая повесть</li>
        <li><strong>"Медный всадник"</strong> - поэма</li>
        <li><strong>"Полтава"</strong> - поэма</li>
        <li><strong>Маленькие трагедии</strong> - цикл драм</li>
      </ul>

      <p>Пушкин считается основателем русской литературы в ее современном виде и оказал огромное влияние на всех последующих русских писателей.</p>
    `
  },
  {
    id: 3,
    title: "Лев Толстой и его эпопеи",
    description: "Анализ произведений 'Война и мир' и 'Анна Каренина'.",
    duration: "25 мин",
    difficulty: "Продвинутый",
    completed: false,
    content: `
      <h2>Лев Николаевич Толстой (1828-1910)</h2>
      <p>Великий русский писатель, мыслитель и философ, один из самых влиятельных авторов мировой литературы.</p>

      <h3>Жизнь:</h3>
      <ul>
        <li>Родился в Ясной Поляне в дворянской семье</li>
        <li>Участник Крымской войны</li>
        <li>Педагог, проповедник толстовства</li>
        <li>Умер в возрасте 82 лет на станции Астапово</li>
      </ul>

      <h3>Главные произведения:</h3>
      <h4>"Война и мир" (1869)</h4>
      <p>Эпический роман о жизни русского общества во времена войн с Наполеоном. В произведении участвуют более 500 персонажей, показана жизнь различных слоев общества.</p>

      <h4>"Анна Каренина" (1877)</h4>
      <p>Роман о трагической любви Анны Карениной. Исследует темы любви, брака, семьи и общества. Знаменитая фраза: "Все счастливые семьи похожи друг на друга, каждая несчастливая семья несчастлива по-своему."</p>

      <h4>Другие произведения:</h4>
      <ul>
        <li>"Воскресение"</li>
        <li>"Смерть Ивана Ильича"</li>
        <li>"Крейцерова соната"</li>
        <li>Автобиографическая трилогия</li>
      </ul>
    `
  },
  {
    id: 4,
    title: "Федор Достоевский: Психология души",
    description: "Глубокий анализ психологических романов великого писателя.",
    duration: "30 мин",
    difficulty: "Продвинутый",
    completed: false,
    content: `
      <h2>Федор Михайлович Достоевский (1821-1881)</h2>
      <p>Русский писатель, философ и публицист, мастер психологического романа.</p>

      <h3>Жизнь:</h3>
      <ul>
        <li>Родился в Москве в семье врача</li>
        <li>Участник кружка петрашевцев</li>
        <li>Приговорен к смертной казни, замененной каторгой</li>
        <li>Вернулся из ссылки в 1859 году</li>
        <li>Умер в Петербурге</li>
      </ul>

      <h3>Главные произведения:</h3>
      <h4>"Преступление и наказание" (1866)</h4>
      <p>История студента Раскольникова, совершившего убийство. Исследует темы морали, совести и наказания.</p>

      <h4>"Братья Карамазовы" (1880)</h4>
      <p>Философский роман о трех братьях и их отце. Ставит вопросы веры, атеизма и человеческой природы.</p>

      <h4>Другие произведения:</h4>
      <ul>
        <li>"Идиот"</li>
        <li>"Бесы"</li>
        <li>"Подросток"</li>
        <li>"Записки из подполья"</li>
      </ul>

      <p>Достоевский считается одним из величайших психологов в мировой литературе.</p>
    `
  },
  {
    id: 5,
    title: "Серебряный век русской поэзии",
    description: "Блок, Ахматова, Маяковский и другие великие поэты.",
    duration: "20 мин",
    difficulty: "Средний",
    completed: false,
    content: `
      <h2>Серебряный век русской поэзии (1890-1920)</h2>
      <p>Период расцвета русской поэзии, характеризующийся разнообразием стилей и направлений.</p>

      <h3>Основные направления:</h3>
      <h4>Символизм</h4>
      <ul>
        <li><strong>Александр Блок</strong> - "Двенадцать", лирика</li>
        <li><strong>Андрей Белый</strong> - экспериментальная поэзия</li>
        <li><strong>Вячеслав Иванов</strong> - философская лирика</li>
      </ul>

      <h4>Акмеизм</h4>
      <ul>
        <li><strong>Анна Ахматова</strong> - "Реквием", "Поэма без героя"</li>
        <li><strong>Осип Мандельштам</strong> - философская лирика</li>
        <li><strong>Николай Гумилев</strong> - экзотическая поэзия</li>
      </ul>

      <h4>Футуризм</h4>
      <ul>
        <li><strong>Владимир Маяковский</strong> - "Облако в штанах", "Флейта-позвоночник"</li>
        <li><strong>Велимир Хлебников</strong> - заумная поэзия</li>
        <li><strong>Алексей Крученых</strong> - эксперименты со звуком</li>
      </ul>

      <h4>Другие поэты:</h4>
      <ul>
        <li><strong>Марина Цветаева</strong> - страстная лирика</li>
        <li><strong>Борис Пастернак</strong> - "Сестра моя жизнь"</li>
        <li><strong>Сергей Есенин</strong> - лирика о русской природе</li>
      </ul>
    `
  },
  {
    id: 6,
    title: "Советская литература",
    description: "От Горького до Солженицына: ключевые произведения и авторы.",
    duration: "25 мин",
    difficulty: "Средний",
    completed: false,
    content: `
      <h2>Советская литература (1917-1991)</h2>
      <p>Литература периода существования Советского Союза, характеризующаяся разнообразием стилей и идеологическим контролем.</p>

      <h3>Основные периоды:</h3>
      <h4>1920-е годы - Авангард и эксперименты</h4>
      <ul>
        <li><strong>Максим Горький</strong> - "Мать", основатель социалистического реализма</li>
        <li><strong>Владимир Маяковский</strong> - поэзия, драматургия</li>
        <li><strong>Борис Пильняк</strong> - экспериментальная проза</li>
      </ul>

      <h4>1930-1950-е - Социалистический реализм</h4>
      <ul>
        <li><strong>Александр Фадеев</strong> - "Разгром"</li>
        <li><strong>Михаил Шолохов</strong> - "Тихий Дон"</li>
        <li><strong>Константин Симонов</strong> - военная лирика</li>
      </ul>

      <h4>1950-1980-е - "Оттепель" и диссидентство</h4>
      <ul>
        <li><strong>Александр Солженицын</strong> - "Архипелаг ГУЛАГ", "Один день Ивана Денисовича"</li>
        <li><strong>Борис Пастернак</strong> - "Доктор Живаго"</li>
        <li><strong>Иосиф Бродский</strong> - поэзия, Нобелевская премия</li>
        <li><strong>Андрей Сахаров</strong> - мемуары</li>
      </ul>

      <h4>Другие важные авторы:</h4>
      <ul>
        <li><strong>Анна Ахматова</strong> - "Реквием"</li>
        <li><strong>Михаил Булгаков</strong> - "Мастер и Маргарита" (опубликовано посмертно)</li>
        <li><strong>Василий Гроссман</strong> - "Жизнь и судьба"</li>
        <li><strong>Георгий Владимов</strong> - "Верный Руслан"</li>
      </ul>
    `
  }
];

const quizzesData = [
  {
    id: 1,
    title: "Классическая литература",
    description: "Проверьте знания о произведениях Пушкина, Толстого и Достоевского.",
    questions: 10,
    bestScore: 0,
    attempts: 0,
    questionsData: [
      {
        question: "Кто написал роман 'Война и мир'?",
        options: ["Федор Достоевский", "Лев Толстой", "Александр Пушкин", "Михаил Булгаков"],
        correct: 1
      },
      {
        question: "Какое произведение Достоевского считается его главным романом?",
        options: ["Бесы", "Братья Карамазовы", "Идиот", "Подросток"],
        correct: 1
      },
      {
        question: "Кто является автором 'Евгения Онегина'?",
        options: ["Михаил Лермонтов", "Александр Пушкин", "Николай Гоголь", "Иван Тургенев"],
        correct: 1
      },
      {
        question: "В каком году был написан роман 'Анна Каренина'?",
        options: ["1869", "1877", "1881", "1899"],
        correct: 1
      },
      {
        question: "Какое произведение Булгакова стало самым известным?",
        options: ["Белая гвардия", "Мастер и Маргарита", "Собачье сердце", "Театральный роман"],
        correct: 1
      },
      {
        question: "Кто написал 'Мертвые души'?",
        options: ["Александр Пушкин", "Николай Гоголь", "Иван Гончаров", "Михаил Лермонтов"],
        correct: 1
      },
      {
        question: "Какой роман Чехова считается самым известным?",
        options: ["Чайка", "Дядя Ваня", "Три сестры", "Вишневый сад"],
        correct: 3
      },
      {
        question: "В каком произведении действует Чичиков?",
        options: ["Ревизор", "Мертвые души", "Шинель", "Нос"],
        correct: 1
      },
      {
        question: "Кто написал 'Героя нашего времени'?",
        options: ["Александр Пушкин", "Михаил Лермонтов", "Николай Гоголь", "Иван Тургенев"],
        correct: 1
      },
      {
        question: "Какое произведение считается вершиной творчества Толстого?",
        options: ["Воскресение", "Анна Каренина", "Война и мир", "Смерть Ивана Ильича"],
        correct: 2
      }
    ]
  },
  {
    id: 2,
    title: "Русские поэты",
    description: "Викторина по творчеству великих русских поэтов.",
    questions: 10,
    bestScore: 0,
    attempts: 0,
    questionsData: [
      {
        question: "Кто считается основателем русского литературного языка?",
        options: ["Михаил Лермонтов", "Александр Пушкин", "Федор Тютчев", "Афанасий Фет"],
        correct: 1
      },
      {
        question: "Какое произведение Пушкина написано в форме романа в стихах?",
        options: ["Полтава", "Медный всадник", "Евгений Онегин", "Капитанская дочка"],
        correct: 2
      },
      {
        question: "Кто написал поэму 'Демон'?",
        options: ["Александр Пушкин", "Михаил Лермонтов", "Николай Некрасов", "Иван Бунин"],
        correct: 1
      },
      {
        question: "Какой поэт написал 'Я помню чудное мгновенье'?",
        options: ["Михаил Лермонтов", "Александр Пушкин", "Федор Тютчев", "Афанасий Фет"],
        correct: 1
      },
      {
        question: "Кто является автором стихотворения 'Бородино'?",
        options: ["Александр Пушкин", "Михаил Лермонтов", "Николай Некрасов", "Иван Бунин"],
        correct: 1
      },
      {
        question: "Какое стихотворение Лермонтова стало народным?",
        options: ["Парус", "Выхожу один я на дорогу", "Родина", "Бородино"],
        correct: 1
      },
      {
        question: "Кто написал 'Стихи о любви'?",
        options: ["Александр Блок", "Андрей Белый", "Владимир Маяковский", "Борис Пастернак"],
        correct: 0
      },
      {
        question: "Какой поэт написал 'Облако в штанах'?",
        options: ["Александр Блок", "Владимир Маяковский", "Борис Пастернак", "Осип Мандельштам"],
        correct: 1
      },
      {
        question: "Кто написал 'Сестра моя жизнь'?",
        options: ["Александр Блок", "Борис Пастернак", "Владимир Маяковский", "Осип Мандельштам"],
        correct: 1
      },
      {
        question: "Какой поэт написал 'Реквием'?",
        options: ["Анна Ахматова", "Марина Цветаева", "Белла Ахмадулина", "Нина Берberова"],
        correct: 0
      }
    ]
  },
  {
    id: 3,
    title: "Литературные жанры",
    description: "Определите жанры произведений и стили авторов.",
    questions: 10,
    bestScore: 0,
    attempts: 0,
    questionsData: [
      {
        question: "К какому жанру относится 'Война и мир'?",
        options: ["Роман-эпопея", "Психологический роман", "Исторический роман", "Философский роман"],
        correct: 0
      },
      {
        question: "Какой жанр у произведения 'Преступление и наказание'?",
        options: ["Детектив", "Психологический роман", "Философский роман", "Социальный роман"],
        correct: 1
      },
      {
        question: "К какому жанру относится 'Мастер и Маргарита'?",
        options: ["Фэнтези", "Сатирический роман", "Мистический роман", "Исторический роман"],
        correct: 1
      },
      {
        question: "Какой жанр у пьесы 'Вишневый сад'?",
        options: ["Трагедия", "Комедия", "Драма", "Трагикомедия"],
        correct: 3
      },
      {
        question: "К какому жанру относится 'Мертвые души'?",
        options: ["Роман", "Поэма", "Повесть", "Комедия"],
        correct: 1
      },
      {
        question: "Какой жанр у произведения 'Шинель'?",
        options: ["Рассказ", "Повесть", "Новелла", "Сказка"],
        correct: 1
      },
      {
        question: "К какому жанру относится 'Евгений Онегин'?",
        options: ["Поэма", "Роман в стихах", "Поэтический цикл", "Лирическая поэзия"],
        correct: 1
      },
      {
        question: "Какой жанр у произведения 'Ревизор'?",
        options: ["Трагедия", "Комедия", "Драма", "Сатира"],
        correct: 1
      },
      {
        question: "К какому жанру относится 'Герой нашего времени'?",
        options: ["Психологический роман", "Исторический роман", "Приключенческий роман", "Любовный роман"],
        correct: 0
      },
      {
        question: "Какой жанр у произведения 'Чайка'?",
        options: ["Трагедия", "Комедия", "Драма", "Трагикомедия"],
        correct: 2
      }
    ]
  }
];

const authorsEducationData = [
  { id: 1, name: "А.С. Пушкин", period: "1799-1837", books: 15, avatar: "👑" },
  { id: 2, name: "Л.Н. Толстой", period: "1828-1910", books: 12, avatar: "👴" },
  { id: 3, name: "Ф.М. Достоевский", period: "1821-1881", books: 8, avatar: "🧔" },
  { id: 4, name: "А.П. Чехов", period: "1860-1904", books: 6, avatar: "🎭" },
  { id: 5, name: "М.А. Булгаков", period: "1891-1940", books: 5, avatar: "🎭" },
  { id: 6, name: "И.С. Тургенев", period: "1818-1883", books: 7, avatar: "🌳" }
];

const Education = () => {
  const [activeTab, setActiveTab] = useState('lessons');
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [completedLessonsList, setCompletedLessonsList] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const { user } = useContext(UserContext);

  const completedLessonsCount = lessonsData.filter(lesson => lesson.completed).length;
  const totalLessons = lessonsData.length;
  const progressPercentage = (completedLessonsCount / totalLessons) * 100;

  const renderLessons = () => (
    <LessonsGrid>
      {lessonsData.map((lesson, index) => (
        <LessonCard
          key={lesson.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => startLesson(lesson)}
        >
          <LessonHeader>
            <LessonIcon completed={completedLessonsList.includes(lesson.id)}>
              {completedLessonsList.includes(lesson.id) ? <FiCheckCircle /> : <FiBookOpen />}
            </LessonIcon>
            <LessonStatus>
              {completedLessonsList.includes(lesson.id) ? (
                <>
                  <FiCheckCircle size={14} />
                  Пройден
                </>
              ) : (
                <>
                  <FiClock size={14} />
                  Доступен
                </>
              )}
            </LessonStatus>
          </LessonHeader>

          <LessonTitle>{lesson.title}</LessonTitle>
          <LessonDescription>{lesson.description}</LessonDescription>

          <LessonMeta>
            <span>{lesson.duration}</span>
            <span>{lesson.difficulty}</span>
          </LessonMeta>
        </LessonCard>
      ))}
    </LessonsGrid>
  );

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
  };

  const closeQuiz = () => {
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
  };

  const startLesson = (lesson) => {
    setCurrentLesson(lesson);
  };

  const closeLesson = () => {
    setCurrentLesson(null);
  };

  const showAuthorDetails = (author) => {
    setSelectedAuthor(author);
  };

  const closeAuthorModal = () => {
    setSelectedAuthor(null);
  };

  const completeLesson = (lessonId) => {
    if (!completedLessonsList.includes(lessonId)) {
      setCompletedLessonsList(prev => [...prev, lessonId]);
      const progress = {
        completedLessons: [...completedLessonsList, lessonId],
        completedQuizzes,
        quizScores: JSON.parse(localStorage.getItem('quizScores') || '{}')
      };
      localStorage.setItem('educationProgress', JSON.stringify(progress));
    }
    setCurrentLesson(null);
  };

  // Загружаем прогресс из localStorage при инициализации
  useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem('educationProgress') || '{}');
    if (savedProgress.completedLessons) {
      setCompletedLessonsList(savedProgress.completedLessons);
    }
    if (savedProgress.completedQuizzes) {
      setCompletedQuizzes(savedProgress.completedQuizzes);
    }
  }, []);

  const selectAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const nextQuestion = () => {
    let newScore = score;
    if (selectedAnswer === currentQuiz.questionsData[currentQuestionIndex].correct) {
      newScore = score + 1;
      setScore(newScore);
    }

    if (currentQuestionIndex < currentQuiz.questionsData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      completeQuiz(newScore);
    }
  };

  const completeQuiz = (finalScore) => {
    const percentage = Math.round((finalScore / currentQuiz.questionsData.length) * 100);
    setQuizCompleted(true);

    // Обновляем лучший результат
    if (percentage > currentQuiz.bestScore) {
      currentQuiz.bestScore = percentage;
      currentQuiz.attempts += 1;
    }

    // Добавляем викторину в пройденные
    if (!completedQuizzes.includes(currentQuiz.id)) {
      setCompletedQuizzes(prev => [...prev, currentQuiz.id]);
    }

    // Сохраняем прогресс в localStorage
    const progress = {
      completedLessons: completedLessonsList,
      completedQuizzes: [...completedQuizzes, currentQuiz.id],
      quizScores: {
        ...JSON.parse(localStorage.getItem('quizScores') || '{}'),
        [currentQuiz.id]: percentage
      }
    };
    localStorage.setItem('educationProgress', JSON.stringify(progress));
  };

  const renderQuizzes = () => (
    <LessonsGrid>
      {quizzesData.map((quiz, index) => (
        <QuizCard
          key={quiz.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => startQuiz(quiz)}
        >
          <QuizHeader>
            <QuizIcon completed={completedQuizzes.includes(quiz.id)}>
              {completedQuizzes.includes(quiz.id) ? <FiCheckCircle /> : <FiPlay />}
            </QuizIcon>
            <QuizScore>
              <QuizBestScore>{quiz.bestScore}%</QuizBestScore>
              <QuizAttempts>{quiz.attempts} попыток</QuizAttempts>
            </QuizScore>
          </QuizHeader>

          <QuizTitle>{quiz.title}</QuizTitle>
          <QuizDescription>{quiz.description}</QuizDescription>

          <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: props => props.theme.textLight }}>
            {quiz.questionsData ? quiz.questionsData.length : quiz.questions} вопросов
          </div>
        </QuizCard>
      ))}
    </LessonsGrid>
  );

  const renderAuthors = () => (
    <AuthorsGrid>
      {authorsEducationData.map((author, index) => (
        <AuthorCard
          key={author.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => showAuthorDetails(author)}
        >
          <AuthorAvatar>{author.avatar}</AuthorAvatar>
          <AuthorName>{author.name}</AuthorName>
          <AuthorPeriod>{author.period}</AuthorPeriod>
          <AuthorBooks>{author.books} произведений</AuthorBooks>
        </AuthorCard>
      ))}
    </AuthorsGrid>
  );

  const renderProgress = () => {
    const averageScore = completedQuizzes.length > 0
      ? Math.round(completedQuizzes.reduce((sum, quizId) => {
          const quiz = quizzesData.find(q => q.id === quizId);
          return sum + (quiz ? quiz.bestScore : 0);
        }, 0) / completedQuizzes.length)
      : 0;

    return (
      <div>
        <ProgressCard>
          <ProgressHeader>
            <ProgressTitle>
              <FiTrendingUp />
              Ваш прогресс обучения
            </ProgressTitle>
          </ProgressHeader>

          <ProgressStats>
            <StatItem>
              <StatValue>{completedLessonsCount}</StatValue>
              <StatLabel>Пройденных уроков</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{totalLessons - completedLessonsCount}</StatValue>
              <StatLabel>Осталось уроков</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{Math.round(progressPercentage)}%</StatValue>
              <StatLabel>Общий прогресс</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{completedQuizzes.length}</StatValue>
              <StatLabel>Пройденных викторин</StatLabel>
            </StatItem>
          </ProgressStats>

          <ProgressBar>
            <ProgressFill percentage={progressPercentage} />
          </ProgressBar>
        </ProgressCard>

        <ProgressCard style={{ marginTop: '2rem' }}>
          <ProgressHeader>
            <ProgressTitle>
              <FiAward />
              Детальная статистика
            </ProgressTitle>
          </ProgressHeader>

          <ProgressStats>
            <StatItem>
              <StatValue>{averageScore}%</StatValue>
              <StatLabel>Средний балл викторин</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{completedLessonsList.length}</StatValue>
              <StatLabel>Завершенных уроков</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{quizzesData.length - completedQuizzes.length}</StatValue>
              <StatLabel>Осталось викторин</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{Math.max(0, totalLessons + quizzesData.length - completedLessonsCount - completedQuizzes.length)}</StatValue>
              <StatLabel>Всего заданий</StatLabel>
            </StatItem>
          </ProgressStats>
        </ProgressCard>

        <LessonsGrid>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '2rem',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}
          >
            <FiAward size={48} color="#fbbf24" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: '#1a202c', marginBottom: '0.5rem' }}>
              {progressPercentage === 100 ? '🎉 Поздравляем!' : 'Продолжайте обучение!'}
            </h3>
            <p style={{ color: '#718096' }}>
              {progressPercentage === 100
                ? 'Вы прошли все уроки и викторины! Ваши знания русской литературы впечатляют!'
                : 'Проходите уроки и викторины, чтобы получить достижения и улучшить свои знания русской литературы.'
              }
            </p>
          </motion.div>
        </LessonsGrid>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'lessons':
        return renderLessons();
      case 'quiz':
        return renderQuizzes();
      case 'authors':
        return renderAuthors();
      case 'progress':
        return renderProgress();
      default:
        return renderLessons();
    }
  };

  return (
    <Container>
      <Header>
        <Title>
          <FiBookOpen />
          Обучение русской литературе
        </Title>
        <Subtitle>
          Изучайте русскую литературу через интерактивные уроки, викторины и биографии великих писателей.
        </Subtitle>
      </Header>

      <NavigationTabs>
        <TabButton active={activeTab === 'lessons'} onClick={() => setActiveTab('lessons')}>
          <FiBookOpen />
          Уроки
        </TabButton>
        <TabButton active={activeTab === 'authors'} onClick={() => setActiveTab('authors')}>
          <FiStar />
          Авторы
        </TabButton>
        <TabButton active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')}>
          <FiPlay />
          Викторины
        </TabButton>
        <TabButton active={activeTab === 'progress'} onClick={() => setActiveTab('progress')}>
          <FiTrendingUp />
          Прогресс
        </TabButton>
      </NavigationTabs>

      <AnimatePresence mode="wait">
        <ContentArea key={activeTab}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </ContentArea>
      </AnimatePresence>

      {/* Quiz Modal */}
      <AnimatePresence>
        {currentQuiz && (
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
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '2rem'
            }}
            onClick={closeQuiz}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '2rem',
                maxWidth: '500px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto',
                border: '1px solid #e2e8f0',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {!quizCompleted ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ color: '#1a202c', margin: 0 }}>{currentQuiz.title}</h3>
                    <span style={{ color: '#718096', fontSize: '0.9rem' }}>
                      {currentQuestionIndex + 1} / {currentQuiz.questionsData.length}
                    </span>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#1a202c', marginBottom: '1rem', fontSize: '1.1rem' }}>
                      {currentQuiz.questionsData[currentQuestionIndex].question}
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {currentQuiz.questionsData[currentQuestionIndex].options.map((option, index) => (
                        <motion.button
                          key={index}
                          onClick={() => selectAnswer(index)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          style={{
                            padding: '0.75rem 1rem',
                            border: `2px solid ${selectedAnswer === index ? '#667eea' : '#e2e8f0'}`,
                            borderRadius: '8px',
                            background: selectedAnswer === index ? '#667eea' : '#ffffff',
                            color: selectedAnswer === index ? 'white' : '#1a202c',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.3s ease',
                            fontSize: '1rem',
                            fontWeight: '500'
                          }}
                        >
                          {String.fromCharCode(65 + index)}. {option}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      onClick={closeQuiz}
                      style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        background: 'transparent',
                        color: '#1a202c',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Выйти
                    </button>

                    <button
                      onClick={nextQuestion}
                      disabled={selectedAnswer === null}
                      style={{
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '6px',
                        background: selectedAnswer !== null ? '#667eea' : '#f7fafc',
                        color: selectedAnswer !== null ? 'white' : '#a0aec0',
                        cursor: selectedAnswer !== null ? 'pointer' : 'not-allowed',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      {currentQuestionIndex < currentQuiz.questionsData.length - 1 ? 'Далее' : 'Завершить'}
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                  <h3 style={{ color: '#1a202c', marginBottom: '1rem' }}>Викторина завершена!</h3>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea', marginBottom: '1rem' }}>
                    {currentQuiz.bestScore}%
                  </div>
                  <p style={{ color: '#718096', marginBottom: '2rem' }}>
                    Правильных ответов: {score} из {currentQuiz.questionsData.length}
                  </p>
                  <button
                    onClick={closeQuiz}
                    style={{
                      padding: '0.75rem 2rem',
                      border: 'none',
                      borderRadius: '8px',
                      background: '#667eea',
                      color: 'white',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Закрыть
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Lesson Modal */}
        <AnimatePresence>
          {currentLesson && (
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
                background: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '2rem'
              }}
              onClick={closeLesson}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                style={{
                  background: props => props.theme.card,
                  borderRadius: '12px',
                  padding: '2rem',
                  maxWidth: '800px',
                  width: '100%',
                  maxHeight: '80vh',
                  overflow: 'auto',
                  border: `1px solid ${props => props.theme.border}`
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ color: props => props.theme.text, marginBottom: '0.5rem' }}>{currentLesson.title}</h2>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: props => props.theme.textLight }}>
                      <span>⏱️ {currentLesson.duration}</span>
                      <span>📚 {currentLesson.difficulty}</span>
                    </div>
                  </div>
                  <button
                    onClick={closeLesson}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      color: props => props.theme.textLight
                    }}
                  >
                    ×
                  </button>
                </div>

                <div
                  style={{
                    color: props => props.theme.text,
                    lineHeight: '1.6',
                    fontSize: '1rem'
                  }}
                  dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                />

                <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <button
                    onClick={() => completeLesson(currentLesson.id)}
                    style={{
                      padding: '0.75rem 2rem',
                      border: 'none',
                      borderRadius: '8px',
                      background: '#667eea',
                      color: 'white',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Завершить урок
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Author Modal */}
        <AnimatePresence>
          {selectedAuthor && (
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
                background: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '2rem'
              }}
              onClick={closeAuthorModal}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '2rem',
                  maxWidth: '600px',
                  width: '100%',
                  maxHeight: '80vh',
                  overflow: 'auto',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{
                    fontSize: '4rem',
                    marginBottom: '1rem',
                    display: 'inline-block'
                  }}>
                    {selectedAuthor.avatar}
                  </div>
                  <h2 style={{ color: '#1a202c', marginBottom: '0.5rem' }}>{selectedAuthor.name}</h2>
                  <p style={{ color: '#718096', fontSize: '1.1rem' }}>{selectedAuthor.period}</p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#1a202c', marginBottom: '0.5rem' }}>Биография</h3>
                  <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
                    {getAuthorBio(selectedAuthor.name)}
                  </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#1a202c', marginBottom: '0.5rem' }}>Известные произведения</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {getAuthorBooks(selectedAuthor.name).map((book, index) => (
                      <span
                        key={index}
                        style={{
                          background: '#f7fafc',
                          color: '#4a5568',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        {book}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={closeAuthorModal}
                    style={{
                      padding: '0.75rem 2rem',
                      border: 'none',
                      borderRadius: '8px',
                      background: '#667eea',
                      color: 'white',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Закрыть
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </Container>
  );
};

// Вспомогательные функции для получения данных об авторах
const getAuthorBio = (name) => {
  const bios = {
    "А.С. Пушкин": "Александр Сергеевич Пушкин (1799-1837) - великий русский поэт, драматург и прозаик, основатель современного русского литературного языка. Его творчество оказало огромное влияние на развитие русской литературы и культуры.",
    "Л.Н. Толстой": "Лев Николаевич Толстой (1828-1910) - великий русский писатель, мыслитель и философ. Автор эпических произведений 'Война и мир' и 'Анна Каренина'. Один из самых влиятельных писателей в мировой литературе.",
    "Ф.М. Достоевский": "Федор Михайлович Достоевский (1821-1881) - русский писатель, философ и публицист, мастер психологического романа. Его произведения исследуют глубины человеческой души и моральные дилеммы.",
    "А.П. Чехов": "Антон Павлович Чехов (1860-1904) - русский писатель, драматург и врач. Мастер короткого рассказа и психологической драмы. Его пьесы стали классикой мирового театра.",
    "М.А. Булгаков": "Михаил Афанасьевич Булгаков (1891-1940) - русский писатель и драматург. Автор знаменитого романа 'Мастер и Маргарита'. Его произведения сочетают сатиру, фантастику и глубокий философский подтекст.",
    "И.С. Тургенев": "Иван Сергеевич Тургенев (1818-1883) - русский писатель, поэт и переводчик. Мастер психологической прозы и пейзажной лирики. Его роман 'Отцы и дети' стал классикой русской литературы."
  };
  return bios[name] || "Биография автора недоступна.";
};

const getAuthorBooks = (name) => {
  const books = {
    "А.С. Пушкин": ["Евгений Онегин", "Капитанская дочка", "Медный всадник", "Полтава"],
    "Л.Н. Толстой": ["Война и мир", "Анна Каренина", "Воскресение", "Смерть Ивана Ильича"],
    "Ф.М. Достоевский": ["Преступление и наказание", "Братья Карамазовы", "Идиот", "Бесы"],
    "А.П. Чехов": ["Чайка", "Дядя Ваня", "Три сестры", "Вишневый сад"],
    "М.А. Булгаков": ["Мастер и Маргарита", "Собачье сердце", "Белая гвардия", "Театральный роман"],
    "И.С. Тургенев": ["Отцы и дети", "Дворянское гнездо", "Накануне", "Рудин"]
  };
  return books[name] || [];
};

export default Education;