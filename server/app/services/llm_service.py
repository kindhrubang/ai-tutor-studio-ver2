from app.core.config import settings
import openai
import json
from app.utils.utils import create_finetuning_training_data

async def create_finetuning_model(testId: str, subjectId: str):
    openai.api_key = settings.OPENAI_API_KEY

    # 트레이닝 데이터 생성
    base_jsonl, low_jsonl, medium_jsonl, high_jsonl = await create_finetuning_training_data(testId, subjectId)

    # 여기에 OpenAI API를 사용하여 파인튜닝 모델을 생성하는 코드를 추가할 수 있습니다.
    results = {}
    for answer_type, data in zip(["base", "low", "medium", "high"], [base_jsonl, low_jsonl, medium_jsonl, high_jsonl]):
        # OpenAI API를 사용하여 파인튜닝 작업 시작
        # 이 부분은 OpenAI의 최신 API에 맞게 구현해야 합니다.
        # 예: results[answer_type] = openai.FineTune.create(training_data=data, model="davinci")
        pass

    return results

