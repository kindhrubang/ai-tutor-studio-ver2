import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, TextField, Grid, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { testFinetunedAnswers } from '../services/api';

interface TestResult {
  avg_cosine_similarity_finetuned: number;
  avg_semantic_similarity_finetuned: number;
  avg_cosine_similarity_normal: number;
  avg_semantic_similarity_normal: number;
  cosine_similarities_finetuned: number[];
  semantic_similarities_finetuned: number[];
  cosine_similarities_normal: number[];
  semantic_similarities_normal: number[];
  standard_answers: any[];
  normal_answers: any[];
  finetuned_answers: any[];
  combined_answers: {
    question: string;
    content: string;
    choices: string[];
    standard_answer: string;
    normal_answer: string;
    finetuned_answer: string;
  }[];
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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
    return <Typography>로딩 중...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!testResult || !testResult.combined_answers) {
    return <Typography>테스트 결과가 없습니다.</Typography>;
  }

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          flexWrap="wrap"
          gap="5px"
        >
          {testResult.combined_answers.map((_, index) => (
            <Button
              key={index}
              variant="outlined"
              style={{
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                minWidth: '20px',
                minHeight: '20px',
                padding: 0,
                margin: '5px 0',
                backgroundColor: index === currentQuestionIndex ? 'blue' : 'lightgray',
                color: index === currentQuestionIndex ? 'white' : 'black',
              }}
              onClick={() => handleQuestionSelect(index)}
            >
              {index + 1}
            </Button>
          ))}
        </Box>
      </Grid>
      <Grid item xs={10}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>테스트 결과</Typography>
            <Typography>파인튜닝 모델 평균 코사인 유사도: {testResult.avg_cosine_similarity_finetuned.toFixed(2)}%</Typography>
            <Typography>파인튜닝 모델 평균 시맨틱 유사도: {testResult.avg_semantic_similarity_finetuned.toFixed(2)}%</Typography>
            <Typography>일반 모델 평균 코사인 유사도: {testResult.avg_cosine_similarity_normal.toFixed(2)}%</Typography>
            <Typography>일반 모델 평균 시맨틱 유사도: {testResult.avg_semantic_similarity_normal.toFixed(2)}%</Typography>
          </CardContent>
        </Card>
        
        <Box mt={2}>
          <Typography variant="h6">문제 {currentQuestionIndex + 1}. {testResult.combined_answers[currentQuestionIndex].question}</Typography>
          <Typography variant="body1" paragraph>
            {testResult.combined_answers[currentQuestionIndex].content}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>보기:</Typography>
          <ol>
            {testResult.combined_answers[currentQuestionIndex].choices.map((choice, index) => (
              <li key={index}>{choice}</li>
            ))}
          </ol>
          <TextField
            label="표준 답안"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={testResult.combined_answers[currentQuestionIndex].standard_answer}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="일반 모델 답안"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={testResult.combined_answers[currentQuestionIndex].normal_answer}
            InputProps={{ readOnly: true }}
          />
          <Typography>
            코사인 유사도: {(testResult.cosine_similarities_normal[currentQuestionIndex] * 100).toFixed(2)}%
          </Typography>
          <Typography>
            시맨틱 유사도: {(testResult.semantic_similarities_normal[currentQuestionIndex] * 100).toFixed(2)}%
          </Typography>
          <TextField
            label="파인튜닝 모델 답안"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={testResult.combined_answers[currentQuestionIndex].finetuned_answer}
            InputProps={{ readOnly: true }}
          />
          <Typography>
            코사인 유사도: {(testResult.cosine_similarities_finetuned[currentQuestionIndex] * 100).toFixed(2)}%
          </Typography>
          <Typography>
            시맨틱 유사도: {(testResult.semantic_similarities_finetuned[currentQuestionIndex] * 100).toFixed(2)}%
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default TestData;
