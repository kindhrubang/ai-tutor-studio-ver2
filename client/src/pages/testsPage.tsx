import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const TestsPage: React.FC = () => {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTests = async () => {
    setLoading(true);

    try {
      const response = await axios.get('http://localhost:8000/api/tests');
      setTests(response.data);
    } catch (error) {
      console.error('테스트 목록 가져오기 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>테스트 목록</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {tests.map((test, index) => (
            <Box key={index} mb={2}>
              <Typography variant="h6">{test.test_name}</Typography>
              <Typography variant="body1">{test.test_description}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default TestsPage;
