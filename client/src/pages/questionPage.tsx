import React from 'react';
import { Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Question from '../components/question';

const QuestionPage: React.FC = () => {
  const { testId, subjectId } = useParams<{ testId: string; subjectId: string }>();

  if (!testId || !subjectId) {
    return <Typography>잘못된 접근입니다.</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        문제 상세
      </Typography>
      <Question testId={testId} subjectId={subjectId} />
    </Container>
  );
};

export default QuestionPage;
