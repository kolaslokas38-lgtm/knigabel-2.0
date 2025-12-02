import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
axios.defaults.timeout = 10000;

// Add request interceptor for authentication
axios.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const initializeApp = async () => {
  try {
    // Fetch initial library data
    const [booksResponse, genresResponse, statsResponse] = await Promise.all([
      axios.get('/api/books'),
      axios.get('/api/genres'),
      axios.get('/api/stats')
    ]);

    return {
      books: booksResponse.data.books || [],
      genres: genresResponse.data || [],
      stats: statsResponse.data || {},
      pagination: booksResponse.data.pagination || null
    };
  } catch (error) {
    console.error('Failed to initialize app:', error);

    // Return mock data if API is not available
    return {
      books: [],
      genres: ['Все жанры', 'Роман-эпопея', 'Фантастика', 'Детектив'],
      stats: {
        totalBooks: 0,
        availableBooks: 0,
        borrowedBooks: 0,
        totalGenres: 4
      }
    };
  }
};

export const apiService = {
  // Books
  getBooks: (params = {}) => axios.get('/api/books', { params }),
  getBook: (id) => axios.get(`/api/books/${id}`),
  getBookContent: (id) => axios.get(`/api/books/${id}/content`),
  searchBooks: (query) => axios.get('/api/books/search', { params: { q: query } }),
  filterBooks: (genre) => axios.get('/api/books/filter', { params: { genre } }),
  borrowBook: (id) => axios.post(`/api/books/borrow/${id}`),
  returnBook: (id) => axios.post(`/api/books/return/${id}`),

  // Genres
  getGenres: () => axios.get('/api/genres'),

  // Stats
  getStats: () => axios.get('/api/stats'),

  // Reviews
  getReviews: () => axios.get('/api/reviews'),
  getBookReviews: (bookId) => axios.get(`/api/reviews/book/${bookId}`),
  addReview: (reviewData) => axios.post('/api/reviews', reviewData),
  deleteReview: (id, userId) => axios.delete(`/api/reviews/${id}`, { data: { userId } }),
  likeReview: (id) => axios.post(`/api/reviews/${id}/like`),

  // Users
  getUsers: () => axios.get('/api/users'),
  getUser: (id) => axios.get(`/api/users/${id}`),
  updateUser: (id, userData) => axios.put(`/api/users/${id}`, userData),
  createUser: (userData) => axios.post('/api/users', userData),

  // Authentication (if implemented)
  login: (credentials) => axios.post('/api/auth/login', credentials),
  register: (userData) => axios.post('/api/auth/register', userData),
  logout: () => axios.post('/api/auth/logout'),
};

export default apiService;