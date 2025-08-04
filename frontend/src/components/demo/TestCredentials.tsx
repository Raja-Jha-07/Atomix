import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { ExpandMore, ExpandLess, ContentCopy } from '@mui/icons-material';

interface TestUser {
  email: string;
  password: string;
  role: string;
  description: string;
}

const testUsers: TestUser[] = [
  {
    email: 'admin@atomix.com',
    password: 'password123',
    role: 'ADMIN',
    description: 'Full system access, can manage all users and settings',
  },
  {
    email: 'manager@atomix.com',
    password: 'manager123',
    role: 'CAFETERIA_MANAGER',
    description: 'Can manage cafeteria operations, view analytics, manage vendors',
  },
  {
    email: 'vendor@atomix.com',
    password: 'password123',
    role: 'VENDOR',
    description: 'Can manage their own menu items and view orders',
  },
  {
    email: 'employee@atomix.com',
    password: 'password123',
    role: 'EMPLOYEE',
    description: 'Can browse menu, place orders, view order history',
  },
];

const TestCredentials: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  const handleCopyCredentials = (email: string, password: string) => {
    navigator.clipboard.writeText(`${email} / ${password}`);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'CAFETERIA_MANAGER':
        return 'warning';
      case 'VENDOR':
        return 'info';
      case 'EMPLOYEE':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ mt: 2, border: '2px dashed #ccc' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" color="textSecondary">
            🧪 Demo Test Credentials
          </Typography>
          <Button
            endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
            onClick={() => setExpanded(!expanded)}
            color="primary"
          >
            {expanded ? 'Hide' : 'Show'} Test Users
          </Button>
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Use these pre-configured accounts to test different user roles:
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Password</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {testUsers.map((user) => (
                    <TableRow key={user.email}>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {user.password}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={getRoleColor(user.role) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {user.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleCopyCredentials(user.email, user.password)}
                          title="Copy credentials"
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              💡 Tip: Click the copy icon to copy email/password, then paste in the login form
            </Typography>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default TestCredentials; 