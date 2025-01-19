import React, { useEffect, useState } from "react";
import { API_HOST } from "../constants";

const SidePanelHeader: React.FC = () => (
  <h1>AI家庭教師くん（サイドパネル）</h1>
);

export const SidePanel: React.FC = () => {
  const [pageInfo, setPageInfo] = useState<{ title: string; url: string; content: string } | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string | null>(null);
  const [isQuestionLoading, setIsQuestionLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === "PAGE_INFO") {
        setPageInfo(message.pageInfo);
        setSummary(null);
        setResponse(null);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const fetchSummary = async () => {
    if (!pageInfo) return;

    setIsSummaryLoading(true);
    setSummary(null);

    try {
      const apiUrl = `${API_HOST}/predict`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: `以下の情報を要約して: ${pageInfo.content}` }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data?.predictions) {
        setSummary(data.predictions);
      } else {
        setSummary("APIからの応答が不正です。");
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSummary("エラーが発生しました。");
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!pageInfo) return;
    if (!question) return;

    setIsQuestionLoading(true);
    setResponse("考え中...");

    try {
      const apiUrl = `${API_HOST}/predict`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: `「${question}」と言う質問に対して、以下の情報を踏まえて回答せよ。: ${pageInfo.content}` }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data?.predictions) {
        setResponse(data.predictions);
      } else {
        setResponse("APIからの応答が不正です。");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      setResponse("エラーが発生しました。");
    } finally {
      setIsQuestionLoading(false);
    }
  };

  return (
    <div>
      <SidePanelHeader />
      {pageInfo && (
        <div>
          {!isSummaryLoading && !summary && <button onClick={fetchSummary}>要約する</button>}
          {isSummaryLoading && <p>要約中・・・</p>}
        </div>
      )}
      {summary && (
        <div>
          <h2>要約</h2>
          <p>{summary}</p>
          <button onClick={fetchSummary}>再要約する</button>
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
        <button onClick={handleAsk} disabled={isQuestionLoading}>質問する</button>
        {response && <p>{response}</p>}
      </div>
    </div>
  );
};