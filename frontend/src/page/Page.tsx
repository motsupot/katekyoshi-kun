import React, { useEffect } from "react";
import { useFetch } from "../shared/hooks";
import { API_HOST } from "../constants";
import Markdown from "react-markdown";

export const Page: React.FC = () => {
  // useFetch の初期値は空文字列（分析結果がテキストで返る想定）
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
        margin: 0,
        padding: "0 1rem",
        boxSizing: "border-box",
      }}
    >
      <h1>AI家庭教師くん</h1>
      <h2>あなたの人物像</h2>
      {loading && <p>読み込み中...</p>}
      {error && <p>{error}</p>}
      {data && (
        <div style={{ width: "70%" }}>
          <h3>分析結果</h3>
          <div style={{ width: "100%" }}>
            <Markdown>{data}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
};
