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

async def create_finetuning_training_data(test_id: str, subject_id: str, level: str):
    questions = await get_questions_by_info(test_id, subject_id)
    
    # 'med'를 'medium'으로 변경
    collection_name = f"{level}_answer"
    answers = await get_answers(test_id, subject_id, collection_name)

    jsonl_data = []
    for question in questions:
        answer = next((a for a in answers if a["question_num"] == str(question["question_number"])), None)
        if answer and answer["answer"].strip():
            data = {
                "messages": [
                    {"role": "system", "content": "당신은 영어 문제에 대한 해설을 제공하는 AI 튜터입니다."},
                    {"role": "user", "content": f"문제: {question['question']}\n내용: {question['content']}\n선택지: {json.dumps(question['choices'], ensure_ascii=False)}"},
                    {"role": "assistant", "content": f"해설: {answer['answer']}"}
                ]
            }
            jsonl_data.append(json.dumps(data, ensure_ascii=False))
    
    result = "\n".join(jsonl_data)
    print("Sample of generated JSONL data:")
    print(result[:1000])  # 처음 1000자만 출력
    return result

async def test_finetuning_model(model_id: str, level: str):
    return "test"
