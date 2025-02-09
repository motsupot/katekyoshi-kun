from app.bookmarks import router as bookmark_router
from app.predict import router as predict_router
<<<<<<< HEAD
from app.model import AnalyzeProfileRequest, Summary, Conversation, Message, Quiz
=======
from app.model import AnalyzeProfileRequest
from app.services import data_service, prompt_service
>>>>>>> 1d3ea95 (プロンプト改善)
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
<<<<<<< HEAD
    # 各テーブルからユーザーごとのデータを取得する
    summaries_list = Summary.find_by_user_id(request.user_id)
    print("summaries_list:", summaries_list)
    conversations_list = Conversation.find_by_user_id(request.user_id)
    print("conversations_list:", conversations_list)
    messages_list = Message.find_by_user_id(request.user_id)
    print("messages_list:", messages_list)
    quizzes_list = Quiz.find_by_user_id(request.user_id)
    print("quizzes_list:", quizzes_list)

    # 取得した各データを文字列に変換（例：必要なフィールドのみ抽出）
    summaries_data = "\n".join([s.body for s in summaries_list])
    conversations_data = "\n".join([f"タイトル: {c.title}\n（チャットID: {c.chat_id}  タイムスタンプ： {c.timestamp} ）" for c in conversations_list])
    messages_data = "\n".join([f"チャットID: {m.chat_id}\nタイムスタンプ: {m.timestamp}\n質問: {m.input} -> 回答: {m.output}" for m in messages_list])
    quizzes_data = "\n".join([f"問題: {q.question}\n回答: {q.answer}\n得点: {q.score} \nタイムスタンプ: {q.timestamp} " for q in quizzes_list])

    # プロンプトを組み立てる
    prompt = (
        "あなたは心理分析の専門家です。以下の情報をもとに、このユーザーの全体像、強み、弱み、"
        "そして今後の成長のための具体的なアドバイスをMarkdown形式で出力してください。\n\n"
        "【要約内容】\n" + summaries_data + "\n\n"
        "【チャット履歴】\n" + conversations_data + "\n\n"
        "【メッセージ履歴】\n" + messages_data + "\n\n"
        "【クイズ結果】\n" + quizzes_data + "\n\n"
        "以上の情報を総合して、分析結果を出力してください。ただし、チャットIDなどの情報は含めないようにしてください。"
    )

=======
   # データ取得
    summaries_data, conversations_data, messages_data, quizzies_data = await data_service.get_user_data_as_strings(request.user_id)

    # プロンプト生成
    prompt = prompt_service.create_analysis_prompt(
        summaries_data=summaries_data,
        conversations_data=conversations_data,
        messages_data=messages_data,
        quizzies_data=quizzies_data
    )
>>>>>>> 1d3ea95 (プロンプト改善)
    print("生成プロンプト:\n", prompt)

    # generative モデルを呼び出して分析結果を取得する
    model = GenerativeModel("gemini-2.0-flash-lite-preview-02-05")
    response = model.generate_content(prompt)
    predictions = response.text
    print("レスポンス:\n", predictions)

    return {"predictions": predictions}
