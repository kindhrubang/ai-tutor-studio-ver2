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

export const saveAnswer = async (testId: string, subjectId: string, questionNum: string, answerType: string, answer: string, testMonth: string, subjectName: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/answer/${testId}/${subjectId}`, {
      question_num: questionNum,
      answer_type: answerType,
      answer: answer,
      test_month: testMonth,
      subject_name: subjectName
    });
    return response.data;
  } catch (error) {
    console.error('답변 저장 중 오류 발생:', error);
    throw error;
  }
};

export const getAnswerStatus = async (testId: string, subjectId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/answer_status/${testId}/${subjectId}`);
    return response.data;
  } catch (error) {
    console.error('답변 상태 가져오기 중 오류 발생:', error);
    throw error;
  }
};

export const getSpecificAnswer = async (testId: string, subjectId: string, questionNum: string, answerType: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/answer/${testId}/${subjectId}/${questionNum}/${answerType}`);
    return response.data.answer;
  } catch (error) {
    console.error('특정 답변 가져오기 중 오류 발생:', error);
    return '';
  }
};
