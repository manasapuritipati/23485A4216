import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import LinkIcon from '@mui/icons-material/Link';

const Navigation = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="logo"
          sx={{ mr: 2 }}
        >
          <LinkIcon />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          URL Shortener
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
            variant={location.pathname === '/' ? 'outlined' : 'text'}
            sx={{
              borderColor: location.pathname === '/' ? 'white' : 'transparent',
              '&:hover': {
                borderColor: 'white',
              },
            }}
          >
            {isMobile ? '' : 'Home'}
          </Button>
          
          <Button
            color="inherit"
            component={Link}
            to="/stats"
            startIcon={<AnalyticsIcon />}
            variant={location.pathname === '/stats' ? 'outlined' : 'text'}
            sx={{
              borderColor: location.pathname === '/stats' ? 'white' : 'transparent',
              '&:hover': {
                borderColor: 'white',
              },
            }}
          >
            {isMobile ? '' : 'Stats'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
