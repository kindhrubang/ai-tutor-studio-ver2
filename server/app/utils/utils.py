from app.core.config import settings
from app.db.database import get_test_infos, get_answers, save_answer, get_answer_collection, check_answer_exists, update_test_info_ready_status, get_questions_by_info
import json

async def process_test_infos():
    test_infos = await get_test_infos()
    
    result = []
    for test_info in test_infos:
        result.append(test_info)
    
    return result

async def save_or_update_answer(test_id: str, subject_id: str, answer_data: dict):
    answer_type = answer_data['answer_type']
    collection_name = f"{answer_type}_answer"
    
    existing_answer = await check_answer_exists(test_id, subject_id, answer_data['question_num'], collection_name)
    
    if existing_answer:
        # 업데이트
        result = await save_answer(test_id, subject_id, answer_data, collection_name, update=True)
    else:
        # 새로 저장
        result = await save_answer(test_id, subject_id, answer_data, collection_name)
    
    # 저장 후 상태 업데이트
    await get_answer_status(test_id, subject_id)
    
    return result

async def get_answer_status(test_id: str, subject_id: str):
    collections = ['low_answer', 'medium_answer', 'high_answer']
    status = {}
    all_complete = True
    
    for collection_name in collections:
        collection = await get_answer_collection(collection_name)
        answers = await collection.find({'testId': int(test_id), 'subjectId': int(subject_id)}).to_list(length=None)
        
        for answer in answers:
            question_num = answer['question_num']
            if question_num not in status:
                status[question_num] = 0
            if answer['answer'].strip() != "":
                status[question_num] += 1
    
    for count in status.values():
        if count != 3:
            all_complete = False
            break
    
    await update_test_info_ready_status(test_id, subject_id, all_complete)
    
    return {k: v == 3 for k, v in status.items()}

async def get_specific_answer_from_db(test_id: str, subject_id: str, question_num: str, answer_type: str):
    collection_name = f"{answer_type}_answer"
    collection = await get_answer_collection(collection_name)
    answer = await collection.find_one({
        "testId": int(test_id),
        "subjectId": int(subject_id),
        "question_num": question_num
    })
    return answer['answer'] if answer else ''

async def create_base_data(question):
    return {
        "test_month": question["test_month"],
        "subject_name": question["subject_name"],
        "question_num": str(question["question_number"]),
        "question": question["question"],
        "content": question["content"],
        "choices": question["choices"]
    }

async def get_answer_for_question(answers, question_num):
    return next((a for a in answers if a["question_num"] == question_num), None)

async def create_finetuning_data(questions, answers):
    data = []
    for question in questions:
        base_data = await create_base_data(question)
        answer = await get_answer_for_question(answers, str(question["question_number"]))
        base_data["answer"] = answer["answer"] if answer else ""
        data.append(json.dumps(base_data, ensure_ascii=False))
    return "\n".join(data)

async def create_finetuning_training_data(test_id: str, subject_id: str):
    questions = await get_questions_by_info(test_id, subject_id)
    base_answers = await get_answers(test_id, subject_id, "base_answer")
    low_answers = await get_answers(test_id, subject_id, "low_answer")
    medium_answers = await get_answers(test_id, subject_id, "medium_answer")
    high_answers = await get_answers(test_id, subject_id, "high_answer")

    base_jsonl = await create_finetuning_data(questions, base_answers)
    low_jsonl = await create_finetuning_data(questions, low_answers)
    medium_jsonl = await create_finetuning_data(questions, medium_answers)
    high_jsonl = await create_finetuning_data(questions, high_answers)

    return base_jsonl, low_jsonl, medium_jsonl, high_jsonl
