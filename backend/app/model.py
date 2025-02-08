from enum import Enum
from typing import Optional
from pydantic import BaseModel
from app.db import db
from google.cloud import firestore


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

    def save(self):
        # コレクション「qa_sessions」に新しいドキュメントを作成
        doc_ref = db.collection('bookmarks').document()
        # ドキュメントにデータを保存
        doc_ref.set({
            'url': self.url,
            'user_id': self.user_id,
            'body': self.body,
            'timestamp': firestore.SERVER_TIMESTAMP
        })
        return doc_ref.id


    def find(id: str):
        doc_ref = db.collection('summaries').document(id)
        doc = doc_ref.get()
        return Summary.model_validate(doc.to_dict()) if doc.exists else None


    def find_by(user_id: str):
        docs = db.collection('summaries').where('user_id', '==', user_id).stream()
        return list(map(lambda doc: Summary.model_validate(doc.to_dict()), docs))
