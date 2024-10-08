from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from datetime import datetime
from bson import ObjectId
import json

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.isoformat()
        return json.JSONEncoder.default(self, o)

client = AsyncIOMotorClient(settings.DATABASE_URL)
db = client[settings.MONGODB_DB_NAME]

async def init_db():
    try:
        await client.admin.command('ping')
        print("데이터베이스에 성공적으로 연결되었습니다.")
        print(f"연결된 데이터베이스: {settings.MONGODB_DB_NAME}")
    except Exception as e:
        print(f"데이터베이스 연결 실패: {str(e)}")
        print(f"시도한 연결 URL: {settings.DATABASE_URL}")
        raise

async def get_collection(collection_name: str):
    return db[collection_name]

async def get_test_infos():
    collection = await get_collection("test_info")
    cursor = collection.find({}, {"_id": 0, "test_month": 1, "subject_name": 1})
    test_infos = await cursor.to_list(length=None)
    return json.loads(json.dumps(test_infos, cls=JSONEncoder))

async def get_questions():
    collection = await get_collection("questions")
    cursor = collection.find({}, {"_id": 0, "test_month": 1, "subject_name": 1, "is_ready": 1})
    questions = await cursor.to_list(length=None)
    return json.loads(json.dumps(questions, cls=JSONEncoder))

