from app.core.config import settings
from app.db.database import get_test_infos, get_questions
import json

async def process_test_infos():
    test_infos = await get_test_infos()
    questions = await get_questions()
    
    result = []
    for test_info in test_infos:
        question = next((q for q in questions if q["test_month"] == test_info["test_month"] and q["subject_name"] == test_info["subject_name"]), None)
        if question:
            test_info["is_ready"] = question["is_ready"]
            result.append(test_info)
    
    return result