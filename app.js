// Глобальные переменные
let currentBooks = [];
let currentSearchQuery = '';
let currentGenre = '';
let tg = null;
let userData = null;
let currentReviewBookId = null;
let selectedRating = 0;
let currentEventId = null;
let selectedTickets = 1;
let currentBookingEventId = null;
let ticketCount = 1;
let reviewsChannel = null; // Для синхронизации отзывов между вкладками
let userDataChannel = null; // Для синхронизации данных пользователя между вкладками
let currentReadingBook = null;
let currentPage = 1;
let currentQuiz = null;
let isAdminLoggedIn = false;

// Функция для получения случайных книг
function getRandomBooks(count) {
    if (!window.APP_DATA || !window.APP_DATA.MOCK_BOOKS) {
        console.warn('MOCK_BOOKS не доступны, возвращаем пустой массив');
        return [];
    }

    const books = window.APP_DATA.MOCK_BOOKS.slice(); // Копируем массив
    const result = [];

    // Перемешиваем массив
    for (let i = books.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [books[i], books[j]] = [books[j], books[i]];
    }

    // Возвращаем первые count книг
    for (let i = 0; i < Math.min(count, books.length); i++) {
        result.push(books[i]);
    }

    return result;
}

// Функция для получения книги дня (постоянной на день)
function getBookOfDay() {
    let books = [];
    if (window.APP_DATA && window.APP_DATA.MOCK_BOOKS && window.APP_DATA.MOCK_BOOKS.length > 0) {
        books = window.APP_DATA.MOCK_BOOKS;
    } else {
        // Демо книги для книги дня
        books = [
            {
                id: 1,
                title: "Война и мир",
                author: "Лев Толстой",
                year: 1869,
                genre: "Роман-эпопея",
                description: "Монументальный роман-эпопея, описывающий русское общество в эпоху войн против Наполеона.",
                available: true,
                icon: "📖",
                pages: 1225,
                rating: 4.8,
                reviewsCount: 156
            }
        ];
    }

    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const bookIndex = dayOfYear % books.length;
    const book = books[bookIndex];

    // Если книга не доступна, возвращаем первую доступную книгу
    if (!book || !book.id) {
        console.warn('Книга дня не доступна, возвращаем первую книгу');
        return books.find(b => b && b.id) || null;
    }

    return book;
}

// Функция для получения книг недели (постоянных на неделю)
function getBooksOfWeek() {
    let books = [];
    if (window.APP_DATA && window.APP_DATA.MOCK_BOOKS && window.APP_DATA.MOCK_BOOKS.length > 0) {
        books = window.APP_DATA.MOCK_BOOKS;
    } else {
        // Демо книги для книг недели
        books = [
            {
                id: 1,
                title: "Война и мир",
                author: "Лев Толстой",
                year: 1869,
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
                year: 1866,
                genre: "Психологический роман",
                description: "История бывшего студента Родиона Раскольникова, совершившего убийство.",
                available: true,
                icon: "🔪",
                pages: 672,
                rating: 4.7,
                reviewsCount: 89
            }
        ];
    }

    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const weekOfYear = Math.floor(dayOfYear / 7);
    const startIndex = weekOfYear % books.length;
    const weeklyBooks = [];

    console.log('getBooksOfWeek: books length:', books.length, 'startIndex:', startIndex);

    for (let i = 0; i < 4; i++) {
        const bookIndex = (startIndex + i) % books.length;
        const book = books[bookIndex];
        console.log('Book at index', bookIndex, ':', book ? book.title : 'undefined');
        if (book && book.id) {
            weeklyBooks.push(book);
        }
    }

    // Если не набралось 4 книги, добавляем дополнительные
    if (weeklyBooks.length < 4) {
        for (let i = 0; weeklyBooks.length < 4 && i < books.length; i++) {
            const book = books[i];
            if (book && book.id && !weeklyBooks.some(b => b.id === book.id)) {
                weeklyBooks.push(book);
            }
        }
    }

    return weeklyBooks;
}

// Функции для расчета статистики
function calculateStats() {
    const totalBooks = 50; // Фиксированное количество книг - 50
    const availableBooks = window.APP_DATA ? Math.min(totalBooks, window.APP_DATA.MOCK_BOOKS.filter(book => book.available).length) : totalBooks;
    const borrowedBooks = Math.max(0, totalBooks - availableBooks);
    const totalGenres = window.APP_DATA ? window.APP_DATA.MOCK_GENRES.length - 1 : 16;

    console.log('calculateStats:', {totalBooks, availableBooks, borrowedBooks, totalGenres});

    return {
        totalBooks,
        availableBooks,
        borrowedBooks,
        totalGenres
    };
}

// Функция для обновления статистики
function updateStats(stats) {
    console.log('updateStats called with:', stats);

    // Обновляем header stats
    const totalBooksEl = document.getElementById('totalBooks');
    console.log('totalBooksEl:', totalBooksEl);
    if (totalBooksEl) {
        totalBooksEl.textContent = stats.totalBooks;
        totalBooksEl.style.animation = 'countUp 1s ease-out';
        console.log('Updated totalBooks to:', stats.totalBooks);
    }

    const availableBooksEl = document.getElementById('availableBooks');
    console.log('availableBooksEl:', availableBooksEl);
    if (availableBooksEl) {
        availableBooksEl.textContent = stats.availableBooks;
        availableBooksEl.style.animation = 'countUp 1s ease-out';
        console.log('Updated availableBooks to:', stats.availableBooks);
    }

    const borrowedBooksEl = document.getElementById('borrowedBooks');
    if (borrowedBooksEl) borrowedBooksEl.textContent = stats.borrowedBooks;

    const totalGenresEl = document.getElementById('totalGenres');
    console.log('totalGenresEl:', totalGenresEl);
    if (totalGenresEl) {
        totalGenresEl.textContent = stats.totalGenres;
        totalGenresEl.style.animation = 'countUp 1s ease-out';
        console.log('Updated totalGenres to:', stats.totalGenres);
    }

    // Обновляем hero stats
    const heroTotalBooksEl = document.getElementById('heroTotalBooks');
    console.log('heroTotalBooksEl:', heroTotalBooksEl);
    if (heroTotalBooksEl) {
        heroTotalBooksEl.textContent = stats.totalBooks;
        console.log('Updated heroTotalBooks to:', stats.totalBooks);
    }

    const heroGenresEl = document.getElementById('heroGenres');
    console.log('heroGenresEl:', heroGenresEl);
    if (heroGenresEl) {
        heroGenresEl.textContent = stats.totalGenres;
        console.log('Updated heroGenres to:', stats.totalGenres);
    }

    const heroAvailableEl = document.getElementById('heroAvailable');
    console.log('heroAvailableEl:', heroAvailableEl);
    if (heroAvailableEl) {
        heroAvailableEl.textContent = stats.availableBooks;
        console.log('Updated heroAvailable to:', stats.availableBooks);
    }

    // Обновляем card stats
    const totalBooksCardEl = document.getElementById('totalBooksCard');
    if (totalBooksCardEl) totalBooksCardEl.textContent = stats.totalBooks;

    const availableBooksCardEl = document.getElementById('availableBooksCard');
    if (availableBooksCardEl) availableBooksCardEl.textContent = stats.availableBooks;

    const borrowedBooksCardEl = document.getElementById('borrowedBooks');
    if (borrowedBooksCardEl) borrowedBooksCardEl.textContent = stats.borrowedBooks;

    const totalGenresCardEl = document.getElementById('totalGenresCard');
    if (totalGenresCardEl) totalGenresCardEl.textContent = stats.totalGenres;

    console.log('Stats updated successfully');
}

// Функция для обработки опыта и достижений
function handleExperienceAndAchievements(userData, expGained) {
    if (!userData || !expGained) return;

    // Начисляем опыт
    const result = window.APP_DATA.LevelSystem.addExperience(userData, expGained);

    // Сохраняем данные
    window.STORAGE.saveAllData(userData);

    // Обновляем профиль немедленно
    updateUserProfile();

    // Показываем уведомление о новом уровне
    if (result.leveledUp) {
        tg.showPopup({
            title: '🎉 Новый уровень!',
            message: `Поздравляем! Вы достигли уровня ${result.newLevel}!`,
            buttons: [{ type: 'ok' }]
        });
    }
}

// Функция для получения класса роли
function getRoleClass(role) {
    switch(role) {
        case 'Активный пользователь': return 'role-active';
        case 'Модератор': return 'role-moderator';
        case 'Администратор': return 'role-admin';
        case 'VIP': return 'role-vip';
        case 'Премиум': return 'role-premium';
        case 'Владелец': return 'role-owner';
        default: return 'role-active';
    }
}

// Функция для обновления профиля пользователя
function updateUserProfile() {
    if (!userData) return;

    // Обновляем имя пользователя
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userData.name || 'Пользователь';
    }

    // Обновляем аватар
    const userAvatarElement = document.getElementById('userAvatar');
    if (userAvatarElement) {
        const avatarPlaceholder = userAvatarElement.querySelector('.avatar-placeholder');
        if (avatarPlaceholder) {
            avatarPlaceholder.textContent = userData.avatar || '👤';
        }
    }

    // Обновляем дату регистрации
    const userRegistrationElement = document.getElementById('userRegistration');
    if (userRegistrationElement) {
        userRegistrationElement.textContent = `Зарегистрирован: ${userData.registrationDate || 'Неизвестно'}`;
    }

    // Обновляем роль
    const userRoleElement = document.getElementById('userRole');
    const specialRoleBadge = document.getElementById('specialRoleBadge');

    const role = userData.role || 'Активный пользователь';
    console.log('Updating user role, role:', role);

    if (userRoleElement) {
        userRoleElement.textContent = `Роль: ${role}`;
        userRoleElement.className = 'user-role ' + getRoleClass(role);
    }

    console.log('Updating special role badge, role:', role, 'element:', specialRoleBadge);
    if (specialRoleBadge) {
        if (role !== 'Активный пользователь') {
            specialRoleBadge.textContent = role;
            specialRoleBadge.className = 'special-role-badge ' + getRoleClass(role).replace('role-', '');
            specialRoleBadge.classList.remove('hidden');
            console.log('Showing special role badge:', role, 'class:', specialRoleBadge.className);
        } else {
            specialRoleBadge.classList.add('hidden');
            console.log('Hiding special role badge');
        }
    } else {
        console.error('specialRoleBadge element not found');
    }

    // Обновляем уровень и опыт
    const userLevelElement = document.getElementById('userLevel');
    if (userLevelElement) {
        userLevelElement.textContent = userData.level || 1;
        userLevelElement.className = 'level-number level-' + Math.min(userData.level, 20);
    }

    // Обновляем класс секции уровня для градиента фона
    const levelSection = document.getElementById('levelSection');
    if (levelSection) {
        levelSection.className = 'level-section level-' + Math.min(userData.level, 20);
    }

    const expFillElement = document.getElementById('expFillSection');
    if (expFillElement && userData.experience !== undefined && userData.experienceToNext !== undefined) {
        const percentage = ((userData.experience % userData.experienceToNext) / userData.experienceToNext) * 100; // Процент до следующего уровня
        expFillElement.style.width = `${percentage}%`;
    }

    const expTextElement = document.getElementById('expTextSection');
    if (expTextElement && userData.experience !== undefined && userData.experienceToNext !== undefined) {
        expTextElement.textContent = `${userData.experience % userData.experienceToNext}/${userData.experienceToNext} XP`;
    }

    // Обновляем статистику
    updateProfileStats();
}

// Функция для обновления статистики профиля
function updateProfileStats() {
    if (!userData || !userData.stats) return;

    // Обновляем активные книги
    const activeBorrowsElement = document.getElementById('activeBorrows');
    if (activeBorrowsElement) {
        activeBorrowsElement.textContent = userData.stats.activeBorrows || 0;
    }

    // Обновляем прочитанные книги
    const totalReadElement = document.getElementById('totalRead');
    if (totalReadElement) {
        totalReadElement.textContent = userData.stats.totalRead || 0;
    }

    // Обновляем дни с нами
    const readingTimeElement = document.getElementById('readingTime');
    if (readingTimeElement) {
        readingTimeElement.textContent = userData.stats.readingDays || 0;
    }

    // Обновляем отзывы
    const userReviewsWrittenElement = document.getElementById('userReviewsWritten');
    if (userReviewsWrittenElement) {
        userReviewsWrittenElement.textContent = userData.stats.reviewsWritten || 0;
    }

    // Обновляем избранные книги
    const userFavoritesElement = document.getElementById('userFavorites');
    if (userFavoritesElement) {
        userFavoritesElement.textContent = userData.favorites ? userData.favorites.length : 0;
    }

    // Обновляем прочитанные страницы
    const totalPagesReadElement = document.getElementById('totalPagesRead');
    if (totalPagesReadElement) {
        totalPagesReadElement.textContent = userData.totalPagesRead || 0;
    }

    // Обновляем общее количество книг
    const userTotalBooksElement = document.getElementById('userTotalBooks');
    if (userTotalBooksElement) {
        userTotalBooksElement.textContent = userData.stats.totalBooks || 0;
    }
}

// Функции для работы с API отзывов
async function fetchReviews(bookId = null) {
    try {
        const url = bookId ? `/api/reviews/book/${bookId}` : '/api/reviews';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(url, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        if (!text) {
            return [];
        }

        const data = JSON.parse(text);
        return data.reviews || [];
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Fetch aborted due to timeout');
        } else {
            console.error('Ошибка загрузки отзывов:', error);
        }
        return [];
    }
}

async function submitReviewToServer(reviewData) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const text = await response.text();
        let data;
        try {
            data = text ? JSON.parse(text) : {};
        } catch (parseError) {
            throw new Error('Неверный ответ сервера');
        }

        if (!response.ok) {
            throw new Error(data.error || 'Ошибка отправки отзыва');
        }
        return data;
    } catch (error) {
        console.error('Ошибка отправки отзыва:', error);
        throw error;
    }
}

async function deleteReviewFromServer(reviewId, userId) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`/api/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const text = await response.text();
        let data;
        try {
            data = text ? JSON.parse(text) : {};
        } catch (parseError) {
            throw new Error('Неверный ответ сервера');
        }

        if (!response.ok) {
            throw new Error(data.error || 'Ошибка удаления отзыва');
        }
        return data;
    } catch (error) {
        console.error('Ошибка удаления отзыва:', error);
        throw error;
    }
}

async function likeReviewOnServer(reviewId) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`/api/reviews/${reviewId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const text = await response.text();
        let data;
        try {
            data = text ? JSON.parse(text) : { likes: 0 };
        } catch (parseError) {
            throw new Error('Неверный ответ сервера');
        }

        if (!response.ok) {
            throw new Error(data.error || 'Ошибка лайка');
        }
        return data.likes || 0;
    } catch (error) {
        console.error('Ошибка лайка:', error);
        return 0;
    }
}

// Инициализация приложения (перенесено в index.html для правильной загрузки данных)

async function initializeApp() {
    console.log('Инициализация приложения...');
    await initializeTelegramApp();
    initializeReviewsSync();

    // Показываем демо книги сразу
    renderWeeklyBooks();
    renderBookOfDay();

    await loadInitialData();
    setupEventListeners();
    initializeTheme();

    // Дополнительное обновление статистики после полной загрузки
    setTimeout(() => {
        console.log('Delayed stats update');
        const stats = calculateStats();
        updateStats(stats);
        window.APP_DATA.MOCK_STATS = stats; // Обновляем MOCK_STATS
    }, 500);
}

// Инициализация Telegram Web App
async function initializeTelegramApp() {
    // Отзывы загружаются по требованию
    window.APP_DATA.BOOK_REVIEWS = [];
    if (window.STORAGE && window.STORAGE.loadAllData) {
        userData = window.STORAGE.loadAllData();
    } else {
        userData = window.APP_DATA ? window.APP_DATA.DEFAULT_USER_DATA : {
            name: 'Пользователь',
            avatar: '👤',
            registrationDate: new Date().toLocaleDateString('ru-RU'),
            telegramId: null,
            theme: 'light',
            profileBackground: 'default',
            level: 1,
            experience: 0,
            experienceToNext: 100,
            totalPagesRead: 0,
            readingStreak: 0,
            achievements: [],
            bookProgress: {},
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
    }

    // Сбрасываем достижения и челленджи для нового старта
    userData.achievements = [];
    userData.challenges = {
        daily: { lastReset: null, completed: [], claimed: [] },
        weekly: { lastReset: null, completed: [], claimed: [] },
        monthly: { lastReset: null, completed: [], claimed: [] }
    };
    userData.achievementRewardsClaimed = [];
    // Сбрасываем отзывы и избранное
    userData.myReviews = [];
    userData.favorites = [];
    userData.borrowedBooks = [];
    userData.history = [];
    // Сбрасываем уровень и опыт
    userData.level = 1;
    userData.experience = 0;
    userData.experienceToNext = 100;
    userData.coins = 0;
    userData.role = 'Активный пользователь';
    // Сбрасываем дни использования
    userData.stats.readingDays = 0;
    userData.lastVisitDate = null;

    // Проверяем дни использования
    const today = new Date().toDateString();
    if (!userData.lastVisitDate || userData.lastVisitDate !== today) {
        userData.stats.readingDays = (userData.stats.readingDays || 0) + 1;
        userData.lastVisitDate = today;
    }

    // Сохраняем данные
    if (window.STORAGE) {
        window.STORAGE.saveAllData(userData);
    }

    if (window.Telegram && window.Telegram.WebApp) {
        tg = window.Telegram.WebApp;
        tg.expand();
        tg.enableClosingConfirmation();
        tg.BackButton.onClick(handleBackButton);
        
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            const tgUser = tg.initDataUnsafe.user;
            userData.name = `${tgUser.first_name} ${tgUser.last_name || ''}`.trim();
            userData.telegramId = tgUser.id;
            
            if (tgUser.photo_url) {
                document.getElementById('userAvatar').innerHTML = 
                    `<img src="${tgUser.photo_url}" alt="${userData.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            } else {
                document.getElementById('userAvatar').querySelector('.avatar-placeholder').textContent = 
                    tgUser.first_name ? tgUser.first_name[0] : '👤';
            }
        }
        
        tg.onEvent('viewportChanged', () => window.STORAGE.saveAllData(userData));
        tg.onEvent('closing', () => window.STORAGE.saveAllData(userData));
        
    } else {
        tg = {
            showPopup: (params) => alert(params.title + ": " + params.message),
            showAlert: (message) => alert(message),
            BackButton: {
                show: () => console.log('BackButton show'),
                hide: () => console.log('BackButton hide'),
                onClick: (cb) => console.log('BackButton onClick')
            },
            onEvent: (event, callback) => console.log('Event listener:', event)
        };
    }
}

function handleBackButton() {
    if (document.getElementById('bookModal').classList.contains('hidden') && 
        document.getElementById('reviewModal').classList.contains('hidden')) {
        tg.close();
    } else {
        closeModal();
        closeReviewModal();
    }
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (e.target.value.length >= 2 || e.target.value.length === 0) {
                searchBooks();
            }
        }, 500);
    });
    
    document.getElementById('bookModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    document.getElementById('reviewModal').addEventListener('click', function(e) {
        if (e.target === this) closeReviewModal();
    });
}

// Навигация по разделам
function showSection(sectionName) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    document.getElementById('searchSection').classList.toggle('hidden', sectionName !== 'catalog');
    document.getElementById(sectionName + 'Section').classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="showSection('${sectionName}')"]`).classList.add('active');

    if (sectionName === 'profile') {
        updateUserProfile();
        updateInventoryList();
    }
    if (sectionName === 'redbook') {
        loadRedBookAnimals();
    }
    if (sectionName === 'events') {
        loadEvents();
    }
    if (sectionName === 'settings') {
        loadSettings();
        loadTitles();
    }
    if (sectionName === 'games') {
        loadGamesSection();
    }
    if (sectionName === 'challenges') {
        loadChallenges();
    }
    if (sectionName === 'authors') {
        loadAuthors();
    }
    if (sectionName === 'education') {
        loadEducationSection();
    }
    if (sectionName === 'reviews') {
        loadReviewsSection();
    }
    if (sectionName === 'achievements') {
        loadAchievementsSection();
    }
    if (sectionName === 'catalog') {
        // renderWeeklyBooks() and renderBookOfDay() are called in loadInitialData
    }
}

// Загрузка начальных данных
async function loadInitialData() {
    try {
        console.log('Начинаем загрузку данных...');
        console.log('APP_DATA exists:', typeof window.APP_DATA !== 'undefined');
        console.log('MOCK_BOOKS length:', window.APP_DATA ? window.APP_DATA.MOCK_BOOKS.length : 'undefined');

        // Проверяем наличие данных
        if (!window.APP_DATA) {
            console.warn('APP_DATA не найден, используем демо данные');
            loadDemoData();
            return;
        }
        if (!window.APP_DATA.MOCK_BOOKS) {
            throw new Error('MOCK_BOOKS не найден');
        }

        console.log('Найдено книг:', window.APP_DATA.MOCK_BOOKS.length);

        // Загрузить сохраненные книги
        const savedBooks = localStorage.getItem('books');
        if (savedBooks) {
            window.APP_DATA.MOCK_BOOKS = JSON.parse(savedBooks);
        }

        // Ограничить количество книг до 50
        if (window.APP_DATA.MOCK_BOOKS.length > 50) {
            window.APP_DATA.MOCK_BOOKS = window.APP_DATA.MOCK_BOOKS.slice(0, 50);
        }

        // Установить правильную статистику
        const availableCount = window.APP_DATA.MOCK_BOOKS.filter(book => book.available).length;
        window.APP_DATA.MOCK_STATS = {
            totalBooks: 50,
            availableBooks: Math.min(50, availableCount),
            borrowedBooks: Math.max(0, 50 - Math.min(50, availableCount)),
            totalGenres: window.APP_DATA.MOCK_GENRES.length - 1
        };

        // Немедленная загрузка данных без задержки
        try {
            updateBooksDisplay(window.APP_DATA.MOCK_BOOKS);
        } catch (error) {
            console.error('Ошибка при отображении каталога:', error);
        }
        populateGenreFilter(window.APP_DATA.MOCK_GENRES);
        updateUserProfile();

        // Отображаем книги недели и дня
        console.log('Calling renderWeeklyBooks from loadInitialData');
        renderWeeklyBooks();
        console.log('Calling renderBookOfDay from loadInitialData');
        renderBookOfDay();

        // Переключаемся на каталог по умолчанию
        showSection('catalog');

        // Обновляем статистику после отображения секции
        updateStats(window.APP_DATA.MOCK_STATS);

        console.log('Данные загружены успешно');
        console.log('Книг отображено:', currentBooks.length);

    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        console.error('Stack:', error.stack);
        // Продолжаем без показа ошибки пользователю
        updateBooksDisplay(window.APP_DATA ? window.APP_DATA.MOCK_BOOKS : []);
        populateGenreFilter(window.APP_DATA ? window.APP_DATA.MOCK_GENRES : []);
        updateStats(window.APP_DATA ? window.APP_DATA.MOCK_STATS : {});
        updateUserProfile();
        renderWeeklyBooks();
        renderBookOfDay();
        showSection('catalog');
    }
}

// Загрузка демо данных
function loadDemoData() {
    console.log('Загрузка демо данных');

    const demoBooks = [
        {
            id: 1,
            title: "Война и мир",
            author: "Лев Толстой",
            year: 1869,
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
            year: 1866,
            genre: "Психологический роман",
            description: "История бывшего студента Родиона Раскольникова, совершившего убийство.",
            available: true,
            icon: "🔪",
            pages: 672,
            rating: 4.7,
            reviewsCount: 89
        }
    ];

    // Устанавливаем демо данные в APP_DATA
    if (!window.APP_DATA) {
        window.APP_DATA = {};
    }
    window.APP_DATA.MOCK_BOOKS = demoBooks;
    window.APP_DATA.MOCK_GENRES = ['Все жанры', 'Роман-эпопея', 'Психологический роман'];
    window.APP_DATA.MOCK_STATS = {totalBooks: demoBooks.length, availableBooks: demoBooks.filter(b => b.available).length, borrowedBooks: 0, totalGenres: 2};

    updateBooksDisplay(demoBooks);
    populateGenreFilter(window.APP_DATA.MOCK_GENRES);
    const stats = calculateStats();
    updateStats(stats);
    window.APP_DATA.MOCK_STATS = stats;
    updateUserProfile();

    // Отображаем книги недели и дня
    renderWeeklyBooks();
    renderBookOfDay();
    showSection('catalog');
}

// Отображение книг недели
function renderWeeklyBooks() {
    try {
        console.log('Rendering weekly books');
        const container = document.getElementById('weeklyBooksContainer');
        if (!container) {
            console.error('weeklyBooksContainer not found');
            return;
        }

        const weeklyBooks = getBooksOfWeek(); // Фильтруем undefined книги
        console.log('Weekly books:', weeklyBooks.length, weeklyBooks);

        if (weeklyBooks.length === 0) {
            container.innerHTML = '<p>Книги временно недоступны</p>';
            return;
        }

        container.innerHTML = weeklyBooks.map(book => `
            <div class="book-card ${getGenreClass(book.genre) || ''}" onclick="showBookDetails(${book.id})">
                <div class="book-header">
                    <div class="book-cover">
                        <div class="book-icon-large">${getGenreIcon(book.genre) || '📚'}</div>
                    </div>
                    <div class="book-info">
                        <div class="book-title">${escapeHtml(book.title)}</div>
                        <div class="book-author">${escapeHtml(book.author)}</div>
                        <div class="book-genre-tag">${book.genre}</div>
                        <div class="book-rating-small">
                            <span class="stars">${createRatingStars(book.rating) || '⭐⭐⭐⭐⭐'}</span>
                            <span class="rating-value">${book.rating || 5}</span>
                        </div>
                        <div class="book-status status-available">⭐ Рекомендуем</div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Ошибка при отображении книг недели:', error);
        const container = document.getElementById('weeklyBooksContainer');
        if (container) {
            container.innerHTML = '<p>Ошибка загрузки книг недели</p>';
        }
    }
}

// Отображение книги дня
function renderBookOfDay() {
    try {
        console.log('Rendering book of day');
        const container = document.getElementById('bookOfDayContainer');
        if (!container) {
            console.error('bookOfDayContainer not found');
            return;
        }

        const bookOfDay = getBookOfDay();
        if (!bookOfDay) {
            container.innerHTML = '<p>Книга дня временно недоступна</p>';
            return;
        }

        console.log('Book of day:', bookOfDay.title);

        container.innerHTML = `
            <div class="book-card book-of-day-card ${getGenreClass(bookOfDay.genre)}" onclick="showBookDetails(${bookOfDay.id})">
                <div class="book-header">
                    <div class="book-cover">
                        <div class="book-icon-large">${getGenreIcon(bookOfDay.genre)}</div>
                    </div>
                    <div class="book-info">
                        <div class="book-of-day-header">
                            <div class="book-of-day-badge">⭐ Книга дня</div>
                        </div>
                        <div class="book-title">${escapeHtml(bookOfDay.title)}</div>
                        <div class="book-author">${escapeHtml(bookOfDay.author)}</div>
                        <div class="book-genre-tag">${bookOfDay.genre}</div>
                        <div class="book-rating-small">
                            <span class="stars">${createRatingStars(bookOfDay.rating)}</span>
                            <span class="rating-value">${bookOfDay.rating}</span>
                        </div>
                        <button class="borrow-btn book-of-day-btn" onclick="event.stopPropagation(); borrowBook(${bookOfDay.id})">
                            📖 Забронировать
                        </button>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Ошибка при отображении книги дня:', error);
        const container = document.getElementById('bookOfDayContainer');
        if (container) {
            container.innerHTML = '<p>Ошибка загрузки книги дня</p>';
        }
    }
}

// Поиск книг
async function searchBooks() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    currentSearchQuery = query;
    
    try {
        showLoading(true);

        let filteredBooks = window.APP_DATA.MOCK_BOOKS;

        if (query) {
            filteredBooks = window.APP_DATA.MOCK_BOOKS.filter(book =>
                book.title.toLowerCase().includes(query.toLowerCase()) ||
                book.author.toLowerCase().includes(query.toLowerCase()) ||
                book.genre.toLowerCase().includes(query.toLowerCase()) ||
                (book.description && book.description.toLowerCase().includes(query.toLowerCase()))
            );
            updateBooksDisplay(filteredBooks);
        } else {
            updateBooksDisplay(window.APP_DATA.MOCK_BOOKS);
        }
        updateSectionTitle(query ? `Результаты поиска: "${query}"` : 'Каталог книг');
        showLoading(false);

    } catch (error) {
        console.error('Ошибка поиска:', error);
        showError('Ошибка при выполнении поиска');
        showLoading(false);
    }
}

// Фильтрация по жанру
async function filterByGenre() {
    const genreFilter = document.getElementById('genreFilter');
    const genre = genreFilter.value;
    currentGenre = genre;
    
    try {
        showLoading(true);

        let filteredBooks = window.APP_DATA.MOCK_BOOKS;
        if (genre && genre !== 'Все жанры') {
            filteredBooks = window.APP_DATA.MOCK_BOOKS.filter(book => book.genre === genre);
            updateBooksDisplay(filteredBooks);
        } else {
            updateBooksDisplay(window.APP_DATA.MOCK_BOOKS);
        }

        updateSectionTitle(genre && genre !== 'Все жанры' ? `Жанр: ${genre}` : 'Каталог книг');
        showLoading(false);

    } catch (error) {
        console.error('Ошибка фильтрации:', error);
        showError('Ошибка при фильтрации');
        showLoading(false);
    }
}

// Отображение книг
function updateBooksDisplay(books) {
    console.log('updateBooksDisplay called with:', books ? books.length : 'null');
    currentBooks = books || [];
    const container = document.getElementById('booksContainer');
    const emptyState = document.getElementById('emptyState');

    if (!books || !Array.isArray(books) || books.length === 0) {
        console.log('Книги не найдены или пустой массив:', books);
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        updateBooksCount(0);
        return;
    }

    console.log('Отображаем книг:', books.length);
    emptyState.classList.add('hidden');

    try {
        container.innerHTML = books.map(book => {
            const isFavorite = userData.favorites.includes(book.id);
            const isBorrowed = userData.borrowedBooks.some(b => b.bookId === book.id && b.status === 'active');

            return `
            <div class="book-card ${getGenreClass(book.genre)}" onclick="showBookDetails(${book.id})">
                <div class="book-header">
                    <div class="book-cover">
                        <div class="book-icon-large">${getGenreIcon(book.genre)}</div>
                    </div>
                    <div class="book-info">
                        <div class="book-title">${escapeHtml(book.title)}</div>
                        <div class="book-author">${escapeHtml(book.author)}</div>
                        <div class="book-meta">
                            <span class="meta-item">📅 ${book.year}</span>
                            <span class="meta-item">📄 ${book.pages} стр.</span>
                        </div>
                        <div class="book-genre-tag">${book.genre}</div>
                        <div class="book-rating-small">
                            <span class="stars">${createRatingStars(book.rating)}</span>
                            <span class="rating-value">${book.rating}</span>
                            <span class="reviews-count">(${book.reviewsCount})</span>
                        </div>
                        <div class="book-status ${book.available ? 'status-available' : 'status-unavailable'}">
                            ${book.available ? '✅ Доступна' : '❌ Выдана'}
                        </div>
                    </div>
                </div>
                <div class="book-actions">
                    <button
                        class="borrow-btn"
                        onclick="event.stopPropagation(); borrowBook(${book.id})"
                        ${!book.available || isBorrowed ? 'disabled' : ''}
                    >
                        ${isBorrowed ? '📖 Уже у вас' : (book.available ? '📚 Забронировать' : 'Недоступна')}
                    </button>
                    <button
                        class="favorite-btn ${isFavorite ? 'favorite-active' : ''}"
                        onclick="event.stopPropagation(); toggleFavorite(${book.id})"
                    >
                        ${isFavorite ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>
            `;
        }).join('');
        
        updateBooksCount(books.length);
    } catch (error) {
        console.error('Ошибка при отображении книг:', error);
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        updateBooksCount(0);
    }
}

// Показать детали книги
async function showBookDetails(bookId) {
    try {
        showLoading(true);

        const book = window.APP_DATA.MOCK_BOOKS.find(b => b.id === bookId);
        if (!book) throw new Error('Книга не найдена');

        const isFavorite = userData.favorites.includes(book.id);
        const isBorrowed = userData.borrowedBooks.some(b => b.bookId === book.id && b.status === 'active');
        const bookReviews = await fetchReviews(bookId);
        const userId = userData.telegramId || 'anonymous';
        const userHasReviewed = bookReviews.some(review => review.userId === userId);
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="book-details">
                <div class="book-cover-large ${getGenreClass(book.genre)}">
                    <div class="book-icon-large">${getGenreIcon(book.genre)}</div>
                </div>
                <div class="book-info-detailed">
                    <h4>${escapeHtml(book.title)}</h4>
                    <p><strong>Автор:</strong> ${escapeHtml(book.author)}</p>
                    <p><strong>Год издания:</strong> ${book.year}</p>
                    <p><strong>Жанр:</strong> ${book.genre}</p>
                    <p><strong>ISBN:</strong> ${book.isbn || 'Не указан'}</p>
                    <p><strong>Страниц:</strong> ${book.pages}</p>
                    
                    <div class="book-rating-detailed">
                        <strong>Рейтинг:</strong>
                        <div class="rating-display">
                            <span class="stars">${createRatingStars(book.rating)}</span>
                            <span class="rating-value">${book.rating}/5</span>
                            <span class="reviews-count">на основе ${book.reviewsCount} отзывов</span>
                        </div>
                    </div>
                    
                    <p><strong>Статус:</strong> 
                        <span class="book-status ${book.available ? 'status-available' : 'status-unavailable'}">
                            ${isBorrowed ? '📖 У вас' : (book.available ? '✅ Доступна' : '❌ Выдана')}
                        </span>
                    </p>
                    <div class="book-description">
                        <strong>Описание:</strong>
                        <p>${escapeHtml(book.description || 'Описание отсутствует.')}</p>
                    </div>
                    
                    <!-- Отзывы -->
                    <div class="reviews-section">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <h5>💬 Отзывы читателей (${bookReviews.length})</h5>
                            <div style="font-size: 0.8em; color: var(--text-light);">
                                Всего в приложении: ${window.APP_DATA.BOOK_REVIEWS.length} отзывов
                            </div>
                        </div>
                        <div class="reviews-list">
                            ${bookReviews.length > 0 ? bookReviews.map(review => {
                                const isOwnReview = review.userId === userId;
                                return `
                                <div class="review-item">
                                    <div class="review-header">
                                        <div class="review-user">${review.userAvatar} ${review.userName}</div>
                                        <div class="review-rating">${createRatingStars(review.rating)}</div>
                                    </div>
                                    <div class="review-comment">${escapeHtml(review.comment)}</div>
                                    <div class="review-footer">
                                        <span class="review-date">${formatReviewDate(review.date)}</span>
                                        <button class="like-review-btn" onclick="event.stopPropagation(); likeReview(${review.id})">
                                            ❤️ ${review.likes}
                                        </button>
                                        ${isOwnReview ? `
                                            <button class="delete-review-btn" onclick="event.stopPropagation(); deleteReview(${review.id}, ${book.id})">
                                                🗑️ Удалить
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                            `}).join('') : `
                                <div class="no-reviews">
                                    <p>Пока нет отзывов. Будьте первым!</p>
                                </div>
                            `}
                        </div>
                        ${!userHasReviewed ? `
                            <div style="text-align: center; margin-top: 15px;">
                                <button class="add-review-btn" onclick="openReviewModal(${book.id})">
                                    ✍️ Написать отзыв
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="read-section" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border-color);">
                        <button onclick="startReading(${book.id})" class="read-online-btn">
                            📖 Читать онлайн
                        </button>
                        ${book.readLink ? `
                        <a href="${book.readLink}" target="_blank" class="read-link-btn">
                            🔗 Читать на внешнем ресурсе
                        </a>
                        ` : ''}
                        <p style="font-size: 0.8em; color: var(--text-light); margin-top: 5px;">
                            Чтение онлайн доступно в приложении
                        </p>
                    </div>
                </div>
            </div>
            <div class="modal-actions">
                <button 
                    class="borrow-btn" 
                    onclick="borrowBook(${book.id})"
                    ${!book.available || isBorrowed ? 'disabled' : ''}
                    style="flex: 1; margin-right: 10px;"
                >
                    ${isBorrowed ? '📖 Уже у вас' : (book.available ? '📚 Забронировать' : 'Недоступна')}
                </button>
                <button 
                    class="favorite-btn ${isFavorite ? 'favorite-active' : ''}" 
                    onclick="toggleFavorite(${book.id})"
                    style="padding: 12px;"
                >
                    ${isFavorite ? '★' : '☆'}
                </button>
            </div>
        `;
        
        document.getElementById('modalTitle').textContent = book.title;
        document.getElementById('bookModal').classList.remove('hidden');
        tg.BackButton.show();
        
    } catch (error) {
        console.error('Ошибка загрузки деталей книги:', error);
        showError('Не удалось загрузить информацию о книге');
    } finally {
        showLoading(false);
    }
}

// Система отзывов и рейтингов
async function openReviewModal(bookId) {
    currentReviewBookId = bookId;
    selectedRating = 0;

    try {
        // Проверяем, не писал ли уже пользователь отзыв
        const userId = userData.telegramId || 'anonymous';
        const bookReviews = await fetchReviews(bookId);
        const existingReview = bookReviews.find(review =>
            review.bookId === bookId && review.userId === userId
        );

        if (existingReview) {
            tg.showAlert('Вы уже писали отзыв на эту книгу!');
            return;
        }
    } catch (error) {
        console.error('Ошибка при проверке отзывов:', error);
        // Продолжаем открытие модала, если не удалось проверить отзывы
    }

    document.getElementById('reviewComment').value = '';
    document.getElementById('charCount').textContent = '0';
    document.getElementById('ratingText').textContent = 'Выберите оценку';
    document.querySelector('.submit-btn').disabled = true;

    document.querySelectorAll('.star').forEach(star => {
        star.textContent = '☆';
        star.classList.remove('active');
    });

    document.getElementById('reviewModal').classList.remove('hidden');
    tg.BackButton.show();
}

function closeReviewModal() {
    document.getElementById('reviewModal').classList.add('hidden');
    tg.BackButton.hide();
}

function setRating(rating) {
    selectedRating = rating;
    const stars = document.querySelectorAll('.star');
    const ratingText = document.getElementById('ratingText');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.textContent = '⭐';
            star.classList.add('active');
        } else {
            star.textContent = '☆';
            star.classList.remove('active');
        }
    });
    
    const ratingTexts = ['Ужасно', 'Плохо', 'Нормально', 'Хорошо', 'Отлично'];
    ratingText.textContent = ratingTexts[rating - 1] || 'Выберите оценку';
    
    updateSubmitButton();
}

function updateCharCount() {
    const textarea = document.getElementById('reviewComment');
    const charCount = document.getElementById('charCount');
    charCount.textContent = textarea.value.length;
    updateSubmitButton();
}

function updateSubmitButton() {
    const submitBtn = document.querySelector('.submit-btn');
    const hasRating = selectedRating > 0;
    const hasComment = document.getElementById('reviewComment').value.trim().length > 0;
    submitBtn.disabled = !(hasRating && hasComment);
}

async function submitReview() {
    if (!currentReviewBookId || !selectedRating) return;

    const comment = document.getElementById('reviewComment').value.trim();
    const book = window.APP_DATA.MOCK_BOOKS.find(b => b.id === currentReviewBookId);

    if (!book) return;

    const userId = userData.telegramId || 'anonymous_' + Date.now();
    const userName = userData.name || 'Анонимный пользователь';

    const reviewData = {
        userId: userId,
        userName: userName,
        bookId: currentReviewBookId,
        rating: selectedRating,
        comment: comment,
        userAvatar: userData.avatar || '👤'
    };

    try {
        // Отправляем отзыв на сервер
        const result = await submitReviewToServer(reviewData);

        // Добавляем в личные отзывы пользователя
        userData.myReviews.unshift({
            ...result.review,
            bookTitle: book.title
        });
        userData.stats.reviewsWritten = userData.myReviews.length;

        // Начисляем опыт за написание отзыва
        handleExperienceAndAchievements(userData, 15); // 15 опыта за отзыв

        // Обновляем прогресс заданий
        updateQuestProgress('write_review');

        window.STORAGE.saveAllData(userData);
        updateUserProfile();

        tg.showPopup({
            title: 'Отзыв добавлен! ★',
            message: 'Ваш отзыв успешно опубликован и виден всем пользователям Telegram Mini App',
            buttons: [{ type: 'ok' }]
        });

        closeReviewModal();
        updateMyReviewsList();

        // Обновляем отображение книги, если модал открыт
        if (!document.getElementById('bookModal').classList.contains('hidden')) {
            showBookDetails(currentReviewBookId);
        }

    } catch (error) {
        tg.showAlert('Ошибка при отправке отзыва: ' + error.message);
    }
}

async function likeReview(reviewId) {
    try {
        const newLikes = await likeReviewOnServer(reviewId);
        if (newLikes > 0) {
            const modalTitle = document.getElementById('modalTitle').textContent;
            const book = window.APP_DATA.MOCK_BOOKS.find(b => b.title === modalTitle);
            if (book) {
                showBookDetails(book.id);
            }
            tg.showAlert('Спасибо за ваш лайк! ❤️');
        }
    } catch (error) {
        tg.showAlert('Ошибка при постановке лайка');
    }
}

async function deleteReview(reviewId, bookId) {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв? Это действие нельзя отменить.')) {
        return;
    }

    const userId = userData.telegramId || 'anonymous';

    try {
        // Отправляем запрос на удаление на сервер
        await deleteReviewFromServer(reviewId, userId);

        // Удаляем из личных отзывов пользователя
        const reviewIndex = userData.myReviews.findIndex(review => review.id === reviewId);
        if (reviewIndex !== -1) {
            userData.myReviews.splice(reviewIndex, 1);
            userData.stats.reviewsWritten = userData.myReviews.length;
        }

        // Сохраняем данные
        window.STORAGE.saveAllData(userData);

        // Обновляем отображение
        updateMyReviewsList();
        showBookDetails(bookId);

        tg.showPopup({
            title: 'Отзыв удален',
            message: 'Ваш отзыв успешно удален и больше не виден другим пользователям.',
            buttons: [{ type: 'ok' }]
        });
    } catch (error) {
        tg.showAlert('Не удалось удалить отзыв: ' + error.message);
    }
}

// Система тем
function toggleTheme() {
    const currentTheme = userData.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    userData.theme = newTheme;
    window.STORAGE.saveAllData(userData);
    applyTheme(newTheme);
    
    tg.showPopup({
        title: 'Тема изменена',
        message: `Переключено на ${newTheme === 'light' ? 'светлую' : 'тёмную'} тему`,
        buttons: [{ type: 'ok' }]
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeConfig = theme === 'light' ? window.APP_DATA.THEMES.LIGHT : window.APP_DATA.THEMES.DARK;
    
    document.documentElement.style.setProperty('--bg-primary', themeConfig.bg);
    document.documentElement.style.setProperty('--text-primary', themeConfig.text);
    document.documentElement.style.setProperty('--bg-card', themeConfig.card);
    document.documentElement.style.setProperty('--border-primary', themeConfig.border);
    document.documentElement.style.setProperty('--primary-color', themeConfig.primary);
    document.documentElement.style.setProperty('--secondary-color', themeConfig.secondary);
    document.documentElement.style.setProperty('--accent-color', themeConfig.accent);
    
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

function initializeTheme() {
    const savedTheme = window.STORAGE.loadTheme();
    userData.theme = savedTheme;
    applyTheme(savedTheme);
}

// Инициализация синхронизации отзывов между вкладками
function initializeReviewsSync() {
    const syncIndicator = document.getElementById('syncIndicator');

    if (typeof BroadcastChannel !== 'undefined') {
        reviewsChannel = new BroadcastChannel('knigabel_reviews_sync');

        if (syncIndicator) {
            syncIndicator.textContent = 'активна';
            syncIndicator.style.color = '#4CAF50';
        }

        reviewsChannel.onmessage = function(event) {
            if (event.data.type === 'reviews_updated') {
                // Перезагружаем отзывы из localStorage
                window.STORAGE.initializeGlobalReviews();

                // Обновляем отображение, если модал открыт
                if (!document.getElementById('bookModal').classList.contains('hidden')) {
                    const modalTitle = document.getElementById('modalTitle').textContent;
                    const book = window.APP_DATA.MOCK_BOOKS.find(b => b.title === modalTitle);
                    if (book) {
                        showBookDetails(book.id);
                    }
                }

                // Обновляем личные отзывы
                updateMyReviewsList();

                // Показываем уведомление о синхронизации
                showSyncNotification();
            }
        };
    } else {
        if (syncIndicator) {
            syncIndicator.textContent = 'недоступна';
            syncIndicator.style.color = '#f44336';
        }
    }
}

// Функция для показа уведомления о синхронизации
function showSyncNotification() {
    // Можно добавить визуальное уведомление, но пока просто console.log
    console.log('📡 Отзывы синхронизированы между вкладками');
}

// Функция для обработки опыта и достижений
function handleExperienceAndAchievements(userData, expGained) {
    const levelUp = window.APP_DATA.LevelSystem.addExperience(userData, expGained);

    // Показываем уведомление о новом уровне
    if (levelUp.leveledUp) {
        tg.showPopup({
            title: '🎉 Новый уровень!',
            message: `Поздравляем! Вы достигли ${levelUp.newLevel} уровня!`,
            buttons: [{ type: 'ok' }]
        });
    }

    // Проверяем достижения
    const newAchievements = window.APP_DATA.AchievementSystem.checkAchievements(userData);
    if (newAchievements.length > 0) {
        window.APP_DATA.AchievementSystem.unlockAchievements(userData, newAchievements);
        showAchievementNotification(newAchievements);
    }
}

// Функция для показа уведомления о новом достижении
function showAchievementNotification(achievements) {
    achievements.forEach(achievement => {
        setTimeout(() => {
            let rewardText = '';
            if (achievement.reward) {
                const rewards = [];
                if (achievement.reward.exp > 0) rewards.push(`${achievement.reward.exp} опыта`);
                if (achievement.reward.coins > 0) rewards.push(`${achievement.reward.coins} 💎`);
                if (rewards.length > 0) rewardText = `\nНаграда: ${rewards.join(', ')}`;
            }

            tg.showPopup({
                title: `🏆 Новое достижение! ${achievement.icon}`,
                message: `${achievement.name}\n${achievement.description}${rewardText}`,
                buttons: [{ type: 'ok' }]
            });
        }, 1000);
    });
}

// Функция для забора награды достижения
function claimAchievementReward(achievementId) {
    try {
        // Используем системную функцию claimReward
        const result = window.APP_DATA.AchievementSystem.claimReward(userData, achievementId);

        if (!result.success) {
            tg.showAlert(result.error || 'Не удалось получить награду');
            return;
        }

        // Сохраняем данные
        window.STORAGE.saveAllData(userData);

        // Обновляем UI
        updateProfileDisplay();
        updateAchievementsList();
        // Обновляем раздел достижений, если он открыт
        if (document.getElementById('achievementsSection').classList.contains('active')) {
            displayAchievements();
            updateAchievementStats();
        }

        // Показываем уведомление
        tg.showPopup({
            title: '🎁 Награда получена!',
            message: result.rewardText,
            buttons: [{ type: 'ok' }]
        });

    } catch (error) {
        console.error('Ошибка при получении награды:', error);
        tg.showAlert('Произошла ошибка при получении награды');
    }
}

// Функция для уведомления других вкладок об обновлении отзывов
function notifyReviewsUpdate() {
    if (reviewsChannel) {
        reviewsChannel.postMessage({ type: 'reviews_updated' });
    }
}

// Бронирование книги
async function borrowBook(bookId) {
    try {
        const book = window.APP_DATA.MOCK_BOOKS.find(b => b.id === bookId);
        if (book && book.available) {
            book.available = false;
            window.STORAGE.saveAllData(userData);
            
            const borrowRecord = {
                id: Date.now(),
                bookId: book.id,
                bookTitle: book.title,
                borrowDate: new Date().toISOString().split('T')[0],
                returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: 'active'
            };
            
            userData.borrowedBooks.push(borrowRecord);
            userData.stats.totalBooks++;
            userData.stats.activeBorrows++;
        
            // Начисляем опыт за бронирование книги
            handleExperienceAndAchievements(userData, 10); // 10 опыта за бронирование книги
        
            // Обновляем прогресс заданий
            updateQuestProgress('borrow_book');
        
            window.APP_DATA.MOCK_STATS.availableBooks--;
            window.APP_DATA.MOCK_STATS.borrowedBooks++;
        
            tg.showPopup({
                title: 'Успех! 🎉',
                message: `Книга "${book.title}" успешно забронирована!\nВерните до ${formatDate(borrowRecord.returnDate)}`,
                buttons: [{ type: 'ok' }]
            });

            updateBooksDisplay(currentBooks);
            updateStats(window.APP_DATA.MOCK_STATS);
            updateUserProfile();
            closeModal();
            
        } else {
            throw new Error('Книга недоступна для бронирования');
        }
    } catch (error) {
        console.error('Ошибка бронирования:', error);
        tg.showPopup({
            title: 'Ошибка',
            message: error.message || 'Не удалось забронировать книгу',
            buttons: [{ type: 'ok' }]
        });
    }
}

// Возврат книги
function returnBook(bookId) {
    const book = window.APP_DATA.MOCK_BOOKS.find(b => b.id === bookId);
    const borrowIndex = userData.borrowedBooks.findIndex(b => b.bookId === bookId && b.status === 'active');
    
    if (book && borrowIndex !== -1) {
        book.available = true;
        userData.borrowedBooks[borrowIndex].status = 'returned';
        
        userData.history.unshift({
            ...userData.borrowedBooks[borrowIndex],
            status: 'returned'
        });
        
        userData.stats.activeBorrows--;
        userData.stats.totalRead++;

        // Начисляем опыт за возврат книги
        handleExperienceAndAchievements(userData, 5); // 5 опыта за возврат книги
        
        window.APP_DATA.MOCK_STATS.availableBooks++;
        window.APP_DATA.MOCK_STATS.borrowedBooks--;
        
        window.STORAGE.saveAllData(userData);
        
        tg.showPopup({
            title: 'Книга возвращена! 📚',
            message: `"${book.title}" успешно возвращена в библиотеку`,
            buttons: [{ type: 'ok' }]
        });

        updateBooksDisplay(currentBooks);
        updateStats(calculateStats());
        updateUserProfile();
    }
}

// Добавить/удалить из избранного
function toggleFavorite(bookId) {
    const favoriteIndex = userData.favorites.indexOf(bookId);
    
    if (favoriteIndex === -1) {
        userData.favorites.push(bookId);
        tg.showPopup({
            title: 'Добавлено в избранное ★',
            message: 'Книга добавлена в ваш список избранных',
            buttons: [{ type: 'ok' }]
        });
    } else {
        userData.favorites.splice(favoriteIndex, 1);
        tg.showPopup({
            title: 'Удалено из избранного',
            message: 'Книга удалена из вашего списка избранных',
            buttons: [{ type: 'ok' }]
        });
    }

    // Обновляем прогресс заданий
    updateQuestProgress('favorite_book');

    window.STORAGE.saveAllData(userData);

    updateBooksDisplay(currentBooks);
    updateUserProfile();

    if (!document.getElementById('bookModal').classList.contains('hidden')) {
        const modalTitle = document.getElementById('modalTitle').textContent;
        const book = window.APP_DATA.MOCK_BOOKS.find(b => b.title === modalTitle);
        if (book) {
            showBookDetails(book.id);
        }
    }
}

// Удалить из избранного
function removeFavorite(bookId) {
    const favoriteIndex = userData.favorites.indexOf(bookId);
    if (favoriteIndex !== -1) {
        userData.favorites.splice(favoriteIndex, 1);
        updateUserProfile();
        window.STORAGE.saveAllData(userData);
        
        tg.showPopup({
            title: 'Удалено из избранного',
            message: 'Книга удалена из вашего списка избранных',
            buttons: [{ type: 'ok' }]
        });
    }
}

// Обновление профиля пользователя
function updateUserProfile() {
    document.getElementById('userName').textContent = userData.name;
    document.getElementById('userRegistration').textContent = `Зарегистрирован: ${userData.registrationDate}`;

    // Отображаем текущий титул
    const currentTitleElement = document.getElementById('userTitle');
    if (userData.titles && userData.titles.length > 0) {
        const currentTitleId = userData.titles[userData.titles.length - 1]; // Последний полученный титул
        const titleData = window.APP_DATA.TITLES.find(t => t.id === currentTitleId);
        if (titleData) {
            currentTitleElement.textContent = `${titleData.icon} ${titleData.name}`;
            currentTitleElement.style.display = 'block';
        } else {
            currentTitleElement.style.display = 'none';
        }
    } else {
        currentTitleElement.style.display = 'none';
    }

    // Обновляем уровень и опыт
    document.getElementById('userLevel').textContent = userData.level;
    const expInLevel = userData.experience % 100;
    const expToNext = 100;
    const expPercent = (expInLevel / expToNext) * 100;

    // Обновляем оба места полоски уровня
    const expFillHeader = document.getElementById('expFillHeader');
    const expTextHeader = document.getElementById('expTextHeader');
    const expFillSection = document.getElementById('expFillSection');
    const expTextSection = document.getElementById('expTextSection');
    if (expFillHeader) expFillHeader.style.width = `${Math.min(100, expPercent)}%`;
    if (expTextHeader) expTextHeader.textContent = `${expInLevel}/${expToNext} XP`;
    if (expFillSection) expFillSection.style.width = `${Math.min(100, expPercent)}%`;
    if (expTextSection) expTextSection.textContent = `${expInLevel}/${expToNext} XP`;

    // Обновляем фон секции уровня
    const levelSection = document.getElementById('levelSection');
    if (levelSection) {
        // Удалить старые классы level-*
        levelSection.className = levelSection.className.replace(/\blevel-\d+\b/g, '');
        // Добавить новый класс
        levelSection.classList.add(`level-${Math.min(userData.level, 10)}`); // Ограничить до 10 для стилей
    }

    document.getElementById('userTotalBooks').textContent = userData.stats.totalBooks;
    document.getElementById('userFavorites').textContent = userData.favorites.length;
    document.getElementById('userReviewsCount').textContent = userData.myReviews.length;
    document.getElementById('totalPagesRead').textContent = userData.totalPagesRead;
    document.getElementById('activeBorrows').textContent = userData.stats.activeBorrows;
    document.getElementById('totalRead').textContent = userData.stats.totalRead;
    document.getElementById('readingTime').textContent = userData.stats.readingDays;
    document.getElementById('userReviewsWritten').textContent = userData.stats.reviewsWritten || 0;

    updateActiveBooksList();
    updateHistoryList();
    updateFavoritesList();
    updateMyReviewsList();

    // Проверяем и разблокируем титулы
    checkAndUnlockTitles();
    updateBookedEventsList();
    updateAchievementsList();
    updateTitlesList();
}

// Обновление списка активных книг
function updateActiveBooksList() {
    const activeBooksList = document.getElementById('activeBooksList');
    const activeBooks = userData.borrowedBooks.filter(b => b.status === 'active');
    
    document.getElementById('activeBooksCount').textContent = activeBooks.length;
    
    if (activeBooks.length === 0) {
        activeBooksList.innerHTML = `
            <div class="empty-profile">
                <div class="empty-icon">📚</div>
                <h4>Нет активных книг</h4>
                <p>Найдите интересные книги в каталоге</p>
            </div>
        `;
    } else {
        activeBooksList.innerHTML = activeBooks.map(borrow => `
            <div class="borrowed-book-item">
                <div class="book-info">
                    <div class="book-title">${borrow.bookTitle}</div>
                    <div class="borrow-dates">
                        <span>Взята: ${formatDate(borrow.borrowDate)}</span>
                        <span class="return-date">Вернуть до: ${formatDate(borrow.returnDate)}</span>
                    </div>
                </div>
                <button class="return-btn" onclick="event.stopPropagation(); returnBook(${borrow.bookId})">
                    🔄 Вернуть
                </button>
            </div>
        `).join('');
    }
}

// Обновление списка забронированных событий
function updateBookedEventsList() {
    const bookedEventsList = document.getElementById('bookedEventsList');

    document.getElementById('bookedEventsCount').textContent = userData.bookedEvents.length;

    if (userData.bookedEvents.length === 0) {
        bookedEventsList.innerHTML = `
            <div class="empty-profile">
                <div class="empty-icon">🎫</div>
                <h4>Нет забронированных событий</h4>
                <p>Забронируйте билеты на интересные мероприятия</p>
            </div>
        `;
    } else {
        bookedEventsList.innerHTML = userData.bookedEvents.map(booking => `
            <div class="booked-event-item">
                <div class="event-info">
                    <div class="event-title">${booking.eventTitle}</div>
                    <div class="event-details">
                        <span>📅 ${formatEventDate(booking.eventDate)} в ${booking.eventTime}</span>
                        <span>📍 ${booking.location}</span>
                        <span>🎫 ${booking.ticketCount} билет${booking.ticketCount > 1 ? 'ов' : ''}</span>
                        <span>💰 ${booking.totalPrice} BYN</span>
                    </div>
                    <div class="booking-date">
                        Забронировано: ${formatEventDate(booking.bookingDate)}
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Обновление истории
function updateHistoryList() {
    const historyList = document.getElementById('historyList');
    
    document.getElementById('historyCount').textContent = userData.history.length;
    
    if (userData.history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-profile">
                <div class="empty-icon">🕐</div>
                <h4>История пуста</h4>
                <p>Здесь появятся ваши завершенные бронирования</p>
            </div>
        `;
    } else {
        historyList.innerHTML = userData.history.map(record => `
            <div class="history-item">
                <div class="history-info">
                    <div class="book-title">${record.bookTitle}</div>
                    <div class="history-dates">
                        <span>${formatDate(record.borrowDate)} - ${formatDate(record.returnDate)}</span>
                    </div>
                </div>
                <div class="history-status ${record.status === 'returned' ? 'status-returned' : 'status-expired'}">
                    ${record.status === 'returned' ? 'Возвращена' : 'Просрочена'}
                </div>
            </div>
        `).join('');
    }
}

// Обновление избранного
function updateFavoritesList() {
    const favoritesList = document.getElementById('favoritesList');
    const favoriteBooks = window.APP_DATA.MOCK_BOOKS.filter(book => userData.favorites.includes(book.id));
    
    document.getElementById('favoritesCount').textContent = favoriteBooks.length;
    
    if (favoriteBooks.length === 0) {
        favoritesList.innerHTML = `
            <div class="empty-profile">
                <div class="empty-icon">⭐</div>
                <h4>Нет избранных книг</h4>
                <p>Добавляйте книги в избранное, нажимая на звездочку</p>
            </div>
        `;
    } else {
        favoritesList.innerHTML = favoriteBooks.map(book => `
            <div class="favorite-item" onclick="showBookDetails(${book.id})">
                <div class="favorite-info">
                    <div class="book-title">${book.title}</div>
                    <div class="favorite-author">${book.author}</div>
                </div>
                <button class="remove-favorite" onclick="event.stopPropagation(); removeFavorite(${book.id})">
                    ✕
                </button>
            </div>
        `).join('');
    }
}

// Обновление достижений
function updateAchievementsList() {
    const achievementsGrid = document.getElementById('achievementsGrid');
    const achievementsCount = document.getElementById('achievementsCount');

    // Проверяем новые достижения при открытии раздела
    const newAchievements = window.APP_DATA.AchievementSystem.checkAchievements(userData);
    if (newAchievements.length > 0) {
        window.APP_DATA.AchievementSystem.unlockAchievements(userData, newAchievements);
        showAchievementNotification(newAchievements);
        window.STORAGE.saveAllData(userData);
    }

    achievementsCount.textContent = userData.achievements.length;

    // Получаем все достижения
    const allAchievements = window.APP_DATA.ACHIEVEMENTS.map(achievement => {
        const isUnlocked = userData.achievements.some(a => a.id === achievement.id);
        const unlockedData = userData.achievements.find(a => a.id === achievement.id);
        const rewardClaimed = userData.achievementRewardsClaimed?.includes(achievement.id) || false;

        return {
            ...achievement,
            isUnlocked,
            unlockedAt: unlockedData?.unlockedAt,
            rewardClaimed
        };
    });

    if (allAchievements.length === 0) {
        achievementsGrid.innerHTML = `
            <div class="empty-profile">
                <div class="empty-icon">🏆</div>
                <h4>Нет достижений</h4>
                <p>Начните читать книги, чтобы получать достижения!</p>
            </div>
        `;
    } else {
        achievementsGrid.innerHTML = allAchievements.map(achievement => {
            let rewardText = '';
            if (achievement.reward) {
                const rewards = [];
                if (achievement.reward.exp > 0) rewards.push(`${achievement.reward.exp} опыта`);
                if (achievement.reward.coins > 0) rewards.push(`${achievement.reward.coins} 💎`);
                if (achievement.reward.title) rewards.push(`Титул: ${achievement.reward.title}`);
                if (rewards.length > 0) rewardText = `Награда: ${rewards.join(', ')}`;
            }

            let actionButton = '';
            if (achievement.isUnlocked && !achievement.rewardClaimed && achievement.reward) {
                actionButton = `<button class="claim-reward-btn" onclick="event.stopPropagation(); claimAchievementReward('${achievement.id}')">🎁 Забрать награду</button>`;
            } else if (achievement.rewardClaimed) {
                actionButton = '<div class="achievement-completed">🎉 Награда получена!</div>';
            }

            return `
            <div class="achievement-item ${achievement.isUnlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${achievement.isUnlocked ? achievement.icon : '🔒'}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                    ${rewardText ? `<div class="achievement-reward">${rewardText}</div>` : ''}
                    ${achievement.isUnlocked ?
                        `<div class="achievement-date">Получено: ${formatAchievementDate(achievement.unlockedAt)}</div>` :
                        '<div class="achievement-locked">🔒 Не получено</div>'
                    }
                    ${actionButton}
                </div>
            </div>
            `;
        }).join('');
    }
}

// Обновление титулов
function updateTitlesList() {
    const titlesGrid = document.getElementById('titlesGrid');
    const titlesCount = document.getElementById('titlesCount');

    // Получаем все титулы
    const allTitles = window.APP_DATA.TITLES.map(title => {
        const isUnlocked = title.type === 'achievement' ? title.condition(userData) :
                          userData.titles?.includes(title.id);
        return {
            ...title,
            isUnlocked
        };
    });

    titlesCount.textContent = allTitles.filter(t => t.isUnlocked).length;

    if (allTitles.length === 0) {
        titlesGrid.innerHTML = `
            <div class="empty-profile">
                <div class="empty-icon">👑</div>
                <h4>Нет титулов</h4>
                <p>Получайте достижения, чтобы разблокировать титулы!</p>
            </div>
        `;
    } else {
        titlesGrid.innerHTML = allTitles.map(title => {
            if (!title.isUnlocked) return '';

            return `
            <div class="title-card unlocked ${title.rarity}">
                <div class="title-header">
                    <div class="title-icon">${title.icon}</div>
                    <div class="title-info">
                        <div class="title-name">${title.name}</div>
                        <div class="title-description">${title.description}</div>
                        <div class="title-rarity">${getRarityText(title.rarity)}</div>
                    </div>
                </div>
                <div class="title-actions">
                    <div class="title-unlocked">✅ Получен</div>
                </div>
            </div>
            `;
        }).join('');
    }
}

// Обновление моих отзывов
function updateMyReviewsList() {
    const myReviewsList = document.getElementById('myReviewsList');
    const myReviewsCount = document.getElementById('myReviewsCount');

    myReviewsCount.textContent = userData.myReviews.length;

    if (userData.myReviews.length === 0) {
        myReviewsList.innerHTML = `
            <div class="empty-profile">
                <div class="empty-icon">💬</div>
                <h4>Нет отзывов</h4>
                <p>Поделитесь вашим мнением о прочитанных книгах</p>
            </div>
        `;
    } else {
        myReviewsList.innerHTML = userData.myReviews.map(review => `
            <div class="my-review-item" onclick="showBookDetails(${review.bookId})">
                <div class="my-review-header">
                    <div class="my-review-book">${escapeHtml(review.bookTitle)}</div>
                    <div class="my-review-rating">${createRatingStars(review.rating)}</div>
                </div>
                <div class="my-review-comment">${escapeHtml(review.comment)}</div>
                <div class="my-review-date">${formatReviewDate(review.date)}</div>
            </div>
        `).join('');
    }
}

// Функция для отображения животных Красной книги
function loadRedBookAnimals() {
    const container = document.getElementById('animalsContainer');
    const animals = window.APP_DATA.RED_BOOK_ANIMALS;

    document.getElementById('animalsCount').textContent = `${animals.length} животных`;

    container.innerHTML = animals.map(animal => `
        <div class="book-card" onclick="showAnimalDetails(${animal.id})">
            <div class="book-header">
                <div class="book-cover">
                    <div class="book-icon">${animal.image && animal.image.startsWith('http') ? createImageElement(animal.image, animal.name) : '🐾'}</div>
                </div>
                <div class="book-info">
                    <div class="book-title">${escapeHtml(animal.name)}</div>
                    <div class="book-author">${escapeHtml(animal.species)}</div>
                    <div class="book-meta">👥 ${animal.population}</div>
                    <div class="book-meta">🏞️ ${animal.habitat}</div>
                    <div class="book-status ${animal.status}">
                        ${getStatusText(animal.status)}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Функция для загрузки челленджей
function loadChallenges() {
    const dailyContainer = document.getElementById('dailyChallengesGrid');
    const weeklyContainer = document.getElementById('weeklyChallengesGrid');
    const challengesCount = document.getElementById('challengesCount');
    const totalCompleted = document.getElementById('totalChallengesCompleted');
    const totalRewards = document.getElementById('totalRewardsEarned');

    // Проверяем и сбрасываем челленджи при необходимости
    checkAndResetChallenges();

    const dailyChallenges = window.APP_DATA.DAILY_CHALLENGES;
    const weeklyChallenges = window.APP_DATA.WEEKLY_CHALLENGES;

    dailyContainer.innerHTML = dailyChallenges.map(challenge => {
        const isCompleted = userData.challenges.daily.completed.includes(challenge.id);
        return `
            <div class="challenge-card ${isCompleted ? 'completed' : ''}" onclick="completeChallenge('${challenge.id}')">
                <div class="challenge-header">
                    <span class="challenge-icon">${challenge.icon}</span>
                    <div class="challenge-info">
                        <div class="challenge-title">${challenge.title}</div>
                        <div class="challenge-description">${challenge.description}</div>
                        <div class="challenge-reward">+${challenge.reward} XP</div>
                    </div>
                    <span class="challenge-status ${isCompleted ? 'completed' : 'pending'}">
                        ${isCompleted ? '✓' : '○'}
                    </span>
                </div>
            </div>
        `;
    }).join('');

    weeklyContainer.innerHTML = weeklyChallenges.map(challenge => {
        const isCompleted = userData.challenges.weekly.completed.includes(challenge.id);
        return `
            <div class="challenge-card ${isCompleted ? 'completed' : ''}" onclick="completeChallenge('${challenge.id}')">
                <div class="challenge-header">
                    <span class="challenge-icon">${challenge.icon}</span>
                    <div class="challenge-info">
                        <div class="challenge-title">${challenge.title}</div>
                        <div class="challenge-description">${challenge.description}</div>
                        <div class="challenge-reward">+${challenge.reward} XP</div>
                    </div>
                    <span class="challenge-status ${isCompleted ? 'completed' : 'pending'}">
                        ${isCompleted ? '✓' : '○'}
                    </span>
                </div>
            </div>
        `;
    }).join('');

    const totalCompletedCount = userData.challenges.daily.completed.length + userData.challenges.weekly.completed.length;
    const totalChallenges = dailyChallenges.length + weeklyChallenges.length;

    challengesCount.textContent = `${totalCompletedCount}/${totalChallenges} выполнено`;
    totalCompleted.textContent = totalCompletedCount;
    totalRewards.textContent = userData.stats.totalRewardsEarned || 0;
}

// Функция для загрузки авторов
function loadAuthors() {
    const authorsGrid = document.getElementById('authorsGrid');
    const dailyQuote = document.getElementById('dailyQuote');

    const authors = Object.keys(window.APP_DATA.AUTHOR_BIOS);

    authorsGrid.innerHTML = authors.map(authorName => {
        const author = window.APP_DATA.AUTHOR_BIOS[authorName];
        return `
            <div class="author-card" onclick="showAuthorDetails('${authorName}')">
                <div class="author-header">
                    <div class="author-avatar">${authorName[0]}</div>
                    <div class="author-info">
                        <div class="author-name">${authorName}</div>
                        <div class="author-bio">${author.bio.substring(0, 100)}...</div>
                        <div class="author-works">
                            <strong>Известные произведения:</strong> ${author.famousWorks.slice(0, 2).join(', ')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Показываем цитату дня
    const today = new Date().toDateString();
    const dailyQuoteData = window.APP_DATA.BOOK_QUOTES[Math.floor(Math.random() * window.APP_DATA.BOOK_QUOTES.length)];

    dailyQuote.innerHTML = `
        <div class="quote-text">${dailyQuoteData.quote}</div>
        <div class="quote-author">— ${dailyQuoteData.author}, "${dailyQuoteData.book}"</div>
    `;
}

// Функция для проверки и сброса челленджей
function checkAndResetChallenges() {
    const now = new Date();
    const today = now.toDateString();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay())).toDateString();

    // Сбрасываем ежедневные челленджи
    if (userData.challenges.daily.lastReset !== today) {
        userData.challenges.daily.completed = [];
        userData.challenges.daily.lastReset = today;
    }

    // Сбрасываем недельные челленджи
    if (userData.challenges.weekly.lastReset !== weekStart) {
        userData.challenges.weekly.completed = [];
        userData.challenges.weekly.claimed = [];
        userData.challenges.weekly.lastReset = weekStart;
    }

    // Сбрасываем месячные челленджи
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toDateString();
    if (userData.challenges.monthly.lastReset !== monthStart) {
        userData.challenges.monthly.completed = [];
        userData.challenges.monthly.claimed = [];
        userData.challenges.monthly.lastReset = monthStart;
    }

    window.STORAGE.saveAllData(userData);
}

// Функция для выполнения челленджа
function completeChallenge(challengeId) {
    const allChallenges = [...window.APP_DATA.DAILY_CHALLENGES, ...window.APP_DATA.WEEKLY_CHALLENGES];
    const challenge = allChallenges.find(c => c.id === challengeId);

    if (!challenge) return;

    const isDaily = window.APP_DATA.DAILY_CHALLENGES.some(c => c.id === challengeId);
    const challengeList = isDaily ? userData.challenges.daily.completed : userData.challenges.weekly.completed;

    if (!challengeList.includes(challengeId)) {
        challengeList.push(challengeId);
        handleExperienceAndAchievements(userData, challenge.reward.exp);

        // Начисляем кристаллы (coins) с учётом множителя
        let coinsEarned = challenge.reward.coins;
        if (userData.coinMultiplier && userData.coinMultiplier > 1 && userData.multiplierEndTime > Date.now()) {
            coinsEarned *= userData.coinMultiplier;
        }
        userData.coins = (userData.coins || 0) + coinsEarned;
        userData.stats.totalRewardsEarned = (userData.stats.totalRewardsEarned || 0) + coinsEarned;

        window.STORAGE.saveAllData(userData);
        loadChallenges(); // Перезагружаем челленджи

        tg.showPopup({
            title: 'Задание выполнено! 🎉',
            message: `Получено ${challenge.reward.exp} опыта и ${coinsEarned} 💎 кристаллов!${coinsEarned > challenge.reward.coins ? ` (x${userData.coinMultiplier} множитель)` : ''}`,
            buttons: [{ type: 'ok' }]
        });
    }
}

// Функция для показа деталей автора
function showAuthorDetails(authorName) {
    const author = window.APP_DATA.AUTHOR_BIOS[authorName];
    if (!author) return;

    const modalBody = document.getElementById('authorModalBody');
    modalBody.innerHTML = `
        <div class="author-details">
            <div class="author-header-large">
                <div class="author-avatar-large">${authorName[0]}</div>
                <div class="author-info-large">
                    <h3>${authorName}</h3>
                    <p class="author-bio-full">${author.bio}</p>
                </div>
            </div>
            <div class="author-works-section">
                <h4>Известные произведения:</h4>
                <ul>
                    ${author.famousWorks.map(work => `<li>${work}</li>`).join('')}
                </ul>
            </div>
            <div class="author-quotes-section">
                <h4>Цитаты:</h4>
                ${author.quotes.map(quote => `<blockquote>"${quote}"</blockquote>`).join('')}
            </div>
        </div>
    `;

    document.getElementById('authorModalTitle').textContent = authorName;
    document.getElementById('authorModal').classList.remove('hidden');
}

// Функция для закрытия модала автора
function closeAuthorModal() {
    document.getElementById('authorModal').classList.add('hidden');
}


// Функция для показа деталей события
function showEventDetails(eventId) {
    const event = window.APP_DATA.MOCK_EVENTS.find(e => e.id === eventId);
    if (!event) return;

    const modalBody = document.getElementById('eventModalBody');
    modalBody.innerHTML = `
        <div class="event-details">
            <div class="event-cover-large">
                <div class="event-icon">${event.image}</div>
            </div>
            <div class="event-info-detailed">
                <h4>${escapeHtml(event.title)}</h4>
                <p><strong>Тип:</strong> ${event.type}</p>
                <p><strong>Дата:</strong> ${formatDate(event.date)}</p>
                <p><strong>Время:</strong> ${event.time}</p>
                <p><strong>Место:</strong> ${escapeHtml(event.location)}</p>
                <p><strong>Цена билета:</strong> ${event.price} BYN</p>
                <p><strong>Доступно билетов:</strong> ${event.availableTickets} из ${event.totalTickets}</p>

                <div class="event-description">
                    <strong>Описание:</strong>
                    <p>${escapeHtml(event.description)}</p>
                </div>

                <div class="event-category">
                    <strong>Категория:</strong> ${event.category}
                </div>
            </div>
        </div>
    `;

    document.getElementById('eventModalTitle').textContent = event.title;
    document.getElementById('eventModal').classList.remove('hidden');
    tg.BackButton.show();
}

// Функция для открытия модала бронирования
function openBookingModal(eventId) {
    const event = window.APP_DATA.MOCK_EVENTS.find(e => e.id === eventId);
    if (!event) return;

    currentEventId = eventId;
    selectedTickets = 1;

    document.getElementById('ticketCount').textContent = selectedTickets;
    document.getElementById('ticketPrice').textContent = event.price;
    document.getElementById('totalPrice').textContent = event.price * selectedTickets;

    document.getElementById('bookingModal').classList.remove('hidden');
    tg.BackButton.show();
}

// Функция для закрытия модала события
function closeEventModal() {
    document.getElementById('eventModal').classList.add('hidden');
    tg.BackButton.hide();
}

// Функция для закрытия модала бронирования
function closeBookingModal() {
    document.getElementById('bookingModal').classList.add('hidden');
    tg.BackButton.hide();
}

// Функция для изменения количества билетов
function changeTicketCount(delta) {
    const event = window.APP_DATA.MOCK_EVENTS.find(e => e.id === currentEventId);
    if (!event) return;

    selectedTickets = Math.max(1, Math.min(event.availableTickets, selectedTickets + delta));
    document.getElementById('ticketCount').textContent = selectedTickets;
    document.getElementById('totalPrice').textContent = event.price * selectedTickets;
}

// Функция для подтверждения бронирования
function confirmBooking() {
    const event = window.APP_DATA.MOCK_EVENTS.find(e => e.id === currentEventId);
    if (!event || selectedTickets > event.availableTickets) return;

    // Обновляем данные события
    event.availableTickets -= selectedTickets;

    // Добавляем в пользовательские бронирования
    const booking = {
        id: Date.now(),
        eventId: currentEventId,
        eventTitle: event.title,
        tickets: selectedTickets,
        totalPrice: event.price * selectedTickets,
        bookingDate: new Date().toISOString().split('T')[0],
        eventDate: event.date,
        eventTime: event.time,
        location: event.location
    };

    userData.bookedEvents.push(booking);
    userData.stats.totalEvents++;
    userData.stats.totalSpent += booking.totalPrice;

    // Начисляем опыт за бронирование события
    handleExperienceAndAchievements(userData, 20); // 20 опыта за бронирование события

    // Сохраняем данные
    window.STORAGE.saveAllData(userData);

    // Показываем уведомление
    tg.showPopup({
        title: 'Успех! 🎫',
        message: `Билеты на "${event.title}" успешно забронированы!\nКоличество: ${selectedTickets}\nСумма: ${booking.totalPrice} BYN`,
        buttons: [{ type: 'ok' }]
    });

    // Обновляем отображение
    loadEvents();
    updateUserProfile();
    closeBookingModal();
}

// Функция для загрузки событий
function loadEvents() {
    const container = document.getElementById('eventsContainer');
    const eventsLoading = document.getElementById('eventsLoading');
    const eventsEmptyState = document.getElementById('eventsEmptyState');
    const events = window.APP_DATA.MOCK_EVENTS;

    eventsLoading.classList.remove('hidden');
    container.innerHTML = '';
    eventsEmptyState.classList.add('hidden');

    setTimeout(() => {
        if (!events || events.length === 0) {
            eventsEmptyState.classList.remove('hidden');
        } else {
            container.innerHTML = events.map(event => {
                const isBooked = userData.bookedEvents.some(be => be.eventId === event.id);
                const ticketsStatus = event.availableTickets === 0 ? 'sold-out' :
                                    event.availableTickets < 10 ? 'low' : 'available';

                return `
                <div class="event-card" onclick="showEventDetails(${event.id})">
                    <div class="event-header">
                        <div class="event-cover">
                            <div class="event-icon">${event.image || '📅'}</div>
                        </div>
                        <div class="event-info">
                            <div class="event-title">${escapeHtml(event.title)}</div>
                            <div class="event-meta">${event.category}</div>
                            <div class="event-date-time">
                                <span class="event-date">📅 ${formatEventDate(event.date)}</span>
                                <span class="event-time">🕐 ${event.time}</span>
                            </div>
                            <div class="event-location">📍 ${escapeHtml(event.location)}</div>
                            <div class="event-price">💰 ${event.price} BYN</div>
                            <div class="event-tickets tickets-${ticketsStatus}">
                                🎫 ${event.availableTickets}/${event.totalTickets} билетов
                            </div>
                        </div>
                    </div>
                    <div class="event-actions">
                        <button
                            class="book-event-btn"
                            onclick="event.stopPropagation(); openBookingModal(${event.id})"
                            ${event.availableTickets === 0 || isBooked ? 'disabled' : ''}
                        >
                            ${isBooked ? '🎫 Уже забронировано' : (event.availableTickets === 0 ? 'Распродано' : 'Забронировать')}
                        </button>
                        <button
                            class="view-event-btn"
                            onclick="event.stopPropagation(); showEventDetails(${event.id})"
                        >
                            👁️
                        </button>
                    </div>
                </div>
                `;
            }).join('');
        }

        updateEventsCount(events.length);
        eventsLoading.classList.add('hidden');
    }, 500);
}

// Функция для показа деталей события
function showEventDetails(eventId) {
    const event = window.APP_DATA.MOCK_EVENTS.find(e => e.id === eventId);
    if (!event) return;

    const isBooked = userData.bookedEvents.some(be => be.eventId === event.id);
    const modalBody = document.getElementById('eventModalBody');

    modalBody.innerHTML = `
        <div class="event-details">
            <div class="event-cover-large">
                <div class="event-icon">${event.image || '📅'}</div>
            </div>
            <div class="event-info-detailed">
                <h4>${escapeHtml(event.title)}</h4>
                <p><strong>Тип:</strong> ${event.type}</p>
                <p><strong>Категория:</strong> ${event.category}</p>
                <p><strong>Дата:</strong> ${formatEventDate(event.date)}</p>
                <p><strong>Время:</strong> ${event.time}</p>
                <p><strong>Место:</strong> ${escapeHtml(event.location)}</p>
                <p><strong>Цена билета:</strong> ${event.price} BYN</p>
                <p><strong>Доступно билетов:</strong>
                    <span class="event-tickets tickets-${event.availableTickets === 0 ? 'sold-out' : (event.availableTickets < 10 ? 'low' : 'available')}">
                        ${event.availableTickets}/${event.totalTickets}
                    </span>
                </p>

                <div class="event-description">
                    <strong>Описание:</strong>
                    <p>${escapeHtml(event.description)}</p>
                </div>
            </div>
        </div>
        <div class="modal-actions">
            <button
                class="book-event-btn"
                onclick="openBookingModal(${event.id})"
                ${event.availableTickets === 0 || isBooked ? 'disabled' : ''}
                style="flex: 1; margin-right: 10px;"
            >
                ${isBooked ? '🎫 Уже забронировано' : (event.availableTickets === 0 ? 'Распродано' : 'Забронировать билет')}
            </button>
            <button class="view-event-btn" onclick="closeEventModal()" style="padding: 12px;">
                Закрыть
            </button>
        </div>
    `;

    document.getElementById('eventModalTitle').textContent = event.title;
    document.getElementById('eventModal').classList.remove('hidden');
    tg.BackButton.show();
}

// Функция для открытия модала бронирования
function openBookingModal(eventId) {
    const event = window.APP_DATA.MOCK_EVENTS.find(e => e.id === eventId);
    if (!event) return;

    currentBookingEventId = eventId;
    ticketCount = 1;

    document.getElementById('ticketCount').textContent = ticketCount;
    document.getElementById('ticketPrice').textContent = event.price;
    document.getElementById('totalPrice').textContent = event.price * ticketCount;

    document.getElementById('bookingModal').classList.remove('hidden');
    tg.BackButton.show();
}

// Функция для закрытия модала события
function closeEventModal() {
    document.getElementById('eventModal').classList.add('hidden');
    tg.BackButton.hide();
}

// Функция для закрытия модала бронирования
function closeBookingModal() {
    document.getElementById('bookingModal').classList.add('hidden');
    tg.BackButton.hide();
}

// Функция для изменения количества билетов
function changeTicketCount(delta) {
    const event = window.APP_DATA.MOCK_EVENTS.find(e => e.id === currentBookingEventId);
    if (!event) return;

    ticketCount = Math.max(1, Math.min(event.availableTickets, ticketCount + delta));
    document.getElementById('ticketCount').textContent = ticketCount;
    document.getElementById('totalPrice').textContent = event.price * ticketCount;
}

// Функция для подтверждения бронирования
function confirmBooking() {
    const event = window.APP_DATA.MOCK_EVENTS.find(e => e.id === currentBookingEventId);
    if (!event || ticketCount > event.availableTickets) return;

    // Обновляем данные события
    event.availableTickets -= ticketCount;

    // Добавляем бронирование пользователю
    const booking = {
        id: Date.now(),
        eventId: event.id,
        eventTitle: event.title,
        ticketCount: ticketCount,
        totalPrice: event.price * ticketCount,
        bookingDate: new Date().toISOString().split('T')[0],
        eventDate: event.date,
        eventTime: event.time,
        location: event.location
    };

    userData.bookedEvents.push(booking);
    userData.stats.totalEvents = (userData.stats.totalEvents || 0) + 1;

    // Сохраняем данные
    window.STORAGE.saveAllData(userData);

    // Показываем уведомление
    tg.showPopup({
        title: 'Успех! 🎫',
        message: `Билеты на "${event.title}" успешно забронированы!\nКоличество: ${ticketCount}\nИтого: ${booking.totalPrice} BYN`,
        buttons: [{ type: 'ok' }]
    });

    // Обновляем интерфейс
    loadEvents();
    updateUserProfile();
    closeBookingModal();
    closeEventModal();
}

// Функции для чтения книг
function startReading(bookId) {
    const book = window.APP_DATA.MOCK_BOOKS.find(b => b.id === bookId);
    if (!book) return;

    currentReadingBook = book;
    currentPage = 1;

    // Инициализируем прогресс книги, если его нет
    if (!userData.bookProgress[bookId]) {
        userData.bookProgress[bookId] = {
            pagesRead: 0,
            completed: false,
            achievements: []
        };
    }

    // Устанавливаем текущую страницу на последнюю прочитанную + 1
    const progress = userData.bookProgress[bookId];
    currentPage = Math.max(1, progress.pagesRead + 1);

    loadReadingContent();
    document.getElementById('readingModal').classList.remove('hidden');
    document.getElementById('readingTitle').textContent = `Чтение: ${book.title}`;
    tg.BackButton.show();
}

function loadReadingContent() {
    if (!currentReadingBook) return;

    const totalPages = currentReadingBook.pages;
    const progress = (currentPage / totalPages) * 100;

    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
    document.getElementById('readingProgress').style.width = `${progress}%`;

    // Генерируем контент страницы (в реальном приложении здесь был бы настоящий текст)
    const content = generatePageContent(currentReadingBook, currentPage);
    document.getElementById('readingContent').innerHTML = content;

    // Обновляем состояние кнопок
    document.getElementById('prevBtn').disabled = currentPage <= 1;
    document.getElementById('nextBtn').disabled = currentPage >= totalPages;
    document.getElementById('pageInput').value = currentPage;
    document.getElementById('pageInput').max = totalPages;
}

function generatePageContent(book, page) {
    // Проверяем, есть ли реальный текст книги
    if (window.BOOK_TEXTS && window.BOOK_TEXTS[book.id]) {
        // Используем реальный текст
        const content = window.generateBookContent(book.id, page);
        return content.map(paragraph => `<p>${paragraph}</p>`).join('');
    }

    // Генерируем демо-контент для книг без реального текста
    const demoContent = [];
    const words = [
        'книга', 'читатель', 'история', 'автор', 'герой', 'событие', 'время', 'место',
        'любовь', 'жизнь', 'счастье', 'горе', 'радость', 'печаль', 'надежда', 'страх',
        'друг', 'враг', 'путешествие', 'приключение', 'тайна', 'открытие', 'знание', 'мудрость'
    ];

    for (let i = 0; i < 15; i++) {
        const sentenceLength = Math.floor(Math.random() * 10) + 5;
        const sentence = [];
        for (let j = 0; j < sentenceLength; j++) {
            sentence.push(words[Math.floor(Math.random() * words.length)]);
        }
        demoContent.push(sentence.join(' ') + '.');
    }

    return demoContent.map(paragraph => `<p>${paragraph}</p>`).join('');
}

function getRandomWord() {
    const words = [
        'книга', 'читатель', 'история', 'автор', 'герой', 'событие', 'время', 'место',
        'любовь', 'жизнь', 'счастье', 'горе', 'радость', 'печаль', 'надежда', 'страх',
        'друг', 'враг', 'путешествие', 'приключение', 'тайна', 'открытие', 'знание', 'мудрость'
    ];
    return words[Math.floor(Math.random() * words.length)];
}

function nextPage() {
    if (currentPage < currentReadingBook.pages) {
        currentPage++;
        loadReadingContent();
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        loadReadingContent();
    }
}

function goToPage(page) {
    const pageNum = parseInt(page);
    if (pageNum >= 1 && pageNum <= currentReadingBook.pages) {
        currentPage = pageNum;
        loadReadingContent();
    }
}

function markPageAsRead() {
    if (!currentReadingBook || !userData.bookProgress[currentReadingBook.id]) return;

    const progress = userData.bookProgress[currentReadingBook.id];

    // Отмечаем текущую страницу как прочитанную
    if (currentPage > progress.pagesRead) {
        const pagesAdded = currentPage - progress.pagesRead;
        progress.pagesRead = currentPage;

        // Добавляем опыт за прочитанные страницы
        const expGained = pagesAdded * 2; // 2 опыта за страницу
        const levelUp = window.APP_DATA.LevelSystem.addExperience(userData, expGained);

        userData.totalPagesRead += pagesAdded;

        // Обновляем прогресс заданий
        updateQuestProgress('read_pages');

        // Проверяем достижения
        const newAchievements = window.APP_DATA.AchievementSystem.checkAchievements(userData);
        if (newAchievements.length > 0) {
            window.APP_DATA.AchievementSystem.unlockAchievements(userData, newAchievements);
            showAchievementNotification(newAchievements);
        }

        // Показываем уведомление о полученном опыте
        tg.showPopup({
            title: 'Страница прочитана! 📖',
            message: `Получено ${expGained} опыта!${levelUp.leveledUp ? `\n🎉 Новый уровень: ${levelUp.newLevel}!` : ''}`,
            buttons: [{ type: 'ok' }]
        });

        window.STORAGE.saveAllData(userData);
        updateUserProfile();
    }
}

function finishBook() {
    if (!currentReadingBook) return;

    const progress = userData.bookProgress[currentReadingBook.id];
    if (!progress.completed) {
        progress.completed = true;
        progress.pagesRead = currentReadingBook.pages;
        userData.stats.booksCompleted++;

        // Добавляем опыт за завершение книги
        const expGained = 50; // 50 опыта за завершение книги
        const levelUp = window.APP_DATA.LevelSystem.addExperience(userData, expGained);

        // Проверяем достижения
        const newAchievements = window.APP_DATA.AchievementSystem.checkAchievements(userData);
        if (newAchievements.length > 0) {
            window.APP_DATA.AchievementSystem.unlockAchievements(userData, newAchievements);
            showAchievementNotification(newAchievements);
        }

        tg.showPopup({
            title: 'Книга завершена! 🎉',
            message: `Поздравляем! Вы прочитали "${currentReadingBook.title}"!\nПолучено ${expGained} опыта!${levelUp.leveledUp ? `\n🎉 Новый уровень: ${levelUp.newLevel}!` : ''}`,
            buttons: [{ type: 'ok' }]
        });

        window.STORAGE.saveAllData(userData);
        updateUserProfile();
    }

    closeReadingModal();
}

function showAchievementNotification(achievements) {
    achievements.forEach(achievement => {
        setTimeout(() => {
            tg.showPopup({
                title: `Новое достижение! ${achievement.icon}`,
                message: `${achievement.name}\n${achievement.description}`,
                buttons: [{ type: 'ok' }]
            });
        }, 1000);
    });
}

function closeReadingModal() {
    document.getElementById('readingModal').classList.add('hidden');
    currentReadingBook = null;
    currentPage = 1;
    tg.BackButton.hide();
}

// Функция для показа деталей животного
function showAnimalDetails(animalId) {
    const animal = window.APP_DATA.RED_BOOK_ANIMALS.find(a => a.id === animalId);
    
    if (!animal) return;
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="book-details">
            <div class="book-cover-large">
                <div class="book-icon">${animal.image && animal.image.startsWith('http') ? createImageElement(animal.image, animal.name, 'large') : '🐾'}</div>
            </div>
            <div class="book-info-detailed">
                <h4>${escapeHtml(animal.name)}</h4>
                <p><strong>Вид:</strong> <em>${escapeHtml(animal.species)}</em></p>
                <p><strong>Статус:</strong>
                    <span class="book-status ${animal.status}">
                        ${getStatusText(animal.status)}
                    </span>
                </p>
                <p><strong>Популяция:</strong> ${animal.population}</p>
                <p><strong>Место обитания:</strong> ${animal.habitat}</p>

                <div class="book-description">
                    <strong>Описание:</strong>
                    <p>${escapeHtml(animal.description)}</p>
                </div>

                <div class="conservation-info">
                    <h5>🛡️ Меры охраны</h5>
                    <p>Вид охраняется в соответствии с законодательством Республики Беларусь.
                       Запрещена охота, уничтожение мест обитания и любая деятельность,
                       приводящая к сокращению численности вида.</p>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modalTitle').textContent = animal.name;
    document.getElementById('bookModal').classList.remove('hidden');
    tg.BackButton.show();
}

// Вспомогательные функции
function populateGenreFilter(genres) {
    const genreFilter = document.getElementById('genreFilter');
    if (!genreFilter) return;
    genreFilter.innerHTML = '<option value="Все жанры">Все жанры</option>' +
        (genres || []).filter(genre => genre !== 'Все жанры').map(genre =>
            `<option value="${genre}">${genre}</option>`
        ).join('');
}

function updateStats(stats) {
    if (!stats) {
        stats = calculateStats();
    }
    const totalBooksEl = document.getElementById('totalBooks');
    const availableBooksEl = document.getElementById('availableBooks');
    const totalBooksCardEl = document.getElementById('totalBooksCard');
    const availableBooksCardEl = document.getElementById('availableBooksCard');
    const borrowedBooksEl = document.getElementById('borrowedBooks');
    const totalGenresEl = document.getElementById('totalGenres');

    // Hero section stats
    const heroTotalBooksEl = document.getElementById('heroTotalBooks');
    const heroGenresEl = document.getElementById('heroGenres');
    const heroAvailableEl = document.getElementById('heroAvailable');

    if (totalBooksEl) totalBooksEl.textContent = stats.totalBooks || 0;
    if (availableBooksEl) availableBooksEl.textContent = stats.availableBooks || 0;
    if (totalBooksCardEl) totalBooksCardEl.textContent = stats.totalBooks || 0;
    if (availableBooksCardEl) availableBooksCardEl.textContent = stats.availableBooks || 0;
    if (borrowedBooksEl) borrowedBooksEl.textContent = stats.borrowedBooks || 0;
    if (totalGenresEl) totalGenresEl.textContent = stats.totalGenres || 0;

    // Hero section
    if (heroTotalBooksEl) heroTotalBooksEl.textContent = stats.totalBooks || 0;
    if (heroGenresEl) heroGenresEl.textContent = stats.totalGenres || 0;
    if (heroAvailableEl) heroAvailableEl.textContent = stats.availableBooks || 0;
}

function updateBooksCount(count) {
    document.getElementById('booksCount').textContent = `всего 50 книг`;
}

function updateSectionTitle(title) {
    document.getElementById('sectionTitle').textContent = title;
}

function getBookWord(count) {
    if (count % 10 === 1 && count % 100 !== 11) return 'книга';
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'книги';
    return 'книг';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

function formatReviewDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Вчера';
    if (diffDays === 2) return 'Позавчера';
    if (diffDays <= 7) return `${diffDays} дней назад`;
    
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    const booksContainer = document.getElementById('booksContainer');
    
    if (show) {
        loading.classList.remove('hidden');
        booksContainer.classList.add('hidden');
    } else {
        loading.classList.add('hidden');
        booksContainer.classList.remove('hidden');
    }
}

function showError(message) {
    tg.showAlert(message);
}

function closeModal() {
    document.getElementById('bookModal').classList.add('hidden');
    tg.BackButton.hide();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('genreFilter').value = 'Все жанры';
    currentSearchQuery = '';
    currentGenre = '';
    loadInitialData();
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function createRatingStars(rating) {
    return window.APP_DATA.RatingUtils.createStars(rating);
}

function getRandomBooks(count) {
    if (!window.APP_DATA || !window.APP_DATA.MOCK_BOOKS || !Array.isArray(window.APP_DATA.MOCK_BOOKS)) {
        // Демо книги
        return [
            {
                id: 1,
                title: "Война и мир",
                author: "Лев Толстой",
                year: 1869,
                genre: "Роман-эпопея",
                available: true,
                icon: "📖",
                rating: 4.8,
                reviewsCount: 156
            }
        ].slice(0, count);
    }
    const shuffled = [...window.APP_DATA.MOCK_BOOKS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function getStatusText(status) {
    const statusMap = {
        'endangered': 'На грани исчезновения',
        'vulnerable': 'Уязвимый',
        'rare': 'Редкий'
    };
    return statusMap[status] || status;
}

function calculateStats() {
    const totalBooks = 50;
    const availableBooks = 45 + Math.floor(Math.random() * 6); // от 45 до 50 доступных книг
    const borrowedBooks = totalBooks - availableBooks;
    const totalGenres = window.APP_DATA && window.APP_DATA.MOCK_GENRES ? window.APP_DATA.MOCK_GENRES.length - 1 : 0;

    return {
        totalBooks,
        availableBooks,
        borrowedBooks,
        totalGenres
    };
}

function updateEventsCount(count) {
    document.getElementById('eventsCount').textContent = `${count} ${getEventWord(count)}`;
}

function updateTitlesCount() {
    const unlockedCount = userData.titles ? userData.titles.length : 0;
    document.getElementById('titlesCount').textContent = unlockedCount;
}

function getEventWord(count) {
    if (count % 10 === 1 && count % 100 !== 11) return 'событие';
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'события';
    return 'событий';
}

function formatEventDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function formatAchievementDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}


function clearAllData() {
    if (confirm('Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.')) {
        window.STORAGE.clearAllData();
    }
}

function clearAllReviews() {
    if (confirm('Вы уверены, что хотите удалить все отзывы? Это действие нельзя отменить.')) {
        window.APP_DATA.BOOK_REVIEWS = [];
        window.STORAGE.saveGlobalReviews();
        // Обновляем все отображения
        if (!document.getElementById('bookModal').classList.contains('hidden')) {
            const modalTitle = document.getElementById('modalTitle').textContent;
            const book = window.APP_DATA.MOCK_BOOKS.find(b => b.title === modalTitle);
            if (book) {
                showBookDetails(book.id);
            }
        }
        updateMyReviewsList();
        tg.showAlert('Все отзывы удалены!');
    }
}

// Функции для игровой механики
function loadGamesSection() {
    updateGamesStats();
    loadDailyQuests();
    loadWeeklyChallenges();
    loadMonthlyChallenges();
    loadSpecialEvents();
    loadRewardsShop();
}

function updateGamesStats() {
    document.getElementById('playerLevel').textContent = userData.level;
    document.getElementById('playerCoins').textContent = userData.coins || 0;
    document.getElementById('streakDays').textContent = userData.readingStreak || 0;
    document.getElementById('achievementsCount').textContent = userData.achievements.length;
}

function loadDailyQuests() {
    const container = document.getElementById('dailyQuestsGrid');
    const quests = window.APP_DATA.GAME_DATA.dailyQuests;

    container.innerHTML = quests.map(quest => {
        const progress = calculateQuestProgress(quest.id);
        const isCompleted = progress >= quest.target;
        const isClaimed = userData.challenges?.daily?.claimed?.includes(quest.id);

        return `
            <div class="quest-card ${isCompleted ? 'completed' : ''} ${isClaimed ? 'claimed' : ''}">
                <div class="quest-header">
                    <div class="quest-icon">${quest.icon}</div>
                    <div class="quest-info">
                        <div class="quest-title">${quest.title}</div>
                        <div class="quest-description">${quest.description}</div>
                    </div>
                </div>
                <div class="quest-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(progress / quest.target) * 100}%"></div>
                    </div>
                    <div class="progress-text">${progress}/${quest.target}</div>
                </div>
                <div class="quest-reward">
                    <span class="reward-exp">⭐ ${quest.reward.exp} XP</span>
                    <span class="reward-coins">💎 ${quest.reward.coins}</span>
                </div>
                ${isClaimed ? '<div class="quest-completed">🎉 Награда получена!</div>' :
                  isCompleted ? '<button class="claim-reward-btn" onclick="event.stopPropagation(); claimChallengeReward(\'' + quest.id + '\', \'daily\')">🎁 Забрать награду</button>' :
                  '<div class="quest-pending">⏳ В процессе...</div>'}
            </div>
        `;
    }).join('');
}

function loadWeeklyChallenges() {
    const container = document.getElementById('weeklyChallengesGrid');
    const challenges = window.APP_DATA.GAME_DATA.weeklyChallenges;

    container.innerHTML = challenges.map(challenge => {
        const progress = calculateChallengeProgress(challenge.id);
        const isCompleted = progress >= challenge.target;
        const isClaimed = userData.challenges?.weekly?.claimed?.includes(challenge.id);

        return `
            <div class="challenge-card ${isCompleted ? 'completed' : ''} ${isClaimed ? 'claimed' : ''}">
                <div class="challenge-header">
                    <div class="challenge-icon">${challenge.icon}</div>
                    <div class="challenge-info">
                        <div class="challenge-title">${challenge.title}</div>
                        <div class="challenge-description">${challenge.description}</div>
                    </div>
                </div>
                <div class="challenge-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(progress / challenge.target) * 100}%"></div>
                    </div>
                    <div class="progress-text">${progress}/${challenge.target}</div>
                </div>
                <div class="challenge-reward">
                    <span class="reward-exp">⭐ ${challenge.reward.exp} XP</span>
                    <span class="reward-coins">💎 ${challenge.reward.coins}</span>
                </div>
                ${isClaimed ? '<div class="challenge-completed">🎉 Награда получена!</div>' :
                  isCompleted ? '<button class="claim-reward-btn" onclick="event.stopPropagation(); claimChallengeReward(\'' + challenge.id + '\', \'weekly\')">🎁 Забрать награду</button>' :
                  '<div class="challenge-pending">⏳ В процессе...</div>'}
            </div>
        `;
    }).join('');
}

function loadMonthlyChallenges() {
    const container = document.getElementById('monthlyChallengesGrid');
    const challenges = window.APP_DATA.GAME_DATA.monthlyChallenges;

    container.innerHTML = challenges.map(challenge => {
        const progress = calculateMonthlyChallengeProgress(challenge.id);
        const isCompleted = progress >= challenge.target;
        const isClaimed = userData.challenges?.monthly?.claimed?.includes(challenge.id);

        return `
            <div class="challenge-card ${isCompleted ? 'completed' : ''} ${isClaimed ? 'claimed' : ''}">
                <div class="challenge-header">
                    <div class="challenge-icon">${challenge.icon}</div>
                    <div class="challenge-info">
                        <div class="challenge-title">${challenge.title}</div>
                        <div class="challenge-description">${challenge.description}</div>
                    </div>
                </div>
                <div class="challenge-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(progress / challenge.target) * 100}%"></div>
                    </div>
                    <div class="progress-text">${progress}/${challenge.target}</div>
                </div>
                <div class="challenge-reward">
                    <span class="reward-exp">⭐ ${challenge.reward.exp} XP</span>
                    <span class="reward-coins">💎 ${challenge.reward.coins}</span>
                </div>
                ${isClaimed ? '<div class="challenge-completed">🎉 Награда получена!</div>' :
                  isCompleted ? '<button class="claim-reward-btn" onclick="event.stopPropagation(); claimChallengeReward(\'' + challenge.id + '\', \'monthly\')">🎁 Забрать награду</button>' :
                  '<div class="challenge-pending">⏳ В процессе...</div>'}
            </div>
        `;
    }).join('');
}

function loadSpecialEvents() {
    const container = document.getElementById('specialEventsGrid');
    const events = window.APP_DATA.GAME_DATA.specialEvents.filter(event => event.active);

    container.innerHTML = events.map(event => `
        <div class="event-card">
            <div class="event-header">
                <div class="event-icon">${event.icon}</div>
                <div class="event-info">
                    <div class="event-title">${event.title}</div>
                    <div class="event-description">${event.description}</div>
                    <div class="event-deadline">До ${formatDate(event.endDate)}</div>
                </div>
            </div>
            <div class="event-reward">
                <span class="reward-exp">⭐ ${event.reward.exp} XP</span>
                <span class="reward-coins">💎 ${event.reward.coins}</span>
            </div>
            <button class="event-join-btn" onclick="joinSpecialEvent('${event.id}')">
                Участвовать
            </button>
        </div>
    `).join('');
}

function loadRewardsShop() {
    const container = document.getElementById('rewardsShopGrid');
    const items = window.APP_DATA.GAME_DATA.rewardsShop;

    container.innerHTML = items.map(item => {
        const owned = userData.gameProgress?.shopItems?.includes(item.id);
        const canAfford = (userData.coins || 0) >= item.price;

        return `
            <div class="shop-item ${owned ? 'owned' : ''}">
                <div class="shop-item-header">
                    <div class="shop-item-icon">${item.icon}</div>
                    <div class="shop-item-info">
                        <div class="shop-item-title">${item.title}</div>
                        <div class="shop-item-description">${item.description}</div>
                    </div>
                </div>
                <div class="shop-item-price">💎 ${item.price}</div>
                <button
                    class="shop-buy-btn"
                    onclick="buyShopItem('${item.id}')"
                    ${owned ? 'disabled' : ''}
                    ${!canAfford ? 'disabled' : ''}
                >
                    ${owned ? '✅ Куплено' : 'Купить'}
                </button>
            </div>
        `;
    }).join('');
}

function calculateQuestProgress(questId) {
    switch (questId) {
        case 'read_pages':
            return userData.totalPagesRead || 0;
        case 'borrow_book':
            return userData.borrowedBooks.filter(b => b.status === 'active').length;
        case 'write_review':
            return userData.myReviews.length;
        case 'favorite_book':
            return userData.favorites.length;
        default:
            return 0;
    }
}

function calculateChallengeProgress(challengeId) {
    switch (challengeId) {
        case 'read_books_week':
            return userData.history.filter(h => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(h.returnDate) > weekAgo;
            }).length;
        case 'pages_week':
            return userData.totalPagesRead || 0; // В реальности нужно считать за неделю
        case 'reviews_week':
            return userData.myReviews.filter(r => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(r.date) > weekAgo;
            }).length;
        default:
            return 0;
    }
}

function calculateMonthlyChallengeProgress(challengeId) {
    switch (challengeId) {
        case 'read_books_month':
            return userData.history.filter(h => {
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return new Date(h.returnDate) > monthAgo;
            }).length;
        case 'pages_month':
            return userData.totalPagesRead || 0; // В реальности нужно считать за месяц
        case 'reviews_month':
            return userData.myReviews.filter(r => {
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return new Date(r.date) > monthAgo;
            }).length;
        case 'streak_month':
            return userData.readingStreak || 0;
        case 'genres_month':
            // Подсчитываем уникальные жанры прочитанных книг
            const genres = new Set();
            userData.history.forEach(h => {
                const book = window.APP_DATA.MOCK_BOOKS.find(b => b.id === h.bookId);
                if (book) genres.add(book.genre);
            });
            return genres.size;
        default:
            return 0;
    }
}

// Функция для обновления прогресса заданий
function updateQuestProgress(questId) {
    // Обновляем отображение заданий, если вкладка игр активна
    if (document.getElementById('gamesSection').classList.contains('active')) {
        loadDailyQuests();
        loadWeeklyChallenges();
        loadMonthlyChallenges();
    }
}

function claimChallengeReward(challengeId, type) {
    const challenges = type === 'daily' ? window.APP_DATA.GAME_DATA.dailyQuests :
                      type === 'weekly' ? window.APP_DATA.GAME_DATA.weeklyChallenges :
                      window.APP_DATA.GAME_DATA.monthlyChallenges;
    const challenge = challenges.find(c => c.id === challengeId);

    if (!challenge) return;

    const progress = type === 'daily' ? calculateQuestProgress(challengeId) :
                    type === 'weekly' ? calculateChallengeProgress(challengeId) :
                    calculateMonthlyChallengeProgress(challengeId);
    const isCompleted = progress >= challenge.target;

    if (!isCompleted) {
        tg.showAlert('Задание ещё не выполнено!');
        return;
    }

    // Проверяем, не получена ли уже награда
    if (!userData.challenges[type].claimed) {
        userData.challenges[type].claimed = [];
    }

    if (userData.challenges[type].claimed.includes(challengeId)) {
        tg.showAlert('Награда уже получена!');
        return;
    }

    // Начисляем награду
    let coinsEarned = challenge.reward.coins;
    if (userData.coinMultiplier && userData.coinMultiplier > 1 && userData.multiplierEndTime > Date.now()) {
        coinsEarned *= userData.coinMultiplier;
    }

    userData.coins = (userData.coins || 0) + coinsEarned;
    userData.stats.totalRewardsEarned = (userData.stats.totalRewardsEarned || 0) + coinsEarned;

    const levelUp = window.APP_DATA.LevelSystem.addExperience(userData, challenge.reward.exp);

    // Отмечаем как полученное
    userData.challenges[type].claimed.push(challengeId);

    window.STORAGE.saveAllData(userData);

    // Перезагружаем челленджи
    if (type === 'daily') {
        loadDailyQuests();
    } else if (type === 'weekly') {
        loadWeeklyChallenges();
    } else {
        loadMonthlyChallenges();
    }

    updateGamesStats();

    tg.showPopup({
        title: 'Награда получена! 🎉',
        message: `Получено ${challenge.reward.exp} опыта и ${coinsEarned} 💎 кристаллов!${coinsEarned > challenge.reward.coins ? ` (x${userData.coinMultiplier} множитель)` : ''}${levelUp.leveledUp ? `\n🎉 Новый уровень: ${levelUp.newLevel}!` : ''}`,
        buttons: [{ type: 'ok' }]
    });
}

function claimAchievementReward(achievementId) {
    const achievement = window.APP_DATA.ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) {
        tg.showAlert('Достижение не найдено!');
        return;
    }

    // Проверяем, разблокировано ли достижение
    const isUnlocked = userData.achievements.some(a => a.id === achievementId);
    if (!isUnlocked) {
        tg.showAlert('Достижение ещё не разблокировано!');
        return;
    }

    // Проверяем, не получена ли уже награда
    if (!userData.achievementRewardsClaimed) {
        userData.achievementRewardsClaimed = [];
    }

    if (userData.achievementRewardsClaimed.includes(achievementId)) {
        tg.showAlert('Награда уже получена!');
        return;
    }

    // Начисляем награду
    let coinsEarned = achievement.reward ? (achievement.reward.coins || 0) : 0;
    let expEarned = achievement.reward ? (achievement.reward.exp || 0) : 0;

    if (userData.coinMultiplier && userData.coinMultiplier > 1 && userData.multiplierEndTime > Date.now()) {
        coinsEarned *= userData.coinMultiplier;
    }

    userData.coins = (userData.coins || 0) + coinsEarned;
    userData.stats.totalRewardsEarned = (userData.stats.totalRewardsEarned || 0) + coinsEarned;

    const levelUp = window.APP_DATA.LevelSystem.addExperience(userData, expEarned);

    // Выдаем титул из награды достижения
    if (achievement.reward && achievement.reward.title) {
        if (!userData.titles) userData.titles = [];
        if (!userData.titles.includes(achievement.reward.title)) {
            userData.titles.push(achievement.reward.title);
        }
    }

    // Отмечаем как полученное
    userData.achievementRewardsClaimed.push(achievementId);

    window.STORAGE.saveAllData(userData);
    updateAchievementsList();
    updateGamesStats();
    updateUserProfile();

    let message = '';
    if (expEarned > 0) message += `Получено ${expEarned} опыта! `;
    if (coinsEarned > 0) message += `Получено ${coinsEarned} 💎 кристаллов! `;
    if (achievement.reward && achievement.reward.title) message += `🏆 Титул: ${achievement.reward.title}! `;
    if (levelUp.leveledUp) message += `🎉 Новый уровень: ${levelUp.newLevel}! `;
    if (coinsEarned > (achievement.reward ? (achievement.reward.coins || 0) : 0)) message += `(x${userData.coinMultiplier} множитель)`;

    tg.showPopup({
        title: 'Награда получена! 🎉',
        message: message.trim(),
        buttons: [{ type: 'ok' }]
    });
}

function joinSpecialEvent(eventId) {
    if (!userData.gameProgress.specialEvents) {
        userData.gameProgress.specialEvents = [];
    }

    if (!userData.gameProgress.specialEvents.includes(eventId)) {
        userData.gameProgress.specialEvents.push(eventId);
        userData.gameStats.specialEventsParticipated = (userData.gameStats.specialEventsParticipated || 0) + 1;
        window.STORAGE.saveAllData(userData);
        tg.showAlert('Вы присоединились к специальному событию!');
        loadSpecialEvents();
    } else {
        tg.showAlert('Вы уже участвуете в этом событии!');
    }
}

function buyShopItem(itemId) {
    const item = window.APP_DATA.GAME_DATA.rewardsShop.find(i => i.id === itemId);
    if (!item) return;

    if ((userData.coins || 0) < item.price) {
        tg.showAlert(`Не хватает кристаллов на покупку предмета "${item.title}"!`);
        return;
    }

    if (!userData.gameProgress.shopItems) {
        userData.gameProgress.shopItems = [];
    }

    if (userData.gameProgress.shopItems.includes(itemId)) {
        tg.showAlert('Этот предмет уже куплен!');
        return;
    }

    // Списываем монеты
    userData.coins -= item.price;
    userData.gameProgress.shopItems.push(itemId);

    // Применяем эффект предмета
    applyShopItemEffect(itemId);

    window.STORAGE.saveAllData(userData);
    updateGamesStats();
    loadRewardsShop();

    tg.showAlert(`Предмет "${item.title}" успешно куплен!`);
}

function applyShopItemEffect(itemId) {
    switch (itemId) {
        case 'bonus_exp':
            const levelUp = window.APP_DATA.LevelSystem.addExperience(userData, 50);
            if (levelUp.leveledUp) {
                tg.showPopup({
                    title: 'Уровень повышен!',
                    message: `Поздравляем! Вы достигли ${levelUp.newLevel} уровня!`,
                    buttons: [{ type: 'ok' }]
                });
            }
            break;
        case 'theme_unlock':
            // Разблокировать тёмную тему - можно добавить флаг
            userData.unlockedThemes = userData.unlockedThemes || [];
            userData.unlockedThemes.push('dark');
            tg.showAlert('Тёмная тема разблокирована! Переключитесь в настройках.');
            break;
        case 'reading_streak_booster':
            userData.readingStreak = (userData.readingStreak || 0) + 7;
            tg.showAlert('Серия чтения увеличена на 7 дней!');
            break;
        case 'coin_multiplier':
            userData.coinMultiplier = userData.coinMultiplier || 1;
            userData.coinMultiplier *= 2;
            userData.multiplierEndTime = Date.now() + (5 * 24 * 60 * 60 * 1000); // 5 дней
            tg.showAlert('Множитель кристаллов активирован на 5 дней!');
            break;
        case 'exclusive_avatar':
            userData.availableAvatars = userData.availableAvatars || [];
            userData.availableAvatars.push('🎭');
            tg.showAlert('Эксклюзивный аватар разблокирован!');
            break;
        case 'background_theme':
            userData.availableBackgrounds = userData.availableBackgrounds || [];
            userData.availableBackgrounds.push('gradient');
            tg.showAlert('Новый фон профиля разблокирован!');
            break;
        case 'speed_reading':
            userData.speedBoost = userData.speedBoost || 1;
            userData.speedBoost *= 1.2;
            userData.speedBoostEndTime = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 дней
            tg.showAlert('Ускорение чтения активировано на неделю!');
            break;
        case 'achievement_unlocker':
            // Разблокировать случайное достижение
            const availableAchievements = window.APP_DATA.ACHIEVEMENTS.filter(a =>
                !userData.achievements.some(ua => ua.id === a.id)
            );
            if (availableAchievements.length > 0) {
                const randomAchievement = availableAchievements[Math.floor(Math.random() * availableAchievements.length)];
                window.APP_DATA.AchievementSystem.unlockAchievements(userData, [randomAchievement]);
                tg.showAlert(`Разблокировано достижение: ${randomAchievement.name}!`);
            } else {
                tg.showAlert('Все достижения уже разблокированы!');
            }
            break;
        default:
            tg.showAlert('Предмет активирован!');
    }
}

// Функции настроек профиля
function loadSettings() {
    // Загружаем текущие настройки
    document.getElementById('settingsName').value = userData.name || '';
    document.getElementById('userAvatar').innerHTML = userData.avatar || '👤';

    // Устанавливаем выбранные опции
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.classList.toggle('selected', option.textContent === userData.avatar);
    });

    document.querySelectorAll('.bg-option').forEach(option => {
        option.classList.toggle('selected', option.style.background.includes(userData.profileBackground || 'default'));
    });
}

function selectAvatar(avatar) {
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.classList.add('selected');
    document.getElementById('userAvatar').innerHTML = avatar;
}

function selectBackground(background) {
    document.querySelectorAll('.bg-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.classList.add('selected');
}

function saveSettings() {
    const newName = document.getElementById('settingsName').value.trim();
    const newAvatar = document.querySelector('.avatar-option.selected')?.textContent || userData.avatar;
    const newBackground = Array.from(document.querySelectorAll('.bg-option')).find(option =>
        option.classList.contains('selected')
    )?.textContent.toLowerCase().replace(/\s+/g, '') || userData.profileBackground;

    if (newName) {
        userData.name = newName;
    }
    userData.avatar = newAvatar;
    userData.profileBackground = newBackground;

    window.STORAGE.saveAllData(userData);
    updateUserProfile();

    tg.showPopup({
        title: 'Настройки сохранены',
        message: 'Ваши настройки профиля успешно обновлены!',
        buttons: [{ type: 'ok' }]
    });
}

function resetSettings() {
    if (confirm('Вы уверены, что хотите сбросить настройки к значениям по умолчанию?')) {
        userData.name = window.APP_DATA.DEFAULT_USER_DATA.name;
        userData.avatar = window.APP_DATA.DEFAULT_USER_DATA.avatar;
        userData.profileBackground = window.APP_DATA.DEFAULT_USER_DATA.profileBackground;

        window.STORAGE.saveAllData(userData);
        loadSettings();
        updateUserProfile();

        tg.showAlert('Настройки сброшены к значениям по умолчанию.');
    }
}

// Функции для работы с титулами
function loadTitles() {
    const container = document.getElementById('titlesContainer');
    const titles = window.APP_DATA.TITLES;

    container.innerHTML = titles.map(title => {
        const isUnlocked = title.type === 'achievement' ? title.condition(userData) :
                          userData.titles?.includes(title.id);
        const canAfford = userData.coins >= (title.price || 0);

        return `
            <div class="title-card ${isUnlocked ? 'unlocked' : ''} ${title.rarity}">
                <div class="title-header">
                    <div class="title-icon">${title.icon}</div>
                    <div class="title-info">
                        <div class="title-name">${title.name}</div>
                        <div class="title-description">${title.description}</div>
                        <div class="title-rarity">${getRarityText(title.rarity)}</div>
                    </div>
                </div>
                <div class="title-actions">
                    ${isUnlocked ?
                        '<div class="title-unlocked">✅ Получен</div>' :
                        title.type === 'purchase' ?
                            `<button class="title-buy-btn" onclick="buyTitle('${title.id}')" ${!canAfford ? 'disabled' : ''}>
                                💎 ${title.price}
                            </button>` :
                            '<div class="title-locked">🔒 Не получен</div>'
                    }
                </div>
            </div>
        `;
    }).join('');

    updateTitlesCount();
}

// Обновление инвентаря
function updateInventoryList() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    const inventoryCount = document.getElementById('inventoryCount');

    const ownedItems = window.APP_DATA.GAME_DATA.rewardsShop.filter(item =>
        userData.gameProgress?.shopItems?.includes(item.id)
    );

    inventoryCount.textContent = ownedItems.length;

    if (ownedItems.length === 0) {
        inventoryGrid.innerHTML = `
            <div class="empty-profile">
                <div class="empty-icon">🎒</div>
                <h4>Инвентарь пуст</h4>
                <p>Купите предметы в магазине наград!</p>
            </div>
        `;
    } else {
        inventoryGrid.innerHTML = ownedItems.map(item => `
            <div class="inventory-item">
                <div class="inventory-item-header">
                    <div class="inventory-item-icon">${item.icon}</div>
                    <div class="inventory-item-info">
                        <div class="inventory-item-title">${item.title}</div>
                        <div class="inventory-item-description">${item.description}</div>
                    </div>
                </div>
                <button class="inventory-use-btn" onclick="useInventoryItem('${item.id}')">
                    Использовать
                </button>
            </div>
        `).join('');
    }
}

// Использование предмета из инвентаря
function useInventoryItem(itemId) {
    const item = window.APP_DATA.GAME_DATA.rewardsShop.find(i => i.id === itemId);
    if (!item) return;

    // Применяем эффект предмета
    applyShopItemEffect(itemId);

    // Удаляем предмет из инвентаря (одноразовое использование)
    if (userData.gameProgress?.shopItems) {
        const index = userData.gameProgress.shopItems.indexOf(itemId);
        if (index > -1) {
            userData.gameProgress.shopItems.splice(index, 1);
        }
    }

    window.STORAGE.saveAllData(userData);
    updateInventoryList();
    updateGamesStats();

    tg.showPopup({
        title: 'Предмет использован!',
        message: `Вы использовали "${item.title}"!`,
        buttons: [{ type: 'ok' }]
    });
}

function buyTitle(titleId) {
    const title = window.APP_DATA.TITLES.find(t => t.id === titleId);
    if (!title || title.type !== 'purchase') return;

    if (userData.coins < title.price) {
        tg.showAlert('Недостаточно монет!');
        return;
    }

    if (!userData.titles) userData.titles = [];
    if (userData.titles.includes(titleId)) {
        tg.showAlert('Этот титул уже куплен!');
        return;
    }

    userData.coins -= title.price;
    userData.titles.push(titleId);

    window.STORAGE.saveAllData(userData);
    loadTitles();
    updateUserProfile();
    updateGamesStats();

    tg.showPopup({
        title: 'Титул куплен!',
        message: `Вы успешно купили титул "${title.name}"!`,
        buttons: [{ type: 'ok' }]
    });
}

function getRarityText(rarity) {
    const rarityMap = {
        common: 'Обычный',
        uncommon: 'Необычный',
        rare: 'Редкий',
        epic: 'Эпический',
        legendary: 'Легендарный'
    };
    return rarityMap[rarity] || rarity;
}

// Функция для получения иконки по жанру
function getGenreIcon(genre) {
    const genreIcons = {
        'Роман-эпопея': '📖',
        'Психологический роман': '🧠',
        'Фантастика': '🚀',
        'Фэнтези': '🧙‍♂️',
        'Детектив': '🕵️‍♂️',
        'Триллер': '🔪',
        'Ужасы': '👻',
        'Романтика': '💕',
        'Исторический роман': '🏰',
        'Биография': '👤',
        'Научная литература': '🔬',
        'Поэзия': '📝',
        'Драма': '🎭',
        'Комедия': '😂',
        'Приключения': '🗺️',
        'Классика': '📚'
    };
    return genreIcons[genre] || '📖';
}

// Функция для получения CSS класса по жанру
function getGenreClass(genre) {
    const genreClasses = {
        'Роман-эпопея': 'genre-epic',
        'Психологический роман': 'genre-psychological',
        'Фантастика': 'genre-sci-fi',
        'Фэнтези': 'genre-fantasy',
        'Детектив': 'genre-detective',
        'Триллер': 'genre-thriller',
        'Ужасы': 'genre-horror',
        'Романтика': 'genre-romance',
        'Исторический роман': 'genre-historical',
        'Биография': 'genre-biography',
        'Научная литература': 'genre-science',
        'Поэзия': 'genre-poetry',
        'Драма': 'genre-drama',
        'Комедия': 'genre-comedy',
        'Приключения': 'genre-adventure',
        'Классика': 'genre-classic'
    };
    return genreClasses[genre] || 'genre-default';
}

// Функция для создания изображения с обработкой ошибок
function createImageElement(src, alt, size = 'normal') {
    const imgId = 'img_' + Math.random().toString(36).substr(2, 9);
    const borderRadius = size === 'large' ? '8px' : '4px';

    // Создаем изображение с обработчиками событий
    setTimeout(() => {
        const img = document.getElementById(imgId);
        if (!img) return;

        img.classList.add('loading');

        img.onload = function() {
            img.classList.remove('loading');
            img.classList.add('loaded');
        };

        img.onerror = function() {
            // Заменяем на fallback
            const container = img.parentElement;
            container.innerHTML = '<div class="fallback">📚</div>';
        };
    }, 0);

    return `<img id="${imgId}" src="${src}" alt="${alt}" style="width:100%;height:100%;object-fit:cover;border-radius:${borderRadius};">`;
}

function checkAndUnlockTitles() {
    const titles = window.APP_DATA.TITLES;
    let newTitles = [];

    titles.forEach(title => {
        if (title.type === 'achievement' && title.condition(userData)) {
            if (!userData.titles?.includes(title.id)) {
                if (!userData.titles) userData.titles = [];
                userData.titles.push(title.id);
                newTitles.push(title);
            }
        }
    });

    if (newTitles.length > 0) {
        window.STORAGE.saveAllData(userData);
        loadTitles();

        newTitles.forEach(title => {
            setTimeout(() => {
                tg.showPopup({
                    title: 'Новый титул!',
                    message: `Вы получили титул "${title.name}"!\n${title.description}`,
                    buttons: [{ type: 'ok' }]
                });
            }, 1000);
        });
    }
}

// Функции для образовательного раздела
function loadEducationSection() {
    loadEducationLessons();
    loadEducationAuthors();
    loadEducationQuizzes();
    updateEducationProgress();
    showEducationCategory('lessons');
}

function showEducationCategory(category) {
    document.querySelectorAll('.education-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(category + 'Content').classList.add('active');
    document.querySelector(`[onclick="showEducationCategory('${category}')"]`).classList.add('active');
}

function loadEducationLessons() {
    const lessons = [
        {
            id: 1,
            title: "Введение в русскую литературу",
            description: "Основные этапы развития русской литературы от древности до наших дней",
            icon: "📚",
            difficulty: "Начинающий",
            duration: "15 мин",
            completed: userData.educationProgress?.lessons?.includes(1) || false
        },
        {
            id: 2,
            title: "Александр Сергеевич Пушкин",
            description: "Жизнь и творчество великого русского поэта",
            icon: "✍️",
            difficulty: "Средний",
            duration: "20 мин",
            completed: userData.educationProgress?.lessons?.includes(2) || false
        },
        {
            id: 3,
            title: "Лев Толстой и 'Война и мир'",
            description: "Анализ великого романа-эпопеи",
            icon: "📖",
            difficulty: "Продвинутый",
            duration: "30 мин",
            completed: userData.educationProgress?.lessons?.includes(3) || false
        },
        {
            id: 4,
            title: "Федор Достоевский",
            description: "Психологизм в произведениях Достоевского",
            icon: "🧠",
            difficulty: "Продвинутый",
            duration: "25 мин",
            completed: userData.educationProgress?.lessons?.includes(4) || false
        },
        {
            id: 5,
            title: "Антон Чехов",
            description: "Малые формы в русской литературе",
            icon: "🎭",
            difficulty: "Средний",
            duration: "20 мин",
            completed: userData.educationProgress?.lessons?.includes(5) || false
        },
        {
            id: 6,
            title: "Серебряный век русской поэзии",
            description: "Символизм, акмеизм и футуризм",
            icon: "🌟",
            difficulty: "Продвинутый",
            duration: "35 мин",
            completed: userData.educationProgress?.lessons?.includes(6) || false
        }
    ];

    const lessonsGrid = document.getElementById('lessonsGrid');
    lessonsGrid.innerHTML = lessons.map(lesson => `
        <div class="lesson-card ${lesson.completed ? 'completed' : ''}" onclick="startLesson(${lesson.id})">
            <div class="lesson-header">
                <div class="lesson-icon">${lesson.icon}</div>
                <div class="lesson-info">
                    <div class="lesson-title">${lesson.title}</div>
                    <div class="lesson-description">${lesson.description}</div>
                    <div class="lesson-meta">
                        <span class="lesson-difficulty ${lesson.difficulty.toLowerCase()}">${lesson.difficulty}</span>
                        <span class="lesson-duration">⏱️ ${lesson.duration}</span>
                    </div>
                </div>
                ${lesson.completed ? '<div class="lesson-completed">✓ Пройден</div>' : '<div class="lesson-start">▶ Начать</div>'}
            </div>
        </div>
    `).join('');

    document.getElementById('lessonsCount').textContent = `${lessons.length} уроков`;
}

function loadEducationAuthors() {
    const authors = [
        {
            id: 1,
            name: "Александр Пушкин",
            years: "1799-1837",
            description: "Великий русский поэт, основоположник современного русского литературного языка",
            works: ["Евгений Онегин", "Капитанская дочка", "Медный всадник"],
            icon: "👑",
            funFact: "Пушкин написал более 800 произведений"
        },
        {
            id: 2,
            name: "Лев Толстой",
            years: "1828-1910",
            description: "Граф, великий писатель, мыслитель, один из самых известных русских писателей",
            works: ["Война и мир", "Анна Каренина", "Воскресение"],
            icon: "📚",
            funFact: "Толстой переписывал 'Войну и мир' 8 раз"
        },
        {
            id: 3,
            name: "Федор Достоевский",
            years: "1821-1881",
            description: "Русский писатель, философ, мыслитель, один из лучших психологов в мировой литературе",
            works: ["Преступление и наказание", "Идиот", "Братья Карамазовы"],
            icon: "🧠",
            funFact: "Достоевский был приговорен к смертной казни, но помилован"
        },
        {
            id: 4,
            name: "Антон Чехов",
            years: "1860-1904",
            description: "Русский писатель, драматург, один из лучших мастеров короткого рассказа",
            works: ["Чайка", "Вишневый сад", "Дама с собачкой"],
            icon: "🎭",
            funFact: "Чехов был врачом и лечил больных холерой"
        },
        {
            id: 5,
            name: "Максим Горький",
            years: "1868-1936",
            description: "Русский писатель, основоположник литературы социалистического реализма",
            works: ["Мать", "На дне", "Детство"],
            icon: "⚒️",
            funFact: "Настоящее имя - Алексей Пешков"
        },
        {
            id: 6,
            name: "Борис Пастернак",
            years: "1890-1960",
            description: "Русский поэт, писатель, лауреат Нобелевской премии по литературе",
            works: ["Доктор Живаго", "Сестра моя жизнь", "Лирика"],
            icon: "🎗️",
            funFact: "Автор знаменитого романа 'Доктор Живаго'"
        }
    ];

    const authorsGrid = document.getElementById('authorsEducationGrid');
    authorsGrid.innerHTML = authors.map(author => `
        <div class="author-education-card" onclick="showAuthorEducationDetails(${author.id})">
            <div class="author-education-header">
                <div class="author-education-avatar">${author.icon}</div>
                <div class="author-education-info">
                    <div class="author-education-name">${author.name}</div>
                    <div class="author-education-years">${author.years}</div>
                    <div class="author-education-description">${author.description}</div>
                </div>
            </div>
            <div class="author-education-works">
                <strong>Известные произведения:</strong>
                <div class="works-list">
                    ${author.works.map(work => `<span class="work-tag">${work}</span>`).join('')}
                </div>
            </div>
            <div class="author-education-fact">
                <strong>Интересный факт:</strong> ${author.funFact}
            </div>
        </div>
    `).join('');
}

function loadEducationQuizzes() {
    const quizzes = [
        {
            id: 1,
            title: "Пушкин: основы",
            description: "Проверь знания о жизни и творчестве А.С. Пушкина",
            questions: 10,
            difficulty: "Легко",
            icon: "❓",
            completed: userData.educationProgress?.quizzes?.includes(1) || false,
            bestScore: userData.educationProgress?.quizScores?.[1] || 0
        },
        {
            id: 2,
            title: "Русская классика",
            description: "Викторина по произведениям русских классиков",
            questions: 10,
            difficulty: "Средне",
            icon: "📚",
            completed: userData.educationProgress?.quizzes?.includes(2) || false,
            bestScore: userData.educationProgress?.quizScores?.[2] || 0
        },
        {
            id: 3,
            title: "Литературные термины",
            description: "Основные понятия и термины русской литературы",
            questions: 10,
            difficulty: "Средне",
            icon: "📝",
            completed: userData.educationProgress?.quizzes?.includes(3) || false,
            bestScore: userData.educationProgress?.quizScores?.[3] || 0
        },
        {
            id: 4,
            title: "Поэзия Серебряного века",
            description: "Творчество поэтов начала XX века",
            questions: 10,
            difficulty: "Сложно",
            icon: "🌟",
            completed: userData.educationProgress?.quizzes?.includes(4) || false,
            bestScore: userData.educationProgress?.quizScores?.[4] || 0
        },
        {
            id: 5,
            title: "Советская литература",
            description: "Классика советского периода",
            questions: 10,
            difficulty: "Средне",
            icon: "⚒️",
            completed: userData.educationProgress?.quizzes?.includes(5) || false,
            bestScore: userData.educationProgress?.quizScores?.[5] || 0
        }
    ];

    const quizGrid = document.getElementById('quizGrid');
    quizGrid.innerHTML = quizzes.map(quiz => `
        <div class="quiz-card" onclick="startQuiz(${quiz.id})">
            <div class="quiz-header">
                <div class="quiz-icon">${quiz.icon}</div>
                <div class="quiz-info">
                    <div class="quiz-title">${quiz.title}</div>
                    <div class="quiz-description">${quiz.description}</div>
                    <div class="quiz-meta">
                        <span class="quiz-questions">❓ ${quiz.questions} вопросов</span>
                        <span class="quiz-difficulty ${quiz.difficulty.toLowerCase()}">${quiz.difficulty}</span>
                    </div>
                </div>
            </div>
            <div class="quiz-progress">
                ${quiz.completed ? `
                    <div class="quiz-completed">
                        <span class="quiz-score">Лучший результат: ${quiz.bestScore}%</span>
                        <span class="quiz-status">✓ Пройдена</span>
                    </div>
                ` : `
                    <div class="quiz-not-completed">
                        <span class="quiz-start">▶ Пройти викторину</span>
                    </div>
                `}
            </div>
        </div>
    `).join('');
}

function updateEducationProgress() {
    if (!userData.educationProgress) {
        userData.educationProgress = {
            lessons: [],
            quizzes: [],
            quizScores: {},
            authorsViewed: [],
            achievements: []
        };
    }

    const progress = userData.educationProgress;
    document.getElementById('completedLessons').textContent = progress.lessons?.length || 0;
    document.getElementById('completedQuizzes').textContent = progress.quizzes?.length || 0;

    // Рассчитываем средний балл
    const scores = Object.values(progress.quizScores || {});
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    document.getElementById('averageScore').textContent = averageScore + '%';

    document.getElementById('achievementsEarned').textContent = progress.achievements?.length || 0;

    // Обновляем прогресс деталей
    updateProgressDetails();
}

function updateProgressDetails() {
    const progressDetails = document.getElementById('progressDetails');
    const progress = userData.educationProgress;

    let detailsHtml = '<h4>📊 Детальная статистика</h4>';

    if (progress.lessons && progress.lessons.length > 0) {
        detailsHtml += `
            <div class="progress-category">
                <h5>📖 Пройденные уроки:</h5>
                <ul>
                    ${progress.lessons.map(lessonId => {
                        const lessonTitles = {
                            1: "Введение в русскую литературу",
                            2: "Александр Сергеевич Пушкин",
                            3: "Лев Толстой и 'Война и мир'",
                            4: "Федор Достоевский",
                            5: "Антон Чехов",
                            6: "Серебряный век русской поэзии"
                        };
                        return `<li>${lessonTitles[lessonId] || `Урок ${lessonId}`}</li>`;
                    }).join('')}
                </ul>
            </div>
        `;
    }

    if (progress.quizzes && progress.quizzes.length > 0) {
        detailsHtml += `
            <div class="progress-category">
                <h5>❓ Пройденные викторины:</h5>
                <ul>
                    ${progress.quizzes.map(quizId => {
                        const quizTitles = {
                            1: "Пушкин: основы",
                            2: "Русская классика",
                            3: "Литературные термины",
                            4: "Поэзия Серебряного века"
                        };
                        const score = progress.quizScores?.[quizId] || 0;
                        return `<li>${quizTitles[quizId] || `Викторина ${quizId}`} - ${score}%</li>`;
                    }).join('')}
                </ul>
            </div>
        `;
    }

    progressDetails.innerHTML = detailsHtml;
}

function startLesson(lessonId) {
    // Показываем модальное окно с уроком
    const lessons = {
        1: {
            title: "Введение в русскую литературу",
            content: `
                <h3>Исторические этапы русской литературы</h3>
                <p>Русская литература имеет богатую историю, насчитывающую более тысячи лет. Она развивалась параллельно с развитием русского языка и культуры.</p>

                <h4>Основные периоды:</h4>
                <ul>
                    <li><strong>Древнерусская литература (XI-XVII вв.)</strong> - летописи, жития святых, "Слово о полку Игореве"</li>
                    <li><strong>Литература Нового времени (XVIII в.)</strong> - классицизм, сентиментализм</li>
                    <li><strong>Золотой век (первая половина XIX в.)</strong> - Пушкин, Лермонтов, Гоголь</li>
                    <li><strong>Критический реализм (вторая половина XIX в.)</strong> - Толстой, Достоевский, Чехов</li>
                    <li><strong>Серебряный век (начало XX в.)</strong> - символизм, акмеизм, футуризм</li>
                    <li><strong>Советская литература (1917-1991)</strong> - социалистический реализм</li>
                    <li><strong>Современная литература (с 1991 г.)</strong> - разнообразие стилей и направлений</li>
                </ul>

                <h4>Особенности русской литературы:</h4>
                <ul>
                    <li>Глубокий психологизм</li>
                    <li>Социальная направленность</li>
                    <li>Философские проблемы</li>
                    <li>Внимание к внутреннему миру человека</li>
                </ul>
            `
        },
        2: {
            title: "Александр Сергеевич Пушкин",
            content: `
                <h3>Великий русский поэт</h3>
                <p>Александр Сергеевич Пушкин (1799-1837) - основоположник современного русского литературного языка, величайший русский поэт и писатель.</p>

                <h4>Жизнь и творчество:</h4>
                <ul>
                    <li>Родился в Москве в дворянской семье</li>
                    <li>Учился в Царскосельском лицее</li>
                    <li>Написал более 800 произведений</li>
                    <li>Погиб на дуэли в возрасте 37 лет</li>
                </ul>

                <h4>Основные произведения:</h4>
                <ul>
                    <li><strong>Поэзия:</strong> "Я помню чудное мгновенье", "Полтава", "Медный всадник"</li>
                    <li><strong>Поэмы:</strong> "Руслан и Людмила", "Цыганы", "Полтава"</li>
                    <li><strong>Романы:</strong> "Евгений Онегин", "Капитанская дочка"</li>
                    <li><strong>Драма:</strong> "Борис Годунов"</li>
                </ul>

                <h4>Значение для русской литературы:</h4>
                <p>Пушкин создал современный русский литературный язык, заложил основы всех жанров русской литературы, оказал огромное влияние на последующих писателей.</p>
            `
        },
        3: {
            title: "Лев Толстой и 'Война и мир'",
            content: `
                <h3>Граф Лев Николаевич Толстой</h3>
                <p>Лев Николаевич Толстой (1828-1910) - один из величайших писателей мира, граф, мыслитель, педагог.</p>

                <h4>'Война и мир' - величайший роман:</h4>
                <ul>
                    <li>Написан в 1863-1869 годах</li>
                    <li>Состоит из 4 томов и эпилога</li>
                    <li>Более 500 персонажей</li>
                    <li>Объем около 1300 страниц</li>
                </ul>

                <h4>Темы романа:</h4>
                <ul>
                    <li>Исторические события Отечественной войны 1812 года</li>
                    <li>Судьбы дворянских семей (Ростовы, Болконские, Курагины)</li>
                    <li>Любовь и семейная жизнь</li>
                    <li>Поиски смысла жизни</li>
                    <li>Философия истории</li>
                </ul>

                <h4>Особенности стиля:</h4>
                <ul>
                    <li>Эпический размах</li>
                    <li>Детальное описание быта и нравов</li>
                    <li>Психологическая глубина</li>
                    <li>Философские отступления</li>
                </ul>
            `
        },
        4: {
            title: "Федор Достоевский",
            content: `
                <h3>Федор Михайлович Достоевский</h3>
                <p>Федор Михайлович Достоевский (1821-1881) - великий русский писатель, философ, один из лучших психологов в мировой литературе.</p>

                <h4>Жизнь:</h4>
                <ul>
                    <li>Родился в Москве в семье врача</li>
                    <li>Учился в Главном инженерном училище</li>
                    <li>Участник кружка петрашевцев</li>
                    <li>Приговорен к смертной казни, замененной каторгой</li>
                    <li>Отбывал ссылку в Омске и Семипалатинске</li>
                </ul>

                <h4>Основные произведения:</h4>
                <ul>
                    <li>"Преступление и наказание" (1866)</li>
                    <li>"Идиот" (1868-1869)</li>
                    <li>"Бесы" (1871-1872)</li>
                    <li>"Подросток" (1875)</li>
                    <li>"Братья Карамазовы" (1879-1880)</li>
                </ul>

                <h4>Особенности творчества:</h4>
                <ul>
                    <li>Глубокий психологизм</li>
                    <li>Исследование человеческой души</li>
                    <li>Религиозно-философские темы</li>
                    <li>Идея о двойственности человеческой природы</li>
                </ul>
            `
        },
        5: {
            title: "Антон Чехов",
            content: `
                <h3>Антон Павлович Чехов</h3>
                <p>Антон Павлович Чехов (1860-1904) - выдающийся русский писатель, драматург, мастер короткого рассказа.</p>

                <h4>Жизнь и творчество:</h4>
                <ul>
                    <li>Родился в Таганроге</li>
                    <li>Окончил медицинский факультет Московского университета</li>
                    <li>Работал врачом</li>
                    <li>Написал около 300 рассказов и 17 пьес</li>
                </ul>

                <h4>Известные рассказы:</h4>
                <ul>
                    <li>"Толстый и тонкий"</li>
                    <li>"Хамелеон"</li>
                    <li>"Человек в футляре"</li>
                    <li>"Дама с собачкой"</li>
                    <li>"Палата №6"</li>
                    <li>"Студент"</li>
                </ul>

                <h4>Пьесы:</h4>
                <ul>
                    <li>"Чайка" (1896)</li>
                    <li>"Дядя Ваня" (1897)</li>
                    <li>"Три сестры" (1901)</li>
                    <li>"Вишневый сад" (1904)</li>
                </ul>

                <h4>Особенности стиля:</h4>
                <ul>
                    <li>Мастер лаконичного рассказа</li>
                    <li>Подтекст и недосказанность</li>
                    <li>Юмор и ирония</li>
                    <li>Критика социальных пороков</li>
                </ul>
            `
        },
        6: {
            title: "Серебряный век русской поэзии",
            content: `
                <h3>Серебряный век русской литературы</h3>
                <p>Серебряный век - период расцвета русской поэзии и культуры в конце XIX - начале XX века.</p>

                <h4>Основные направления:</h4>
                <ul>
                    <li><strong>Символизм:</strong> Александр Блок, Андрей Белый, Валерий Брюсов</li>
                    <li><strong>Акмеизм:</strong> Анна Ахматова, Осип Мандельштам, Николай Гумилев</li>
                    <li><strong>Футуризм:</strong> Владимир Маяковский, Велимир Хлебников, Алексей Крученых</li>
                </ul>

                <h4>Ключевые фигуры:</h4>
                <ul>
                    <li><strong>Александр Блок</strong> - "Двенадцать", лирика</li>
                    <li><strong>Анна Ахматова</strong> - "Реквием", "Поэма без героя"</li>
                    <li><strong>Борис Пастернак</strong> - "Доктор Живаго", лирика</li>
                    <li><strong>Марина Цветаева</strong> - эмоциональная лирика</li>
                    <li><strong>Владимир Маяковский</strong> - "Облако в штанах", "Флейта позвоночника"</li>
                </ul>

                <h4>Особенности:</h4>
                <ul>
                    <li>Эксперименты с формой и языком</li>
                    <li>Философская глубина</li>
                    <li>Влияние европейских течений</li>
                    <li>Тематическое разнообразие</li>
                </ul>
            `
        }
    };

    const lesson = lessons[lessonId];
    if (!lesson) return;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="lesson-modal">
            <div class="lesson-content">
                ${lesson.content}
            </div>
            <div class="lesson-actions">
                <button class="lesson-complete-btn" onclick="completeLesson(${lessonId})">
                    ✓ Отметить как пройденный
                </button>
            </div>
        </div>
    `;

    document.getElementById('modalTitle').textContent = lesson.title;
    document.getElementById('bookModal').classList.remove('hidden');
    tg.BackButton.show();
}

function completeLesson(lessonId) {
    if (!userData.educationProgress.lessons) {
        userData.educationProgress.lessons = [];
    }

    if (!userData.educationProgress.lessons.includes(lessonId)) {
        userData.educationProgress.lessons.push(lessonId);

        // Начисляем опыт за урок
        handleExperienceAndAchievements(userData, 20); // 20 опыта за урок

        tg.showPopup({
            title: 'Урок пройден! 📚',
            message: 'Поздравляем! Вы успешно изучили новый материал.',
            buttons: [{ type: 'ok' }]
        });
    }

    window.STORAGE.saveAllData(userData);
    loadEducationLessons();
    updateEducationProgress();
    closeModal();
}

function startQuiz(quizId) {
    const quizzes = {
        1: {
            title: "Пушкин: основы",
            questions: [
                {
                    question: "В каком году родился А.С. Пушкин?",
                    options: ["1799", "1800", "1798", "1801"],
                    correct: 0
                },
                {
                    question: "Какое произведение Пушкина считается вершиной русской поэзии?",
                    options: ["Руслан и Людмила", "Евгений Онегин", "Полтава", "Медный всадник"],
                    correct: 1
                },
                {
                    question: "Где учился Пушкин?",
                    options: ["Московский университет", "Царскосельский лицей", "Петербургский университет", "Казанский университет"],
                    correct: 1
                },
                {
                    question: "Какое произведение Пушкин написал последним?",
                    options: ["Капитанская дочка", "Медный всадник", "Пир во время чумы", "Сказка о рыбаке и рыбке"],
                    correct: 1
                },
                {
                    question: "Какой титул носил Пушкин?",
                    options: ["Граф", "Князь", "Барон", "Дворянин"],
                    correct: 3
                },
                {
                    question: "Кто был секундантом Пушкина на дуэли?",
                    options: ["Данзас", "Геккерн", "Дантес", "Николай I"],
                    correct: 0
                },
                {
                    question: "Какое произведение Пушкин написал в ссылке?",
                    options: ["Борис Годунов", "Полтава", "Цыганы", "Медный всадник"],
                    correct: 2
                },
                {
                    question: "Сколько глав в 'Евгении Онегине'?",
                    options: ["6", "8", "10", "12"],
                    correct: 1
                },
                {
                    question: "Какой жанр у произведения 'Медный всадник'?",
                    options: ["Поэма", "Роман", "Повесть", "Сказка"],
                    correct: 0
                },
                {
                    question: "В каком возрасте умер Пушкин?",
                    options: ["35", "37", "39", "41"],
                    correct: 1
                }
            ]
        },
        2: {
            title: "Русская классика",
            questions: [
                {
                    question: "Кто написал 'Войну и мир'?",
                    options: ["Ф.М. Достоевский", "Л.Н. Толстой", "И.С. Тургенев", "А.П. Чехов"],
                    correct: 1
                },
                {
                    question: "Главный герой романа 'Преступление и наказание'?",
                    options: ["Раскольников", "Алеша Карамазов", "Левин", "Обломов"],
                    correct: 0
                },
                {
                    question: "Автор пьесы 'Вишневый сад'?",
                    options: ["М. Горький", "А. Островский", "А.П. Чехов", "А.Н. Островский"],
                    correct: 2
                },
                {
                    question: "Кто написал 'Обломова'?",
                    options: ["И.А. Гончаров", "Н.А. Некрасов", "Ф.И. Тютчев", "А.А. Фет"],
                    correct: 0
                },
                {
                    question: "Главный герой 'Анны Карениной'?",
                    options: ["Анна Каренина", "Левин", "Вронский", "Облонский"],
                    correct: 0
                },
                {
                    question: "Автор 'Ревизора'?",
                    options: ["А.С. Грибоедов", "Н.В. Гоголь", "А.С. Пушкин", "М.Ю. Лермонтов"],
                    correct: 1
                },
                {
                    question: "Кто написал 'Героя нашего времени'?",
                    options: ["А.С. Пушкин", "М.Ю. Лермонтов", "Н.В. Гоголь", "И.С. Тургенев"],
                    correct: 1
                },
                {
                    question: "Автор 'Отцов и детей'?",
                    options: ["Л.Н. Толстой", "Ф.М. Достоевский", "И.С. Тургенев", "Н.Г. Чернышевский"],
                    correct: 2
                },
                {
                    question: "Главный герой 'Идиота' Достоевского?",
                    options: ["Раскольников", "Мышкин", "Алеша Карамазов", "Иван Карамазов"],
                    correct: 1
                },
                {
                    question: "Автор 'Чайки'?",
                    options: ["М. Горький", "А. Островский", "А.П. Чехов", "Л.Н. Толстой"],
                    correct: 2
                }
            ]
        },
        3: {
            title: "Литературные термины",
            questions: [
                {
                    question: "Что такое 'метафора'?",
                    options: ["Сравнение без слов 'как' или 'словно'", "Повтор согласных звуков", "Повтор гласных звуков", "Сравнение с помощью 'как'"],
                    correct: 0
                },
                {
                    question: "Что такое 'эпитет'?",
                    options: ["Художественное определение", "Повтор слов", "Обращение к слушателю", "Вопросительная форма"],
                    correct: 0
                },
                {
                    question: "Что такое 'гипербола'?",
                    options: ["Преувеличение", "Преуменьшение", "Сравнение", "Олицетворение"],
                    correct: 0
                },
                {
                    question: "Что такое 'метонимия'?",
                    options: ["Замена названия на другое, связанное с ним", "Скрытое сравнение", "Повтор одинаковых звуков", "Ритмическая организация речи"],
                    correct: 0
                },
                {
                    question: "Что такое 'сюжет'?",
                    options: ["Последовательность событий в произведении", "Описание внешности героя", "Место действия", "Время действия"],
                    correct: 0
                },
                {
                    question: "Что такое 'композиция'?",
                    options: ["Строение произведения", "Язык произведения", "Стиль автора", "Тема произведения"],
                    correct: 0
                },
                {
                    question: "Что такое 'конфликт'?",
                    options: ["Столкновение противоположных сил", "Описание природы", "Внутренний монолог", "Диалог героев"],
                    correct: 0
                },
                {
                    question: "Что такое 'психологизм'?",
                    options: ["Изображение внутреннего мира героя", "Описание внешних событий", "Юмористический стиль", "Лирическое отступление"],
                    correct: 0
                },
                {
                    question: "Что такое 'аллегория'?",
                    options: ["Иносказание, символическое изображение", "Прямое описание", "Шутка", "Ирония"],
                    correct: 0
                },
                {
                    question: "Что такое 'интрига'?",
                    options: ["Завязка событий, запутанность сюжета", "Развязка событий", "Кульминация", "Экспозиция"],
                    correct: 0
                }
            ]
        },
        4: {
            title: "Поэзия Серебряного века",
            questions: [
                {
                    question: "Кто является основателем акмеизма?",
                    options: ["Александр Блок", "Николай Гумилев", "Владимир Маяковский", "Борис Пастернак"],
                    correct: 1
                },
                {
                    question: "Какое направление представлял Александр Блок?",
                    options: ["Акмеизм", "Символизм", "Футуризм", "Имажинизм"],
                    correct: 1
                },
                {
                    question: "Кто написал поэму 'Облако в штанах'?",
                    options: ["Владимир Маяковский", "Борис Пастернак", "Анна Ахматова", "Марина Цветаева"],
                    correct: 0
                },
                {
                    question: "Какое произведение написал Борис Пастернак?",
                    options: ["Реквием", "Доктор Живаго", "Поэма без героя", "Сестра моя жизнь"],
                    correct: 1
                },
                {
                    question: "Кто написал 'Реквием'?",
                    options: ["Анна Ахматова", "Марина Цветаева", "Белла Ахмадулина", "Зинаида Гиппиус"],
                    correct: 0
                },
                {
                    question: "Какое направление представлял Велимир Хлебников?",
                    options: ["Символизм", "Акмеизм", "Футуризм", "Классицизм"],
                    correct: 2
                },
                {
                    question: "Кто написал 'Я памятник себе воздвиг...'?",
                    options: ["А.С. Пушкин", "М.Ю. Лермонтов", "Ф.И. Тютчев", "А.А. Фет"],
                    correct: 0
                },
                {
                    question: "Какое произведение написал Сергей Есенин?",
                    options: ["Черный человек", "Исповедь хулигана", "Пугачев", "Анна Снегина"],
                    correct: 0
                },
                {
                    question: "Кто написал 'Поэму без героя'?",
                    options: ["Анна Ахматова", "Марина Цветаева", "Белла Ахмадулина", "Зинаида Гиппиус"],
                    correct: 0
                },
                {
                    question: "Какое направление представляла Марина Цветаева?",
                    options: ["Символизм", "Акмеизм", "Футуризм", "Неоромантизм"],
                    correct: 3
                }
            ]
        },
        5: {
            title: "Советская литература",
            questions: [
                {
                    question: "Кто написал роман 'Тихий Дон'?",
                    options: ["Максим Горький", "Михаил Шолохов", "Александр Фадеев", "Константин Симонов"],
                    correct: 1
                },
                {
                    question: "Главный герой романа 'Мать' Горького?",
                    options: ["Павел Власов", "Ниловна", "Рыбин", "Тихон"],
                    correct: 1
                },
                {
                    question: "Кто написал 'Архипелаг ГУЛАГ'?",
                    options: ["Александр Солженицын", "Борис Пастернак", "Иосиф Бродский", "Андрей Сахаров"],
                    correct: 0
                },
                {
                    question: "Какое произведение написал Михаил Булгаков?",
                    options: ["Мастер и Маргарита", "Доктор Живаго", "Один день Ивана Денисовича", "Реквием"],
                    correct: 0
                },
                {
                    question: "Кто написал поэму 'Хорошо!'?",
                    options: ["Владимир Маяковский", "Сергей Есенин", "Борис Пастернак", "Анна Ахматова"],
                    correct: 0
                },
                {
                    question: "Главный герой повести 'Судьба человека' Шолохова?",
                    options: ["Андрей Соколов", "Григорий Мелехов", "Давыдов", "Разметнов"],
                    correct: 0
                },
                {
                    question: "Кто написал 'Как закалялась сталь'?",
                    options: ["Николай Островский", "Александр Фадеев", "Валентин Катаев", "Аркадий Гайдар"],
                    correct: 0
                },
                {
                    question: "Какое произведение написал Константин Паустовский?",
                    options: ["Повести о лесах", "Золотая роза", "Донские рассказы", "Казаки"],
                    correct: 1
                },
                {
                    question: "Кто написал 'Маленького принца'?",
                    options: ["Антуан де Сент-Экзюпери", "Эрнест Хемингуэй", "Фрэнсис Скотт Фицджеральд", "Джон Стейнбек"],
                    correct: 0
                },
                {
                    question: "Какое произведение написал Александр Твардовский?",
                    options: ["Василий Теркин", "Октябрьская поэма", "За далью даль", "Стихи о войне"],
                    correct: 0
                }
            ]
        }
    };

    const quiz = quizzes[quizId];
    if (!quiz) return;

    currentQuiz = {
        id: quizId,
        questions: quiz.questions,
        currentQuestion: 0,
        answers: [],
        startTime: Date.now()
    };

    showQuizQuestion();
}

function showQuizQuestion() {
    const question = currentQuiz.questions[currentQuiz.currentQuestion];
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <div class="quiz-modal">
            <div class="quiz-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(currentQuiz.currentQuestion / currentQuiz.questions.length) * 100}%"></div>
                </div>
                <div class="progress-text">
                    ${currentQuiz.currentQuestion + 1} / ${currentQuiz.questions.length}
                </div>
            </div>
            <div class="quiz-question">
                <h3>${question.question}</h3>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <button class="quiz-option" onclick="selectQuizAnswer(${index})">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    document.getElementById('modalTitle').textContent = `Викторина: ${currentQuiz.questions.length} вопросов`;
    document.getElementById('bookModal').classList.remove('hidden');
    tg.BackButton.show();
}

function selectQuizAnswer(answerIndex) {
    currentQuiz.answers.push(answerIndex);

    if (currentQuiz.currentQuestion < currentQuiz.questions.length - 1) {
        currentQuiz.currentQuestion++;
        showQuizQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    const correctAnswers = currentQuiz.answers.reduce((count, answer, index) => {
        return count + (answer === currentQuiz.questions[index].correct ? 1 : 0);
    }, 0);

    const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100);

    // Сохраняем результат
    if (!userData.educationProgress.quizzes) {
        userData.educationProgress.quizzes = [];
    }
    if (!userData.educationProgress.quizScores) {
        userData.educationProgress.quizScores = {};
    }

    if (!userData.educationProgress.quizzes.includes(currentQuiz.id)) {
        userData.educationProgress.quizzes.push(currentQuiz.id);
    }

    const bestScore = userData.educationProgress.quizScores[currentQuiz.id] || 0;
    if (score > bestScore) {
        userData.educationProgress.quizScores[currentQuiz.id] = score;
    }

    // Начисляем опыт за викторину
    handleExperienceAndAchievements(userData, score >= 80 ? 30 : 15); // 30 опыта за отличный результат, 15 за прохождение

    window.STORAGE.saveAllData(userData);

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="quiz-result">
            <div class="quiz-score">
                <div class="score-circle ${score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'poor'}">
                    ${score}%
                </div>
                <h3>${score >= 80 ? 'Отлично!' : score >= 60 ? 'Хорошо!' : 'Попробуйте еще раз'}</h3>
            </div>
            <div class="quiz-stats">
                <p>Правильных ответов: ${correctAnswers} из ${currentQuiz.questions.length}</p>
                <p>Время: ${Math.round((Date.now() - currentQuiz.startTime) / 1000)} сек</p>
            </div>
            <div class="quiz-actions">
                <button class="quiz-retry-btn" onclick="startQuiz(${currentQuiz.id})">
                    🔄 Пройти еще раз
                </button>
                <button class="quiz-close-btn" onclick="closeModal()">
                    Закрыть
                </button>
            </div>
        </div>
    `;

    loadEducationQuizzes();
    updateEducationProgress();
}

function showAuthorEducationDetails(authorId) {
    const authors = {
        1: {
            name: "Александр Пушкин",
            bio: "Александр Сергеевич Пушкин (1799-1837) - великий русский поэт, драматург и прозаик, основоположник современного русского литературного языка.",
            works: ["Евгений Онегин", "Капитанская дочка", "Медный всадник", "Руслан и Людмила"],
            quotes: [
                "Я помню чудное мгновенье...",
                "Умом Россию не понять...",
                "Чем меньше женщину мы любим, тем легче нравимся мы ей."
            ]
        }
    };

    const author = authors[authorId];
    if (!author) return;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="author-education-details">
            <div class="author-bio">
                <h3>${author.name}</h3>
                <p>${author.bio}</p>
            </div>
            <div class="author-works">
                <h4>Известные произведения:</h4>
                <ul>
                    ${author.works.map(work => `<li>${work}</li>`).join('')}
                </ul>
            </div>
            <div class="author-quotes">
                <h4>Цитаты:</h4>
                ${author.quotes.map(quote => `<blockquote>"${quote}"</blockquote>`).join('')}
            </div>
        </div>
    `;

    document.getElementById('modalTitle').textContent = author.name;
    document.getElementById('bookModal').classList.remove('hidden');
    tg.BackButton.show();
}

// Функции для работы с отзывами

// Глобальные переменные для отзывов
let allReviews = [];
let currentReviewsSort = 'newest';
let currentReviewsBookFilter = '';

// Загрузка секции отзывов
async function loadReviewsSection() {
    try {
        showReviewsLoading(true);

        // Загружаем все отзывы
        allReviews = await fetchReviews();

        // Заполняем фильтр книг
        populateBookFilter();

        // Отображаем отзывы
        displayAllReviews();

        showReviewsLoading(false);
    } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
        showError('Не удалось загрузить отзывы');
        showReviewsLoading(false);
    }
}

// Заполнение фильтра книг
function populateBookFilter() {
    const bookFilter = document.getElementById('reviewsBookFilter');
    if (!bookFilter) return;

    // Получаем уникальные книги из отзывов
    const booksWithReviews = [...new Set(allReviews.map(review => review.bookId))];

    let optionsHtml = '<option value="">Все книги</option>';

    booksWithReviews.forEach(bookId => {
        const book = window.APP_DATA.MOCK_BOOKS.find(b => b.id === bookId);
        if (book) {
            optionsHtml += `<option value="${bookId}">${escapeHtml(book.title)}</option>`;
        }
    });

    bookFilter.innerHTML = optionsHtml;
}

// Отображение всех отзывов
function displayAllReviews() {
    const container = document.getElementById('allReviewsContainer');
    const emptyState = document.getElementById('reviewsEmptyState');
    const countElement = document.getElementById('allReviewsCount');

    if (!allReviews || allReviews.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        if (countElement) countElement.textContent = '0 отзывов';
        return;
    }

    emptyState.classList.add('hidden');

    // Фильтруем отзывы
    let filteredReviews = allReviews.slice();

    // Фильтр по книге
    if (currentReviewsBookFilter) {
        filteredReviews = filteredReviews.filter(review => review.bookId === parseInt(currentReviewsBookFilter));
    }

    // Сортировка
    filteredReviews.sort((a, b) => {
        switch (currentReviewsSort) {
            case 'newest':
                return new Date(b.date) - new Date(a.date);
            case 'oldest':
                return new Date(a.date) - new Date(b.date);
            case 'rating-high':
                return b.rating - a.rating;
            case 'rating-low':
                return a.rating - b.rating;
            case 'most-liked':
                return (b.likes || 0) - (a.likes || 0);
            default:
                return 0;
        }
    });

    // Обновляем счетчик
    const word = getReviewWord(filteredReviews.length);
    if (countElement) countElement.textContent = `${filteredReviews.length} ${word}`;

    // Отображаем отзывы
    container.innerHTML = filteredReviews.map(review => {
        const book = window.APP_DATA.MOCK_BOOKS.find(b => b.id === review.bookId);
        const bookTitle = book ? book.title : 'Неизвестная книга';
        const bookAuthor = book ? book.author : 'Неизвестный автор';

        return `
            <div class="review-card">
                <div class="review-header">
                    <div class="review-user-info">
                        <div class="review-avatar">${review.userAvatar}</div>
                        <div class="review-user-details">
                            <div class="review-user-name">${escapeHtml(review.userName)}</div>
                            <div class="review-book-info">
                                <span class="review-book-title">${escapeHtml(bookTitle)}</span>
                                <span class="review-book-author">${escapeHtml(bookAuthor)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${createRatingStars(review.rating)}
                    </div>
                </div>
                <div class="review-content">
                    <p class="review-text">${escapeHtml(review.comment)}</p>
                </div>
                <div class="review-footer">
                    <div class="review-date">${formatReviewDate(review.date)}</div>
                    <div class="review-actions">
                        <button class="like-review-btn" onclick="likeReview(${review.id})">
                            ❤️ ${review.likes || 0}
                        </button>
                        <button class="view-book-btn" onclick="showBookDetails(${review.bookId})">
                            📖 Посмотреть книгу
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Сортировка отзывов
function sortReviews() {
    const sortSelect = document.getElementById('reviewsSort');
    currentReviewsSort = sortSelect.value;
    displayAllReviews();
}

// Фильтрация отзывов по книге
function filterReviewsByBook() {
    const bookFilter = document.getElementById('reviewsBookFilter');
    currentReviewsBookFilter = bookFilter.value;
    displayAllReviews();
}

// Показать загрузку отзывов
function showReviewsLoading(show) {
    const loading = document.getElementById('reviewsLoading');
    const container = document.getElementById('allReviewsContainer');

    if (show) {
        loading.classList.remove('hidden');
        container.classList.add('hidden');
    } else {
        loading.classList.add('hidden');
        container.classList.remove('hidden');
    }
}

// Получить правильное слово для отзывов
function getReviewWord(count) {
    if (count % 10 === 1 && count % 100 !== 11) return 'отзыв';
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'отзыва';
    return 'отзывов';
}

// Функции для работы с достижениями

let currentAchievementCategory = 'all';

// Загрузка раздела достижений
function loadAchievementsSection() {
    showAchievementsLoading(true);

    // Проверяем новые достижения
    const newAchievements = window.APP_DATA.AchievementSystem.checkAchievements(userData);
    if (newAchievements.length > 0) {
        window.APP_DATA.AchievementSystem.unlockAchievements(userData, newAchievements);
        showAchievementNotification(newAchievements);
        window.STORAGE.saveAllData(userData);
    }

    // Обновляем статистику
    updateAchievementStats();

    // Отображаем достижения
    displayAchievements();

    showAchievementsLoading(false);
}

// Показать категорию достижений
function showAchievementCategory(category) {
    currentAchievementCategory = category;

    // Обновляем активную вкладку
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[onclick="showAchievementCategory('${category}')"]`).classList.add('active');

    displayAchievements();
}

// Отображение достижений
function displayAchievements() {
    const container = document.getElementById('achievementsShowcase');
    const emptyState = document.getElementById('achievementsEmptyState');

    if (!window.APP_DATA.ACHIEVEMENTS) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    let filteredAchievements = window.APP_DATA.ACHIEVEMENTS.slice();

    // Фильтруем по категории
    if (currentAchievementCategory !== 'all') {
        filteredAchievements = filteredAchievements.filter(achievement => achievement.type === currentAchievementCategory);
    }

    // Сортируем: разблокированные сначала
    filteredAchievements.sort((a, b) => {
        const aUnlocked = userData.achievements.some(ua => ua.id === a.id);
        const bUnlocked = userData.achievements.some(ua => ua.id === b.id);

        if (aUnlocked && !bUnlocked) return -1;
        if (!aUnlocked && bUnlocked) return 1;
        return 0;
    });

    if (filteredAchievements.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    container.innerHTML = filteredAchievements.map(achievement => {
        const isUnlocked = userData.achievements.some(a => a.id === achievement.id);
        const unlockedData = userData.achievements.find(a => a.id === achievement.id);

        let rewardText = '';
        if (achievement.reward) {
            const rewards = [];
            if (achievement.reward.exp > 0) rewards.push(`${achievement.reward.exp} опыта`);
            if (achievement.reward.coins > 0) rewards.push(`${achievement.reward.coins} 💎`);
            if (achievement.reward.title) rewards.push(`Титул: ${achievement.reward.title}`);
            if (rewards.length > 0) rewardText = rewards.join(', ');
        }

        const categoryColors = {
            reading: '#4CAF50',
            education: '#2196F3',
            social: '#FF9800',
            special: '#9C27B0',
            meta: '#607D8B',
            pages: '#795548',
            level: '#3F51B5',
            events: '#E91E63',
            reviews: '#00BCD4',
            genres: '#8BC34A',
            collection: '#FF5722',
            performance: '#673AB7'
        };

        const bgColor = categoryColors[achievement.type] || '#9E9E9E';

        return `
            <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}" style="--category-color: ${bgColor}">
                <div class="achievement-header">
                    <div class="achievement-icon" style="background: ${bgColor}">
                        ${isUnlocked ? achievement.icon : '🔒'}
                    </div>
                    <div class="achievement-info">
                        <h4 class="achievement-name">${achievement.name}</h4>
                        <p class="achievement-description">${achievement.description}</p>
                        ${rewardText ? `<div class="achievement-reward">Награда: ${rewardText}</div>` : ''}
                    </div>
                </div>
                <div class="achievement-footer">
                    ${isUnlocked ?
                        `<div class="achievement-unlocked">
                            <span class="unlock-date">Получено: ${formatAchievementDate(unlockedData.unlockedAt)}</span>
                            <div class="achievement-badge">🏆</div>
                        </div>` :
                        `<div class="achievement-locked">
                            <span>🔒 Не получено</span>
                        </div>`
                    }
                </div>
            </div>
        `;
    }).join('');

    // Обновляем счетчик
    const totalCount = `${userData.achievements.length}/${window.APP_DATA.ACHIEVEMENTS.length}`;
    document.getElementById('totalAchievementsCount').textContent = totalCount;
}

// Обновление статистики достижений
function updateAchievementStats() {
    const unlockedCount = userData.achievements.length;
    const totalCoins = userData.achievements.reduce((sum, achievement) => {
        return sum + (achievement.reward?.coins || 0);
    }, 0);
    const totalExp = userData.achievements.reduce((sum, achievement) => {
        return sum + (achievement.reward?.exp || 0);
    }, 0);
    const titlesCount = userData.titles ? userData.titles.length : 0;

    document.getElementById('unlockedAchievements').textContent = unlockedCount;
    document.getElementById('totalCoinsEarned').textContent = totalCoins;
    document.getElementById('totalExpEarned').textContent = totalExp;
    document.getElementById('titlesEarned').textContent = titlesCount;
}

// Показать загрузку достижений
function showAchievementsLoading(show) {
    const loading = document.getElementById('achievementsLoading');
    const container = document.getElementById('achievementsShowcase');

    if (show) {
        loading.classList.remove('hidden');
        container.classList.add('hidden');
    } else {
        loading.classList.add('hidden');
        container.classList.remove('hidden');
    }
}

// Форматирование даты достижения
function formatAchievementDate(dateString) {
    if (!dateString) return 'Неизвестно';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Экспортируем глобальные функции
window.searchBooks = searchBooks;
window.filterByGenre = filterByGenre;
window.showBookDetails = showBookDetails;
window.borrowBook = borrowBook;
window.returnBook = returnBook;
window.toggleFavorite = toggleFavorite;
window.removeFavorite = removeFavorite;
window.showSection = showSection;
window.closeModal = closeModal;
window.clearFilters = clearFilters;
window.likeReview = likeReview;
window.openReviewModal = openReviewModal;
window.closeReviewModal = closeReviewModal;
window.setRating = setRating;
window.updateCharCount = updateCharCount;
window.submitReview = submitReview;
window.toggleTheme = toggleTheme;
window.loadRedBookAnimals = loadRedBookAnimals;
window.showAnimalDetails = showAnimalDetails;
window.loadEvents = loadEvents;
window.showEventDetails = showEventDetails;
window.openBookingModal = openBookingModal;
window.closeEventModal = closeEventModal;
window.closeBookingModal = closeBookingModal;
window.changeTicketCount = changeTicketCount;
window.confirmBooking = confirmBooking;
window.clearAllData = clearAllData;
window.clearAllReviews = clearAllReviews;
window.startReading = startReading;
window.closeReadingModal = closeReadingModal;
window.nextPage = nextPage;
window.previousPage = previousPage;
window.goToPage = goToPage;
window.markPageAsRead = markPageAsRead;
window.finishBook = finishBook;
window.loadGamesSection = loadGamesSection;
window.joinSpecialEvent = joinSpecialEvent;
window.buyShopItem = buyShopItem;
window.handleExperienceAndAchievements = handleExperienceAndAchievements;
window.showAchievementNotification = showAchievementNotification;
window.loadChallenges = loadChallenges;
window.loadAuthors = loadAuthors;
window.completeChallenge = completeChallenge;
window.showAuthorDetails = showAuthorDetails;
window.closeAuthorModal = closeAuthorModal;
window.loadSettings = loadSettings;
window.selectAvatar = selectAvatar;
window.selectBackground = selectBackground;
window.saveSettings = saveSettings;
window.resetSettings = resetSettings;
window.loadTitles = loadTitles;
window.buyTitle = buyTitle;
window.checkAndUnlockTitles = checkAndUnlockTitles;
window.updateInventoryList = updateInventoryList;
window.useInventoryItem = useInventoryItem;
window.claimAchievementReward = claimAchievementReward;
window.loadEducationSection = loadEducationSection;
window.showEducationCategory = showEducationCategory;
window.startLesson = startLesson;
window.completeLesson = completeLesson;
window.startQuiz = startQuiz;
window.selectQuizAnswer = selectQuizAnswer;
window.finishQuiz = finishQuiz;
window.showAuthorEducationDetails = showAuthorEducationDetails;
window.loadReviewsSection = loadReviewsSection;
window.sortReviews = sortReviews;
window.filterReviewsByBook = filterReviewsByBook;
window.loadAchievementsSection = loadAchievementsSection;
window.showAchievementCategory = showAchievementCategory;
window.openAdminModal = openAdminModal;
window.closeAdminModal = closeAdminModal;
window.adminLogin = adminLogin;
window.showAdminTab = showAdminTab;
window.showAddBookForm = showAddBookForm;
window.closeAddBookModal = closeAddBookModal;
window.addBook = addBook;
window.editBook = editBook;
window.closeEditBookModal = closeEditBookModal;
window.updateBook = updateBook;
window.deleteBook = deleteBook;
window.loadBooksAdmin = loadBooksAdmin;
window.loadUsersAdmin = loadUsersAdmin;
window.selectUserForAdmin = selectUserForAdmin;
window.updateUserLevelPreview = updateUserLevelPreview;
window.updateUserExpPreview = updateUserExpPreview;
window.updateUserCoinsPreview = updateUserCoinsPreview;
window.updateUserRolePreview = updateUserRolePreview;
window.applyUserChanges = applyUserChanges;
window.resetUserChanges = resetUserChanges;

// Админ функции
function openAdminModal() {
    document.getElementById('adminModal').classList.remove('hidden');
    if (isAdminLoggedIn) {
        document.getElementById('adminLogin').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        loadBooksAdmin();
        loadUsersAdmin();
    } else {
        document.getElementById('adminLogin').classList.remove('hidden');
        document.getElementById('adminPanel').classList.add('hidden');
    }
}

function closeAdminModal() {
    document.getElementById('adminModal').classList.add('hidden');
}

function adminLogin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const errorEl = document.getElementById('adminError');

    if (username === 'pinkleaf' && password === '1212') {
        isAdminLoggedIn = true;
        errorEl.style.display = 'none';
        document.getElementById('adminLogin').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        loadBooksAdmin();
        loadUsersAdmin();
    } else {
        errorEl.textContent = 'Неверный логин или пароль';
        errorEl.style.display = 'block';
    }
}

function showAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="showAdminTab('${tab}')"]`).classList.add('active');

    document.querySelectorAll('.admin-content').forEach(content => content.classList.add('hidden'));
    document.getElementById('admin' + tab.charAt(0).toUpperCase() + tab.slice(1) + 'Tab').classList.remove('hidden');
}

function loadBooksAdmin() {
    const container = document.getElementById('booksAdminList');
    if (!container) return;

    const books = window.APP_DATA.MOCK_BOOKS || [];
    container.innerHTML = books.map(book => `
        <div class="admin-book-item">
            <div class="book-info">
                <strong>${book.title}</strong> - ${book.author} (${book.genre})
            </div>
            <div class="book-actions">
                <button onclick="editBook(${book.id})" class="edit-btn">✏️ Редактировать</button>
                <button onclick="deleteBook(${book.id})" class="delete-btn">🗑️ Удалить</button>
            </div>
        </div>
    `).join('');
}

let selectedUserForAdmin = 'current'; // 'current' или 'demo'
let originalUserValues = {}; // Для хранения оригинальных значений

async function loadUsersAdmin() {
    const container = document.getElementById('userAdminControls');
    if (!container) return;

    try {
        // Устанавливаем селектор на текущего пользователя по умолчанию
        const selector = document.getElementById('userSelector');
        if (selector) {
            selector.value = selectedUserForAdmin;
        }

        // Получаем выбранного пользователя
        const selectedUser = getSelectedUserForAdmin();

        // Сохраняем оригинальные значения для сброса
        originalUserValues = {
            level: selectedUser.level,
            experience: selectedUser.experience,
            coins: selectedUser.coins,
            role: selectedUser.role
        };

        container.innerHTML = `
            <div class="admin-user-editor">
                <div class="user-info-display">
                    <div class="user-avatar-large">${selectedUser.avatar}</div>
                    <div class="user-details">
                        <h4>${selectedUser.name}</h4>
                        <p>ID: ${selectedUser.telegramId}</p>
                        <p>Регистрация: ${selectedUser.registrationDate}</p>
                    </div>
                </div>

                <div class="user-stats-editor">
                    <div class="stat-editor-group">
                        <label>Уровень:</label>
                        <div class="stat-input-group">
                            <input type="number" id="adminUserLevel" value="${selectedUser.level}" min="1" max="100" oninput="updateUserLevelPreview()">
                            <span class="stat-preview" id="levelPreview">Уровень ${selectedUser.level}</span>
                        </div>
                    </div>

                    <div class="stat-editor-group">
                        <label>Опыт:</label>
                        <div class="stat-input-group">
                            <input type="number" id="adminUserExp" value="${selectedUser.experience}" min="0" oninput="updateUserExpPreview()">
                            <span class="stat-preview" id="expPreview">${selectedUser.experience} XP</span>
                        </div>
                    </div>

                    <div class="stat-editor-group">
                        <label>Кристаллы:</label>
                        <div class="stat-input-group">
                            <input type="number" id="adminUserCoins" value="${selectedUser.coins}" min="0" oninput="updateUserCoinsPreview()">
                            <span class="stat-preview" id="coinsPreview">${selectedUser.coins} 💎</span>
                        </div>
                    </div>

                    <div class="stat-editor-group">
                        <label>Роль:</label>
                        <select id="adminUserRole" onchange="updateUserRolePreview()">
                            <option value="Активный пользователь" ${selectedUser.role === 'Активный пользователь' ? 'selected' : ''}>👤 Активный пользователь</option>
                            <option value="Модератор" ${selectedUser.role === 'Модератор' ? 'selected' : ''}>🛡️ Модератор</option>
                            <option value="Администратор" ${selectedUser.role === 'Администратор' ? 'selected' : ''}>⚙️ Администратор</option>
                            <option value="VIP" ${selectedUser.role === 'VIP' ? 'selected' : ''}>⭐ VIP</option>
                            <option value="Премиум" ${selectedUser.role === 'Премиум' ? 'selected' : ''}>💎 Премиум</option>
                            <option value="Владелец" ${selectedUser.role === 'Владелец' ? 'selected' : ''}>👑 Владелец</option>
                        </select>
                        <div class="role-preview" id="rolePreview">Роль: ${selectedUser.role}</div>
                    </div>
                </div>

                <div class="admin-actions">
                    <button onclick="applyUserChanges()" class="apply-changes-btn">✅ Применить изменения</button>
                    <button onclick="resetUserChanges()" class="reset-changes-btn">🔄 Сбросить</button>
                </div>

                <div class="change-log" id="changeLog">
                    <!-- Лог изменений будет отображаться здесь -->
                </div>
            </div>
        `;

        // Инициализируем превью
        updateUserLevelPreview();
        updateUserExpPreview();
        updateUserCoinsPreview();
        updateUserRolePreview();

    } catch (error) {
        console.error('Ошибка загрузки управления пользователями:', error);
        // В случае ошибки используем демо-данные
        const demoUser = {
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
        };

        originalUserValues = {
            level: demoUser.level,
            experience: demoUser.experience,
            coins: demoUser.coins,
            role: demoUser.role
        };

        container.innerHTML = `
            <div class="admin-user-editor">
                <div class="user-info-display">
                    <div class="user-avatar-large">${demoUser.avatar}</div>
                    <div class="user-details">
                        <h4>${demoUser.name}</h4>
                        <p>ID: ${demoUser.telegramId}</p>
                        <p>Регистрация: ${demoUser.registrationDate}</p>
                    </div>
                </div>

                <div class="user-stats-editor">
                    <div class="stat-editor-group">
                        <label>Уровень:</label>
                        <div class="stat-input-group">
                            <input type="number" id="adminUserLevel" value="${demoUser.level}" min="1" max="100" oninput="updateUserLevelPreview()">
                            <span class="stat-preview" id="levelPreview">Уровень ${demoUser.level}</span>
                        </div>
                    </div>

                    <div class="stat-editor-group">
                        <label>Опыт:</label>
                        <div class="stat-input-group">
                            <input type="number" id="adminUserExp" value="${demoUser.experience}" min="0" oninput="updateUserExpPreview()">
                            <span class="stat-preview" id="expPreview">${demoUser.experience} XP</span>
                        </div>
                    </div>

                    <div class="stat-editor-group">
                        <label>Кристаллы:</label>
                        <div class="stat-input-group">
                            <input type="number" id="adminUserCoins" value="${demoUser.coins}" min="0" oninput="updateUserCoinsPreview()">
                            <span class="stat-preview" id="coinsPreview">${demoUser.coins} 💎</span>
                        </div>
                    </div>

                    <div class="stat-editor-group">
                        <label>Роль:</label>
                        <select id="adminUserRole" onchange="updateUserRolePreview()">
                            <option value="Активный пользователь" ${demoUser.role === 'Активный пользователь' ? 'selected' : ''}>👤 Активный пользователь</option>
                            <option value="Модератор" ${demoUser.role === 'Модератор' ? 'selected' : ''}>🛡️ Модератор</option>
                            <option value="Администратор" ${demoUser.role === 'Администратор' ? 'selected' : ''}>⚙️ Администратор</option>
                            <option value="VIP" ${demoUser.role === 'VIP' ? 'selected' : ''}>⭐ VIP</option>
                            <option value="Премиум" ${demoUser.role === 'Премиум' ? 'selected' : ''}>💎 Премиум</option>
                            <option value="Владелец" ${demoUser.role === 'Владелец' ? 'selected' : ''}>👑 Владелец</option>
                        </select>
                        <div class="role-preview" id="rolePreview">Роль: ${demoUser.role}</div>
                    </div>
                </div>

                <div class="admin-actions">
                    <button onclick="applyUserChanges()" class="apply-changes-btn">✅ Применить изменения</button>
                    <button onclick="resetUserChanges()" class="reset-changes-btn">🔄 Сбросить</button>
                </div>

                <div class="change-log" id="changeLog">
                    <!-- Лог изменений будет отображаться здесь -->
                </div>
            </div>
        `;

        // Инициализируем превью
        updateUserLevelPreview();
        updateUserExpPreview();
        updateUserCoinsPreview();
        updateUserRolePreview();
    }
}

function getSelectedUserForAdmin() {
    if (selectedUserForAdmin === 'current') {
        return userData;
    } else {
        // Возвращаем демо пользователя
        return {
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
        };
    }
}

function selectUserForAdmin() {
    const selector = document.getElementById('userSelector');
    selectedUserForAdmin = selector.value;
    loadUsersAdmin();
}

function updateUserLevelPreview() {
    const level = parseInt(document.getElementById('adminUserLevel').value) || 1;
    document.getElementById('levelPreview').textContent = `Уровень ${level}`;
}

function updateUserExpPreview() {
    const exp = parseInt(document.getElementById('adminUserExp').value) || 0;
    document.getElementById('expPreview').textContent = `${exp} XP`;
}

function updateUserCoinsPreview() {
    const coins = parseInt(document.getElementById('adminUserCoins').value) || 0;
    document.getElementById('coinsPreview').textContent = `${coins} 💎`;
}

function updateUserRolePreview() {
    const role = document.getElementById('adminUserRole').value;
    const rolePreview = document.getElementById('rolePreview');
    rolePreview.textContent = `Роль: ${role}`;

    // Обновляем класс для цвета роли
    function getRoleClass(role) {
        switch(role) {
            case 'Активный пользователь': return 'role-active';
            case 'Модератор': return 'role-moderator';
            case 'Администратор': return 'role-admin';
            case 'VIP': return 'role-vip';
            case 'Премиум': return 'role-premium';
            case 'Владелец': return 'role-owner';
            default: return 'role-active';
        }
    }
    rolePreview.className = 'role-preview ' + getRoleClass(role);
}

function applyUserChanges() {
    const level = parseInt(document.getElementById('adminUserLevel').value) || 1;
    const exp = parseInt(document.getElementById('adminUserExp').value) || 0;
    const coins = parseInt(document.getElementById('adminUserCoins').value) || 0;
    const role = document.getElementById('adminUserRole').value;

    const selectedUser = getSelectedUserForAdmin();
    const oldValues = {
        level: selectedUser.level,
        experience: selectedUser.experience,
        coins: selectedUser.coins,
        role: selectedUser.role
    };

    // Применяем изменения
    if (selectedUserForAdmin === 'current') {
        // Обновляем текущего пользователя
        userData.level = level;
        userData.experience = exp;
        userData.coins = coins;
        userData.role = role;

        // Рассчитываем experienceToNext
        if (window.APP_DATA && window.APP_DATA.LevelSystem) {
            userData.experienceToNext = window.APP_DATA.LevelSystem.getExperienceToNextLevel(exp);
        } else {
            userData.experienceToNext = 100; // Дефолтное значение
        }

        // Сохраняем данные
        if (window.STORAGE) {
            window.STORAGE.saveAllData(userData);
        }

        // Обновляем профиль в реальном времени
        updateUserProfile();
        updateStats(calculateStats());
    }

    // Логируем изменения
    logUserChanges(oldValues, { level, experience: exp, coins, role });

    // Показываем уведомление
    tg.showPopup({
        title: '✅ Изменения применены',
        message: 'Данные пользователя успешно обновлены!',
        buttons: [{ type: 'ok' }]
    });

    // Перезагружаем интерфейс
    loadUsersAdmin();
}

function resetUserChanges() {
    // Возвращаем значения к оригинальным
    document.getElementById('adminUserLevel').value = originalUserValues.level;
    document.getElementById('adminUserExp').value = originalUserValues.experience;
    document.getElementById('adminUserCoins').value = originalUserValues.coins;
    document.getElementById('adminUserRole').value = originalUserValues.role;

    // Обновляем превью
    updateUserLevelPreview();
    updateUserExpPreview();
    updateUserCoinsPreview();
    updateUserRolePreview();

    // Очищаем лог изменений
    const changeLog = document.getElementById('changeLog');
    if (changeLog) {
        changeLog.innerHTML = '';
    }
}

function logUserChanges(oldValues, newValues) {
    const logContainer = document.getElementById('changeLog');
    if (!logContainer) return;

    let changes = [];
    if (oldValues.level !== newValues.level) {
        changes.push(`Уровень: ${oldValues.level} → ${newValues.level}`);
    }
    if (oldValues.experience !== newValues.experience) {
        changes.push(`Опыт: ${oldValues.experience} → ${newValues.experience}`);
    }
    if (oldValues.coins !== newValues.coins) {
        changes.push(`Кристаллы: ${oldValues.coins} → ${newValues.coins}`);
    }
    if (oldValues.role !== newValues.role) {
        changes.push(`Роль: ${oldValues.role} → ${newValues.role}`);
    }

    if (changes.length > 0) {
        const timestamp = new Date().toLocaleTimeString('ru-RU');
        logContainer.innerHTML = `
            <div class="change-entry">
                <div class="change-time">${timestamp}</div>
                <div class="change-details">${changes.join(', ')}</div>
            </div>
        ` + logContainer.innerHTML;
    }
}

function showAddBookForm() {
    document.getElementById('addBookModal').classList.remove('hidden');
}

function closeAddBookModal() {
    document.getElementById('addBookModal').classList.add('hidden');
}

function addBook() {
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const genre = document.getElementById('bookGenre').value;
    const year = parseInt(document.getElementById('bookYear').value);
    const description = document.getElementById('bookDescription').value;
    const pages = parseInt(document.getElementById('bookPages').value);
    const rating = parseFloat(document.getElementById('bookRating').value);
    const icon = document.getElementById('bookIcon').value;

    if (!title || !author || !genre || !year || !description || !pages || !rating || !icon) {
        alert('Заполните все поля');
        return;
    }

    const newBook = {
        id: Date.now(), // Простой ID
        title,
        author,
        year,
        genre,
        description,
        pages,
        rating,
        icon,
        available: true,
        reviewsCount: 0
    };

    window.APP_DATA.MOCK_BOOKS.push(newBook);
    localStorage.setItem('books', JSON.stringify(window.APP_DATA.MOCK_BOOKS));
    const stats = calculateStats();
    updateStats(stats);
    window.APP_DATA.MOCK_STATS = stats;
    loadBooksAdmin();
    closeAddBookModal();

    // Очистить форму
    document.getElementById('bookTitle').value = '';
    document.getElementById('bookAuthor').value = '';
    document.getElementById('bookGenre').value = '';
    document.getElementById('bookYear').value = '';
    document.getElementById('bookDescription').value = '';
    document.getElementById('bookPages').value = '';
    document.getElementById('bookRating').value = '';
    document.getElementById('bookIcon').value = '';
}

function editBook(bookId) {
    const book = window.APP_DATA.MOCK_BOOKS.find(b => b.id === bookId);
    if (!book) return;

    document.getElementById('editBookId').value = book.id;
    document.getElementById('editBookTitle').value = book.title;
    document.getElementById('editBookAuthor').value = book.author;
    document.getElementById('editBookGenre').value = book.genre;
    document.getElementById('editBookYear').value = book.year;
    document.getElementById('editBookDescription').value = book.description;
    document.getElementById('editBookPages').value = book.pages;
    document.getElementById('editBookRating').value = book.rating;
    document.getElementById('editBookIcon').value = book.icon;

    document.getElementById('editBookModal').classList.remove('hidden');
}

function closeEditBookModal() {
    document.getElementById('editBookModal').classList.add('hidden');
}

function updateBook() {
    const id = parseInt(document.getElementById('editBookId').value);
    const title = document.getElementById('editBookTitle').value;
    const author = document.getElementById('editBookAuthor').value;
    const genre = document.getElementById('editBookGenre').value;
    const year = parseInt(document.getElementById('editBookYear').value);
    const description = document.getElementById('editBookDescription').value;
    const pages = parseInt(document.getElementById('editBookPages').value);
    const rating = parseFloat(document.getElementById('editBookRating').value);
    const icon = document.getElementById('editBookIcon').value;

    if (!title || !author || !genre || !year || !description || !pages || !rating || !icon) {
        alert('Заполните все поля');
        return;
    }

    const bookIndex = window.APP_DATA.MOCK_BOOKS.findIndex(b => b.id === id);
    if (bookIndex === -1) return;

    window.APP_DATA.MOCK_BOOKS[bookIndex] = {
        ...window.APP_DATA.MOCK_BOOKS[bookIndex],
        title,
        author,
        genre,
        year,
        description,
        pages,
        rating,
        icon
    };

    localStorage.setItem('books', JSON.stringify(window.APP_DATA.MOCK_BOOKS));
    const stats = calculateStats();
    updateStats(stats);
    window.APP_DATA.MOCK_STATS = stats;
    loadBooksAdmin();
    closeEditBookModal();
}

function deleteBook(bookId) {
    if (confirm('Вы уверены, что хотите удалить эту книгу?')) {
        window.APP_DATA.MOCK_BOOKS = window.APP_DATA.MOCK_BOOKS.filter(book => book.id !== bookId);
        localStorage.setItem('books', JSON.stringify(window.APP_DATA.MOCK_BOOKS));
        const stats = calculateStats();
        updateStats(stats);
        window.APP_DATA.MOCK_STATS = stats;
        loadBooksAdmin();
    }
}
