import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TestPage: React.FC = () => {
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { testId } = useParams<{ testId: string }>();

  const fetchTest = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:8000/api/tests/${testId}`);
      setTest(response.data);
    } catch (error) {
      console.error('테스트 가져오기 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTest();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>테스트 상세</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Typography variant="h6">{test.test_name}</Typography>
          <Typography variant="body1">{test.test_description}</Typography>
        </Box>
      )}
    </Container>
  );
};

export default TestPage;
