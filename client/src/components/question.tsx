import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, TextField, Grid } from '@mui/material';
import { getQuestions } from '../services/api';

interface QuestionData {
  question_number: number;
  question: string;
  content: string;
  choices: string[];
}

interface BaseAnswer {
  question_num: string;
  answer: string;
}

interface QuestionProps {
  testId: string;
  subjectId: string;
}

const Question: React.FC<QuestionProps> = ({ testId, subjectId }) => {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [baseAnswers, setBaseAnswers] = useState<BaseAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data for:', testId, subjectId);
        const data = await getQuestions(testId, subjectId);
        console.log('Received data:', data);
        setQuestions(data[0]);
        setBaseAnswers(data[1]);
      } catch (error) {
        console.error('문제 가져오기 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [testId, subjectId]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  if (isLoading) {
    return <Typography>로딩 중...</Typography>;
  }

  if (questions.length === 0) {
    return <Typography>문제를 찾을 수 없습니다.</Typography>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentBaseAnswer = baseAnswers.find(
    (answer) => answer.question_num === currentQuestion.question_number.toString()
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={1}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        flexWrap="wrap"
        gap="5px"
      >
        {questions.map((_, index) => (
          <Button
            key={index}
            variant="outlined"
            style={{
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              minWidth: '20px',
              minHeight: '20px',
              padding: 0, // 패딩을 0으로 설정하여 버튼이 더 균형 잡히게 만듦
              margin: '5px 0',
            }}
            onClick={() => handleQuestionSelect(index)}
          >
            {index + 1}
          </Button>
        ))}
      </Box>
      </Grid>
      <Grid item xs={11}>
        <Card>
          <CardContent>
            <Typography variant="h6">
              {currentQuestion.question_number}. {currentQuestion.question}
            </Typography>
            <Typography variant="body1" paragraph>
              {currentQuestion.content}
            </Typography>
            <Typography variant="body1">보기:</Typography>
            {currentQuestion.choices.map((choice, index) => (
              <Typography key={index} variant="body2">
                {index + 1}. {choice}
              </Typography>
            ))}
          </CardContent>
        </Card>
        <Card style={{ marginTop: '20px' }}>
          <CardContent>
            <Typography variant="h6">기본 답안</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={currentBaseAnswer?.answer || ''}
              InputProps={{ readOnly: true }}
            />
          </CardContent>
        </Card>
        <Box mt={2}>
          <TextField label="Low" fullWidth multiline rows={4} margin="normal" />
          <TextField label="Mid" fullWidth multiline rows={4} margin="normal" />
          <TextField label="High" fullWidth multiline rows={4} margin="normal" />
        </Box>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button variant="contained" onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
            다음
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Question;


