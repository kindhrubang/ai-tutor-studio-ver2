import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getTestInfos } from '../services/api';

interface TestsInfo {
  id: number;
  test_name: string;
  test_description: string;
}

const Tests: React.FC = () => {
  const [testsInfo, setTestsInfo] = useState<TestsInfo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestsInfo = async () => {
      const data = await getTestInfos();
      setTestsInfo(data);
    };
    fetchTestsInfo();
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
          {testsInfo.map((testInfo, index) => (
            <TableRow key={index}>
              <TableCell>{testInfo.test_name}</TableCell>
              <TableCell>{testInfo.test_description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Tests;


