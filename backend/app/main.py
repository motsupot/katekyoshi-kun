from app.bookmarks import router as bookmark_router
from app.db import db, save_question_and_answer
from app.predict import router as predict_router
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


@app.get("/data")
async def get_user_data(user_id: str):
    # FirestoreのコレクションからユーザーIDに基づいてデータを取得
    docs = db.collection('qa_sessions').where('user', '==', user_id).stream()
    print(docs)
    user_data = []
    for doc in docs:
        user_data.append(doc.to_dict())

    return {"qa_sessions": user_data}
