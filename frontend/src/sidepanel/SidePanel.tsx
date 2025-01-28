import React, { useEffect, useState } from "react";
import { API_HOST } from "../constants";
import { CardProps, renderCard } from "./components";
import { SortableList } from "../shared/components/SortableList/SortableList";

const SidePanelHeader: React.FC = () => <h1>AI家庭教師くん（サイドパネル）</h1>;

const usePageInfo = (onPageChange: () => void) => {
  const [pageInfo, setPageInfo] = useState<{
    title: string;
    url: string;
    content: string;
  } | null>(null);

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === "PAGE_INFO") {
        setPageInfo(message.pageInfo);
        onPageChange();
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [onPageChange]);

  return pageInfo;
};

const useFetch = (url: string, defaultState: any) => {
  const [data, setData] = useState(defaultState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (body: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result?.predictions || "APIからの応答が不正です。");
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError("エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
};

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
  } = useFetch(`${API_HOST}/predict`, null);

  const {
    data: responseData,
    loading: isQuestionLoading,
    fetchData: fetchAnswer,
  } = useFetch(`${API_HOST}/predict`, null);

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
    { id: "1", type: "Summary", content: "漸く要約", hasGenerated: true },
    { id: "3", type: "Question", model: "ahiahi" },
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
