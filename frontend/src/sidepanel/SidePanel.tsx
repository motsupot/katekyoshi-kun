import React, { useEffect, useState } from "react";
import { API_HOST } from "../constants";
import { CardProps, renderCard } from "./components";
import { SortableList } from "../shared/components/SortableList/SortableList";
import { useFetch, usePageInfo } from "../shared/hooks";

const SidePanelHeader: React.FC = () => <h1>AI家庭教師くん（サイドパネル）</h1>;

export const SidePanel: React.FC = () => {
  const [question, setQuestion] = useState<string>("");
  const [summary, setSummary] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const resetStates = () => {
    setSummary(null);
    setResponse(null);
    setQuestion("");
  };

  const pageInfo = usePageInfo(resetStates);

  const {
    data: summaryData,
    loading: isSummaryLoading,
    fetchData: fetchSummary,
  } = useFetch<typeof summary>(`${API_HOST}/predict`, null);

  const {
    data: responseData,
    loading: isQuestionLoading,
    fetchData: fetchAnswer,
  } = useFetch<typeof response>(`${API_HOST}/predict`, null);

  useEffect(() => {
    if (summaryData !== null) setSummary(summaryData);
  }, [summaryData]);

  useEffect(() => {
    if (responseData !== null) setResponse(responseData);
  }, [responseData]);

  const handleSummary = () => {
    if (pageInfo) {
      fetchSummary({ text: `以下の情報を要約して: ${pageInfo.content}` });
    }
  };

  const handleQuestion = () => {
    if (pageInfo && question) {
      fetchAnswer({
        text: `「${question}」と言う質問に対して、以下の情報を踏まえて回答せよ。: ${pageInfo.content}`,
      });
    }
  };

  const [cards, setCards] = React.useState<CardProps[]>([
    { id: "1", type: "Summary", pageInfo, content: "漸く要約", hasGenerated: true },
    { id: "3", type: "Question", pageInfo, model: "ahiahi" },
  ]);

  return (
    <>
      <div style={{ maxWidth: 400, margin: "30px auto" }}>
        <SortableList
          items={cards}
          onChange={setCards}
          renderItem={(item) => (
            <SortableList.Item id={item.id}>
              {renderCard(item)}
              <SortableList.DragHandle />
            </SortableList.Item>
          )}
        />
      </div>
    </>
  );
  return (
    <div>
      <SidePanelHeader />
      {pageInfo && (
        <div>
          {!isSummaryLoading && !summary && (
            <button onClick={handleSummary}>要約する</button>
          )}
          {isSummaryLoading && <p>要約中・・・</p>}
        </div>
      )}
      {summary && (
        <div>
          <h2>要約</h2>
          <p>{summary}</p>
          <button onClick={handleSummary}>再要約する</button>
        </div>
      )}
      <div>
        <h2>質問する</h2>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="質問を入力してください"
        />
        <button onClick={handleQuestion} disabled={isQuestionLoading}>
          質問する
        </button>
        {isQuestionLoading && <p>考え中...</p>}
        {response && <p>{response}</p>}
      </div>
    </div>
  );
};
