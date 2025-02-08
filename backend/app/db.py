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

def save_chat(
    question: str,
    answer: str,
    user_id: str,
    chat_id: str,
    url: str,
    title: str
):
    # 「conversations」コレクションでは、chat_idを固定のドキュメントIDとして使用
    conversation_ref = db.collection('conversations').document(chat_id)
    # ドキュメントが存在しない場合のみ作成
    if not conversation_ref.get().exists:
        conversation_ref.set({
            'user_id': user_id,
            'url': url,
            'chat_id': chat_id,
            'title': title,
            'timestamp': firestore.SERVER_TIMESTAMP
        })

    # 「messages」コレクションには各メッセージを個別のドキュメントとして追加
    message_ref = db.collection('messages').document()  # 自動生成IDを利用
    message_ref.set({
        'user_id': user_id,
        'input': question,
        'output': answer,
        'chat_id': chat_id,
        'timestamp': firestore.SERVER_TIMESTAMP
    })
