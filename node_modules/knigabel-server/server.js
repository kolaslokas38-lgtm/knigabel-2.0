const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { books, genres } = require('./books-data');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Статистика библиотеки
let libraryStats = {
   totalBooks: books.length,
   availableBooks: books.filter(book => book.available).length,
   borrowedBooks: books.filter(book => !book.available).length,
   totalGenres: genres.length - 1 // минус "Все жанры"
};

// Хранилище отзывов

// Функции для работы с файлами
const USERS_FILE = path.join(__dirname, 'users.json');
const BOOKS_FILE = path.join(__dirname, 'books-modified.json');
const REVIEWS_FILE = path.join(__dirname, 'reviews.json');

function loadUsers() {
    try {
        if (fs.existsSync(USERS_FILE)) {
            const data = fs.readFileSync(USERS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
    }

    // Возвращаем демо пользователей, если файл не найден
    return [
        {
            id: 1,
            telegramId: 'demo_user',
            name: 'Демо Пользователь',
            avatar: '👤',
            role: 'Активный пользователь',
            level: 1,
            experience: 0,
            coins: 0,
            registrationDate: new Date().toLocaleDateString('ru-RU'),
            stats: {
                totalBooks: 0,
                activeBorrows: 0,
                totalRead: 0,
                readingDays: 0,
                reviewsWritten: 0
            }
        }
    ];
}

function saveUsers() {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        console.log('Пользователи сохранены в файл');
    } catch (error) {
        console.error('Ошибка сохранения пользователей:', error);
    }
}

function loadBooks() {
    try {
        if (fs.existsSync(BOOKS_FILE)) {
            const data = fs.readFileSync(BOOKS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Ошибка загрузки книг:', error);
    }
    return books; // Возвращаем исходные книги
}

function saveBooks() {
    try {
        fs.writeFileSync(BOOKS_FILE, JSON.stringify(books, null, 2));
        console.log('Книги сохранены в файл');
    } catch (error) {
        console.error('Ошибка сохранения книг:', error);
    }
}

function loadReviews() {
    try {
        if (fs.existsSync(REVIEWS_FILE)) {
            const data = fs.readFileSync(REVIEWS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
    }
    return []; // Возвращаем пустой массив
}

function saveReviews() {
    try {
        fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
        console.log('Отзывы сохранены в файл');
    } catch (error) {
        console.error('Ошибка сохранения отзывов:', error);
    }
}

// Хранилище данных
let users = loadUsers();
let books = loadBooks();
let reviews = loadReviews();

// Маршруты API

// Главная страница API
app.get('/', (req, res) => {
   res.json({
       message: 'Добро пожаловать в API библиотеки "КнігаБел"',
       version: '1.0.0',
       endpoints: {
           '/api/books': 'Получить все книги',
           '/api/books/search?q=query': 'Поиск книг',
           '/api/books/filter?genre=genreName': 'Фильтр по жанру',
           '/api/books/:id': 'Получить книгу по ID',
           '/api/books/:id/content': 'Получить контент книги для чтения',
           '/api/genres': 'Получить все жанры',
           '/api/stats': 'Статистика библиотеки',
           '/api/reviews': 'Получить все отзывы',
           '/api/reviews/book/:bookId': 'Получить отзывы для книги',
           'POST /api/reviews': 'Добавить новый отзыв',
           'DELETE /api/reviews/:id': 'Удалить отзыв',
           'POST /api/reviews/:id/like': 'Поставить лайк отзыву'
       }
   });
});

// Получить все книги
app.get('/api/books', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  
  const paginatedBooks = books.slice(startIndex, endIndex);
  
  res.json({
    books: paginatedBooks,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(books.length / limit),
      totalBooks: books.length,
      hasNext: endIndex < books.length,
      hasPrev: startIndex > 0
    }
  });
});

// Поиск книг
app.get('/api/books/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  
  if (!query) {
    return res.status(400).json({ error: 'Пустой поисковый запрос' });
  }
  
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(query) || 
    book.author.toLowerCase().includes(query) ||
    book.genre.toLowerCase().includes(query) ||
    book.description.toLowerCase().includes(query)
  );
  
  res.json({
    books: filteredBooks,
    query: query,
    count: filteredBooks.length
  });
});

// Фильтр по жанру
app.get('/api/books/filter', (req, res) => {
  const genre = req.query.genre;
  
  if (!genre || genre === 'Все жанры') {
    return res.json({ books: books });
  }
  
  const filteredBooks = books.filter(book => book.genre === genre);
  
  res.json({
    books: filteredBooks,
    genre: genre,
    count: filteredBooks.length
  });
});

// Получить книгу по ID
app.get('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return res.status(404).json({ error: 'Книга не найдена' });
  }

  res.json(book);
});

// Получить контент книги
app.get('/api/books/:id/content', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return res.status(404).json({ error: 'Книга не найдена' });
  }

  // Путь к файлу книги
  const bookFilePath = path.join(__dirname, '..', 'books', `book-${bookId}.txt`);

  // Проверяем существование файла
  if (!fs.existsSync(bookFilePath)) {
    // Если файла нет, возвращаем демо контент
    const demoContent = `Это демо контент для книги "${book.title}" автора ${book.author}.

Книга "${book.title}" - это увлекательное произведение в жанре ${book.genre}.

${book.description}

К сожалению, полный текст книги пока недоступен. Функция чтения находится в разработке.

Ожидайте обновлений! 📚✨`;

    return res.json({
      content: demoContent,
      bookId: bookId,
      available: false
    });
  }

  try {
    const content = fs.readFileSync(bookFilePath, 'utf8');
    res.json({
      content: content,
      bookId: bookId,
      available: true
    });
  } catch (error) {
    console.error('Ошибка чтения файла книги:', error);
    res.status(500).json({ error: 'Ошибка загрузки контента книги' });
  }
});

// Получить все жанры
app.get('/api/genres', (req, res) => {
  res.json(genres);
});

// Получить статистику
app.get('/api/stats', (req, res) => {
  res.json(libraryStats);
});

// Бронирование книги
app.post('/api/books/borrow/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === bookId);
  
  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Книга не найдена' });
  }
  
  if (!books[bookIndex].available) {
    return res.status(400).json({ error: 'Книга уже выдана' });
  }
  
  // Обновляем статус книги
  books[bookIndex].available = false;

  // Обновляем статистику
  libraryStats.availableBooks--;
  libraryStats.borrowedBooks++;

  // Сохраняем изменения
  saveBooks();

  res.json({
    success: true,
    message: `Книга "${books[bookIndex].title}" успешно забронирована!`,
    book: books[bookIndex]
  });
});

// Возврат книги
app.post('/api/books/return/:id', (req, res) => {
   const bookId = parseInt(req.params.id);
   const bookIndex = books.findIndex(b => b.id === bookId);

   if (bookIndex === -1) {
       return res.status(404).json({ error: 'Книга не найдена' });
   }

   if (books[bookIndex].available) {
       return res.status(400).json({ error: 'Книга уже доступна' });
   }

   // Обновляем статус книги
   books[bookIndex].available = true;

   // Обновляем статистику
   libraryStats.availableBooks++;
   libraryStats.borrowedBooks--;

   // Сохраняем изменения
   saveBooks();

   res.json({
       success: true,
       message: `Книга "${books[bookIndex].title}" успешно возвращена!`,
       book: books[bookIndex]
   });
});

// API для отзывов

// Получить все отзывы
app.get('/api/reviews', (req, res) => {
   res.json({
       reviews: reviews,
       count: reviews.length
   });
});

// Получить отзывы для конкретной книги
app.get('/api/reviews/book/:bookId', (req, res) => {
   const bookId = parseInt(req.params.bookId);
   const bookReviews = reviews.filter(review => review.bookId === bookId)
       .sort((a, b) => new Date(b.date) - new Date(a.date));

   res.json({
       reviews: bookReviews,
       count: bookReviews.length
   });
});

// Добавить новый отзыв
app.post('/api/reviews', (req, res) => {
   const { userId, userName, bookId, rating, comment, userAvatar } = req.body;

   if (!userId || !userName || !bookId || !rating || !comment) {
       return res.status(400).json({ error: 'Все поля обязательны' });
   }

   // Проверяем, не писал ли уже пользователь отзыв на эту книгу
   const existingReview = reviews.find(review =>
       review.userId === userId && review.bookId === bookId
   );

   if (existingReview) {
       return res.status(400).json({ error: 'Вы уже писали отзыв на эту книгу' });
   }

   const newReview = {
       id: Date.now(),
       userId,
       userName,
       bookId,
       rating: parseInt(rating),
       comment,
       date: new Date().toISOString().split('T')[0],
       likes: 0,
       userAvatar: userAvatar || '👤'
   };

   reviews.push(newReview);

   // Обновляем рейтинг книги
   const book = books.find(b => b.id === bookId);
   if (book) {
       book.totalRating = (book.totalRating || 0) + newReview.rating;
       book.ratingsCount = (book.ratingsCount || 0) + 1;
       book.rating = Math.round((book.totalRating / book.ratingsCount) * 10) / 10;
       book.reviewsCount = book.ratingsCount;
   }

   res.json({
       success: true,
       message: 'Отзыв успешно добавлен',
       review: newReview
   });
});

// Удалить отзыв
app.delete('/api/reviews/:id', (req, res) => {
   const reviewId = parseInt(req.params.id);
   const reviewIndex = reviews.findIndex(review => review.id === reviewId);

   if (reviewIndex === -1) {
       return res.status(404).json({ error: 'Отзыв не найден' });
   }

   const review = reviews[reviewIndex];
   const { userId } = req.body;

   // Проверяем, что отзыв принадлежит пользователю
   if (review.userId !== userId) {
       return res.status(403).json({ error: 'Нельзя удалить чужой отзыв' });
   }

   // Удаляем отзыв
   reviews.splice(reviewIndex, 1);

   // Пересчитываем рейтинг книги
   const book = books.find(b => b.id === review.bookId);
   if (book && book.ratingsCount > 0) {
       book.totalRating -= review.rating;
       book.ratingsCount -= 1;
       if (book.ratingsCount > 0) {
           book.rating = Math.round((book.totalRating / book.ratingsCount) * 10) / 10;
       } else {
           book.rating = 0;
           book.totalRating = 0;
       }
       book.reviewsCount = book.ratingsCount;
   }

   res.json({
       success: true,
       message: 'Отзыв успешно удален'
   });
});

// Лайк отзыва
app.post('/api/reviews/:id/like', (req, res) => {
    const reviewId = parseInt(req.params.id);
    const review = reviews.find(r => r.id === reviewId);

    if (!review) {
        return res.status(404).json({ error: 'Отзыв не найден' });
    }

    review.likes = (review.likes || 0) + 1;

    res.json({
        success: true,
        likes: review.likes
    });
});

// API для пользователей

// Получить всех пользователей
app.get('/api/users', (req, res) => {
    res.json({
        users: users,
        count: users.length
    });
});

// Получить пользователя по ID
app.get('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(user);
});

// Обновить пользователя
app.put('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const { level, experience, coins, role } = req.body;

    // Обновляем данные пользователя
    if (level !== undefined) users[userIndex].level = parseInt(level);
    if (experience !== undefined) users[userIndex].experience = parseInt(experience);
    if (coins !== undefined) users[userIndex].coins = parseInt(coins);
    if (role !== undefined) users[userIndex].role = role;

    // Сохраняем изменения в файл
    saveUsers();

    res.json({
        success: true,
        message: 'Пользователь успешно обновлен',
        user: users[userIndex]
    });
});

// Добавить нового пользователя
app.post('/api/users', (req, res) => {
    const { telegramId, name, avatar, role } = req.body;

    if (!telegramId || !name) {
        return res.status(400).json({ error: 'telegramId и name обязательны' });
    }

    // Проверяем, существует ли пользователь
    const existingUser = users.find(u => u.telegramId === telegramId);
    if (existingUser) {
        return res.status(400).json({ error: 'Пользователь уже существует' });
    }

    const newUser = {
        id: Date.now(),
        telegramId,
        name,
        avatar: avatar || '👤',
        role: role || 'Активный пользователь',
        level: 1,
        experience: 0,
        coins: 0,
        registrationDate: new Date().toLocaleDateString('ru-RU'),
        stats: {
            totalBooks: 0,
            activeBorrows: 0,
            totalRead: 0,
            readingDays: 0,
            reviewsWritten: 0
        }
    };

    users.push(newUser);

    // Сохраняем изменения в файл
    saveUsers();

    res.json({
        success: true,
        message: 'Пользователь успешно добавлен',
        user: newUser
    });
});

// Обработка 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер библиотеки "КнігаБел" запущен на порту ${PORT}`);
  console.log(`📚 Доступно книг: ${libraryStats.totalBooks}`);
  console.log(`✅ Доступно для выдачи: ${libraryStats.availableBooks}`);
  console.log(`🔗 API доступно по адресу: http://localhost:${PORT}`);
});