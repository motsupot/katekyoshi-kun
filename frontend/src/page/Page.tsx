import React, { useEffect } from "react";
import { useFetchData } from "../shared/hooks";
import { API_HOST } from "../constants";

export const Page: React.FC = () => {
  const { data, loading, error, fetchData } = useFetchData<any[]>(
    `${API_HOST}/data`,
    []
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>AI家庭教師くん</h1>
      <h2>データ一覧</h2>

      {loading && <p>データを取得中...</p>}
      {error && <p>エラー: {error}</p>}

      {!loading && !error && data.length > 0 ? (
        <ul>
          {data.map((item, index) => (
            <li
              key={index}
              style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc" }}
            >
              <p>
                <strong>質問:</strong> {item.question}
              </p>
              <p>
                <strong>回答:</strong> {item.answer}
              </p>
              <p>
                <strong>タイプ:</strong> {item.type}
              </p>
              <p>
                <strong>ユーザー:</strong> {item.user}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>データがありません。</p>
      )}
    </div>
  );
};
