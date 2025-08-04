import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { createAppTheme } from '../theme/theme';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (darkMode: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme from localStorage or default to light mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('atomix-theme');
    return savedTheme === 'dark';
  });

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('atomix-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const setDarkMode = (darkMode: boolean) => {
    setIsDarkMode(darkMode);
  };

  const theme = createAppTheme(isDarkMode ? 'dark' : 'light');

  const value = {
    isDarkMode,
    toggleTheme,
    setDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 