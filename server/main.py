from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.db.database import init_db
from app.utils.utils import process_test_infos

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

