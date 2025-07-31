import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Chip,
} from '@mui/material';
import { Add, Restaurant } from '@mui/icons-material';

const MenuPage: React.FC = () => {
  const menuItems = [
    {
      id: '1',
      name: 'Chicken Biryani',
      description: 'Fragrant basmati rice with tender chicken pieces',
      price: 180,
      category: 'Main Course',
      imageUrl: '/api/placeholder/300/200',
      isAvailable: true,
      prepTime: 25,
    },
    {
      id: '2',
      name: 'Paneer Butter Masala',
      description: 'Creamy tomato curry with cottage cheese',
      price: 140,
      category: 'Main Course',
      imageUrl: '/api/placeholder/300/200',
      isAvailable: true,
      prepTime: 15,
    },
    {
      id: '3',
      name: 'Dal Tadka',
      description: 'Yellow lentils tempered with spices',
      price: 80,
      category: 'Dal',
      imageUrl: '/api/placeholder/300/200',
      isAvailable: true,
      prepTime: 10,
    },
    {
      id: '4',
      name: 'Masala Chai',
      description: 'Traditional Indian spiced tea',
      price: 25,
      category: 'Beverages',
      imageUrl: '/api/placeholder/300/200',
      isAvailable: true,
      prepTime: 5,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Today's Menu
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Fresh and delicious food prepared with love
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="div"
                sx={{
                  height: 200,
                  backgroundColor: 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Restaurant sx={{ fontSize: 60, color: 'grey.500' }} />
              </CardMedia>
              
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {item.description}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip label={item.category} size="small" color="primary" variant="outlined" />
                  <Chip label={`${item.prepTime} min`} size="small" color="default" />
                </Box>

                <Box sx={{ mt: 'auto' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" color="primary">
                      ₹{item.price}
                    </Typography>
                    <Chip 
                      label={item.isAvailable ? 'Available' : 'Out of Stock'} 
                      color={item.isAvailable ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Add />}
                    disabled={!item.isAvailable}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {menuItems.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Restaurant sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No menu items available
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Check back later for today's specials
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MenuPage; 