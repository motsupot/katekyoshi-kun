import React, { useEffect, useState } from "react";
import { API_HOST } from "../constants";
import Markdown from "react-markdown";
import { getUserId } from "../shared/functions/getUserId";
import { Card } from "../sidepanel/components/base";

export const BookmarkQuizzes: React.FC = () => {
  interface Quiz {
    id: string;
    title: string;
    url: string;
    question: string;
    answer: string;
    score: number;
    explanation: string;
  }

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const userId = await getUserId();
        const response = await fetch(`${API_HOST}/bookmarks/quiz/${userId}`);
        if (!response.ok) {
          throw new Error("サマリーの取得に失敗しました");
        }
        const data = await response.json();
        setQuizzes(data.quizzes);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>ブックマークしたクイズ一覧</h2>
      {quizzes.length === 0 ? (
        <p>ブックマークされたクイズはありません。</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              style={{
                width: "calc(33.333% - 10px)",
                boxSizing: "border-box",
              }}
            >
              <Card title={quiz.title}>
                <a href={quiz.url} target="_blank" rel="noreferrer">
                  ページに移動する
                </a>
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
                    marginBottom: "10px",
                  }}
                >
                  <Markdown>{quiz.question}</Markdown>
                  <h3>ユーザの回答</h3>
                  <Markdown>{quiz.answer}</Markdown>
                  <Markdown>{quiz.explanation}</Markdown>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
