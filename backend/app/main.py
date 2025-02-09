from app.bookmarks import router as bookmark_router
from app.predict import router as predict_router
from app.model import AnalyzeProfileRequest
from app.services import data_service, prompt_service
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import aiplatform
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


@app.post("/analyze_profile")
async def analyze_profile(request: AnalyzeProfileRequest):
   # データ取得
    summaries_data, conversations_data, messages_data, quizzies_data = await data_service.get_user_data_as_strings(request.user_id)

    # プロンプト生成
    prompt = prompt_service.create_analysis_prompt(
        summaries_data=summaries_data,
        conversations_data=conversations_data,
        messages_data=messages_data,
        quizzies_data=quizzies_data
    )
    print("生成プロンプト:\n", prompt)

    # generative モデルを呼び出して分析結果を取得する
    model = GenerativeModel("gemini-2.0-flash-lite-preview-02-05")
    response = model.generate_content(prompt)
    predictions = response.text
    print("レスポンス:\n", predictions)

    return {"predictions": predictions}
