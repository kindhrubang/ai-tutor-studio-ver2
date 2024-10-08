import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const QuestionPage: React.FC = () => {
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { questionId } = useParams<{ questionId: string }>();

  const fetchQuestion = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:8000/api/questions/${questionId}`);
      setQuestion(response.data);
    } catch (error) {
      console.error('문제 가져오기 중 오류 발생:', error);
    } finally {
      setLoading(false);

    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>문제 상세</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Typography variant="h6">{question.subject_name} - {question.question_num}</Typography>
          <Typography variant="body1">{question.question}</Typography>
          <Typography variant="body1">{question.content}</Typography>
        </Box>
      )}
    </Container>
  );
};

export default QuestionPage;
