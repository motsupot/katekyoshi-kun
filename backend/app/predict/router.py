from app.db import save_question_and_answer, save_chat
from app.model import PredictRequest, PredictQuestion, Conversation, Message
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

    conversation = Conversation(user_id=request.user_id, url=request.url, chat_id=request.chat_id, title=request.title)
    conversation.save()
    message = Message(user_id=request.user_id, chat_id=request.chat_id, input=request.question, output=predictions)
    message.save()

    # Firestoreに質問と回答を保存(一旦、ユーザーIDは固定)
    save_chat(
        question=request.question,
        answer=predictions,
        user_id=request.user_id,
        url=request.url,
        chat_id=request.chat_id,
        title=request.title
    )

    return dict(predictions=predictions)


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
