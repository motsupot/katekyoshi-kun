import React, { useEffect, useState } from "react";
import { Card, CardBase } from "./base";
import { PageInfo } from "../../types/Page";
import { useFetch } from "../../shared/hooks";
import { API_HOST } from "../../constants";
import Markdown from "react-markdown";

type Props = {
  pageInfo: PageInfo | null;
};

export const SummaryCard: React.FC<Props> = ({ pageInfo }) => {
  const [summary, setSummary] = useState<string | null>(null);

  const {
    data: summaryData,
    loading: isSummaryLoading,
    fetchData: fetchSummary,
  } = useFetch<typeof summary>(`${API_HOST}/predict/summary`, null);

  useEffect(() => {
    if (summaryData !== null) setSummary(summaryData);
  }, [summaryData]);

  const onClickSummary = () => {
    if (pageInfo == null) {
      console.error("ページの内容が取得できませんでした.");
      return;
    }
    fetchSummary({
      content: pageInfo.content,
      url: pageInfo.url,
      title: pageInfo.title,
    });
  };

  return (
    <Card title="要約">
      {summary || isSummaryLoading ? (
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
          {isSummaryLoading ? <p>要約中...</p> : <Markdown>{summary}</Markdown>}
        </div>
      ) : null}
      <button onClick={onClickSummary}>
        {summary ? "再要約する" : "要約する"}
      </button>
    </Card>
  );
};

export type Summary = CardBase &
  Props & {
    type: "Summary";
  };
