import React from "react";
import Markdown from "react-markdown";
import { Card } from "../../sidepanel/components/base";

type Props = {
  summaries: Summary[];
  loading: boolean;
  error: string | null;
};

export const BookmarkSummariesUI: React.FC<Props> = ({
  summaries,
  loading,
  error,
}) => {
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
