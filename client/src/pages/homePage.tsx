import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>홈</Typography>
    </Container>
  );
};

export default HomePage;
