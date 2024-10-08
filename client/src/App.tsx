import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import Layout from './styles/Layout';
import AppRouter from './routes/AppRouter';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <AppRouter />
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
