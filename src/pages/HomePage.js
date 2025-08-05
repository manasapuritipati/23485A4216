import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Alert,
  Grid,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShortenIcon from '@mui/icons-material/Link';
import { v4 as uuidv4 } from 'uuid';

const HomePage = () => {
  const [longUrl, setLongUrl] = useState('');
  const [customShortcode, setCustomShortcode] = useState('');
  const [expiryMinutes, setExpiryMinutes] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load saved URLs from localStorage on component mount
  React.useEffect(() => {
    const savedUrls = localStorage.getItem('shortenedUrls');
    if (savedUrls) {
      setShortenedUrls(JSON.parse(savedUrls));
    }
  }, []);

  // Save URLs to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('shortenedUrls', JSON.stringify(shortenedUrls));
  }, [shortenedUrls]);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const generateShortcode = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const handleShorten = () => {
    setError('');
    setSuccess('');

    if (!longUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(longUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    if (customShortcode && !/^[a-zA-Z0-9-]+$/.test(customShortcode)) {
      setError('Custom shortcode can only contain letters, numbers, and hyphens');
      return;
    }

    if (expiryMinutes && (!/^\d+$/.test(expiryMinutes) || parseInt(expiryMinutes) <= 0)) {
      setError('Please enter a valid expiry time in minutes');
      return;
    }

    const shortcode = customShortcode || generateShortcode();
    
    // Check for duplicate shortcode
    if (shortenedUrls.some(url => url.shortcode === shortcode)) {
      setError('This shortcode is already taken. Please choose another one.');
      return;
    }

    const newUrl = {
      id: uuidv4(),
      originalUrl: longUrl,
      shortcode: shortcode,
      shortUrl: `http://localhost:3000/${shortcode}`,
      createdAt: new Date().toISOString(),
      expiryAt: expiryMinutes ? new Date(Date.now() + parseInt(expiryMinutes) * 60000).toISOString() : null,
      clicks: 0,
      clickDetails: []
    };

    setShortenedUrls([newUrl, ...shortenedUrls]);
    setSuccess('URL shortened successfully!');
    
    // Reset form
    setLongUrl('');
    setCustomShortcode('');
    setExpiryMinutes('');
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const isExpired = (expiryAt) => {
    return expiryAt && new Date(expiryAt) < new Date();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        URL Shortener
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom align="center">
        Create short, memorable links for your long URLs
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" noValidate>
            <TextField
              fullWidth
              label="Enter long URL"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              margin="normal"
              placeholder="https://example.com/very-long-url"
            />
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Custom shortcode (optional)"
                  value={customShortcode}
                  onChange={(e) => setCustomShortcode(e.target.value)}
                  placeholder="my-link"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expiry time (minutes, optional)"
                  value={expiryMinutes}
                  onChange={(e) => setExpiryMinutes(e.target.value)}
                  placeholder="60"
                  type="number"
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleShorten}
              sx={{ mt: 2 }}
              startIcon={<ShortenIcon />}
            >
              Shorten URL
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}
        </CardContent>
      </Card>

      {shortenedUrls.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom>
            Your Shortened URLs
          </Typography>
          
          {shortenedUrls.map((url) => (
            <Card key={url.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {url.shortUrl}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Original: {url.originalUrl}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  <Chip label={`${url.clicks} clicks`} size="small" />
                  {url.expiryAt && (
                    <Chip 
                      label={`Expires: ${formatDate(url.expiryAt)}`} 
                      size="small" 
                      color={isExpired(url.expiryAt) ? "error" : "default"}
                    />
                  )}
                  {isExpired(url.expiryAt) && (
                    <Chip label="Expired" size="small" color="error" />
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Copy short URL">
                    <IconButton 
                      onClick={() => handleCopy(url.shortUrl)}
                      size="small"
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </Container>
  );
};

export default HomePage;
