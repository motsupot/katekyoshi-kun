import React, { useEffect, useState } from "react";
import { API_HOST } from "../constants";
import { getUserId } from "../shared/functions/getUserId";
import { BookmarkQuizzesUI } from "./components/BookmarkQuizzes";

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

  const [quizzes, setQuizzes] = useState<(Quiz & { bookmark_id: string })[]>(
    []
  );
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

  const deleteBookmark = (bookmarkId: string) => {
    fetch(`${API_HOST}/bookmarks/${bookmarkId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      setQuizzes((prev) => prev.filter((s) => s.bookmark_id !== bookmarkId));
    });
  };

  return (
    <BookmarkQuizzesUI
      quizzes={quizzes}
      loading={loading}
      error={error}
      deleteBookmark={deleteBookmark}
    />
  );
};
