import React, { useState } from 'react';
import { Box, Typography, Button, Paper, TextField, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Questions {
  id: number;
  subject_name: string;
  question_num: number;
  question: string;
  content: string;
}

export default Questions;


