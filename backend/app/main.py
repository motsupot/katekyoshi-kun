from app.bookmarks import router as bookmark_router
from app.db import db, save_question_and_answer
from app.predict import router as predict_router
from app.model import AnalyzeProfileRequest, Summary, Conversation, Message, Quizz
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import aiplatform
from pydantic import BaseModel
from vertexai.generative_models import GenerativeModel
import os

app = FastAPI()

app.include_router(router=bookmark_router, prefix="/bookmarks")
app.include_router(router=predict_router, prefix="/predict")

# CORS設定の追加
extension_id = os.environ.get("CHROME_EXTENSION_ID")
origins = [
    "http://localhost",
    "chrome-extension://" + str(extension_id),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GCPプロジェクトとリージョンの設定
PROJECT_ID = "katekyoshi-kun"
LOCATION = "us-central1"

# Vertex AIの初期化
aiplatform.init(project=PROJECT_ID, location=LOCATION)


# リクエストボディのモデル定義
class PredictRequest(BaseModel):
    text: str
    user_id: str


@app.post("/predict")
async def predict(request: PredictRequest):
    model = GenerativeModel("gemini-1.5-flash-002")
    prompt = request.text

    response = model.generate_content(prompt)
    print(prompt)

    # レスポンスの取得
    predictions = response.text

    # Firestoreに質問と回答を保存(一旦、ユーザーIDは固定)
    save_question_and_answer(
        chat_type=request.chat_type,
        question=prompt,
        answer=predictions,
        user=request.user_id
    )

    return {"predictions": predictions}


@app.post("/analyze_profile")
async def analyze_profile(request: AnalyzeProfileRequest):
    # 各テーブルからユーザーごとのデータを取得する
    summaries_list = Summary.find_by_user_id(request.user_id)
    print("summaries_list:", summaries_list)
    conversations_list = Conversation.find_by_user_id(request.user_id)
    print("conversations_list:", conversations_list)
    messages_list = Message.find_by_user_id(request.user_id)
    print("messages_list:", messages_list)
    quizzies_list = Quizz.find_by_user_id(request.user_id)
    print("quizzies_list:", quizzies_list)

    # 取得した各データを文字列に変換（例：必要なフィールドのみ抽出）
    summaries_data = "\n".join([s.body for s in summaries_list])
    conversations_data = "\n".join([f"タイトル: {c.title} （チャットID: {c.chat_id}）" for c in conversations_list])
    messages_data = "\n".join([f"チャットID: {m.chat_id} 質問: {m.input} -> 回答: {m.output}" for m in messages_list])
    quizzies_data = "\n".join([f"問題: {q.question}\n回答: {q.answer}\n得点: {q.score}" for q in quizzies_list])
    
    # プロンプトを組み立てる
    prompt = (
        "あなたは心理分析の専門家です。以下の情報をもとに、このユーザーの全体像、強み、弱み、"
        "そして今後の成長のための具体的なアドバイスをMarkdown形式で出力してください。\n\n"
        "【要約内容】\n" + summaries_data + "\n\n"
        "【チャット履歴】\n" + conversations_data + "\n\n"
        "【メッセージ履歴】\n" + messages_data + "\n\n"
        "【クイズ結果】\n" + quizzies_data + "\n\n"
        "以上の情報を総合して、分析結果を出力してください。ただし、チャットIDなどの情報は含めないようにしてください。"
    )
    
    print("生成プロンプト:\n", prompt)
    
    # generative モデルを呼び出して分析結果を取得する
    model = GenerativeModel("gemini-1.5-flash-002")
    response = model.generate_content(prompt)
    predictions = response.text
    print("レスポンス:\n", predictions)

    return {"predictions": predictions}
