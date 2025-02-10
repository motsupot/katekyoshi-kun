from app.model import Summary, Conversation, Message, Quiz, Bookmark, ChatType
async def get_user_data_as_strings(user_id: str) -> tuple[str, str, str, str, str, str]:
    """
    ユーザーIDに基づいて各データソースからデータを取得し、文字列として整形する。
    """
    summaries_list = Summary.find_by_user_id(user_id)
    conversations_list = Conversation.find_by_user_id(user_id)
    messages_list = Message.find_by_user_id(user_id)
    quizzes_list = Quiz.find_by_user_id(user_id)

    bookmarks = Bookmark.find_by(user_id)

    bookmarked_summaries_list = []
    bookmarked_quizzes_list = []
    for bookmark in bookmarks:
        if bookmark.type == ChatType.SUMMARY:
            summary = Summary.find(bookmark.item_id)
            if summary:
                bookmarked_summaries_list.append(f"タイトル: {summary.title}\n要約文: {summary.body}")
        elif bookmark.type == ChatType.QUIZ: 
            quiz = Quiz.find(bookmark.item_id) 
            if quiz:
                bookmarked_quizzes_list.append(f"問題: {quiz.question}\n解答: {quiz.answer}\n得点: {quiz.score} \n解説:{quiz.explanation} \nタイムスタンプ: {quiz.timestamp} ")

    summaries_data = "\n".join([s.body for s in summaries_list])
    conversations_data = "\n".join([f"タイトル: {c.title}\n（チャットID: {c.chat_id}  タイムスタンプ： {c.timestamp} ）" for c in conversations_list])
    messages_data = "\n".join([f"チャットID: {m.chat_id}\nタイムスタンプ: {m.timestamp}\n質問: {m.input} -> 解答: {m.output}" for m in messages_list])
    quizzes_data = "\n".join([f"問題: {q.question}\n解答: {q.answer}\n得点: {q.score}\n解説:{q.explanation} \nタイムスタンプ: {q.timestamp} " for q in quizzes_list])
    bookmarked_summaries_data = "\n".join(bookmarked_summaries_list)
    bookmarked_quizzes_data = "\n".join(bookmarked_quizzes_list)

    return summaries_data, conversations_data, messages_data, quizzes_data, bookmarked_summaries_data, bookmarked_quizzes_data
