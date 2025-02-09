import React, { useEffect, useState } from "react";
import { API_HOST } from "../constants";
import Markdown from "react-markdown";
import { getUserId } from "../shared/functions/getUserId";
import { Card } from "../sidepanel/components/base";

export const Bookmarks: React.FC = () => {
  interface Summary {
    id: string;
    title: string;
    body: string;
    url: string;
  }

  const [summaries, setSummaries] = useState<Summary[]>([]);
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

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>ブックマークしたサマリー一覧</h2>
      {summaries.length === 0 ? (
        <p>ブックマークされたサマリーはありません。</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {summaries.map((summary) => (
            <div
              key={summary.id}
              style={{
                width: "calc(33.333% - 10px)",
                boxSizing: "border-box",
              }}
            >
              <Card title={summary.title}>
                <a href={summary.url} target="_blank" rel="noreferrer">
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
                  <Markdown>{summary.body}</Markdown>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
