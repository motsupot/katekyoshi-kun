import React, { useEffect, useState } from "react";
import { Card, CardBase } from "./base";
import { PageInfo } from "../../types/Page";
import { useBookmark, useFetch } from "../../shared/hooks";
import { API_HOST } from "../../constants";
import Markdown from "react-markdown";
import { Bookmark } from "./Bookmark";

type Props = {
  pageInfo: PageInfo | null;
};

export const SummaryCard: React.FC<Props> = ({ pageInfo }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryId, setSummaryId] = useState<string | null>(null);

  const {
    data: summaryData,
    loading: isSummaryLoading,
    fetchData: fetchSummary,
  } = useFetch<{ result: string; id: string } | null>(
    `${API_HOST}/predict/summary`,
    null
  );

  useEffect(() => {
    if (summaryData !== null) {
      setSummary(summaryData.result);
      setSummaryId(summaryData.id);
    }
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

  // ブックマーク追加
  const {
    isBookmarked,
    isRegistering,
    registerBookmark,
    deleteBookmark,
  } = useBookmark("summary");

  return (
    <Card
      title="要約"
      rightElement={
        summary && (
          <Bookmark
            isBookmarked={isBookmarked}
            isRegistering={isRegistering}
            onRegister={() => {
              if (summaryId == null) {
                console.error("要約IDが存在しません.");
                return;
              }
              registerBookmark(summaryId);
            }}
            onDelete={deleteBookmark}
          />
        )
      }
    >
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
