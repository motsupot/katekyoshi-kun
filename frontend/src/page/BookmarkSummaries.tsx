import React, { useEffect, useState } from "react";
import { API_HOST } from "../constants";
import { getUserId } from "../shared/functions/getUserId";
import { BookmarkSummariesUI } from "./components/BookmarkSummaries";

export const BookmarkSummaries: React.FC = ({}: {}) => {
  const [summaries, setSummaries] = useState<(Summary & { bookmarkId: string})[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const userId = await getUserId();
        const response = await fetch(`${API_HOST}/bookmarks/summary/${userId}`);
        if (!response.ok) {
          throw new Error("サマリーの取得に失敗しました");
        }
        const data = await response.json();
        setSummaries(data.summaries);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, []);

  const deleteBookmark = (bookmarkId: string) => {
    fetch(`${API_HOST}/bookmarks/${bookmarkId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      // setIsBookmarked(false);
    });
  };

  return (
    <BookmarkSummariesUI
      summaries={summaries}
      loading={loading}
      error={error}
      deleteBookmark={deleteBookmark}
    />
  );
};
