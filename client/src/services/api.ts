import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const getTestInfos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/test_infos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching test infos:', error);
    throw error;
  }
};

export const getQuestions = async (testId: string, subjectId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/questions/${testId}/${subjectId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};
