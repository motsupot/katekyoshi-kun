import React from "react";
import Markdown from "react-markdown";
import { Card } from "../../sidepanel/components/base";
import { Bookmark } from "../../sidepanel/components/Bookmark";

type Props = {
  summaries: (Summary & { bookmark_id: string })[];
  loading: boolean;
  error: string | null;
  deleteBookmark: (bookmarkId: string) => void;
};

export const BookmarkSummariesUI: React.FC<Props> = ({
  summaries,
  loading,
  error,
  deleteBookmark,
}) => {
  if (loading) {
    return;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2
        style={{
          color: "#283E51",
          borderBottom: "2px solid #283E51",
          paddingBottom: "0.5rem",
        }}
      >
        ブックマークした要約一覧
      </h2>
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
          {summaries.map(({ bookmark_id: bookmarkId, ...summary }) => (
            <div
              key={summary.id}
              style={{
                width: "calc(33.333% - 10px)",
                boxSizing: "border-box",
              }}
            >
              <Card
                title={summary.title}
                rightElement={
                  bookmarkId && (
                    <Bookmark
                      isBookmarked={true}
                      isRegistering={false}
                      onRegister={() => {}}
                      onDelete={() => deleteBookmark(bookmarkId)}
                    />
                  )
                }
              >
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
