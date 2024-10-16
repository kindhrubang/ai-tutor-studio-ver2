import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, TextField, Grid, IconButton, Tooltip } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { getQuestions, saveAnswer, getAnswerStatus, getSpecificAnswer, convertSpeechToText } from '../services/api';
import VoiceRecorder from './VoiceRecorder';

interface QuestionData {
  question_number: number;
  question: string;
  content: string;
  choices: string[];
  test_month: string;
  subject_name: string;
}

interface BaseAnswer {
  question_num: string;
  answer: string;
}

interface QuestionProps {
  testId: string;
  subjectId: string;
}

interface AnswerStatus {
  [key: string]: boolean;
}

const Question: React.FC<QuestionProps> = ({ testId, subjectId }) => {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [baseAnswers, setBaseAnswers] = useState<BaseAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<{[key: string]: {low: string, medium: string, high: string}}>({});
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>({});
  const [originalAnswers, setOriginalAnswers] = useState<{[key: string]: {low: string, medium: string, high: string}}>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data for:', testId, subjectId);
        const [questionsData, answersData] = await Promise.all([
          getQuestions(testId, subjectId),
          getAnswerStatus(testId, subjectId)
        ]);
        console.log('Received data:', questionsData);
        setQuestions(questionsData[0]);
        setBaseAnswers(questionsData[1]);
        setAnswerStatus(answersData);
        
        // 저장된 답변 데이터 가져오기
        const savedAnswers: {[key: string]: {low: string, medium: string, high: string}} = {};
        for (const question of questionsData[0]) {
          const questionNum = question.question_number.toString();
          savedAnswers[questionNum] = {
            low: await fetchAnswer(testId, subjectId, questionNum, 'low'),
            medium: await fetchAnswer(testId, subjectId, questionNum, 'medium'),
            high: await fetchAnswer(testId, subjectId, questionNum, 'high')
          };
        }
        setAnswers(savedAnswers);
        setOriginalAnswers(JSON.parse(JSON.stringify(savedAnswers))); // 깊은 복사로 원본 데이터 저장
      } catch (error) {
        console.error('데이터 가져오기 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [testId, subjectId]);

  const fetchAnswer = async (testId: string, subjectId: string, questionNum: string, answerType: string) => {
    return await getSpecificAnswer(testId, subjectId, questionNum, answerType);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSaveAnswer = async () => {
    try {
      const currentQuestion = questions[currentQuestionIndex];
      const questionNum = currentQuestion.question_number.toString();
      await Promise.all([
        saveAnswer(testId, subjectId, questionNum, 'low', answers[questionNum].low, currentQuestion.test_month, currentQuestion.subject_name),
        saveAnswer(testId, subjectId, questionNum, 'medium', answers[questionNum].medium, currentQuestion.test_month, currentQuestion.subject_name),
        saveAnswer(testId, subjectId, questionNum, 'high', answers[questionNum].high, currentQuestion.test_month, currentQuestion.subject_name)
      ]);
      const newStatus = await getAnswerStatus(testId, subjectId);
      setAnswerStatus(newStatus);
      alert('답변이 저장되었습니다.');
    } catch (error) {
      console.error('답변 저장 중 오류 발생:', error);
      alert('답변 저장에 실패했습니다.');
    }
  };

  const handleAnswerChange = (answerType: 'low' | 'medium' | 'high', value: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const questionNum = currentQuestion.question_number.toString();
    setAnswers(prev => ({
      ...prev,
      [questionNum]: {
        ...prev[questionNum],
        [answerType]: value
      }
    }));
  };

  const handleVoiceRecordingComplete = async (answerType: 'low' | 'medium' | 'high', audioBlob: Blob) => {
    try {
      const text = await convertSpeechToText(audioBlob);
      handleAnswerChange(answerType, text);
    } catch (error) {
      console.error('음성을 텍스트로 변환하는 중 오류 발생:', error);
      alert('음성을 텍스트로 변환하는데 실패했습니다.');
    }
  };

  const ResetButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
      <Tooltip title="원래 데이터로 되돌리기">
        <IconButton onClick={onClick} color="primary">
          <RestoreIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const handleReset = (answerType: 'low' | 'medium' | 'high') => {
    const currentQuestion = questions[currentQuestionIndex];
    const questionNum = currentQuestion.question_number.toString();
    setAnswers(prev => ({
      ...prev,
      [questionNum]: {
        ...prev[questionNum],
        [answerType]: originalAnswers[questionNum][answerType]
      }
    }));
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
      <Grid item xs={2}>
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
                padding: 0,
                margin: '5px 0',
                backgroundColor: answerStatus[index + 1] ? 'blue' : 'lightgray',
                color: answerStatus[index + 1] ? 'white' : 'black',
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
          <Box display="flex" alignItems="center">
            <TextField
              label="Low"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={answers[currentQuestion.question_number.toString()]?.low || ''}
              onChange={(e) => handleAnswerChange('low', e.target.value)}
            />
            <ResetButton onClick={() => handleReset('low')} />
          </Box>
          <VoiceRecorder onRecordingComplete={(audioBlob) => handleVoiceRecordingComplete('low', audioBlob)} />
          
          <Box display="flex" alignItems="center">
            <TextField
              label="Medium"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={answers[currentQuestion.question_number.toString()]?.medium || ''}
              onChange={(e) => handleAnswerChange('medium', e.target.value)}
            />
            <ResetButton onClick={() => handleReset('medium')} />
          </Box>
          <VoiceRecorder onRecordingComplete={(audioBlob) => handleVoiceRecordingComplete('medium', audioBlob)} />
          
          <Box display="flex" alignItems="center">
            <TextField
              label="High"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={answers[currentQuestion.question_number.toString()]?.high || ''}
              onChange={(e) => handleAnswerChange('high', e.target.value)}
            />
            <ResetButton onClick={() => handleReset('high')} />
          </Box>
          <VoiceRecorder onRecordingComplete={(audioBlob) => handleVoiceRecordingComplete('high', audioBlob)} />
        </Box>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="contained" onClick={handleSaveAnswer}>
            저장
          </Button>
          <Button
            variant="contained"
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            다음
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Question;
