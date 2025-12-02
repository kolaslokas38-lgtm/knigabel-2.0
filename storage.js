// Функции для работы с localStorage
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        return false;
    }
}

function loadFromStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        return defaultValue;
    }
}

// Функции для сохранения конкретных данных
function saveUserData(userData) {
    return saveToStorage(window.APP_DATA.STORAGE_KEYS.USER_DATA, userData);
}

function saveBooksData() {
    const booksToSave = window.APP_DATA.MOCK_BOOKS.map(book => ({
        id: book.id,
        available: book.available,
        totalRating: book.totalRating,
        ratingsCount: book.ratingsCount,
        rating: book.rating,
        reviewsCount: book.reviewsCount
    }));
    return saveToStorage(window.APP_DATA.STORAGE_KEYS.BOOKS_DATA, booksToSave);
}

function saveLibraryStats() {
    return saveToStorage(window.APP_DATA.STORAGE_KEYS.LIBRARY_STATS, window.APP_DATA.MOCK_STATS);
}

function saveAllReviews() {
    return saveToStorage(window.APP_DATA.STORAGE_KEYS.BOOK_REVIEWS, window.APP_DATA.BOOK_REVIEWS);
}

// Глобальная система отзывов
function initializeGlobalReviews() {
    const saved = loadFromStorage(window.APP_DATA.STORAGE_KEYS.BOOK_REVIEWS);
    if (saved && Array.isArray(saved)) {
        // Загружаем сохраненные отзывы
        window.APP_DATA.BOOK_REVIEWS = saved;
    } else {
        // Если нет сохраненных отзывов, начинаем с пустого массива
        window.APP_DATA.BOOK_REVIEWS = [];
        saveGlobalReviews();
    }
}

function addGlobalReview(review) {
    // Добавляем отзыв в глобальный массив
    window.APP_DATA.BOOK_REVIEWS.unshift(review);

    // Обновляем рейтинг книги
    window.APP_DATA.RatingUtils.updateBookRating(review.bookId, review.rating);

    // Сохраняем глобально
    saveGlobalReviews();
    saveBooksData();

    return review;
}

function saveGlobalReviews() {
    return saveToStorage(window.APP_DATA.STORAGE_KEYS.BOOK_REVIEWS, window.APP_DATA.BOOK_REVIEWS);
}

function loadGlobalReviews() {
    return loadFromStorage(window.APP_DATA.STORAGE_KEYS.BOOK_REVIEWS, []);
}

// Функции для загрузки данных
function loadUserData() {
    const saved = loadFromStorage(window.APP_DATA.STORAGE_KEYS.USER_DATA);
    if (saved) {
        // Объединяем сохраненные данные с дефолтными (на случай добавления новых полей)
        return {
            ...window.APP_DATA.DEFAULT_USER_DATA,
            ...saved,
            stats: {
                ...window.APP_DATA.DEFAULT_USER_DATA.stats,
                ...(saved.stats || {})
            },
            myReviews: saved.myReviews || [],
            bookedEvents: saved.bookedEvents || [],
            theme: saved.theme || 'light'
        };
    }
    return window.APP_DATA.DEFAULT_USER_DATA;
}

function loadBooksData() {
    const saved = loadFromStorage(window.APP_DATA.STORAGE_KEYS.BOOKS_DATA);
    if (saved) {
        // Восстанавливаем статусы книг и рейтинги из сохраненных данных
        saved.forEach(savedBook => {
            const book = window.APP_DATA.MOCK_BOOKS.find(b => b.id === savedBook.id);
            if (book) {
                book.available = savedBook.available;
                book.totalRating = savedBook.totalRating || book.totalRating;
                book.ratingsCount = savedBook.ratingsCount || book.ratingsCount;
                book.rating = savedBook.rating || book.rating;
                book.reviewsCount = savedBook.reviewsCount || book.reviewsCount;
            }
        });
    }
}

function loadLibraryStats() {
    const saved = loadFromStorage(window.APP_DATA.STORAGE_KEYS.LIBRARY_STATS);
    if (saved) {
        Object.keys(saved).forEach(key => {
            window.APP_DATA.MOCK_STATS[key] = saved[key];
        });
    }
}

function loadAllReviews() {
    const saved = loadFromStorage(window.APP_DATA.STORAGE_KEYS.BOOK_REVIEWS);
    if (saved && saved.length > 0) {
        // Заменяем mock отзывы сохраненными
        window.APP_DATA.BOOK_REVIEWS.length = 0;
        window.APP_DATA.BOOK_REVIEWS.push(...saved);
    }
}

// Функция для сохранения темы
function saveTheme(theme) {
    return saveToStorage(window.APP_DATA.STORAGE_KEYS.THEME, theme);
}

function loadTheme() {
    return loadFromStorage(window.APP_DATA.STORAGE_KEYS.THEME, 'light');
}

// Функции для работы с отзывами
function addNewReview(review) {
    // Добавляем отзыв в общий список
    window.APP_DATA.BOOK_REVIEWS.unshift(review);
    
    // Обновляем рейтинг книги
    window.APP_DATA.RatingUtils.updateBookRating(review.bookId, review.rating);
    
    // Сохраняем изменения
    saveAllReviews();
    saveBooksData();
    
    return review;
}

function getUserReviews(userId) {
    return window.APP_DATA.BOOK_REVIEWS.filter(review => 
        review.userId === userId
    );
}

function getBookReviews(bookId) {
    return window.APP_DATA.BOOK_REVIEWS.filter(review => 
        review.bookId === bookId
    ).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function likeReview(reviewId) {
    const review = window.APP_DATA.BOOK_REVIEWS.find(r => r.id === reviewId);
    if (review) {
        review.likes = (review.likes || 0) + 1;
        saveAllReviews();
        return review.likes;
    }
    return 0;
}

function deleteReview(reviewId) {
    const reviewIndex = window.APP_DATA.BOOK_REVIEWS.findIndex(r => r.id === reviewId);
    if (reviewIndex !== -1) {
        const review = window.APP_DATA.BOOK_REVIEWS[reviewIndex];

        // Удаляем отзыв из массива
        window.APP_DATA.BOOK_REVIEWS.splice(reviewIndex, 1);

        // Обновляем рейтинг книги (пересчитываем без этого отзыва)
        window.APP_DATA.RatingUtils.recalculateBookRating(review.bookId);

        // Сохраняем изменения
        saveAllReviews();
        saveBooksData();

        return true;
    }
    return false;
}

// Функция для полного сохранения всех данных
function saveAllData(userData) {
    saveUserData(userData);
    saveBooksData();
    saveLibraryStats();
    saveAllReviews();
    saveTheme(userData.theme);
}

// Функция для полной загрузки всех данных
function loadAllData() {
    loadBooksData();
    loadLibraryStats();
    initializeGlobalReviews();
    const userData = loadUserData();
    userData.theme = loadTheme();
    return userData;
}

// Функция для очистки всех данных (для тестирования)
function clearAllData() {
    try {
        Object.values(window.APP_DATA.STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        
        // Восстанавливаем дефолтные данные
        window.location.reload();
        return true;
    } catch (error) {
        console.error('Ошибка очистки данных:', error);
        return false;
    }
}

// Функция для получения статистики хранилища
function getStorageStats() {
    const stats = {
        totalSize: 0,
        items: {}
    };
    
    Object.values(window.APP_DATA.STORAGE_KEYS).forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
            stats.items[key] = {
                size: new Blob([data]).size,
                length: data.length
            };
            stats.totalSize += new Blob([data]).size;
        }
    });
    
    return stats;
}

// Экспортируем функции хранилища
window.STORAGE = {
    // Основные функции
    saveToStorage,
    loadFromStorage,
    saveUserData,
    saveBooksData,
    saveLibraryStats,
    loadUserData,
    loadBooksData,
    loadLibraryStats,
    saveTheme,
    loadTheme,
    saveAllData,
    loadAllData,
    
    // Функции для отзывов
    addNewReview,
    getUserReviews,
    getBookReviews,
    likeReview,
    saveAllReviews,
    loadAllReviews,
    addGlobalReview,
    loadGlobalReviews,
    initializeGlobalReviews,
    saveGlobalReviews,
    
    // Сервисные функции
    clearAllData,
    getStorageStats
};