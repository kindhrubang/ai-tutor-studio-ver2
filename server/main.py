from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.db.database import init_db, get_questions_by_info, get_answers
from app.utils.utils import process_test_infos, save_or_update_answer, get_answer_status, get_specific_answer_from_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await init_db()
        print("데이터베이스 초기화 성공")
    except Exception as e:
        print(f"데이터베이스 초기화 실패: {str(e)}")
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "AI Tutor Studio API"}

@app.get("/test_infos")
async def get_test_infos_route():
    test_infos = await process_test_infos()
    return test_infos

@app.get("/questions/{test_id}/{subject_id}")
async def get_questions(test_id: str, subject_id: str):
    questions = await get_questions_by_info(test_id, subject_id)
    base_answers = await get_answers(test_id, subject_id, "base_answer")

    return questions, base_answers

@app.post("/questions/{test_id}/{subject_id}")
async def create_question():

    return {"message": "Question created successfully"}

@app.post("/answer/{test_id}/{subject_id}")
async def save_answer(test_id: str, subject_id: str, answer_data: dict):
    result = await save_or_update_answer(test_id, subject_id, answer_data)
    return result

@app.get("/answer_status/{test_id}/{subject_id}")
async def get_answers_status(test_id: str, subject_id: str):
    status = await get_answer_status(test_id, subject_id)
    return status

@app.get("/answer/{test_id}/{subject_id}/{question_num}/{answer_type}")
async def get_specific_answer(test_id: str, subject_id: str, question_num: str, answer_type: str):
    answer = await get_specific_answer_from_db(test_id, subject_id, question_num, answer_type)
    return {"answer": answer}
