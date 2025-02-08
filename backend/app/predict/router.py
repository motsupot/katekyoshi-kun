import re

from app.db import save_question_and_answer
from app.model import PredictRequest, PredictQuiz, PredictScoring
from fastapi import APIRouter
from vertexai.generative_models import GenerativeModel


router = APIRouter()


@router.get("/")
async def get_all_bookmarks():
    return dict(bookmarks=[])


@router.post("/summary")
async def predict_summary(request: PredictRequest):
    model = GenerativeModel("gemini-1.5-flash-002")
    prompt = request.text

    response = model.generate_content(prompt)
    print(prompt)

    # レスポンスの取得
    predictions = response.text

    # Firestoreに質問と回答を保存(一旦、ユーザーIDは固定)
    save_question_and_answer(
        chat_type="summary",
        question=prompt,
        answer=predictions,
        user=request.user_id
    )

    return {"predictions": predictions}


@router.post("/question")
async def predict_question(request: PredictRequest):
    model = GenerativeModel("gemini-1.5-flash-002")
    prompt = request.text

    response = model.generate_content(prompt)
    print(prompt)

    # レスポンスの取得
    predictions = response.text

    # Firestoreに質問と回答を保存(一旦、ユーザーIDは固定)
    save_question_and_answer(
        chat_type="question",
        question=prompt,
        answer=predictions,
        user=request.user_id
    )

    return {"predictions": predictions}


@router.post("/quiz")
async def predict_quiz(request: PredictQuiz):
    model = GenerativeModel("gemini-1.5-flash-002")
    prompt = request.build_prompt()

    response = model.generate_content(prompt)
    print(prompt)

    # レスポンスの取得
    predictions = response.text

    return {"predictions": predictions}


@router.post("/scoring")
async def predict_quiz(request: PredictScoring):
    model = GenerativeModel("gemini-1.5-flash-002")
    prompt = request.build_prompt()

    response = model.generate_content(prompt)
    print(prompt)

    # レスポンスの取得
    predictions = response.text
    
    # predictionsからスコアを取得
    score = int(re.search(r"## 得点:\s*(\d+)/100", predictions).group(1))    

    # DBに保存（）
    request.save(score=score, explanation=predictions)

    return {"predictions": predictions}
