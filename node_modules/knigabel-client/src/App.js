// src/App.js
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

// Context
import { ThemeContext } from './context/ThemeContext';
import { UserContext } from './context/UserContext';
import { LibraryContext } from './context/LibraryContext';

// Styles
import GlobalStyles from './styles/GlobalStyles';
import { lightTheme, darkTheme } from './styles/themes';

// Utils
import { getStoredTheme, getStoredUser, initializeStorageSync } from './utils/storage';

// Pages (Lazy loaded for better performance)
const Catalog = lazy(() => import('./pages/Catalog/Catalog'));
const Authors = lazy(() => import('./pages/Authors/Authors'));
const Education = lazy(() => import('./pages/Education/Education'));
const Games = lazy(() => import('./pages/Games/Games'));
const Events = lazy(() => import('./pages/Events/Events'));
const RedBook = lazy(() => import('./pages/RedBook/RedBook'));
const Reviews = lazy(() => import('./pages/Reviews/Reviews'));
const Achievements = lazy(() => import('./pages/Achievements/Achievements'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const BookReader = lazy(() => import('./pages/BookReader/BookReader'));
const AdminPanel = lazy(() => import('./pages/AdminPanel/AdminPanel'));
const Analytics = lazy(() => import('./components/Analytics/Analytics'));
const Settings = lazy(() => import('./pages/Settings/Settings'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [theme, setTheme] = useState(getStoredTheme());
  const [customColors, setCustomColors] = useState({
    primary: '#667eea',
    secondary: '#764ba2'
  });
  const [customSettings, setCustomSettings] = useState({
    fontFamily: 'Inter, sans-serif',
    fontSize: 16,
    readingFontSize: 1.1,
    readingLineHeight: 1.6,
    readingFontFamily: 'Georgia, serif'
  });
  const [user, setUser] = useState(getStoredUser());
  const [libraryData, setLibraryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('catalog');

  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize storage sync for real-time saving
        initializeStorageSync();

        // Mock library data for now
        const mockData = {
          stats: {
            totalBooks: 50,
            availableBooks: 45,
            totalGenres: 16
          },
          books: [],
          genres: []
        };
        setLibraryData(mockData);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const updateCustomColors = (colors) => {
    setCustomColors(colors);
    localStorage.setItem('customColors', JSON.stringify(colors));
  };

  const updateCustomSettings = (settings) => {
    setCustomSettings(settings);
    localStorage.setItem('customSettings', JSON.stringify(settings));
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    // Update custom settings from user settings
    if (userData.settings) {
      if (userData.settings.primaryColor && userData.settings.secondaryColor) {
        updateCustomColors({
          primary: userData.settings.primaryColor,
          secondary: userData.settings.secondaryColor
        });
      }
      if (userData.settings.fontFamily || userData.settings.fontSize ||
          userData.settings.readingFontSize || userData.settings.readingLineHeight ||
          userData.settings.readingFontFamily) {
        updateCustomSettings({
          fontFamily: userData.settings.fontFamily || customSettings.fontFamily,
          fontSize: userData.settings.fontSize || customSettings.fontSize,
          readingFontSize: userData.settings.readingFontSize || customSettings.readingFontSize,
          readingLineHeight: userData.settings.readingLineHeight || customSettings.readingLineHeight,
          readingFontFamily: userData.settings.readingFontFamily || customSettings.readingFontFamily
        });
      }
    }
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <GlobalStyles />
        <LoadingSpinner fullScreen />
      </ThemeProvider>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeContext.Provider value={{
          theme,
          customColors,
          settings: customSettings,
          toggleTheme,
          updateCustomColors,
          updateSettings: updateCustomSettings
        }}>
          <UserContext.Provider value={{ user, updateUser }}>
            <LibraryContext.Provider value={{ libraryData, setLibraryData }}>
              <ThemeProvider theme={{
                ...((theme === 'light' ? lightTheme : darkTheme)),
                primary: customColors.primary,
                accent: customColors.secondary,
                fontFamily: customSettings.fontFamily,
                fontSize: customSettings.fontSize,
                readingFontSize: customSettings.readingFontSize,
                readingLineHeight: customSettings.readingLineHeight,
                readingFontFamily: customSettings.readingFontFamily
              }}>
                <GlobalStyles />
                <Router>
                  <div className="app">
                    <Header />
                    <Navigation />

                    <main className="main-content">
                      <AnimatePresence mode="wait">
                        <Suspense fallback={<LoadingSpinner />}>
                          <Routes>
                            <Route path="/" element={<Navigate to="/catalog" replace />} />
                            <Route path="/catalog" element={<Catalog />} />
                            <Route path="/authors" element={<Authors />} />
                            <Route path="/education" element={<Education />} />
                            <Route path="/games" element={<Games />} />
                            <Route path="/events" element={<Events />} />
                            <Route path="/redbook" element={<RedBook />} />
                            <Route path="/reviews" element={<Reviews />} />
                            <Route path="/achievements" element={<Achievements />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/book/:id" element={<BookReader />} />
                            <Route path="/admin" element={<AdminPanel />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="*" element={<Navigate to="/catalog" replace />} />
                          </Routes>
                        </Suspense>
                      </AnimatePresence>
                    </main>

                    <Toaster
                      position="top-right"
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: theme === 'light' ? '#fff' : '#1e293b',
                          color: theme === 'light' ? '#1e293b' : '#fff',
                          border: `1px solid ${theme === 'light' ? '#e2e8f0' : '#334155'}`,
                        },
                      }}
                    />
                  </div>
                </Router>
              </ThemeProvider>
            </LibraryContext.Provider>
          </UserContext.Provider>
        </ThemeContext.Provider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;