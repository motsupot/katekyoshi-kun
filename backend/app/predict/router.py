from app.db import save_question_and_answer
from app.model import PredictRequest, PredictSummaryRequest, Summary
from fastapi import APIRouter
from vertexai.generative_models import GenerativeModel


router = APIRouter()


@router.get("/")
async def get_all_bookmarks():
    return dict(bookmarks=[])


@router.post("/summary")
async def predict_summary(request: PredictSummaryRequest):
    model = GenerativeModel("gemini-1.5-flash-002")
    prompt = f"以下の情報を要約して:{request.content}"

    response = model.generate_content(prompt)
    print(prompt)

    # レスポンスの取得
    predictions = response.text

    summary = Summary(user_id=request.user_id, url=request.url, body=predictions)
    summary.save()

    return dict(predictions=predictions)


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
async def predict_quiz(request: PredictRequest):
    model = GenerativeModel("gemini-1.5-flash-002")
    prompt = request.text

    response = model.generate_content(prompt)
    print(prompt)

    # レスポンスの取得
    predictions = response.text

    # Firestoreに質問と回答を保存(一旦、ユーザーIDは固定)
    save_question_and_answer(
        chat_type="quiz",
        question=prompt,
        answer=predictions,
        user=request.user_id
    )

    return {"predictions": predictions}


@router.post("/scoring")
async def predict_quiz(request: PredictRequest):
    model = GenerativeModel("gemini-1.5-flash-002")
    prompt = request.text

    response = model.generate_content(prompt)
    print(prompt)

    # レスポンスの取得
    predictions = response.text

    # Firestoreに質問と回答を保存(一旦、ユーザーIDは固定)
    save_question_and_answer(
        chat_type="scoring",
        question=prompt,
        answer=predictions,
        user=request.user_id
    )

    return {"predictions": predictions}
