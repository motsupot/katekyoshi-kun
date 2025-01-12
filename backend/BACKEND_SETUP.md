# 環境構築

## gcloud cliで認証

- gcloud cliをインストール（特別な設定は必要なし）
- ``

## pip3でパッケージinstall

`pip3 install -r requirements.txt`

## 起動

`uvicorn main:app --reload --port 8888`


## リクエスト

`curl -X POST "http://localhost:8888/predict" -H "Content-Type: application/json" -d '{"text": "what is the fastest animal in the world?"}'`
