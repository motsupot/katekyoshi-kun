from app.model import Summary, Conversation, Message, Quizz

async def get_user_data_as_strings(user_id: str) -> tuple[str, str, str, str]:
    """
    ユーザーIDに基づいて各データソースからデータを取得し、文字列として整形する。
    """
    summaries_list = Summary.find_by_user_id(user_id)
    conversations_list = Conversation.find_by_user_id(user_id)
    messages_list = Message.find_by_user_id(user_id)
    quizzes_list = Quizz.find_by_user_id(user_id)

    summaries_data = "\n".join([s.body for s in summaries_list])
    conversations_data = "\n".join([f"タイトル: {c.title}\n（チャットID: {c.chat_id}  タイムスタンプ： {c.timestamp} ）" for c in conversations_list])
    messages_data = "\n".join([f"チャットID: {m.chat_id}\nタイムスタンプ: {m.timestamp}\n質問: {m.input} -> 回答: {m.output}" for m in messages_list])
    quizzes_data = "\n".join([f"問題: {q.question}\n回答: {q.answer}\n得点: {q.score} \nタイムスタンプ: {q.timestamp} " for q in quizzes_list])

    return summaries_data, conversations_data, messages_data, quizzes_data