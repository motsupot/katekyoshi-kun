import React, { useEffect } from "react";
import { useFetch } from "../shared/hooks";
import { API_HOST } from "../constants";
import Markdown from "react-markdown";
import { BookmarkSummaries } from "./BookmarkSummaries";
import { BookmarkQuizzes } from "./BookmarkQuizzes";
import { LoadingSpinner } from "../shared/components/LoadingSpinner/LoadingSpinner";

export const Page: React.FC = () => {
  const { data, loading, error, fetchData } = useFetch(
    API_HOST + "/analyze_profile",
    ""
  );

  useEffect(() => {
    (async () => {
      await fetchData({});
    })();
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f2f5, #ffffff)",
        padding: "2rem",
        boxSizing: "border-box",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <header
        style={{
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            margin: 0,
            color: "#283E51",
          }}
        >
          AI家庭教師くん：ダッシュボード
        </h1>
      </header>

      <main
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "2rem",
        }}
      >
        {loading && (
          <div>
            <LoadingSpinner />
          </div>
        )}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {data && (
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                borderBottom: "2px solid #283E51",
                paddingBottom: "0.5rem",
                color: "#283E51",
              }}
            >
              分析結果
            </h2>
            <div style={{ marginTop: "1rem" }}>
              <Markdown>{data}</Markdown>
            </div>
          </section>
        )}

        <section style={{ marginTop: "2rem" }}>
          <div style={{ marginTop: "1rem" }}>
            <BookmarkSummaries />
            <BookmarkQuizzes />
          </div>
        </section>
      </main>
    </div>
  );
};
