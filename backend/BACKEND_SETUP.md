# 環境構築

## pip3でパッケージinstall

`pip3 install -r requirements.txt`

## gcloud cliで認証

- gcloud cliをインストール（特別な設定は必要なし）
- GCP -> IAM -> サービスアカウント(wataru-sbを選択) -> 鍵 -> キーを追加 -> 新規作成（json）で認証情報をダウンロードする
- `export GOOGLE_APPLICATION_CREDENTIALS="/backend/{katekyoshi-kun-7dff12803eef}.json"` みたいにbackend直下に配置して絶対パスで環境変数を設定する
- `gcloud auth login`


## 起動

`uvicorn main:app --reload --port 8888`


## リクエスト

`curl -X POST "http://localhost:8888/predict" -H "Content-Type: application/json" -d '{"text": "what is the fastest animal in the world?"}'`
