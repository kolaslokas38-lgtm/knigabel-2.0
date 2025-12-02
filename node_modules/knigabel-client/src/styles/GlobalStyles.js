import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    /* Primary Colors */
    --primary: #6366F1;
    --primary-dark: #4F46E5;
    --primary-light: #8B5CF6;
    --secondary: #10B981;
    --secondary-dark: #059669;
    --accent: #F59E0B;
    --accent-dark: #D97706;

    /* Status Colors */
    --success: #10B981;
    --error: #EF4444;
    --warning: #F59E0B;
    --info: #06B6D4;

    /* Neutral Colors */
    --white: #FFFFFF;
    --black: #000000;
    --gray-50: #F8FAFC;
    --gray-100: #F1F5F9;
    --gray-200: #E2E8F0;
    --gray-300: #CBD5E1;
    --gray-400: #94A3B8;
    --gray-500: #64748B;
    --gray-600: #475569;
    --gray-700: #334155;
    --gray-800: #1E293B;
    --gray-900: #0F172A;

    /* Spacing */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-2xl: 48px;
    --spacing-3xl: 64px;

    /* Border Radius */
    --radius-sm: 6px;
    --radius: 12px;
    --radius-lg: 16px;
    --radius-xl: 20px;
    --radius-2xl: 24px;
    --radius-full: 50%;

    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

    /* Transitions */
    --transition-fast: 150ms ease-in-out;
    --transition-normal: 250ms ease-in-out;
    --transition-slow: 350ms ease-in-out;

    /* Typography */
    --font-size-xs: 12px;
    --font-size-sm: 14px;
    --font-size-base: 16px;
    --font-size-lg: 18px;
    --font-size-xl: 20px;
    --font-size-2xl: 24px;
    --font-size-3xl: 30px;
    --font-size-4xl: 36px;
    --font-size-5xl: 48px;

    --font-weight-light: 300;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    --font-weight-extrabold: 800;

    --line-height-tight: 1.25;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.75;

    /* Z-index */
    --z-dropdown: 1000;
    --z-sticky: 1020;
    --z-fixed: 1030;
    --z-modal-backdrop: 1040;
    --z-modal: 1050;
    --z-popover: 1060;
    --z-tooltip: 1070;
    --z-toast: 1080;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${props => props.theme.fontFamily || "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"};
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
    line-height: var(--line-height-normal);
    font-size: ${props => props.theme.fontSize ? `${props.theme.fontSize}px` : 'var(--font-size-base)'};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color var(--transition-normal), color var(--transition-normal);
  }

  /* Reading styles */
  .reading-content {
    font-family: ${props => props.theme.readingFontFamily || 'Georgia, serif'};
    font-size: ${props => props.theme.readingFontSize ? `${props.theme.readingFontSize}rem` : '1.1rem'};
    line-height: ${props => props.theme.readingLineHeight || '1.6'};
  }

  #root {
    min-height: 100vh;
  }

  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
    padding: var(--spacing-lg);
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.backgroundSecondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: var(--radius-full);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.textLight};
  }

  /* Selection */
  ::selection {
    background: ${props => props.theme.primary};
    color: white;
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid ${props => props.theme.primary};
    outline-offset: 2px;
  }

  /* Button reset */
  button {
    font-family: inherit;
    border: none;
    background: none;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  /* Input reset */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    border: 1px solid ${props => props.theme.border};
    border-radius: var(--radius);
    padding: var(--spacing-sm) var(--spacing-md);
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
    transition: all var(--transition-fast);
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  /* Link styles */
  a {
    color: ${props => props.theme.primary};
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  a:hover {
    color: ${props => props.theme.primaryDark};
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .container-fluid {
    width: 100%;
    padding-left: var(--spacing-lg);
    padding-right: var(--spacing-lg);
    margin-left: auto;
    margin-right: auto;
  }

  .container {
    max-width: 1200px;
    padding-left: var(--spacing-lg);
    padding-right: var(--spacing-lg);
    margin-left: auto;
    margin-right: auto;
  }

  /* Animation keyframes */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
      transform: translate3d(0, 0, 0);
    }
    40%, 43% {
      transform: translate3d(0, -30px, 0);
    }
    70% {
      transform: translate3d(0, -15px, 0);
    }
    90% {
      transform: translate3d(0, -4px, 0);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Responsive breakpoints */
  @media (max-width: 768px) {
    .main-content {
      padding: var(--spacing-md);
    }

    .container {
      padding-left: var(--spacing-md);
      padding-right: var(--spacing-md);
    }
  }

  @media (max-width: 480px) {
    .main-content {
      padding: var(--spacing-sm);
    }

    .container {
      padding-left: var(--spacing-sm);
      padding-right: var(--spacing-sm);
    }
  }

  /* Print styles */
  @media print {
    body {
      background: white !important;
      color: black !important;
    }

    .no-print {
      display: none !important;
    }
  }
`;

export default GlobalStyles;