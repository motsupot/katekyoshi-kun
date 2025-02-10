# AI家庭教師くん

本プロダクトは、Chrome拡張として常時稼働することで、ユーザーがWebブラウジングを行うその瞬間に学習支援を提供します。\
以下の記事にプロダクトの詳細について説明しています。
<!-- zennのリンク -->
[AI家庭教師くん紹介記事](https://zenn.dev/motsupot/articles/2ac5560d7840d5)

# 使用技術

<!-- 要修正 -->
<!-- シールド一覧 -->
<p style="display: inline">
  <!-- フロントエンド -->
  <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=61DAFB">

  <!-- バックエンド -->
  <img src="https://img.shields.io/badge/-Python-F2C63C.svg?logo=python&style=for-the-badge">
  <img src="https://img.shields.io/badge/-FastAPI-005571.svg?style=for-the-badge&logo=fastapi">
  
  <!-- インフラ一覧 -->
  <img src="https://img.shields.io/badge/-Firestore-000000.svg?logo=firebase&style=for-the-badge&logoColor=red">
  <img src="https://img.shields.io/badge/-VertexAI-000000.svg?logo=VertexAI&style=for-the-badge">
  <img src="https://img.shields.io/badge/-GithubActions-F8F8FF.svg?logo=GithubActions&style=for-the-badge">
  
</p>

# アーキテクチャ
![image](https://github.com/user-attachments/assets/7d296bfa-5013-4e58-8997-a26ce28220f7)

# インストール
## GCP

1. Google Cloud プロジェクトを作成
2. Vertex AI API, Cloud Run API, Firestore を有効化
3. サービスアカウントを有効化
4. （デプロイはバックエンドのセットアップで行う）


## フロントエンド

[frontend/FRONTEND_SETUP.md](https://github.com/motsupot/katekyoshi-kun/blob/main/frontend/FRONTEND_SETUP.md) を参照

## バックエンド

[backend/BACKEND_SETUP.md](https://github.com/motsupot/katekyoshi-kun/blob/main/backend/BACKEND_SETUP.md) を参照
