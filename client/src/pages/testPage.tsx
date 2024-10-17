import React from 'react';
import { Container } from '@mui/material';
import TestData from '../components/test';
import { useParams } from 'react-router-dom';

const TestPage: React.FC = () => {
  const { testId, subjectId, level } = useParams<{ testId: string; subjectId: string; level: string }>();
  
  return (
    <Container>
      <TestData testId={testId} subjectId={subjectId} level={level} />
    </Container>
  );
};

export default TestPage;
