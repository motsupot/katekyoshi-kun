import re

from app.db import save_question_and_answer, save_chat
from app.model import PredictRequest, PredictSummaryRequest, Summary, PredictQuiz, PredictScoring, PredictQuestion
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

    summary = Summary(user_id=request.user_id, url=request.url, body=predictions, title=request.title)
    summary.save()

    return dict(predictions=predictions)

@router.post("/question")
async def predict_question(request: PredictQuestion):
    model = GenerativeModel("gemini-1.5-flash-002")

    # プロンプトテンプレートを定義して読みやすくする
    prompt = (
        f"参考情報：\n{request.page_info}\n"
        f"これまでの会話内容：\n{request.chat_history}\n"
        "上記の会話内容を踏まえて、アシスタントとして以下の質問に回答せよ。\n"
        f"質問：{request.question}"
    )
    
    print("生成プロンプト:\n", prompt)

    response = model.generate_content(prompt)
    print("レスポンス:\n", prompt)

    # レスポンスの取得
    predictions = response.text

    # Firestoreに質問と回答を保存(一旦、ユーザーIDは固定)
    save_chat(
        question=request.question,
        answer=predictions,
        user_id=request.user_id,
        url=request.url,
        chat_id=request.chat_id,
        title=request.title
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
