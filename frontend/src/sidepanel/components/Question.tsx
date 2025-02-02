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

  const {
    data: responseData,
    loading: isQuestionLoading,
    fetchData: fetchAnswer,
  } = useFetch<string>(`${API_HOST}/predict`, "");

  // APIからの回答が返ってきたら、会話履歴に追加
  useEffect(() => {
    if (responseData !== null) {
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: responseData },
      ]);
    }
  }, [responseData]);

  // 会話履歴からプロンプト文字列を作成
  const buildPrompt = (newQuestion: string) => {
    // 例として、過去のやり取りを「ユーザー」と「アシスタント」で表記
    const historyText = chatHistory
      .map(
        (msg) =>
          `${msg.role === "user" ? "ユーザー" : "アシスタント"}: ${msg.content}`
      )
      .join("\n");
    // ページ情報を含める場合は、末尾に追加する
    const pageInfoText = pageInfo ? `\n参考情報: ${pageInfo.content}` : "";
    // 新しい質問を追加
    const prompt = historyText
      ? `${historyText}\nユーザー: ${newQuestion}\nアシスタント:`
      : `ユーザー: ${newQuestion}\nアシスタント:`;
    return prompt + pageInfoText;
  };

  const handleQuestion = () => {
    if (pageInfo && currentQuestion.trim()) {
      // まず、ユーザーの発言を会話履歴に追加
      setChatHistory((prev) => [
        ...prev,
        { role: "user", content: currentQuestion.trim() },
      ]);
      // 作成したプロンプト文字列を送信する
      const prompt = buildPrompt(currentQuestion.trim());
      fetchAnswer({ text: prompt, chat_type: "question" });
      // 入力欄をクリア
      setCurrentQuestion("");
    }
  };

  return (
    <Card title="チャット形式で質問する">
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
        {/* 会話履歴の表示 */}
        {chatHistory.length === 0
          ? "ここに会話の履歴が表示されます"
          : chatHistory.map((msg, index) => (
              <div key={index}>
                <strong>
                  {msg.role === "user" ? "ユーザー" : "アシスタント"}:{" "}
                </strong>
                {msg.content}
              </div>
            ))}
        {isQuestionLoading && <div>考え中...</div>}
      </div>
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
