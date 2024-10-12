from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from datetime import datetime
from bson import ObjectId
import json
import logging

logger = logging.getLogger(__name__)

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.isoformat()
        return json.JSONEncoder.default(self, o)

client = AsyncIOMotorClient(settings.MONGODB_URL)
database = client[settings.MONGODB_DB_NAME]

async def init_db():
    try:
        await client.admin.command('ping')
        logger.info("데이터베이스에 성공적으로 연결되었습니다.")
        logger.info(f"연결된 데이터베이스: {settings.MONGODB_DB_NAME}")
        logger.info(f"연결 URL: {settings.MONGODB_URL}")
    except Exception as e:
        logger.error(f"데이터베이스 연결 실패: {str(e)}")
        logger.error(f"시도한 연결 URL: {settings.MONGODB_URL}")
        raise

# 데이터베이스 연결 종료 함수
async def close_mongo_connection():
    client.close()
    print("MongoDB 연결이 종료되었습니다.")

async def get_collection(collection_name: str):
    return database[collection_name]

async def get_test_infos():
    collection = await get_collection("test_info")
    cursor = collection.find({}, {"_id": 0, "testId": 1, "subjectId": 1, "test_month": 1, "subject_name": 1, "is_ready": 1})
    test_infos = await cursor.to_list(length=None)
    return json.loads(json.dumps(test_infos, cls=JSONEncoder))

async def get_questions():
    collection = await get_collection("questions")
    cursor = collection.find({}, {"_id": 0, "testId": 1, "subjectId": 1, "test_month": 1, "subject_name": 1})
    questions = await cursor.to_list(length=None)
    return json.loads(json.dumps(questions, cls=JSONEncoder))

async def get_questions_by_info(testId: str, subjectId: str):
    collection = await get_collection("questions")
    cursor = collection.find(
        {"testId": int(testId), "subjectId": int(subjectId)},
        {"_id": 0, "testId": 1, "subjectId": 1, "question_number": 1, "question": 1, "content": 1, "choices": 1, "test_month": 1, "subject_name": 1}
    )
    questions = await cursor.to_list(length=None)
    print(questions)
    return json.loads(json.dumps(questions, cls=JSONEncoder))

async def get_answers(testId: str, subjectId: str, collection_name: str):
    collection = await get_collection(collection_name)
    cursor = collection.find({"testId": int(testId), "subjectId": int(subjectId)})
    answers = await cursor.to_list(length=None)
    return json.loads(json.dumps(answers, cls=JSONEncoder))

async def save_answer(test_id: str, subject_id: str, answer_data: dict, collection_name: str, update=False):
    collection = await get_collection(collection_name)
    
    document = {
        "test_month": answer_data['test_month'],
        "subject_name": answer_data['subject_name'],
        "question_num": answer_data['question_num'],
        "answer": answer_data['answer'],
        "testId": int(test_id),
        "subjectId": int(subject_id)
    }
    
    if update:
        result = await collection.update_one(
            {"testId": int(test_id), "subjectId": int(subject_id), "question_num": answer_data['question_num']},
            {"$set": document}
        )
    else:
        result = await collection.insert_one(document)
    
    return str(result.inserted_id) if not update else "Updated successfully"

async def get_answer_collection(collection_name: str):
    return await get_collection(collection_name)

async def check_answer_exists(test_id: str, subject_id: str, question_num: str, collection_name: str):
    collection = await get_collection(collection_name)
    existing_answer = await collection.find_one({
        "testId": int(test_id),
        "subjectId": int(subject_id),
        "question_num": question_num
    })
    return existing_answer is not None

async def update_test_info_ready_status(test_id: str, subject_id: str, is_ready: bool):
    collection = await get_collection("test_info")
    await collection.update_one(
        {"testId": int(test_id), "subjectId": int(subject_id)},
        {"$set": {"is_ready": is_ready}}
    )
