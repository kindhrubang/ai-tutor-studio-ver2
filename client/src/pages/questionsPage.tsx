import React from 'react';
import { Container, Typography } from '@mui/material';
import Questions from '../components/questions';

const QuestionsPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        모의고사 문제 목록
      </Typography>
      <Questions />
    </Container>
  );
};

export default QuestionsPage;
