import React from 'react';
import { Container } from '@mui/material';
import TestData from '../components/test';
import { useParams } from 'react-router-dom';

const TestPage: React.FC = () => {
  const { modelId } = useParams();
  return (
    <Container>
      <TestData modelId={modelId || ''} />
    </Container>
  );
};

export default TestPage;
