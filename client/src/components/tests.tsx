import React, { useState } from 'react';
import { Box, Typography, Button, Paper, TextField, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Tests {
  id: number;
  test_name: string;
  test_description: string;
}

export default Tests;


