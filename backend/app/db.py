from google.cloud import firestore


# Firestoreクライアントの作成
db = firestore.Client()


def save_question_and_answer(
        chat_type: str,
        question: str,
        answer: str,
        user: str
    ):
    # コレクション「qa_sessions」に新しいドキュメントを作成
    doc_ref = db.collection('qa_sessions').document()
    # ドキュメントにデータを保存
    doc_ref.set({
        'type': chat_type,
        'question': question,
        'answer': answer,
        'user': user,
        'timestamp': firestore.SERVER_TIMESTAMP
    })
