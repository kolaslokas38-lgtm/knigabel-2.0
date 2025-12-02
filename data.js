// Конфигурация
console.log('data.js loading start');
const CONFIG = {
    USE_MOCK_DATA: true
};

// Mock данные книг
// Mock данные книг
const MOCK_BOOKS = [
  {
    id: 1,
    title: "Война и мир",
    author: "Лев Толстой",
    year: 1869,
    genre: "Роман-эпопея",
    description: "Монументальный роман-эпопея, описывающий русское общество в эпоху войн против Наполеона.",
    isbn: "978-5-699-13799-2",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/War_and_Peace_-_First_edition%2C_1869.jpg/220px-War_and_Peace_-_First_edition%2C_1869.jpg",
    readLink: "https://ilibrary.ru/text/11/index.html",
    pages: 1225,
    rating: 4.8,
    reviewsCount: 156
  },
  {
    id: 2,
    title: "Преступление и наказание",
    author: "Федор Достоевский",
    year: 1866,
    genre: "Психологический роман",
    description: "История бывшего студента Родиона Раскольникова, совершившего убийство.",
    isbn: "978-5-17-145136-8",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Crime_and_Punishment_cover.gif/220px-Crime_and_Punishment_cover.gif",
    readLink: "https://www.litres.ru/book/fedor-dostoevskiy/prestuplenie-i-nakazanie-139491/chitat-onlayn/",
    pages: 672,
    rating: 4.7,
    reviewsCount: 89
  },
  {
    id: 3,
    title: "Мастер и Маргарита",
    author: "Михаил Булгаков",
    year: 1967,
    genre: "Фантастика",
    description: "Мистический роман о визите дьявола в Москву 1930-х годов.",
    isbn: "978-5-389-06587-5",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Bulgakov%2C_Mikhail_-_The_Master_and_Margarita_%281967%2C_1st_ed.%29.jpg/220px-Bulgakov%2C_Mikhail_-_The_Master_and_Margarita_%281967%2C_1st_ed.%29.jpg",
    readLink: "https://author.today/reader/428523",
    pages: 480,
    rating: 4.9,
    reviewsCount: 203
  },
  {
    id: 4,
    title: "Евгений Онегин",
    author: "Александр Пушкин",
    year: 1833,
    genre: "Роман в стихах",
    description: "Роман в стихах, одно из самых значительных произведений русской литературы.",
    isbn: "978-5-4453-0152-3",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Eugene_Onegin_1833.jpg/220px-Eugene_Onegin_1833.jpg",
    readLink: "https://ilibrary.ru/text/436/p.2/in-/index.html",
    pages: 288,
    rating: 4.6,
    reviewsCount: 78
  },
  {
    id: 5,
    title: "Тихий Дон",
    author: "Михаил Шолохов",
    year: 1940,
    genre: "Роман-эпопея",
    description: "Эпопея о донском казачестве в годы Первой мировой и Гражданской войны.",
    isbn: "978-5-699-80699-2",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/And_Quiet_Flows_the_Don_1st_edition.jpg/220px-And_Quiet_Flows_the_Don_1st_edition.jpg",
    readLink: "https://kartaslov.ru/%D0%BA%D0%BD%D0%B8%D0%B3%D0%B8/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB_%D0%A8%D0%BE%D0%BB%D0%BE%D1%85%D0%BE%D0%B2_%D0%A2%D0%B8%D1%85%D0%B8%D0%B9_%D0%94%D0%BE%D0%BD",
    pages: 1504,
    rating: 4.5,
    reviewsCount: 67
  },
  {
    id: 6,
    title: "Отцы и дети",
    author: "Иван Тургенев",
    year: 1862,
    genre: "Социально-психологический роман",
    description: "Роман о конфликте между либералами и нигилистами в России XIX века.",
    isbn: "978-5-04-116640-5",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Fathers_and_Sons_1862.jpg/220px-Fathers_and_Sons_1862.jpg",
    readLink: "https://ilibrary.ru/text/96/p.1/index.html",
    pages: 320,
    rating: 4.4,
    reviewsCount: 54
  },
  {
    id: 7,
    title: "Анна Каренина",
    author: "Лев Толстой",
    year: 1877,
    genre: "Реализм",
    description: "Трагическая история любви замужней женщины к блестящему офицеру.",
    isbn: "978-5-389-04221-0",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/AnnaKareninaTitle.jpg/220px-AnnaKareninaTitle.jpg",
    readLink: "https://ilibrary.ru/text/1099/p.1/index.html",
    pages: 864,
    rating: 4.8,
    reviewsCount: 134
  },
  {
    id: 8,
    title: "Мёртвые души",
    author: "Николай Гоголь",
    year: 1842,
    genre: "Поэма",
    description: "Сатирическое произведение о российском обществе середины XIX века.",
    isbn: "978-5-4453-0153-0",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Dead_Souls_1846.jpg/220px-Dead_Souls_1846.jpg",
    readLink: "https://ilibrary.ru/text/78/p.1/index.html",
    pages: 352,
    rating: 4.3,
    reviewsCount: 45
  },
  {
    id: 9,
    title: "Герой нашего времени",
    author: "Михаил Лермонтов",
    year: 1840,
    genre: "Психологический роман",
    description: "Первый в русской прозе лирико-психологический роман.",
    isbn: "978-5-389-04222-7",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Hero_of_Our_Time_1840.jpg/220px-Hero_of_Our_Time_1840.jpg",
    readLink: "https://ilibrary.ru/text/71/p.1/index.html",
    pages: 224,
    rating: 4.6,
    reviewsCount: 89
  },
  {
    id: 10,
    title: "Братья Карамазовы",
    author: "Федор Достоевский",
    year: 1880,
    genre: "Философский роман",
    description: "Последний роман Достоевского, затрагивающий глубокие философские вопросы.",
    isbn: "978-5-389-04223-4",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/The_Brothers_Karamazov_1881.jpg/220px-The_Brothers_Karamazov_1881.jpg",
    readLink: "https://ilibrary.ru/text/1045/p.1/index.html",
    pages: 824,
    rating: 4.7,
    reviewsCount: 112
  },
  {
    id: 11,
    title: "Капитанская дочка",
    author: "Александр Пушкин",
    year: 1836,
    genre: "Исторический роман",
    description: "Исторический роман о событиях крестьянского восстания под предводительством Емельяна Пугачёва.",
    isbn: "978-5-4453-0154-7",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/The_Captain%27s_Daughter_1836.jpg/220px-The_Captain%27s_Daughter_1836.jpg",
    readLink: "https://ilibrary.ru/text/359/p.1/index.html",
    pages: 320,
    rating: 4.5,
    reviewsCount: 67
  },
  {
    id: 12,
    title: "Обломов",
    author: "Иван Гончаров",
    year: 1859,
    genre: "Социально-психологический роман",
    description: "Роман о жизни Ильи Ильича Обломова, воплощающий тип «лишнего человека».",
    isbn: "978-5-04-116641-2",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Oblomov_1859.jpg/220px-Oblomov_1859.jpg",
    readLink: "https://ilibrary.ru/text/110/p.1/index.html",
    pages: 480,
    rating: 4.4,
    reviewsCount: 58
  },
  {
    id: 13,
    title: "Вишнёвый сад",
    author: "Антон Чехов",
    year: 1904,
    genre: "Драма",
    description: "Лирическая пьеса в четырёх действиях о вынужденной продаже родового имения.",
    isbn: "978-5-4453-0155-4",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/The_Cherry_Orchard_1904.jpg/220px-The_Cherry_Orchard_1904.jpg",
    readLink: "https://ilibrary.ru/text/1190/p.1/index.html",
    pages: 96,
    rating: 4.2,
    reviewsCount: 34
  },
  {
    id: 14,
    title: "Ревизор",
    author: "Николай Гоголь",
    year: 1836,
    genre: "Комедия",
    description: "Комедия в пяти действиях о чиновничьем произволе и страхе перед высшей властью.",
    isbn: "978-5-4453-0156-1",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/The_Inspector_General_1836.jpg/220px-The_Inspector_General_1836.jpg",
    readLink: "https://ilibrary.ru/text/74/p.1/index.html",
    pages: 128,
    rating: 4.3,
    reviewsCount: 41
  },
  {
    id: 15,
    title: "Горе от ума",
    author: "Александр Грибоедов",
    year: 1825,
    genre: "Комедия",
    description: "Комедия в стихах, сатира на аристократическое московское общество первой половины XIX века.",
    isbn: "978-5-4453-0157-8",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Woe_from_Wit_1833.jpg/220px-Woe_from_Wit_1833.jpg",
    readLink: "https://ilibrary.ru/text/60/p.1/index.html",
    pages: 160,
    rating: 4.4,
    reviewsCount: 49
  },
  {
    id: 16,
    title: "Доктор Живаго",
    author: "Борис Пастернак",
    year: 1957,
    genre: "Роман",
    description: "Роман о жизни русской интеллигенции в период революции и Гражданской войны.",
    isbn: "978-5-699-80700-5",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Doctor_Zhivago_1957.jpg/220px-Doctor_Zhivago_1957.jpg",
    readLink: "https://ilibrary.ru/text/1120/p.1/index.html",
    pages: 592,
    rating: 4.6,
    reviewsCount: 78
  },
  {
    id: 17,
    title: "Идиот",
    author: "Федор Достоевский",
    year: 1869,
    genre: "Психологический роман",
    description: "Роман о князе Мышкине, «положительно прекрасном человеке», пытающемся принести добро в жестокий мир.",
    isbn: "978-5-17-145137-5",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/The_Idiot_1869.jpg/220px-The_Idiot_1869.jpg",
    readLink: "https://ilibrary.ru/text/1030/p.1/index.html",
    pages: 640,
    rating: 4.7,
    reviewsCount: 95
  },
  {
    id: 18,
    title: "Бесы",
    author: "Федор Достоевский",
    year: 1872,
    genre: "Политический роман",
    description: "Роман-предупреждение о разрушительной силе революционных идей.",
    isbn: "978-5-17-145138-2",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Demons_1873.jpg/220px-Demons_1873.jpg",
    readLink: "https://ilibrary.ru/text/1040/p.1/index.html",
    pages: 768,
    rating: 4.5,
    reviewsCount: 63
  },
  {
    id: 19,
    title: "Двенадцать стульев",
    author: "Илья Ильф, Евгений Петров",
    year: 1928,
    genre: "Сатирический роман",
    description: "Сатирический роман о поисках бриллиантов, спрятанных в одном из двенадцати стульев гостиного гарнитура.",
    isbn: "978-5-699-80701-2",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Twelve_Chairs_1928.jpg/220px-Twelve_Chairs_1928.jpg",
    readLink: "https://ilibrary.ru/text/1130/p.1/index.html",
    pages: 416,
    rating: 4.8,
    reviewsCount: 121
  },
  {
    id: 20,
    title: "Золотой телёнок",
    author: "Илья Ильф, Евгений Петров",
    year: 1931,
    genre: "Сатирический роман",
    description: "Продолжение приключений Остапа Бендера в поисках миллиона рублей.",
    isbn: "978-5-699-80702-9",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/The_Golden_Calf_1931.jpg/220px-The_Golden_Calf_1931.jpg",
    readLink: "https://ilibrary.ru/text/1140/p.1/index.html",
    pages: 384,
    rating: 4.7,
    reviewsCount: 98
  },
  {
    id: 21,
    title: "Петербургские повести",
    author: "Николай Гоголь",
    year: 1842,
    genre: "Повести",
    description: "Цикл повестей, посвящённых жизни Петербурга и его обитателей.",
    isbn: "978-5-4453-0158-5",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Petersburg_Tales_1842.jpg/220px-Petersburg_Tales_1842.jpg",
    readLink: "https://ilibrary.ru/text/77/p.1/index.html",
    pages: 256,
    rating: 4.3,
    reviewsCount: 42
  },
  {
    id: 22,
    title: "Гранатовый браслет",
    author: "Александр Куприн",
    year: 1911,
    genre: "Повесть",
    description: "Повесть о безответной любви мелкого чиновника к замужней княгине.",
    isbn: "978-5-4453-0159-2",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/The_Garnet_Bracelet_1911.jpg/220px-The_Garnet_Bracelet_1911.jpg",
    readLink: "https://ilibrary.ru/text/1150/p.1/index.html",
    pages: 96,
    rating: 4.5,
    reviewsCount: 56
  },
  {
    id: 23,
    title: "Старик и море",
    author: "Эрнест Хемингуэй",
    year: 1952,
    genre: "Повесть",
    description: "Повесть о кубинском рыбаке Сантьяго и его борьбе с гигантской рыбой.",
    isbn: "978-5-699-80703-6",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/The_Old_Man_and_the_Sea_1952.jpg/220px-The_Old_Man_and_the_Sea_1952.jpg",
    readLink: "https://ilibrary.ru/text/1160/p.1/index.html",
    pages: 112,
    rating: 4.4,
    reviewsCount: 67
  },
  {
    id: 24,
    title: "Маленький принц",
    author: "Антуан де Сент-Экзюпери",
    year: 1943,
    genre: "Философская сказка",
    description: "Самое известное произведение Экзюпери, обращённое к детям и взрослым.",
    isbn: "978-5-699-80704-3",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/The_Little_Prince_1943.jpg/220px-The_Little_Prince_1943.jpg",
    readLink: "https://ilibrary.ru/text/1170/p.1/index.html",
    pages: 96,
    rating: 4.9,
    reviewsCount: 215
  },
  {
    id: 25,
    title: "1984",
    author: "Джордж Оруэлл",
    year: 1949,
    genre: "Антиутопия",
    description: "Роман-антиутопия о тоталитарном обществе под постоянным контролем «Старшего Брата».",
    isbn: "978-5-699-80705-0",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Nineteen_Eighty-Four_1984.jpg/220px-Nineteen_Eighty-Four_1984.jpg",
    readLink: "https://ilibrary.ru/text/1180/p.1/index.html",
    pages: 320,
    rating: 4.8,
    reviewsCount: 189
  },
  {
    id: 26,
    title: "Шерлок Холмс: Собака Баскервилей",
    author: "Артур Конан Дойл",
    year: 1902,
    genre: "Детектив",
    description: "Классический детективный роман о знаменитом сыщике Шерлоке Холмсе и докторе Ватсоне.",
    isbn: "978-5-699-80706-7",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/The_Hound_of_the_Baskervilles_1902.jpg/220px-The_Hound_of_the_Baskervilles_1902.jpg",
    readLink: "https://ilibrary.ru/text/1190/p.1/index.html",
    pages: 256,
    rating: 4.6,
    reviewsCount: 145
  },
  {
    id: 27,
    title: "Гарри Поттер и философский камень",
    author: "Джоан Роулинг",
    year: 1997,
    genre: "Фэнтези",
    description: "Первая книга о приключениях юного волшебника Гарри Поттера в Хогвартсе.",
    isbn: "978-5-699-80707-4",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Harry_Potter_and_the_Philosopher%27s_Stone_1997.jpg/220px-Harry_Potter_and_the_Philosopher%27s_Stone_1997.jpg",
    readLink: "https://ilibrary.ru/text/1200/p.1/index.html",
    pages: 336,
    rating: 4.9,
    reviewsCount: 312
  },
  {
    id: 28,
    title: "Убить пересмешника",
    author: "Харпер Ли",
    year: 1960,
    genre: "Драма",
    description: "Роман о расовой несправедливости и детской невинности в Америке 1930-х годов.",
    isbn: "978-5-699-80708-1",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/To_Kill_a_Mockingbird_1960.jpg/220px-To_Kill_a_Mockingbird_1960.jpg",
    readLink: "https://ilibrary.ru/text/1210/p.1/index.html",
    pages: 376,
    rating: 4.7,
    reviewsCount: 198
  },
  {
    id: 29,
    title: "Великий Гэтсби",
    author: "Фрэнсис Скотт Фицджеральд",
    year: 1925,
    genre: "Роман",
    description: "История о американской мечте, любви и трагедии в эпоху джаза.",
    isbn: "978-5-699-80709-8",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/The_Great_Gatsby_1925.jpg/220px-The_Great_Gatsby_1925.jpg",
    readLink: "https://ilibrary.ru/text/1220/p.1/index.html",
    pages: 180,
    rating: 4.4,
    reviewsCount: 167
  },
  {
    id: 30,
    title: "Над пропастью во ржи",
    author: "Джером Дэвид Сэлинджер",
    year: 1951,
    genre: "Роман",
    description: "История подростка Холдена Колфилда и его видения мира.",
    isbn: "978-5-699-80710-4",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/The_Catcher_in_the_Rye_1951.jpg/220px-The_Catcher_in_the_Rye_1951.jpg",
    readLink: "https://ilibrary.ru/text/1230/p.1/index.html",
    pages: 277,
    rating: 4.5,
    reviewsCount: 234
  },
  {
    id: 31,
    title: "Сто лет одиночества",
    author: "Габриэль Гарсия Маркес",
    year: 1967,
    genre: "Магический реализм",
    description: "Эпопея семьи Буэндиа в вымышленном городе Макондо.",
    isbn: "978-5-699-80711-1",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/One_Hundred_Years_of_Solitude_1967.jpg/220px-One_Hundred_Years_of_Solitude_1967.jpg",
    readLink: "https://ilibrary.ru/text/1240/p.1/index.html",
    pages: 448,
    rating: 4.8,
    reviewsCount: 189
  },
  {
    id: 32,
    title: "Лолита",
    author: "Владимир Набоков",
    year: 1955,
    genre: "Роман",
    description: "Скандальный роман о сложных взаимоотношениях.",
    isbn: "978-5-699-80712-8",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Lolita_1955.jpg/220px-Lolita_1955.jpg",
    readLink: "https://ilibrary.ru/text/1250/p.1/index.html",
    pages: 336,
    rating: 4.3,
    reviewsCount: 156
  },
  {
    id: 33,
    title: "Властелин колец: Братство кольца",
    author: "Джон Рональд Руэл Толкин",
    year: 1954,
    genre: "Фэнтези",
    description: "Первая часть эпической трилогии о Средиземье.",
    isbn: "978-5-699-80713-5",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/The_Fellowship_of_the_Ring_1954.jpg/220px-The_Fellowship_of_the_Ring_1954.jpg",
    readLink: "https://ilibrary.ru/text/1260/p.1/index.html",
    pages: 576,
    rating: 4.9,
    reviewsCount: 278
  },
  {
    id: 34,
    title: "Дон Кихот",
    author: "Мигель де Сервантес",
    year: 1605,
    genre: "Роман",
    description: "Классический роман о рыцаре и его оруженосце.",
    isbn: "978-5-699-80714-2",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Don_Quixote_1605.jpg/220px-Don_Quixote_1605.jpg",
    readLink: "https://ilibrary.ru/text/1270/p.1/index.html",
    pages: 1024,
    rating: 4.6,
    reviewsCount: 134
  },
  {
    id: 35,
    title: "Фауст",
    author: "Иоганн Вольфганг Гёте",
    year: 1808,
    genre: "Трагедия",
    description: "Философская трагедия о сделке с дьяволом.",
    isbn: "978-5-699-80715-9",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Faust_1808.jpg/220px-Faust_1808.jpg",
    readLink: "https://ilibrary.ru/text/1280/p.1/index.html",
    pages: 464,
    rating: 4.4,
    reviewsCount: 98
  },
  {
    id: 36,
    title: "Божественная комедия",
    author: "Данте Алигьери",
    year: 1320,
    genre: "Поэма",
    description: "Эпическая поэма о путешествии по загробному миру.",
    isbn: "978-5-699-80716-6",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Divine_Comedy_1320.jpg/220px-Divine_Comedy_1320.jpg",
    readLink: "https://ilibrary.ru/text/1290/p.1/index.html",
    pages: 688,
    rating: 4.7,
    reviewsCount: 87
  },
  {
    id: 37,
    title: "Искусство войны",
    author: "Сунь Цзы",
    year: -500,
    genre: "Трактат",
    description: "Древний китайский трактат о стратегии и войне.",
    isbn: "978-5-699-80717-3",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/The_Art_of_War.jpg/220px-The_Art_of_War.jpg",
    readLink: "https://ilibrary.ru/text/1300/p.1/index.html",
    pages: 96,
    rating: 4.5,
    reviewsCount: 145
  },
  {
    id: 38,
    title: "Краткая история времени",
    author: "Стивен Хокинг",
    year: 1988,
    genre: "Научно-популярная",
    description: "Введение в современную космологию для широкой аудитории.",
    isbn: "978-5-699-80718-0",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/A_Brief_History_of_Time_1988.jpg/220px-A_Brief_History_of_Time_1988.jpg",
    readLink: "https://ilibrary.ru/text/1310/p.1/index.html",
    pages: 256,
    rating: 4.6,
    reviewsCount: 203
  },
  {
    id: 39,
    title: "Солярис",
    author: "Станислав Лем",
    year: 1961,
    genre: "Научная фантастика",
    description: "Философский роман о контакте с инопланетным разумом.",
    isbn: "978-5-699-80719-7",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Solaris_1961.jpg/220px-Solaris_1961.jpg",
    readLink: "https://ilibrary.ru/text/1320/p.1/index.html",
    pages: 224,
    rating: 4.4,
    reviewsCount: 167
  },
  {
    id: 40,
    title: "Дюна",
    author: "Фрэнк Герберт",
    year: 1965,
    genre: "Научная фантастика",
    description: "Эпическая сага о пустынной планете Арракис.",
    isbn: "978-5-699-80720-3",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Dune_1965.jpg/220px-Dune_1965.jpg",
    readLink: "https://ilibrary.ru/text/1330/p.1/index.html",
    pages: 688,
    rating: 4.8,
    reviewsCount: 245
  },
  {
    id: 41,
    title: "Метро 2033",
    author: "Дмитрий Глуховский",
    year: 2005,
    genre: "Постапокалипсис",
    description: "Роман о выживании в московском метро после ядерной войны.",
    isbn: "978-5-699-80721-0",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Metro_2033_2005.jpg/220px-Metro_2033_2005.jpg",
    readLink: "https://ilibrary.ru/text/1340/p.1/index.html",
    pages: 352,
    rating: 4.7,
    reviewsCount: 189
  },
  {
    id: 42,
    title: "Тёмные аллеи",
    author: "Иван Бунин",
    year: 1943,
    genre: "Проза",
    description: "Сборник рассказов о любви и человеческих страстях.",
    isbn: "978-5-699-80722-7",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Dark_Avenues_1943.jpg/220px-Dark_Avenues_1943.jpg",
    readLink: "https://ilibrary.ru/text/1350/p.1/index.html",
    pages: 288,
    rating: 4.5,
    reviewsCount: 98
  },
  {
    id: 43,
    title: "Чайка по имени Джонатан Ливингстон",
    author: "Ричард Бах",
    year: 1970,
    genre: "Философская притча",
    description: "История о чайке, которая стремится к совершенству.",
    isbn: "978-5-699-80723-4",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Jonathan_Livingston_Seagull_1970.jpg/220px-Jonathan_Livingston_Seagull_1970.jpg",
    readLink: "https://ilibrary.ru/text/1360/p.1/index.html",
    pages: 128,
    rating: 4.6,
    reviewsCount: 234
  },
  {
    id: 44,
    title: "Атлант расправил плечи",
    author: "Айн Рэнд",
    year: 1957,
    genre: "Философский роман",
    description: "Роман о роли разума и индивидуализма в обществе.",
    isbn: "978-5-699-80724-1",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Atlas_Shrugged_1957.jpg/220px-Atlas_Shrugged_1957.jpg",
    readLink: "https://ilibrary.ru/text/1370/p.1/index.html",
    pages: 1168,
    rating: 4.3,
    reviewsCount: 145
  },
  {
    id: 45,
    title: "Общество потребления",
    author: "Жан Бодрийяр",
    year: 1970,
    genre: "Философия",
    description: "Критика общества потребления и симулякров.",
    isbn: "978-5-699-80725-8",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/The_Society_of_Consumption_1970.jpg/220px-The_Society_of_Consumption_1970.jpg",
    readLink: "https://ilibrary.ru/text/1380/p.1/index.html",
    pages: 272,
    rating: 4.2,
    reviewsCount: 76
  },
  {
    id: 46,
    title: "Смерть Ивана Ильича",
    author: "Лев Толстой",
    year: 1886,
    genre: "Философская повесть",
    description: "Размышления о смысле жизни и смерти.",
    isbn: "978-5-699-80726-5",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/The_Death_of_Ivan_Ilyich_1886.jpg/220px-The_Death_of_Ivan_Ilyich_1886.jpg",
    readLink: "https://ilibrary.ru/text/1390/p.1/index.html",
    pages: 96,
    rating: 4.7,
    reviewsCount: 123
  },
  {
    id: 47,
    title: "Записки из подполья",
    author: "Федор Достоевский",
    year: 1864,
    genre: "Философская повесть",
    description: "Монолог «подпольного» человека о свободе воли.",
    isbn: "978-5-699-80727-2",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Notes_from_Underground_1864.jpg/220px-Notes_from_Underground_1864.jpg",
    readLink: "https://ilibrary.ru/text/1400/p.1/index.html",
    pages: 112,
    rating: 4.5,
    reviewsCount: 156
  },
  {
    id: 48,
    title: "Шум и ярость",
    author: "Уильям Фолкнер",
    year: 1929,
    genre: "Модернизм",
    description: "Экспериментальный роман о семье Компсонов.",
    isbn: "978-5-699-80728-9",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/The_Sound_and_the_Fury_1929.jpg/220px-The_Sound_and_the_Fury_1929.jpg",
    readLink: "https://ilibrary.ru/text/1410/p.1/index.html",
    pages: 416,
    rating: 4.4,
    reviewsCount: 89
  },
  {
    id: 49,
    title: "Процесс",
    author: "Франц Кафка",
    year: 1925,
    genre: "Абсурдистская проза",
    description: "История Йозефа К., обвиненного в неизвестном преступлении.",
    isbn: "978-5-699-80729-6",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/The_Trial_1925.jpg/220px-The_Trial_1925.jpg",
    readLink: "https://ilibrary.ru/text/1420/p.1/index.html",
    pages: 256,
    rating: 4.6,
    reviewsCount: 178
  },
  {
    id: 50,
    title: "Замок",
    author: "Франц Кафка",
    year: 1926,
    genre: "Абсурдистская проза",
    description: "История землемера К., пытающегося проникнуть в замок.",
    isbn: "978-5-699-80730-2",
    available: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/The_Castle_1926.jpg/220px-The_Castle_1926.jpg",
    readLink: "https://ilibrary.ru/text/1430/p.1/index.html",
    pages: 352,
    rating: 4.5,
    reviewsCount: 134
  }
];
const MOCK_GENRES = [
  "Все жанры", "Роман-эпопея", "Психологический роман", "Фантастика", 
  "Роман в стихах", "Реализм", "Поэма", "Социально-психологический роман",
  "Философский роман", "Исторический роман", "Драма", "Комедия", 
  "Сатирический роман", "Политический роман", "Повести", "Философская сказка",
  "Антиутопия"
];

const DAILY_CHALLENGES = [
  {
    id: 'read_pages',
    title: 'Читатель дня',
    description: 'Прочитайте 20 страниц сегодня',
    type: 'daily',
    target: 20,
    reward: 25,
    icon: '📖',
    category: 'reading'
  },
  {
    id: 'write_review',
    title: 'Критик',
    description: 'Напишите отзыв на книгу',
    type: 'daily',
    target: 1,
    reward: 15,
    icon: '✍️',
    category: 'reviews'
  },
  {
    id: 'borrow_book',
    title: 'Исследователь',
    description: 'Забронируйте новую книгу',
    type: 'daily',
    target: 1,
    reward: 10,
    icon: '📚',
    category: 'borrowing'
  },
  {
    id: 'visit_event',
    title: 'Социофил',
    description: 'Посетите мероприятие',
    type: 'daily',
    target: 1,
    reward: 20,
    icon: '🎭',
    category: 'events'
  }
];

const WEEKLY_CHALLENGES = [
  {
    id: 'read_books_week',
    title: 'Недельный читатель',
    description: 'Прочитайте 3 книги за неделю',
    type: 'weekly',
    target: 3,
    reward: 100,
    icon: '📚',
    category: 'reading'
  },
  {
    id: 'write_reviews_week',
    title: 'Супер-критик',
    description: 'Напишите 5 отзывов за неделю',
    type: 'weekly',
    target: 5,
    reward: 75,
    icon: '⭐',
    category: 'reviews'
  },
  {
    id: 'complete_genre',
    title: 'Жанровый эксперт',
    description: 'Прочитайте книги из 3 разных жанров',
    type: 'weekly',
    target: 3,
    reward: 50,
    icon: '🎭',
    category: 'diversity'
  },
  {
    id: 'social_butterfly',
    title: 'Социальная бабочка',
    description: 'Посетите 2 мероприятия за неделю',
    type: 'weekly',
    target: 2,
    reward: 40,
    icon: '🦋',
    category: 'events'
  }
];

const AUTHOR_BIOS = {
  'Лев Толстой': {
    bio: 'Лев Николаевич Толстой (1828–1910) — великий русский писатель, мыслитель и общественный деятель. Автор эпопеи "Война и мир" и романа "Анна Каренина". Его произведения затрагивают глубокие философские и нравственные вопросы.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Leo_Tolstoy_1897.jpg/330px-Leo_Tolstoy_1897.jpg',
    famousWorks: ['Война и мир', 'Анна Каренина', 'Воскресение'],
    quotes: [
      'Все счастливые семьи похожи друг на друга, каждая несчастливая семья несчастлива по-своему.',
      'Истинная жизнь человека начинается лишь тогда, когда он может сказать: "Я есть, и я хочу быть тем, чем я хочу быть".'
    ]
  },
  'Федор Достоевский': {
    bio: 'Фёдор Михайлович Достоевский (1821–1881) — русский писатель, философ и публицист. Мастер психологического романа, исследующий глубины человеческой души.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Dostoevsky_1876.jpg/330px-Dostoevsky_1876.jpg',
    famousWorks: ['Преступление и наказание', 'Идиот', 'Братья Карамазовы'],
    quotes: [
      'Человек есть тайна. Её надо разгадывать, и ежели будешь её разгадывать всю жизнь, то не говори, что потерял время.',
      'Красота спасёт мир.'
    ]
  },
  'Михаил Булгаков': {
    bio: 'Михаил Афанасьевич Булгаков (1891–1940) — русский писатель и драматург. Автор знаменитого романа "Мастер и Маргарита", полного мистики и сатиры.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Bulgakov_1930s.jpg/330px-Bulgakov_1930s.jpg',
    famousWorks: ['Мастер и Маргарита', 'Собачье сердце', 'Белая гвардия'],
    quotes: [
      'Рукописи не горят!',
      'Никогда и ничего не просите! Никогда и ничего, и в особенности у тех, кто сильнее вас. Сами предложат и сами всё дадут!'
    ]
  }
};

const BOOK_QUOTES = [
  {
    book: 'Война и мир',
    author: 'Лев Толстой',
    quote: 'Человек создан для счастья, как птица для полёта.',
    category: 'философия'
  },
  {
    book: 'Преступление и наказание',
    author: 'Федор Достоевский',
    quote: 'Умный человек не может быть не трусом, а трус не может быть умным.',
    category: 'психология'
  },
  {
    book: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    quote: 'Разруха не в клозетах, а в головах.',
    category: 'сатира'
  },
  {
    book: 'Анна Каренина',
    author: 'Лев Толстой',
    quote: 'Все смешалось в доме Облонских.',
    category: 'семья'
  },
  {
    book: '1984',
    author: 'Джордж Оруэлл',
    quote: 'Война - это мир. Свобода - это рабство. Незнание - сила.',
    category: 'дистопия'
  }
];


const MOCK_EVENTS = [
  {
    id: 1,
    title: "Встреча с автором: Михаил Булгаков",
    description: "Литературный вечер с обсуждением творчества Михаила Булгакова. Автор расскажет о создании 'Мастера и Маргариты' и ответит на вопросы читателей.",
    date: "2024-12-15",
    time: "18:00",
    location: "Центральная библиотека, Минск",
    type: "встреча с автором",
    availableTickets: 50,
    totalTickets: 100,
    price: 15,
    image: "📖",
    category: "литературный вечер"
  },
  {
    id: 2,
    title: "Книжный клуб: Классика русской литературы",
    description: "Обсуждение произведений Льва Толстого и Фёдора Достоевского. Приглашаются все любители русской классики.",
    date: "2024-12-20",
    time: "19:30",
    location: "Книжный магазин 'КнигиБел', Минск",
    type: "книжный клуб",
    availableTickets: 25,
    totalTickets: 30,
    price: 5,
    image: "📚",
    category: "обсуждение книг"
  },
  {
    id: 3,
    title: "Мастер-класс по писательскому мастерству",
    description: "Практический семинар по созданию персонажей и сюжетов. Ведущий - известный белорусский писатель.",
    date: "2024-12-25",
    time: "16:00",
    location: "Литературный центр, Минск",
    type: "мастер-класс",
    availableTickets: 20,
    totalTickets: 25,
    price: 25,
    image: "✍️",
    category: "мастер-класс"
  },
  {
    id: 4,
    title: "Детский литературный праздник",
    description: "Весёлый праздник для детей с чтением сказок, конкурсами и встречей с иллюстраторами детских книг.",
    date: "2024-12-30",
    time: "14:00",
    location: "Детская библиотека, Минск",
    type: "праздник",
    availableTickets: 80,
    totalTickets: 100,
    price: 8,
    image: "🎉",
    category: "детское мероприятие"
  },
  {
    id: 5,
    title: "Поэтический вечер: Современная поэзия Беларуси",
    description: "Вечер поэзии с участием молодых белорусских поэтов. Чтение стихов и обсуждение современной литературы.",
    date: "2025-01-10",
    time: "20:00",
    location: "Арт-кафе 'Стихи', Минск",
    type: "поэтический вечер",
    availableTickets: 40,
    totalTickets: 50,
    price: 10,
    image: "📝",
    category: "поэзия"
  },
  {
    id: 6,
    title: "Литературная экскурсия по Минску",
    description: "Пешеходная экскурсия по литературным местам Минска. Посещение музеев и памятных мест, связанных с писателями.",
    date: "2025-01-15",
    time: "11:00",
    location: "Центр города, Минск",
    type: "экскурсия",
    availableTickets: 15,
    totalTickets: 20,
    price: 20,
    image: "🏛️",
    category: "экскурсия"
  }
];

const TITLES = [
  // Бесплатные титулы за достижения
  {
    id: 'first_reader',
    name: 'Первый читатель',
    description: 'За первое прочтение книги',
    icon: '📖',
    type: 'achievement',
    condition: (user) => user.stats.booksCompleted >= 1,
    rarity: 'common'
  },
  {
    id: 'bookworm',
    name: 'Книжный червь',
    description: 'Прочитано 10 книг',
    icon: '🐛',
    type: 'achievement',
    condition: (user) => user.stats.booksCompleted >= 10,
    rarity: 'uncommon'
  },
  {
    id: 'literary_critic',
    name: 'Литературный критик',
    description: 'Написано 5 отзывов',
    icon: '📝',
    type: 'achievement',
    condition: (user) => user.myReviews.length >= 5,
    rarity: 'uncommon'
  },
  {
    id: 'event_goer',
    name: 'Посетитель мероприятий',
    description: 'Посещено 3 события',
    icon: '🎭',
    type: 'achievement',
    condition: (user) => (user.stats.totalEvents || 0) >= 3,
    rarity: 'rare'
  },
  {
    id: 'level_master',
    name: 'Мастер уровней',
    description: 'Достигнут 10 уровень',
    icon: '⭐',
    type: 'achievement',
    condition: (user) => user.level >= 10,
    rarity: 'epic'
  },
  {
    id: 'level_expert',
    name: 'Эксперт уровней',
    description: 'Достигнут 15 уровень',
    icon: '🎖️',
    type: 'achievement',
    condition: (user) => user.level >= 15,
    rarity: 'legendary'
  },

  // Покупаемые титулы
  {
    id: 'vip_reader',
    name: 'VIP Читатель',
    description: 'Эксклюзивный статус для активных читателей',
    icon: '👑',
    type: 'purchase',
    price: 500,
    rarity: 'legendary'
  },
  {
    id: 'book_collector',
    name: 'Коллекционер книг',
    description: 'Для истинных ценителей литературы',
    icon: '📚',
    type: 'purchase',
    price: 300,
    rarity: 'epic'
  },
  {
    id: 'literary_expert',
    name: 'Литературный эксперт',
    description: 'Статус для знатоков литературы',
    icon: '🎓',
    type: 'purchase',
    price: 200,
    rarity: 'rare'
  },
  {
    id: 'event_organizer',
    name: 'Организатор событий',
    description: 'Для тех, кто любит культурные мероприятия',
    icon: '🎪',
    type: 'purchase',
    price: 150,
    rarity: 'uncommon'
  },
  {
    id: 'supporter',
    name: 'Поддержка проекта',
    description: 'Благодарность за поддержку библиотеки',
    icon: '❤️',
    type: 'purchase',
    price: 100,
    rarity: 'common'
  }
];

const RED_BOOK_ANIMALS = [
  {
    id: 1,
    name: "Зубр",
    species: "Bison bonasus",
    status: "endangered",
    description: "Крупнейшее наземное млекопитающее Европы. Символ Беларуси.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Bison_bonasus_%28Linnaeus_1758%29.jpg/330px-Bison_bonasus_%28Linnaeus_1758%29.jpg",
    population: "~2000 особей",
    habitat: "Беловежская пуща"
  },
  {
    id: 2,
    name: "Рысь",
    species: "Lynx lynx",
    status: "vulnerable",
    description: "Крупная хищная кошка с кисточками на ушах.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Lynx_lynx2.jpg/640px-Lynx_lynx2.jpg",
    population: "~800 особей",
    habitat: "Леса по всей стране"
  },
  {
    id: 3,
    name: "Чёрный аист",
    species: "Ciconia nigra",
    status: "endangered",
    description: "Редкая птица, гнездящаяся в глухих лесах.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Ciconia_nigra_on_Lesbos_Greece.jpg/330px-Ciconia_nigra_on_Lesbos_Greece.jpg",
    population: "~400 пар",
    habitat: "Заболоченные леса"
  },
  {
    id: 4,
    name: "Беркут",
    species: "Aquila chrysaetos",
    status: "endangered",
    description: "Крупный орёл, самый большой хищник Беларуси.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Maakotka_%28Aquila_chrysaetos%29_by_Jarkko_J%C3%A4rvinen_%28crop%29.jpg/330px-Maakotka_%28Aquila_chrysaetos%29_by_Jarkko_J%C3%A4rvinen_%28crop%29.jpg",
    population: "~50 пар",
    habitat: "Северные районы"
  },
  {
    id: 5,
    name: "Выдра",
    species: "Lutra lutra",
    status: "vulnerable",
    description: "Водный хищник с ценным мехом.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Young_Otter_%281%29_%285878286924%29.jpg/330px-Young_Otter_%281%29_%285878286924%29.jpg",
    population: "~2000 особей",
    habitat: "Реки и озёра"
  },
  {
    id: 6,
    name: "Барсук",
    species: "Meles meles",
    status: "rare",
    description: "Крупный хищник, роющий глубокие норы.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/%D0%91%D0%BE%D1%80%D1%81%D1%83%D0%BA.jpg/330px-%D0%91%D0%BE%D1%80%D1%81%D1%83%D0%BA.jpg",
    population: "~5000 особей",
    habitat: "Леса по всей стране"
  },
  {
    id: 7,
    name: "Серый журавль",
    species: "Grus grus",
    status: "vulnerable",
    description: "Крупная перелётная птица с громким голосом.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Grus_grus_1_%28Marek_Szczepanek%29.jpg/330px-Grus_grus_1_%28Marek_Szczepanek%29.jpg",
    population: "~1500 пар",
    habitat: "Болота и влажные луга"
  },
  {
    id: 8,
    name: "Филин",
    species: "Bubo bubo",
    status: "endangered",
    description: "Крупнейшая сова Европы с характерными 'ушами'.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Bubo_bubo_winter_1.jpg/330px-Bubo_bubo_winter_1.jpg",
    population: "~100 пар",
    habitat: "Глухие леса"
  },
  {
    id: 9,
    name: "Волк",
    species: "Canis lupus",
    status: "vulnerable",
    description: "Крупный хищник, санитар леса.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Eurasian_wolf_2.jpg/330px-Eurasian_wolf_2.jpg",
    population: "~1500 особей",
    habitat: "Леса по всей стране"
  },
  {
    id: 10,
    name: "Бурый медведь",
    species: "Ursus arctos",
    status: "endangered",
    description: "Крупнейший хищник Беларуси.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/2010-kodiak-bear-1.jpg/330px-2010-kodiak-bear-1.jpg",
    population: "~100 особей",
    habitat: "Беловежская пуща"
  },
  {
    id: 11,
    name: "Лось",
    species: "Alces alces",
    status: "rare",
    description: "Крупнейший представитель оленевых.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Moose_superior.jpg/330px-Moose_superior.jpg",
    population: "~10000 особей",
    habitat: "Леса и болота"
  },
  {
    id: 12,
    name: "Косуля",
    species: "Capreolus capreolus",
    status: "rare",
    description: "Небольшой изящный олень.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Capreolus_capreolus_2_Jojo.jpg/330px-Capreolus_capreolus_2_Jojo.jpg",
    population: "~50000 особей",
    habitat: "Леса и поля"
  },
  {
    id: 13,
    name: "Бобр",
    species: "Castor fiber",
    status: "vulnerable",
    description: "Крупный грызун, строитель плотин.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/%D0%9E%D0%B1%D1%8B%D0%BA%D0%BD%D0%BE%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9_%D0%B1%D0%BE%D0%B1%D1%80_%28Castor_fiber%29%2C_%D0%9F%D0%BE%D0%BA%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%B5-%D0%A1%D1%82%D1%80%D0%B5%D1%88%D0%BD%D0%B5%D0%B2%D0%BE.jpg/330px-%D0%9E%D0%B1%D1%8B%D0%BA%D0%BD%D0%BE%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9_%D0%B1%D0%BE%D0%B1%D1%80_%28Castor_fiber%29%2C_%D0%9F%D0%BE%D0%BA%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%B5-%D0%A1%D1%82%D1%80%D0%B5%D1%88%D0%BD%D0%B5%D0%B2%D0%BE.jpg",
    population: "~60000 особей",
    habitat: "Реки и озёра"
  },
  {
    id: 14,
    name: "Ёж",
    species: "Erinaceus europaeus",
    status: "rare",
    description: "Небольшой насекомоядный зверёк с иголками.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Erinaceus_europaeus_LC0119.jpg/330px-Erinaceus_europaeus_LC0119.jpg",
    population: "~100000 особей",
    habitat: "Леса, парки, сады"
  },
  {
    id: 15,
    name: "Заяц-русак",
    species: "Lepus europaeus",
    status: "rare",
    description: "Крупный заяц с длинными ушами.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Lepus_europaeus_%28Causse_M%C3%A9jean%2C_Loz%C3%A8re%29-cropped.jpg/330px-Lepus_europaeus_%28Causse_M%C3%A9jean%2C_Loz%C3%A8re%29-cropped.jpg",
    population: "~80000 особей",
    habitat: "Поля и опушки"
  },
  {
    id: 16,
    name: "Лисица",
    species: "Vulpes vulpes",
    status: "rare",
    description: "Хищник с рыжей шерстью и пушистым хвостом.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Tiergarten_Worms_Rotfuchs_2011.JPG/330px-Tiergarten_Worms_Rotfuchs_2011.JPG",
    population: "~30000 особей",
    habitat: "Леса и поля"
  },
  {
    id: 17,
    name: "Белка",
    species: "Sciurus vulgaris",
    status: "rare",
    description: "Прыгучий грызун с пушистым хвостом.",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/MattiParkkonen_Orava.jpg",
    population: "~150000 особей",
    habitat: "Леса и парки"
  },
  {
    id: 18,
    name: "Уж",
    species: "Natrix natrix",
    status: "vulnerable",
    description: "Неядовитая змея с жёлтыми пятнами за головой.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/2017.07.17.-15-Tiefer_See_oder_Grubensee-Storkow_%28Mark%29--Ringelnatter.jpg/330px-2017.07.17.-15-Tiefer_See_oder_Grubensee-Storkow_%28Mark%29--Ringelnatter.jpg",
    population: "~50000 особей",
    habitat: "Водоёмы и влажные места"
  },
  {
    id: 19,
    name: "Ястреб-тетеревятник",
    species: "Accipiter gentilis",
    status: "vulnerable",
    description: "Крупный хищник, охотящийся на птиц.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Northern_Goshawk_ad_M2.jpg/250px-Northern_Goshawk_ad_M2.jpg",
    population: "20000 особей",
    habitat: " Населяют хвойные и лиственные леса."
  },
  ]


// Отзывы пользователей (глобальные, сохраняются для всех)
let BOOK_REVIEWS = [];
const THEMES = {
    LIGHT: {
        name: 'light',
        bg: '#fafbfc',
        text: '#24292f',
        card: '#ffffff',
        border: '#d1d9e0',
        primary: '#0969da',
        secondary: '#8250df',
        accent: '#f78166'
    },
    DARK: {
        name: 'dark',
        bg: '#1a1a1a',
        text: '#ffffff',
        card: '#2d2d2d',
        border: '#404040',
        primary: '#66BB6A',
        secondary: '#64B5F6',
        accent: '#FFB74D'
    }
};

// Ключи для localStorage
const STORAGE_KEYS = {
    USER_DATA: 'knigabel_user_data_v2',
    BOOKS_DATA: 'knigabel_books_data_v2',
    LIBRARY_STATS: 'knigabel_library_stats_v2',
    USER_REVIEWS: 'knigabel_user_reviews_v2',
    THEME: 'knigabel_theme_v2',
    BOOK_REVIEWS: 'knigabel_global_reviews_v3' // Изменен ключ для сброса старых отзывов
};

// Игровые данные
const GAME_DATA = {
    // Ежедневные задания
    dailyQuests: [
        {
            id: 'read_pages',
            title: 'Читатель страниц',
            description: 'Прочитайте 10 страниц',
            icon: '📖',
            reward: { exp: 20, coins: 5 },
            progress: 0,
            target: 10,
            completed: false
        },
        {
            id: 'borrow_book',
            title: 'Книжный гурман',
            description: 'Забронируйте книгу',
            icon: '📚',
            reward: { exp: 15, coins: 3 },
            progress: 0,
            target: 1,
            completed: false
        },
        {
            id: 'write_review',
            title: 'Критик',
            description: 'Напишите отзыв о книге',
            icon: '✍️',
            reward: { exp: 25, coins: 7 },
            progress: 0,
            target: 1,
            completed: false
        },
        {
            id: 'favorite_book',
            title: 'Любитель книг',
            description: 'Добавьте книгу в избранное',
            icon: '❤️',
            reward: { exp: 10, coins: 2 },
            progress: 0,
            target: 1,
            completed: false
        }
    ],

    // Недельные челленджи
    weeklyChallenges: [
        {
            id: 'read_books_week',
            title: 'Недельный читатель',
            description: 'Прочитайте 5 книг за неделю',
            icon: '📚',
            reward: { exp: 100, coins: 25 },
            progress: 0,
            target: 5,
            completed: false
        },
        {
            id: 'pages_week',
            title: 'Марафонец чтения',
            description: 'Прочитайте 200 страниц за неделю',
            icon: '🏃',
            reward: { exp: 80, coins: 20 },
            progress: 0,
            target: 200,
            completed: false
        },
        {
            id: 'reviews_week',
            title: 'Супер-критик',
            description: 'Напишите 3 отзыва за неделю',
            icon: '⭐',
            reward: { exp: 60, coins: 15 },
            progress: 0,
            target: 3,
            completed: false
        }
    ],

    // Месячные челленджи
    monthlyChallenges: [
        {
            id: 'read_books_month',
            title: 'Месячный марафон',
            description: 'Прочитайте 20 книг за месяц',
            icon: '📚',
            reward: { exp: 500, coins: 100 },
            progress: 0,
            target: 20,
            completed: false
        },
        {
            id: 'pages_month',
            title: 'Мастер страниц',
            description: 'Прочитайте 1000 страниц за месяц',
            icon: '📄',
            reward: { exp: 400, coins: 80 },
            progress: 0,
            target: 1000,
            completed: false
        },
        {
            id: 'reviews_month',
            title: 'Критик месяца',
            description: 'Напишите 10 отзывов за месяц',
            icon: '✍️',
            reward: { exp: 300, coins: 60 },
            progress: 0,
            target: 10,
            completed: false
        },
        {
            id: 'streak_month',
            title: 'Несокрушимая серия',
            description: 'Поддерживайте серию чтения 30 дней',
            icon: '🔥',
            reward: { exp: 350, coins: 70 },
            progress: 0,
            target: 30,
            completed: false
        },
        {
            id: 'genres_month',
            title: 'Исследователь жанров',
            description: 'Прочитайте книги из 10 разных жанров',
            icon: '🗺️',
            reward: { exp: 250, coins: 50 },
            progress: 0,
            target: 10,
            completed: false
        }
    ],

    // Специальные события
    specialEvents: [
        {
            id: 'reading_challenge',
            title: 'Челлендж чтения',
            description: 'Прочитайте как можно больше страниц за 24 часа',
            icon: '⏰',
            active: true,
            endDate: '2024-12-31',
            reward: { exp: 50, coins: 10 }
        },
        {
            id: 'author_quiz',
            title: 'Викторина об авторах',
            description: 'Ответьте на вопросы об авторах книг',
            icon: '🧠',
            active: true,
            endDate: '2024-12-31',
            reward: { exp: 30, coins: 8 }
        }
    ],

    // Магазин наград
    rewardsShop: [
        {
            id: 'avatar_frame',
            title: 'Золотая рамка аватара',
            description: 'Роскошная золотая рамка для вашего профиля',
            icon: '👑',
            price: 50,
            owned: false
        },
        {
            id: 'theme_unlock',
            title: 'Тёмная тема',
            description: 'Разблокируйте стильную тёмную тему приложения',
            icon: '🌙',
            price: 100,
            owned: false
        },
        {
            id: 'special_badge',
            title: 'Элитный значок',
            description: 'Уникальный значок элитного читателя',
            icon: '🏅',
            price: 75,
            owned: false
        },
        {
            id: 'bonus_exp',
            title: 'Бонус опыта',
            description: '+50 опыта для быстрого роста уровня',
            icon: '⚡',
            price: 25,
            consumable: true
        },
        {
            id: 'reading_streak_booster',
            title: 'Бустер серии чтения',
            description: '+7 дней к серии чтения',
            icon: '🔥',
            price: 40,
            consumable: true
        },
        {
            id: 'coin_multiplier',
            title: 'Множитель кристаллов',
            description: 'Удваивает кристаллы за следующие 5 заданий',
            icon: '💎',
            price: 60,
            consumable: true
        },
        {
            id: 'exclusive_avatar',
            title: 'Эксклюзивный аватар',
            description: 'Редкий аватар "Мастер чтения"',
            icon: '🎭',
            price: 120,
            owned: false
        },
        {
            id: 'background_theme',
            title: 'Фон профиля',
            description: 'Красивый градиентный фон для профиля',
            icon: '🎨',
            price: 80,
            owned: false
        },
        {
            id: 'speed_reading',
            title: 'Ускорение чтения',
            description: '+20% к скорости чтения на неделю',
            icon: '🚀',
            price: 90,
            consumable: true
        },
        {
            id: 'achievement_unlocker',
            title: 'Разблокировщик достижений',
            description: 'Мгновенно разблокирует случайное достижение',
            icon: '🎯',
            price: 150,
            consumable: true
        }
    ],

    // Система титулов
    titles: [
        {
            id: 'novice_reader',
            name: 'Начинающий читатель',
            description: 'Первый шаг в мир книг',
            icon: '📖',
            price: 100,
            unlocked: false,
            condition: (user) => user.stats.booksCompleted >= 1
        },
        {
            id: 'bookworm',
            name: 'Книжный червь',
            description: 'Любитель чтения',
            icon: '📚',
            price: 250,
            unlocked: false,
            condition: (user) => user.stats.booksCompleted >= 10
        },
        {
            id: 'literature_expert',
            name: 'Эксперт литературы',
            description: 'Знаток книжного мира',
            icon: '🎓',
            price: 500,
            unlocked: false,
            condition: (user) => user.stats.booksCompleted >= 25
        },
        {
            id: 'bibliophile',
            name: 'Библиофил',
            description: 'Истинный ценитель книг',
            icon: '🏛️',
            price: 1000,
            unlocked: false,
            condition: (user) => user.stats.booksCompleted >= 50
        },
        {
            id: 'reading_legend',
            name: 'Легенда чтения',
            description: 'Мастер книжного искусства',
            icon: '👑',
            price: 2000,
            unlocked: false,
            condition: (user) => user.stats.booksCompleted >= 100
        },
        {
            id: 'critic',
            name: 'Критик',
            description: 'Знаток литературной критики',
            icon: '✍️',
            price: 300,
            unlocked: false,
            condition: (user) => user.stats.reviewsWritten >= 10
        },
        {
            id: 'social_reader',
            name: 'Социальный читатель',
            description: 'Общительный книголюб',
            icon: '👥',
            price: 400,
            unlocked: false,
            condition: (user) => user.stats.totalEvents >= 5
        },
        {
            id: 'speed_demon',
            name: 'Скоростной демон',
            description: 'Быстрый читатель',
            icon: '⚡',
            price: 600,
            unlocked: false,
            condition: (user) => user.stats.fastestRead <= 2
        },
        {
            id: 'marathon_runner',
            name: 'Марафонец',
            description: 'Выносливый читатель',
            icon: '🏃',
            price: 800,
            unlocked: false,
            condition: (user) => user.readingStreak >= 30
        },
        {
            id: 'achievement_hunter',
            name: 'Охотник за достижениями',
            description: 'Мастер достижений',
            icon: '🎯',
            price: 1500,
            unlocked: false,
            condition: (user) => user.achievements.length >= 15
        }
    ]
};

// Рассчитываем статистику библиотеки
const MOCK_STATS = {
    totalBooks: MOCK_BOOKS.length,
    availableBooks: MOCK_BOOKS.filter(book => book.available).length,
    borrowedBooks: Math.max(0, MOCK_BOOKS.length - MOCK_BOOKS.filter(book => book.available).length),
    totalGenres: 16,
    totalReviews: BOOK_REVIEWS.length
};

// Данные пользователя по умолчанию
const DEFAULT_USER_DATA = {
    name: 'Пользователь',
    avatar: '👤',
    registrationDate: new Date().toLocaleDateString('ru-RU'),
    telegramId: null,
    theme: 'light',
    profileBackground: 'default',
    // Система уровней и достижений
    level: 1,
    experience: 0,
    experienceToNext: 100,
    totalPagesRead: 0,
    readingStreak: 0,
    achievements: [],
    role: 'Активный пользователь',
    bookProgress: {}, // {bookId: {pagesRead: number, completed: boolean, achievements: []}}
    // Игровые данные
    coins: 0,
    gameStats: {
        dailyQuestsCompleted: 0,
        weeklyChallengesCompleted: 0,
        totalCoinsEarned: 0,
        specialEventsParticipated: 0
    },
    gameProgress: {
        dailyQuests: [],
        weeklyChallenges: [],
        specialEvents: [],
        shopItems: []
    },
    borrowedBooks: [],
    history: [],
    favorites: [],
    myReviews: [],
    bookedEvents: [],
    titles: [],
    stats: {
        totalBooks: 0,
        activeBorrows: 0,
        totalRead: 0,
        readingDays: 0,
        reviewsWritten: 0,
        totalEvents: 0,
        booksCompleted: 0,
        achievementsUnlocked: 0,
        dailyChallengesCompleted: 0,
        weeklyChallengesCompleted: 0,
        totalPagesRead: 0
    },
    achievementRewardsClaimed: [],
    challenges: {
        daily: {
            lastReset: null,
            completed: [],
            claimed: []
        },
        weekly: {
            lastReset: null,
            completed: [],
            claimed: []
        },
        monthly: {
            lastReset: null,
            completed: [],
            claimed: []
        }
    }
};

// Функции для работы с рейтингами
const RatingUtils = {
    // Обновление рейтинга книги при добавлении нового отзыва
    updateBookRating(bookId, newRating) {
        const book = MOCK_BOOKS.find(b => b.id === bookId);
        if (book) {
            book.totalRating = (book.totalRating || 0) + newRating;
            book.ratingsCount = (book.ratingsCount || 0) + 1;
            book.rating = Math.round((book.totalRating / book.ratingsCount) * 10) / 10;
            book.reviewsCount = book.ratingsCount;
        }
    },

    // Создание звезд рейтинга
    createStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '⭐';
        if (hasHalfStar) stars += '✨';
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) stars += '☆';
        
        return stars;
    },

    // Текстовое описание рейтинга
    getRatingText(rating) {
        const texts = ['Ужасно', 'Плохо', 'Нормально', 'Хорошо', 'Отлично'];
        return texts[Math.floor(rating) - 1] || 'Не оценено';
    }
};

// Система достижений
const ACHIEVEMENTS = [
    // Достижения за чтение
    { id: 'first_book', name: 'Первый шаг', description: 'Прочитайте первую книгу', icon: '📖', type: 'reading', condition: (user) => user.stats.booksCompleted >= 1, reward: { exp: 20, coins: 5 } },
    { id: 'bookworm', name: 'Книжный червь', description: 'Прочитайте 5 книг', icon: '📚', type: 'reading', condition: (user) => user.stats.booksCompleted >= 5, reward: { exp: 50, coins: 10, title: 'Книжный червь' } },
    { id: 'literature_lover', name: 'Любитель литературы', description: 'Прочитайте 10 книг', icon: '❤️', type: 'reading', condition: (user) => user.stats.booksCompleted >= 10, reward: { exp: 100, coins: 20, title: 'Любитель литературы' } },
    { id: 'bibliophile', name: 'Библиофил', description: 'Прочитайте 25 книг', icon: '🏆', type: 'reading', condition: (user) => user.stats.booksCompleted >= 25, reward: { exp: 200, coins: 50, title: 'Библиофил' } },

    // Достижения за страницы
    { id: 'page_master', name: 'Мастер страниц', description: 'Прочитайте 1000 страниц', icon: '📄', type: 'pages', condition: (user) => user.totalPagesRead >= 1000, reward: { exp: 75, coins: 15 } },
    { id: 'page_legend', name: 'Легенда страниц', description: 'Прочитайте 5000 страниц', icon: '📜', type: 'pages', condition: (user) => user.totalPagesRead >= 5000, reward: { exp: 150, coins: 30, title: 'Легенда страниц' } },

    // Достижения за отзывы
    { id: 'first_review', name: 'Критик', description: 'Напишите первый отзыв', icon: '✍️', type: 'reviews', condition: (user) => user.stats.reviewsWritten >= 1, reward: { exp: 15, coins: 3, title: 'Критик' } },
    { id: 'review_expert', name: 'Эксперт по отзывам', description: 'Напишите 10 отзывов', icon: '⭐', type: 'reviews', condition: (user) => user.stats.reviewsWritten >= 10, reward: { exp: 60, coins: 12 } },

    // Достижения за уровень
    { id: 'level_up', name: 'Рост уровня', description: 'Достигните 5 уровня', icon: '⬆️', type: 'level', condition: (user) => user.level >= 5, reward: { exp: 50, coins: 10 } },
    { id: 'high_level', name: 'Высокий уровень', description: 'Достигните 10 уровня', icon: '🎯', type: 'level', condition: (user) => user.level >= 10, reward: { exp: 100, coins: 25 } },
    { id: 'level_master', name: 'Мастер уровней', description: 'Достигните 15 уровня', icon: '⭐', type: 'level', condition: (user) => user.level >= 15, reward: { exp: 200, coins: 50, title: 'Мастер уровней' } },

    // Достижения за события
    { id: 'first_event', name: 'Посетитель событий', description: 'Посетите первое мероприятие', icon: '🎫', type: 'events', condition: (user) => user.stats.totalEvents >= 1, reward: { exp: 25, coins: 5, title: 'Посетитель событий' } },
    { id: 'event_regular', name: 'Постоянный посетитель', description: 'Посетите 5 мероприятий', icon: '🎪', type: 'events', condition: (user) => user.stats.totalEvents >= 5, reward: { exp: 75, coins: 15 } },

    // Специальные достижения
    { id: 'early_bird', name: 'Ранняя пташка', description: 'Используйте приложение в первые 7 дней', icon: '🐦', type: 'special', condition: (user) => user.stats.readingDays >= 7, reward: { exp: 30, coins: 7 } },
    { id: 'streak_master', name: 'Мастер серии', description: 'Поддерживайте серию чтения 7 дней', icon: '🔥', type: 'special', condition: (user) => user.readingStreak >= 7, reward: { exp: 40, coins: 10 } },

    // Достижения за жанры
    { id: 'classic_reader', name: 'Классик', description: 'Прочитайте 5 классических произведений', icon: '📜', type: 'genres', condition: (user) => user.stats.booksCompleted >= 5, reward: { exp: 45, coins: 9 } },
    { id: 'fantasy_explorer', name: 'Исследователь фантастики', description: 'Прочитайте 3 фантастических книги', icon: '🧙', type: 'genres', condition: (user) => user.stats.booksCompleted >= 3, reward: { exp: 35, coins: 7 } },
    { id: 'mystery_solver', name: 'Разгадыватель тайн', description: 'Прочитайте 3 детективных книги', icon: '🕵️', type: 'genres', condition: (user) => user.stats.booksCompleted >= 3, reward: { exp: 35, coins: 7 } },

    // Достижения за социальную активность
    { id: 'social_butterfly', name: 'Социальная бабочка', description: 'Добавьте 10 друзей', icon: '🦋', type: 'social', condition: (user) => user.stats.friendsCount >= 10, reward: { exp: 40, coins: 8 } },
    { id: 'review_master', name: 'Мастер отзывов', description: 'Получите 50 лайков на отзывы', icon: '👍', type: 'social', condition: (user) => user.stats.reviewLikes >= 50, reward: { exp: 60, coins: 12 } },

    // Достижения за события
    { id: 'event_attendee', name: 'Посетитель', description: 'Посетите 10 мероприятий', icon: '🎭', type: 'events', condition: (user) => user.stats.totalEvents >= 10, reward: { exp: 80, coins: 16 } },
    { id: 'event_organizer', name: 'Организатор', description: 'Организуйте мероприятие', icon: '🎪', type: 'events', condition: (user) => user.stats.eventsOrganized >= 1, reward: { exp: 100, coins: 20 } },

    // Достижения за коллекционирование
    { id: 'collection_starter', name: 'Коллекционер', description: 'Соберите 10 книг в избранное', icon: '⭐', type: 'collection', condition: (user) => user.favorites.length >= 10, reward: { exp: 30, coins: 6 } },
    { id: 'collection_master', name: 'Мастер коллекций', description: 'Соберите 50 книг в избранное', icon: '🏆', type: 'collection', condition: (user) => user.favorites.length >= 50, reward: { exp: 90, coins: 18 } },

    // Достижения за производительность
    { id: 'speed_reader', name: 'Быстрый читатель', description: 'Прочитайте книгу за 1 день', icon: '⚡', type: 'performance', condition: (user) => user.stats.fastestRead <= 1, reward: { exp: 55, coins: 11 } },
    { id: 'consistent_reader', name: 'Последовательный читатель', description: 'Чтение 30 дней подряд', icon: '📅', type: 'performance', condition: (user) => user.readingStreak >= 30, reward: { exp: 120, coins: 25 } },

    // Достижения за викторины
    { id: 'quiz_starter', name: 'Начинающий знаток', description: 'Пройдите первую викторину', icon: '🧠', type: 'education', condition: (user) => user.educationProgress?.quizzes?.length >= 1, reward: { exp: 25, coins: 5 } },
    { id: 'quiz_expert', name: 'Эксперт викторин', description: 'Пройдите 5 викторин', icon: '🎓', type: 'education', condition: (user) => user.educationProgress?.quizzes?.length >= 5, reward: { exp: 75, coins: 15 } },
    { id: 'quiz_master', name: 'Мастер викторин', description: 'Пройдите все викторины', icon: '👑', type: 'education', condition: (user) => user.educationProgress?.quizzes?.length >= 4, reward: { exp: 150, coins: 30, title: 'Мастер викторин' } },
    { id: 'perfect_score', name: 'Идеальный балл', description: 'Получите 100% в любой викторине', icon: '💯', type: 'education', condition: (user) => user.educationProgress?.quizScores && Object.values(user.educationProgress.quizScores).some(score => score === 100), reward: { exp: 50, coins: 10 } },
    { id: 'high_scorer', name: 'Высокий балл', description: 'Получите средний балл выше 80%', icon: '⭐', type: 'education', condition: (user) => {
        const scores = user.educationProgress?.quizScores ? Object.values(user.educationProgress.quizScores) : [];
        return scores.length > 0 && (scores.reduce((a, b) => a + b, 0) / scores.length) >= 80;
    }, reward: { exp: 40, coins: 8 } },

    // Достижения за уроки
    { id: 'lesson_learner', name: 'Учащийся', description: 'Пройдите первый урок', icon: '📖', type: 'education', condition: (user) => user.educationProgress?.lessons?.length >= 1, reward: { exp: 20, coins: 4 } },
    { id: 'knowledge_seeker', name: 'Искатель знаний', description: 'Пройдите 3 урока', icon: '🔍', type: 'education', condition: (user) => user.educationProgress?.lessons?.length >= 3, reward: { exp: 60, coins: 12 } },
    { id: 'scholar', name: 'Ученый', description: 'Пройдите все уроки', icon: '🎓', type: 'education', condition: (user) => user.educationProgress?.lessons?.length >= 6, reward: { exp: 120, coins: 25, title: 'Ученый' } },

    // Достижения за достижения
    { id: 'achievement_hunter', name: 'Охотник за достижениями', description: 'Получите 10 достижений', icon: '🎯', type: 'meta', condition: (user) => user.achievements.length >= 10, reward: { exp: 70, coins: 15 } },
    { id: 'achievement_master', name: 'Мастер достижений', description: 'Получите все достижения', icon: '👑', type: 'meta', condition: (user) => user.achievements.length >= ACHIEVEMENTS.length, reward: { exp: 300, coins: 100, title: 'Мастер достижений' } },

    // Новые достижения
    { id: 'genre_explorer', name: 'Исследователь жанров', description: 'Прочитайте книги из 5 разных жанров', icon: '🗺️', type: 'genres', condition: (user) => user.stats.booksCompleted >= 5, reward: { exp: 50, coins: 10 } },
    { id: 'night_owl', name: 'Ночная сова', description: 'Чтение после полуночи 10 раз', icon: '🦉', type: 'special', condition: (user) => user.stats.nightReading >= 10, reward: { exp: 35, coins: 7 } },
    { id: 'social_reader', name: 'Социальный читатель', description: 'Поделитесь 20 отзывами', icon: '📣', type: 'social', condition: (user) => user.stats.reviewsWritten >= 20, reward: { exp: 65, coins: 13 } },
    { id: 'book_collector', name: 'Коллекционер', description: 'Добавьте 100 книг в избранное', icon: '📚', type: 'collection', condition: (user) => user.favorites.length >= 100, reward: { exp: 110, coins: 22 } },
    { id: 'marathon_reader', name: 'Марафонец чтения', description: 'Прочитайте 1000 страниц за месяц', icon: '🏃‍♂️', type: 'performance', condition: (user) => user.stats.monthlyPages >= 1000, reward: { exp: 85, coins: 17 } },
    { id: 'review_quality', name: 'Критик качества', description: 'Получите 50 лайков на отзывы', icon: '👍', type: 'social', condition: (user) => user.stats.reviewLikes >= 50, reward: { exp: 60, coins: 12 } },
    { id: 'early_adopter', name: 'Ранний пользователь', description: 'Используйте приложение в первые 30 дней', icon: '🚀', type: 'special', condition: (user) => user.stats.readingDays >= 30, reward: { exp: 45, coins: 9 } },
    { id: 'perfect_week', name: 'Идеальная неделя', description: 'Чтение каждый день в течение недели', icon: '📅', type: 'performance', condition: (user) => user.readingStreak >= 7, reward: { exp: 40, coins: 8 } },
    { id: 'author_fan', name: 'Фанат автора', description: 'Прочитайте все книги одного автора', icon: '👨‍🎨', type: 'genres', condition: (user) => user.stats.authorComplete >= 1, reward: { exp: 55, coins: 11 } },
    { id: 'reading_champion', name: 'Чемпион чтения', description: 'Прочитайте 500 книг', icon: '🏆', type: 'reading', condition: (user) => user.stats.booksCompleted >= 500, reward: { exp: 500, coins: 200, title: 'Чемпион чтения' } }
];

// Функции для работы с достижениями
const AchievementSystem = {
    checkAchievements(user) {
        const newAchievements = [];
        ACHIEVEMENTS.forEach(achievement => {
            if (!user.achievements.some(a => a.id === achievement.id) && achievement.condition(user)) {
                newAchievements.push({
                    ...achievement,
                    unlockedAt: new Date().toISOString()
                });
            }
        });
        return newAchievements;
    },

    unlockAchievements(user, newAchievements) {
        newAchievements.forEach(achievement => {
            // Добавляем достижение
            user.achievements.push(achievement);

            // Автоматически начисляем награду
            if (achievement.reward) {
                let rewardText = '';

                if (achievement.reward.exp > 0) {
                    const levelUp = window.APP_DATA.LevelSystem.addExperience(user, achievement.reward.exp);
                    rewardText += `${achievement.reward.exp} опыта`;
                    if (levelUp.leveledUp) {
                        rewardText += ` (новый уровень ${levelUp.newLevel}!)`;
                    }
                }

                if (achievement.reward.coins > 0) {
                    user.coins = (user.coins || 0) + achievement.reward.coins;
                    rewardText += (rewardText ? ', ' : '') + `${achievement.reward.coins} 💎`;
                }

                if (achievement.reward.title) {
                    if (!user.titles) user.titles = [];
                    if (!user.titles.includes(achievement.reward.title)) {
                        user.titles.push(achievement.reward.title);
                        rewardText += (rewardText ? ', ' : '') + `титул "${achievement.reward.title}"`;
                    }
                }

                // Показываем уведомление о награде
                if (rewardText) {
                    console.log(`Получена награда за достижение "${achievement.name}": ${rewardText}`);
                }
            }

            // Проверяем связанные титулы (старый способ для совместимости)
            const relatedTitle = TITLES.find(title =>
                title.type === 'achievement' && title.condition && title.condition(user)
            );
            if (relatedTitle && !user.titles?.includes(relatedTitle.id)) {
                if (!user.titles) user.titles = [];
                user.titles.push(relatedTitle.id);
                console.log(`Получен титул "${relatedTitle.name}" за достижение "${achievement.name}"`);
            }
        });

        user.stats.achievementsUnlocked = user.achievements.length;
    },

    getAchievementProgress(user, achievementId) {
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (!achievement) return null;

        // Здесь можно добавить логику для расчета прогресса
        return {
            current: 0,
            target: 1,
            percentage: 0
        };
    },

    claimReward(user, achievementId) {
        // Проверяем, получено ли достижение
        const userAchievement = user.achievements.find(a => a.id === achievementId);
        if (!userAchievement) {
            throw new Error('Достижение не получено');
        }

        // Проверяем, не забрана ли награда
        if (!user.achievementRewardsClaimed) {
            user.achievementRewardsClaimed = [];
        }
        if (user.achievementRewardsClaimed.includes(achievementId)) {
            throw new Error('Награда уже забрана');
        }

        // Получаем данные достижения
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (!achievement || !achievement.reward) {
            throw new Error('Награда недоступна');
        }

        // Выдаем награду
        const reward = achievement.reward;
        let rewardText = '';

        if (reward.exp > 0) {
            const levelUp = window.APP_DATA.LevelSystem.addExperience(user, reward.exp);
            rewardText += `${reward.exp} опыта`;
            if (levelUp.leveledUp) {
                rewardText += ` (новый уровень ${levelUp.newLevel}!)`;
            }
        }

        if (reward.coins > 0) {
            user.coins = (user.coins || 0) + reward.coins;
            rewardText += (rewardText ? ', ' : '') + `${reward.coins} 💎`;
        }

        if (reward.title) {
            if (!user.titles) user.titles = [];
            if (!user.titles.includes(reward.title)) {
                user.titles.push(reward.title);
                rewardText += (rewardText ? ', ' : '') + `титул "${reward.title}"`;
            }
        }

        // Отмечаем награду как забранную
        user.achievementRewardsClaimed.push(achievementId);

        return {
            success: true,
            rewardText: rewardText,
            achievement: achievement
        };
    }
};

// Функции для работы с уровнями
const LevelSystem = {
    calculateLevel(experience) {
        // Уровень = floor(опыт / 100) + 1
        return Math.floor(experience / 100) + 1;
    },

    getExperienceForLevel(level) {
        return (level - 1) * 100;
    },

    getExperienceToNextLevel(currentExp) {
        const currentLevel = this.calculateLevel(currentExp);
        const nextLevelExp = this.getExperienceForLevel(currentLevel + 1);
        return nextLevelExp - currentExp;
    },

    addExperience(user, amount) {
        user.experience += amount;
        const newLevel = this.calculateLevel(user.experience);

        if (newLevel > user.level) {
            user.level = newLevel;
            // Показать уведомление о новом уровне
            return { leveledUp: true, newLevel: newLevel };
        }

        user.experienceToNext = this.getExperienceToNextLevel(user.experience);
        return { leveledUp: false };
    }
};

// Экспортируем все данные
window.APP_DATA = {
    CONFIG,
    MOCK_BOOKS,
    MOCK_GENRES,
    MOCK_EVENTS,
    TITLES,
    RED_BOOK_ANIMALS,
    STORAGE_KEYS,
    BOOK_REVIEWS,
    MOCK_STATS,
    DEFAULT_USER_DATA,
    THEMES,
    RatingUtils,
    ACHIEVEMENTS,
    AchievementSystem,
    LevelSystem,
    DAILY_CHALLENGES,
    WEEKLY_CHALLENGES,
    AUTHOR_BIOS,
    BOOK_QUOTES,
    GAME_DATA
};
console.log('MOCK_BOOKS length:', MOCK_BOOKS.length);
console.log('data.js loaded successfully');