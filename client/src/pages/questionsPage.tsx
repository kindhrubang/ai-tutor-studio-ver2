import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);

    try {
      const response = await axios.get('http://localhost:8000/api/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('문제 목록 가져오기 중 오류 발생:', error);
    } finally {
      setLoading(false);

    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>문제 목록</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {questions.map((question, index) => (
            <Box key={index} mb={2}>
              <Typography variant="h6">{question.subject_name} - {question.question_num}</Typography>
              <Typography variant="body1">{question.question}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default QuestionsPage;
