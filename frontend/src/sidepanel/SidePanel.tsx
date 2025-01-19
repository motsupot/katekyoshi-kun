import React, { useEffect, useState } from "react";
import { API_HOST } from "../constants";

const SidePanelHeader: React.FC = () => (
  <h1>AI家庭教師くん（サイドパネル）</h1>
);

const usePageInfo = () => {
  const [pageInfo, setPageInfo] = useState<{ title: string; url: string; content: string } | null>(null);

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === "PAGE_INFO") {
        setPageInfo(message.pageInfo);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

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
  const pageInfo = usePageInfo();
  const [question, setQuestion] = useState<string>("");

  const { data: summary, loading: isSummaryLoading, fetchData: fetchSummary } = useFetch(
    `${API_HOST}/predict`,
    null
  );

  const { data: response, loading: isQuestionLoading, fetchData: fetchAnswer } = useFetch(
    `${API_HOST}/predict`,
    null
  );

  const handleSummary = () => {
    if (pageInfo) {
      fetchSummary({ text: `以下の情報を要約して: ${pageInfo.content}` });
    }
  };

  const handleQuestion = () => {
    if (pageInfo && question) {
      fetchAnswer({ text: `「${question}」と言う質問に対して、以下の情報を踏まえて回答せよ。: ${pageInfo.content}` });
    }
  };

  return (
    <div>
      <SidePanelHeader />
      {pageInfo && (
        <div>
          {!isSummaryLoading && !summary && <button onClick={handleSummary}>要約する</button>}
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
        <button onClick={handleQuestion} disabled={isQuestionLoading}>質問する</button>
        {isQuestionLoading && <p>考え中...</p>}
        {response && <p>{response}</p>}
      </div>
    </div>
  );
};
