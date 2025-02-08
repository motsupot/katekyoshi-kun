# 環境構築

## frontend 配下に .env を作成

frontend 配下の .env.sample を参考に .env を作成

## ライブラリのインストール

volta をインストールする（ https://docs.volta.sh/guide/getting-started ）。\
その後、以下のコマンドを順に実行

`volta install`

`volta install pnpm`

`pnpm install`

## ビルド

`pnpm run build`

## 拡張機能を読み込ませる

1. chrome > 拡張機能 > 拡張機能を管理 > パッケージ化されていない拡張機能を読み込む を選択
2. frontend を選択
