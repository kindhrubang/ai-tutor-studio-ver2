import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getTestInfos } from '../services/api';

interface TestInfo {
  testId: string;
  subjectId: string;
  test_month: string;
  subject_name: string;
  is_ready: boolean;
}

const Questions: React.FC = () => {
  const [testInfos, setTestInfos] = useState<TestInfo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestInfos = async () => {
      const data = await getTestInfos();
      setTestInfos(data);
    };
    fetchTestInfos();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>모의고사</TableCell>
            <TableCell>과목</TableCell>
            <TableCell>데이터 상태</TableCell>
            <TableCell>풀이</TableCell>
            <TableCell>모델</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {testInfos.map((testInfo, index) => (
            <TableRow key={index}>
              <TableCell>{testInfo.test_month}</TableCell>
              <TableCell>{testInfo.subject_name}</TableCell>
              <TableCell>
                <Box
                  component="span"
                  sx={{
                    backgroundColor: testInfo.is_ready ? '#90EE90' : '#FFA500',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    color: 'white',
                  }}
                >
                  {testInfo.is_ready ? '완료' : '미완'}
                </Box>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => navigate(`/questions/${testInfo.testId}/${testInfo.subjectId}`)}
                >
                  수정
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  disabled={!testInfo.is_ready}
                  onClick={() => {/* 모델 생성 로직 */}}
                >
                  생성
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Questions;


