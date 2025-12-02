import { createContext } from 'react';

export const ThemeContext = createContext({
  theme: 'light',
  customColors: {
    primary: '#667eea',
    secondary: '#764ba2'
  },
  settings: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 16,
    readingFontSize: 1.1,
    readingLineHeight: 1.6,
    readingFontFamily: 'Georgia, serif'
  },
  toggleTheme: () => {},
  updateCustomColors: () => {},
  updateSettings: () => {},
});