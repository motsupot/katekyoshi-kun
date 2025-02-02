from typing import Literal, Optional

from fastapi import FastAPI
from pydantic import BaseModel
from google.cloud import aiplatform, firestore
import vertexai
from vertexai.generative_models import GenerativeModel, Image
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS設定の追加
origins = [
    "http://localhost",
    "chrome-extension://[拡張機能のID]"  # 実際の拡張機能IDに置き換える
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

# Firestoreクライアントの作成
db = firestore.Client()

# リクエストボディのモデル定義
class PredictRequest(BaseModel):
    text: str
    chat_type: Optional[Literal["summary", "question", "quiz"]] = "none"

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.post("/predict")
async def predict(request: PredictRequest):
    model = GenerativeModel("gemini-1.5-flash-002")

    response = model.generate_content(request.text)
    print(response.text)

    # レスポンスの取得
    predictions = response.text

    # Firestoreに質問と回答を保存(一旦、ユーザーIDは固定)
    save_question_and_answer(
        chat_type=request.chat_type,
        question=request.text,
        answer=predictions,
        user="user123"
    )

    return {"predictions": predictions}

def save_question_and_answer(
        chat_type: str,
        question: str,
        answer: str,
        user: str
    ):
    # コレクション「qa_sessions」に新しいドキュメントを作成
    doc_ref = db.collection('qa_sessions').document()
    # ドキュメントにデータを保存
    doc_ref.set({
        'type': chat_type,
        'question': question,
        'answer': answer,
        'user': user,
        'timestamp': firestore.SERVER_TIMESTAMP
    })
