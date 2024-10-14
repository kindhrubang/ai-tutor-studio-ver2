import React from 'react';
import { Routes, Route } from 'react-router-dom';
import QuestionsPage from '../pages/questionsPage';
import TestsPage from '../pages/testsPage';
import QuestionPage from '../pages/questionPage';
import TestPage from '../pages/testPage';
import HomePage from '../pages/homePage';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/questions" element={<QuestionsPage />} />
      <Route path="/tests" element={<TestsPage />} />
      <Route path="/questions/:testId/:subjectId" element={<QuestionPage />} />
      <Route path="/tests/:modelId" element={<TestPage />} />
    </Routes>
  );
};

export default AppRouter;
