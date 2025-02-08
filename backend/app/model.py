from pydantic import BaseModel
from app.db import db
from google.cloud import firestore


class Summary(BaseModel):
    url: str
    user_id: str
    body: str

    def save(self):
        # コレクション「qa_sessions」に新しいドキュメントを作成
        doc_ref = db.collection('summaries').document()
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


    def find_by_user_id(user_id: str):
        docs = db.collection('summaries').where('user_id', '==', user_id).stream()
        return list(map(lambda doc: Summary.model_validate(doc.to_dict()), docs))


class PredictRequest(BaseModel):
    text: str
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
