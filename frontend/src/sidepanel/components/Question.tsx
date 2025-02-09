import React, { useEffect, useState } from "react";
import { Card, CardBase } from "./base";
import { PageInfo } from "../../types/Page";
import { useFetch } from "../../shared/hooks";
import { API_HOST } from "../../constants";

// メッセージの型定義
type Message = {
  role: "user" | "assistant";
  content: string;
};

type Props = {
  pageInfo: PageInfo | null;
};

export const QuestionCard: React.FC<Props> = ({ pageInfo }) => {
  // 現在の入力内容
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  // 会話の履歴（ユーザーとアシスタントの発言を管理）
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  // チャットID
  const [chatId, setChatId] = useState<string | null>(null);

  const {
    data: responseData,
    loading: isQuestionLoading,
    fetchData: fetchAnswer,
  } = useFetch<string | null>(`${API_HOST}/predict/question`, null);

  // APIからの回答が返ってきたら、会話履歴に追加
  useEffect(() => {
    if (responseData !== null) {
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: responseData },
      ]);
    }
  }, [responseData]);

  // コンポーネントのマウント時に一度だけ実行
  useEffect(() => {
    if (crypto.randomUUID) {
      // ブラウザが対応している場合はcrypto.randomUUIDを使用
      setChatId(crypto.randomUUID());
    } else {
      // 対応していない場合は簡易的なUUID生成ロジックを使用
      setChatId(
        "xxxxxxxx-xxxx-7xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        })
      );
    }
  }, []);

  // 会話履歴を文字列として構築
  const buildHistory = () => {
    return chatHistory
      .map(
        (msg) =>
          `${msg.role === "user" ? "ユーザー" : "アシスタント"}: ${msg.content}`
      )
      .join("\n");
  };

  // 質問を送信する処理
  const handleQuestion = () => {
    if (pageInfo && currentQuestion.trim()) {
      // ユーザーの発言を会話履歴に追加
      setChatHistory((prev) => [
        ...prev,
        { role: "user", content: currentQuestion.trim() },
      ]);
      // APIリクエストを送信
      fetchAnswer({
        chat_history: buildHistory(),
        question: currentQuestion.trim(),
        chat_id: chatId,
        url: pageInfo.url,
        title: pageInfo.title,
        page_info: pageInfo.content,
      });
      // 入力欄をクリア
      setCurrentQuestion("");
    }
  };

  return (
    <Card title="チャット形式で質問する">
      {/* チャット履歴の表示 */}
      {chatHistory.length > 0 && (
        <div
          style={{
            height: "200px",
            overflowY: "auto",
            color: "#555",
            fontSize: "14px",
            lineHeight: "1.6",
            padding: "4px",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "4px",
            marginBottom: "8px",
            whiteSpace: "pre-wrap",
          }}
        >
          {chatHistory.map((msg, index) => (
            <div key={index}>
              <strong>
                {msg.role === "user" ? "ユーザー" : "アシスタント"}:{" "}
              </strong>
              {msg.content}
            </div>
          ))}
          {isQuestionLoading && <div>考え中...</div>}
        </div>
      )}
      {/* 入力フォーム */}
      <input
        type="text"
        value={currentQuestion}
        onChange={(e) => setCurrentQuestion(e.target.value)}
        placeholder="質問を入力してください"
        style={{ width: "100%", marginBottom: "4px" }}
      />
      <button onClick={handleQuestion}>送信</button>
    </Card>
  );
};

export type Question = CardBase &
  Props & {
    type: "Question";
  };
