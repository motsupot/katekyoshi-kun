from enum import Enum
from typing import Optional
from pydantic import BaseModel
from app.db import db
from google.cloud import firestore
from datetime import datetime

class Summary(BaseModel):
    url: str
    user_id: str
    body: str
    title: str

    def save(self):
        # コレクション「qa_sessions」に新しいドキュメントを作成
        doc_ref = db.collection('summaries').document()
        # ドキュメントにデータを保存
        doc_ref.set({
            'url': self.url,
            'user_id': self.user_id,
            'body': self.body,
            'title': self.title,
            'timestamp': firestore.SERVER_TIMESTAMP
        })
        return doc_ref.id


    def find(id: str):
        doc_ref = db.collection('summaries').document(id)
        doc = doc_ref.get()
        return Summary.model_validate(doc.to_dict()) if doc.exists else None


    def find_by_user_id(user_id: str):
        docs = db.collection('summaries').where('user_id', '==', user_id).stream()
        return list(map(lambda doc: Summary.model_validate(doc.to_dict()), docs))

class Conversation(BaseModel):
    url: str
    user_id: str
    chat_id: str
    title: str

    def save(self):
        doc_ref = db.collection('conversations').document(self.chat_id)
        if not doc_ref.get().exists:
            doc_ref.set({
                'user_id': self.user_id,
                'url': self.url,
                'chat_id': self.chat_id,
                'title': self.title,
                'timestamp': firestore.SERVER_TIMESTAMP
            })
        return doc_ref.id

    def find(id: str):
        doc_ref = db.collection('conversations').document(id)
        doc = doc_ref.get()
        return Conversation.model_validate(doc.to_dict()) if doc.exists else None

    def find_by_user_id(user_id: str):
        docs = db.collection('conversations').where('user_id', '==', user_id).stream()
        return list(map(lambda doc: Conversation.model_validate(doc.to_dict()), docs))


class Message(BaseModel):
    user_id: str
    chat_id: str
    input: str
    output: str

    def save(self):
        doc_ref = db.collection('messages').document()
        if not doc_ref.get().exists:
            doc_ref.set({
                'user_id': self.user_id,
                'input': self.input,
                'output': self.output,
                'chat_id': self.chat_id,
                'timestamp': firestore.SERVER_TIMESTAMP
            })
        return doc_ref.id

    def find(id: str):
        doc_ref = db.collection('messages').document(id)
        doc = doc_ref.get()
        return Conversation.model_validate(doc.to_dict()) if doc.exists else None

    def find_by_user_id(user_id: str):
        docs = db.collection('messages').where('user_id', '==', user_id).stream()
        return list(map(lambda doc: Message.model_validate(doc.to_dict()), docs))

class PredictRequest(BaseModel):
    text: str
    user_id: str


class PredictSummaryRequest(BaseModel):
    user_id: str
    content: str
    url: str
    title: str


class ChatType(str, Enum):
    SUMMARY = "summary"
    QUESTION = "question"
    QUIZ = "quiz"
    SCORING = "scoring"


class Bookmark(BaseModel):
    user_id: str
    type: ChatType
    item_id: str

    def save(self):
        # コレクション「qa_sessions」に新しいドキュメントを作成
        doc_ref = db.collection('bookmarks').document()
        # ドキュメントにデータを保存
        doc_ref.set({
            'user_id': self.user_id,
            'type': self.type.value,
            'item_id': self.item_id,
            'timestamp': firestore.SERVER_TIMESTAMP
        })
        return doc_ref.id


    def find(id: str):
        doc_ref = db.collection('bookmarks').document(id)
        doc = doc_ref.get()
        return Summary.model_validate(doc.to_dict()) if doc.exists else None


    def find_by(user_id: str):
        docs = db.collection('bookmarks').where('user_id', '==', user_id).stream()
        return list(map(lambda doc: Summary.model_validate(doc.to_dict()), docs))


class BookmarkRegisterRequest(BaseModel):
    id: str
    user_id: str


class PredictQuiz(BaseModel):
    user_id: str
    url: str
    title: str
    page_info: str

    def build_prompt(self):
        # tabで整形するとプロンプトが崩れるので、このままにします
        return f"""
指示:

与えられたターゲットテキストの内容をもとに、読者の理解度を確認する自由記述形式のクイズを1問作成してください。
出力は Markdown のフォーマットに従うこと.

要件:

問題はターゲットテキスト内の情報に基づいたものとする。
解答者が説明・記述する形のオープンクエスチョンにする。
枝葉の内容ではなく、ターゲットテキストの主題や重要な概念・ポイントを問う問題にする。
具体例を求めたり、ターゲットテキスト内の概念を他と比較させたりする問いも含める。
ただし、問題および解答が200文字を超えないように注意する。

ターゲットテキスト:
{self.page_info}
"""

class PredictScoring(BaseModel):
    user_id: str
    url: str
    title: str
    page_info: str
    question: str
    answer: str

    def save(self, score: int, explanation: str):
        # コレクション「quizzies」に新しいドキュメントを作成
        doc_ref = db.collection('quizzies').document()
        # ドキュメントにデータを保存
        doc_ref.set({
            'user_id': self.user_id,
            'url': self.url,
            'title': self.title,
            'question': self.question,
            'answer': self.answer,
            'score': score,
            'explanation': explanation,
            'timestamp': firestore.SERVER_TIMESTAMP
        })
        return doc_ref.id


    def build_prompt(self):
        # tabで整形するとプロンプトが崩れるので、このままにします
        return f"""
指示:

あなたは採点者です。「ターゲットテキスト」をもとに「問題」が出題されました。解答者の「解答」を評価し、以下の要素を含めて採点してください。
出力は Markdown のフォーマットに従うこと.

## 得点 (100点満点で適切なスコアリングを設定)

完全正解 (100点)：ターゲットテキストの内容と一致し、重要なポイントを正しく説明している
部分正解 (50～90点)：一部のポイントは正しいが、説明不足や細かい誤りがある
誤答 (0～40点)：主要なポイントが欠落している、または誤った情報が含まれている

## 正しい部分

解答のどの点がターゲットテキストと合致しているかを具体的に指摘。
長くても400文字程度で出力する。

## 間違っている・不足している部分

解答のどの点が間違っているか、または重要な情報が不足しているかを指摘
必要に応じて、正しい答えの一例を示す
長くても400文字程度で出力する。

## 模範解答

「問題」に対する模範解答

## 改善点 (誤答や部分正解の場合)

どの部分を復習すれば満点に近づくかアドバイス

---

出力フォーマット例:
採点結果

## 得点: 70/100

## 正しい部分:

1. 「○○の定義」を正しく説明している。
2. 「○○と□□の違い」の一部が適切に述べられている。

## 間違っている・不足している部分:

「○○の応用例」が抜けているため、具体的な事例を挙げるとより良い解答になる。
「○○の特徴」の説明が不十分で、ターゲットテキストには「△△」という特徴も記載されていたが、これが欠けている。

## 模範解答

○○とは...である。

## 改善点:

「○○の応用例」について資料を読み返すと良いでしょう。
「○○の特徴」に関する部分で「△△との比較」を注意深く読むと、より正確な理解が得られるでしょう。


---

ターゲットテキスト:

{self.page_info}

問題:

{self.question}


解答:

{self.answer}

"""

class PredictQuestion(BaseModel):
    chat_history: str
    user_id: str
    question: str
    chat_id: str
    url: str
    title: str
    page_info: str

class AnalyzeProfileRequest(BaseModel):
    user_id: str

class Quizz(BaseModel):
    user_id: str
    url: str
    title: str
    question: str
    answer: str
    score: int
    explanation: str

    def find_by_user_id(user_id: str):
        docs = db.collection('quizzies').where('user_id', '==', user_id).stream()
        return list(map(lambda doc: Quizz.model_validate(doc.to_dict()), docs))