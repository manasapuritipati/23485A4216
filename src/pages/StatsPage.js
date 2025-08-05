import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const StatsPage = () => {
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [totalClicks, setTotalClicks] = useState(0);
  const [mostClicked, setMostClicked] = useState(null);

  useEffect(() => {
    const savedUrls = localStorage.getItem('shortenedUrls');
    if (savedUrls) {
      const urls = JSON.parse(savedUrls);
      setShortenedUrls(urls);
      
      // Calculate total clicks
      const total = urls.reduce((sum, url) => sum + url.clicks, 0);
      setTotalClicks(total);
      
      // Find most clicked URL
      const most = urls.reduce((max, url) => url.clicks > max.clicks ? url : max, urls[0]);
      setMostClicked(most);
    }
  }, []);

  const handleDelete = (id) => {
    const updatedUrls = shortenedUrls.filter(url => url.id !== id);
    setShortenedUrls(updatedUrls);
    localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
    
    // Recalculate stats
    const total = updatedUrls.reduce((sum, url) => sum + url.clicks, 0);
    setTotalClicks(total);
    
    const most = updatedUrls.reduce((max, url) => url.clicks > max.clicks ? url : max, updatedUrls[0]);
    setMostClicked(most);
  };

  const handleSimulateClick = (id) => {
    const updatedUrls = shortenedUrls.map(url => {
      if (url.id === id) {
        const newClick = {
          timestamp: new Date().toISOString(),
          referrer: 'Direct',
          userAgent: navigator.userAgent,
          ip: '127.0.0.1'
        };
        return {
          ...url,
          clicks: url.clicks + 1,
          clickDetails: [...url.clickDetails, newClick]
        };
      }
      return url;
    });
    
    setShortenedUrls(updatedUrls);
    localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
    
    // Recalculate stats
    const total = updatedUrls.reduce((sum, url) => sum + url.clicks, 0);
    setTotalClicks(total);
    
    const most = updatedUrls.reduce((max, url) => url.clicks > max.clicks ? url : max, updatedUrls[0]);
    setMostClicked(most);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const isExpired = (expiryAt) => {
    return expiryAt && new Date(expiryAt) < new Date();
  };

  const getClickDistribution = () => {
    return shortenedUrls.map(url => ({
      name: url.shortcode,
      value: url.clicks,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        URL Analytics
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom align="center">
        Track performance and engagement of your shortened URLs
      </Typography>

      {shortenedUrls.length === 0 ? (
        <Alert severity="info" sx={{ mt: 4 }}>
          No shortened URLs found. Create your first short URL on the home page!
        </Alert>
      ) : (
        <>
          {/* Stats Overview */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total URLs
                  </Typography>
                  <Typography variant="h4">
                    {shortenedUrls.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Clicks
                  </Typography>
                  <Typography variant="h4">
                    {totalClicks}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Average Clicks
                  </Typography>
                  <Typography variant="h4">
                    {shortenedUrls.length > 0 ? Math.round(totalClicks / shortenedUrls.length) : 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Most Clicked
                  </Typography>
                  <Typography variant="h6">
                    {mostClicked?.shortcode || 'N/A'}
                  </Typography>
                  <Typography variant="h4">
                    {mostClicked?.clicks || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

            {shortenedUrls.length > 0 && (
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Click Distribution
                </Typography>
                <Box sx={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={getClickDistribution()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getClickDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* URL Details Table */}
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                URL Details
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Short URL</TableCell>
                      <TableCell>Original URL</TableCell>
                      <TableCell align="center">Clicks</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Expires</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {shortenedUrls.map((url) => (
                      <TableRow key={url.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {url.shortUrl}
                            </Typography>
                            <Chip 
                              label={url.shortcode} 
                              size="small" 
                              variant="outlined"
                              color={isExpired(url.expiryAt) ? "error" : "primary"}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {url.originalUrl}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="h6">{url.clicks}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(url.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {url.expiryAt ? formatDate(url.expiryAt) : 'Never'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Tooltip title="Simulate click">
                              <IconButton
                                onClick={() => handleSimulateClick(url.id)}
                                size="small"
                                color="primary"
                              >
                                <AnalyticsIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                onClick={() => handleDelete(url.id)}
                                size="small"
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
};

export default StatsPage;
