import React from "react";
import Markdown from "react-markdown";
import { Card } from "../../sidepanel/components/base";
import { Bookmark } from "../../sidepanel/components/Bookmark";

type Props = {
  quizzes: (Quiz & { bookmark_id: string })[];
  loading: boolean;
  error: string | null;
  deleteBookmark: (bookmarkId: string) => void;
};

export const BookmarkQuizzesUI: React.FC<Props> = ({
  quizzes,
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
        ブックマークしたクイズ一覧
      </h2>
      {quizzes.length === 0 ? (
        <p>ブックマークされたクイズはありません。</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            columnGap: "40px",
            rowGap: "8px",
          }}
        >
          {quizzes.map(({ bookmark_id: bookmarkId, ...quiz }) => (
            <div
              key={quiz.id}
              style={{
                width: "calc(33.333% - 40px)",
                boxSizing: "border-box",
              }}
            >
              <Card
                title={quiz.title}
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
                  <h3>自身の解答</h3>
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
