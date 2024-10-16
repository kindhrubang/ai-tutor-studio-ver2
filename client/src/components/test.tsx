import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { testFinetunedAnswers } from '../services/api';

interface TestResult {
  avg_cosine_similarity: number;
  avg_semantic_similarity: number;
  cosine_similarities: number[];
  semantic_similarities: number[];
  standard_answers: any[];
  finetuned_answers: any[];
}

interface TestDataProps {
  testId?: string;
  subjectId?: string;
  level?: string;
}

const TestData: React.FC<TestDataProps> = ({ testId, subjectId, level }) => {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        if (testId && subjectId && level) {
          const data = await testFinetunedAnswers(testId, subjectId, level);
          setTestResult(data);
        }
      } catch (error) {
        console.error('Error fetching test data:', error);
        setError('테스트 데이터를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [testId, subjectId, level]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!testResult) {
    return <Typography>테스트 결과가 없습니다.</Typography>;
  }

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>테스트 결과</Typography>
          <Typography>평균 코사인 유사도: {testResult.avg_cosine_similarity.toFixed(2)}%</Typography>
          <Typography>평균 시맨틱 유사도: {testResult.avg_semantic_similarity.toFixed(2)}%</Typography>
          
          {testResult.standard_answers.map((standard, index) => (
            <Box key={index} mt={2}>
              <Typography variant="h6">문제 {index + 1}</Typography>
              <Typography>표준 답안: {standard.answer}</Typography>
              <Typography>파인튜닝된 답안: {testResult.finetuned_answers[index].answer}</Typography>
              <Typography>코사인 유사도: {(testResult.cosine_similarities[index] * 100).toFixed(2)}%</Typography>
              <Typography>시맨틱 유사도: {(testResult.semantic_similarities[index] * 100).toFixed(2)}%</Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TestData;
