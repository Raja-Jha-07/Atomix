import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CircularProgress, Box, Typography, Alert } from '@mui/material';
import { useAppDispatch } from '../../hooks/redux';
import { setCredentials } from '../../store/slices/authSlice';

const OAuth2RedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (error) {
      // Handle error - could redirect to login page with error message
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            error: 'OAuth2 authentication failed. Please try again.'
          }
        });
      }, 3000);
      return;
    }

    if (token && refreshToken) {
      // Store tokens and navigate to dashboard
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Decode token to get user info (optional - you might want to fetch user info separately)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userInfo = {
          token,
          refreshToken,
          user: {
            id: payload.sub,
            email: payload.email || payload.sub,
            firstName: payload.given_name || 'User',
            lastName: payload.family_name || '',
            role: payload.role || 'EMPLOYEE'
          }
        };
        
        dispatch(setCredentials(userInfo));
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Error parsing token:', err);
        navigate('/login', { 
          state: { 
            error: 'Authentication failed. Please try again.'
          }
        });
      }
    } else {
      // No token received
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            error: 'No authentication token received. Please try again.'
          }
        });
      }, 3000);
    }
  }, [searchParams, navigate, dispatch]);

  const error = searchParams.get('error');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      {error ? (
        <Alert severity="error" sx={{ mb: 2, maxWidth: 400 }}>
          <Typography variant="h6" gutterBottom>
            Authentication Failed
          </Typography>
          <Typography variant="body2">
            {error === 'authentication_failed' 
              ? 'OAuth2 authentication failed. Please try again.'
              : 'An error occurred during authentication. Please try again.'}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Redirecting to login page...
          </Typography>
        </Alert>
      ) : (
        <>
          <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
            Completing sign in...
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', opacity: 0.8 }}>
            Please wait while we finish setting up your account.
          </Typography>
        </>
      )}
    </Box>
  );
};

export default OAuth2RedirectHandler;
