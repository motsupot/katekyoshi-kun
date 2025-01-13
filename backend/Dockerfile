# ベースイメージとして公式のPythonイメージを使用
FROM python:3.10-slim

# 作業ディレクトリを設定
WORKDIR /app

# 必要なシステムパッケージのインストール（必要に応じて追加）
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

# 依存関係のコピーとインストール
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードのコピー
COPY ./app /app/app

# 環境変数の設定
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# 起動コマンド
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
