import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, TextField, Grid } from '@mui/material';
import { testFinetuningModel } from '../services/api';

interface TestDataProps {
  modelId: string;
}

interface TestData {
  message: string;
}

const TestData: React.FC<TestDataProps> = ({ modelId }) => {
  const [testData, setTestData] = useState<TestData | null>(null);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const data = await testFinetuningModel(modelId);
        setTestData(data);
      } catch (error) {
        console.error('Error fetching test data:', error);
      }
    };

    fetchTestData();
  }, [modelId]);

  return (
    <Box>
      {testData ? (
        <Card>
          <CardContent>
            <Typography variant="body1">{JSON.stringify(testData)}</Typography>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body1">Loading...</Typography>
      )}
    </Box>
  );
};

export default TestData;