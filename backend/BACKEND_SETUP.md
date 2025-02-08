# 環境構築

## pip3 でパッケージ install

`pip3 install -r requirements.txt`

## gcloud cli で認証

- gcloud cli をインストール（特別な設定は必要なし）
- GCP -> IAM -> サービスアカウント(wataru-sb を選択) -> 鍵 -> キーを追加 -> 新規作成（json）で認証情報をダウンロードする
- `export GOOGLE_APPLICATION_CREDENTIALS="/backend/{katekyoshi-kun-7dff12803eef}.json"` みたいに backend 直下に配置して絶対パスで環境変数を設定する
- `gcloud auth login`

# 環境変数

- .env.example を参考に環境変数を設定しておく

## 起動

`uvicorn app.main:app --reload --port 8888`

## リクエスト

`curl -X POST "http://localhost:8888/predict" -H "Content-Type: application/json" -d '{"text": "what is the fastest animal in the world?"}'`

## デプロイ

`cd backend`
`gcloud run deploy fastapi-app --source . --platform managed --region us-central1 --allow-unauthenticated`
