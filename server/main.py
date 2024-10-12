import logging
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import init_db, get_questions_by_info, get_answers
from app.utils.utils import process_test_infos, save_or_update_answer, get_answer_status, get_specific_answer_from_db

# 로깅 설정
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stdout
)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("Application is starting up")
    logger.info(f"MONGODB_URL: {settings.MONGODB_URL}")
    logger.info(f"MONGODB_DB_NAME: {settings.MONGODB_DB_NAME}")
    try:
        await init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}")
        logger.exception("Detailed error information:")

@app.get("/")
async def root():
    logger.info("Root endpoint called")
    return {"message": "AI Tutor Studio API"}

@app.get("/test_infos")
async def get_test_infos_route():
    logger.info("Fetching test infos")
    test_infos = await process_test_infos()
    return test_infos

@app.get("/questions/{test_id}/{subject_id}")
async def get_questions(test_id: str, subject_id: str):
    logger.info(f"Fetching questions for test_id: {test_id}, subject_id: {subject_id}")
    questions = await get_questions_by_info(test_id, subject_id)
    base_answers = await get_answers(test_id, subject_id, "base_answer")
    return questions, base_answers

@app.post("/questions/{test_id}/{subject_id}")
async def create_question():
    logger.info("Creating new question")
    return {"message": "Question created successfully"}

@app.post("/answer/{test_id}/{subject_id}")
async def save_answer(test_id: str, subject_id: str, answer_data: dict):
    logger.info(f"Saving answer for test_id: {test_id}, subject_id: {subject_id}")
    result = await save_or_update_answer(test_id, subject_id, answer_data)
    return result

@app.get("/answer_status/{test_id}/{subject_id}")
async def get_answers_status(test_id: str, subject_id: str):
    logger.info(f"Fetching answer status for test_id: {test_id}, subject_id: {subject_id}")
    status = await get_answer_status(test_id, subject_id)
    return status

@app.get("/answer/{test_id}/{subject_id}/{question_num}/{answer_type}")
async def get_specific_answer(test_id: str, subject_id: str, question_num: str, answer_type: str):
    logger.info(f"Fetching specific answer for test_id: {test_id}, subject_id: {subject_id}, question_num: {question_num}, answer_type: {answer_type}")
    answer = await get_specific_answer_from_db(test_id, subject_id, question_num, answer_type)
    return {"answer": answer}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting the application")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
