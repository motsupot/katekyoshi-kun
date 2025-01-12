from fastapi import FastAPI
from pydantic import BaseModel
from google.cloud import aiplatform
import vertexai
from vertexai.generative_models import GenerativeModel, Image

app = FastAPI()

# GCPプロジェクトとリージョンの設定
PROJECT_ID = "katekyoshi-kun"
LOCATION = "us-central1" 

# Vertex AIの初期化
aiplatform.init(project=PROJECT_ID, location=LOCATION)

# リクエストボディのモデル定義
class PredictRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.post("/predict")
async def predict(request: PredictRequest):
    # エンドポイントの取得
    endpoint = aiplatform.Endpoint(endpoint_name="projects/{project_id}/locations/{location}/endpoints/{endpoint_id}")
    model = GenerativeModel("gemini-1.5-flash")

    response = model.generate_content(request.text)
    print(response.text) #  The opposite of hot is cold.

    # レスポンスの取得
    predictions = response.text

    return {"predictions": predictions}
