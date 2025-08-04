import { createTheme, Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Custom color palette
const primaryColor = '#2563eb'; // Modern blue
const secondaryColor = '#7c3aed'; // Purple
const successColor = '#059669'; // Green
const warningColor = '#d97706'; // Orange
const errorColor = '#dc2626'; // Red

export const createAppTheme = (mode: 'light' | 'dark'): Theme => {
  const isLight = mode === 'light';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: primaryColor,
        light: '#60a5fa',
        dark: '#1d4ed8',
        contrastText: '#ffffff',
      },
      secondary: {
        main: secondaryColor,
        light: '#a78bfa',
        dark: '#5b21b6',
        contrastText: '#ffffff',
      },
      success: {
        main: successColor,
        light: '#34d399',
        dark: '#047857',
      },
      warning: {
        main: warningColor,
        light: '#fbbf24',
        dark: '#92400e',
      },
      error: {
        main: errorColor,
        light: '#f87171',
        dark: '#991b1b',
      },
      background: {
        default: isLight ? '#f8fafc' : '#0f172a',
        paper: isLight ? '#ffffff' : '#1e293b',
      },
      text: {
        primary: isLight ? '#1e293b' : '#f1f5f9',
        secondary: isLight ? '#64748b' : '#94a3b8',
      },
      divider: isLight ? alpha('#e2e8f0', 0.8) : alpha('#334155', 0.8),
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '3rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: '2.25rem',
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: '1.875rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: isLight 
              ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
              : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            minHeight: '100vh',
          },
          '#root': {
            minHeight: '100vh',
            background: isLight 
              ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
              : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: isLight 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
            border: isLight 
              ? '1px solid rgba(226, 232, 240, 0.8)'
              : '1px solid rgba(51, 65, 85, 0.8)',
            borderRadius: 16,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: isLight
                ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                : '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            fontWeight: 600,
            textTransform: 'none',
            padding: '10px 24px',
            fontSize: '0.95rem',
            transition: 'all 0.2s ease-in-out',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: isLight 
                ? '0 4px 12px rgba(0, 0, 0, 0.15)'
                : '0 4px 12px rgba(0, 0, 0, 0.4)',
              transform: 'translateY(-1px)',
            },
          },
          contained: {
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${alpha(primaryColor, 0.8)} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${alpha(primaryColor, 0.9)} 0%, ${alpha(primaryColor, 0.7)} 100%)`,
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: primaryColor,
                },
              },
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderWidth: 2,
                  borderColor: primaryColor,
                },
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isLight 
              ? `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
              : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            boxShadow: isLight
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            borderBottom: isLight 
              ? 'none'
              : '1px solid rgba(51, 65, 85, 0.8)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: isLight 
              ? 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
              : 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            borderRight: isLight 
              ? '1px solid rgba(226, 232, 240, 0.8)'
              : '1px solid rgba(51, 65, 85, 0.8)',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            margin: '4px 8px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              background: alpha(primaryColor, 0.08),
              transform: 'translateX(4px)',
            },
            '&.Mui-selected': {
              background: `linear-gradient(135deg, ${alpha(primaryColor, 0.15)} 0%, ${alpha(secondaryColor, 0.15)} 100%)`,
              color: primaryColor,
              '&:hover': {
                background: `linear-gradient(135deg, ${alpha(primaryColor, 0.2)} 0%, ${alpha(secondaryColor, 0.2)} 100%)`,
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
};

// Default theme (light mode)
export const theme = createAppTheme('light');
export default theme; 