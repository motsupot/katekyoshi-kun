import React, { useEffect, useState } from "react";
import { API_HOST } from "../constants";
import { getUserId } from "../shared/functions/getUserId";
import { BookmarkSummariesUI } from "./components/BookmarkSummaries";

export const BookmarkSummaries: React.FC = ({
  originalSummaries,
  originalLoading,
}: {
  originalSummaries?: Summary[];
  originalLoading?: boolean;
}) => {
  const [summaries, setSummaries] = useState<Summary[]>(
    originalSummaries ?? []
  );
  const [loading, setLoading] = useState(originalLoading ?? true);
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

  return (
    <BookmarkSummariesUI
      summaries={summaries}
      loading={loading}
      error={error}
    />
  );
};
