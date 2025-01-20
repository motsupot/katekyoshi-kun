import React, { useEffect, useState } from "react";
import { API_HOST } from "../constants";

const SidePanelHeader: React.FC = () => (
  <h1>AI家庭教師くん（サイドパネル）</h1>
);

export const SidePanel: React.FC = () => {
  const [pageInfo, setPageInfo] = useState<{ title: string; url: string; content: string } | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === "PAGE_INFO") {
        setPageInfo(message.pageInfo);
        setSummary(null);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const fetchSummary = async () => {
    if (!pageInfo) return;

    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return (
    <div>
      <SidePanelHeader />
      {pageInfo && (
        <div>
          {!isLoading && !summary && <button onClick={fetchSummary}>要約する</button>}
          {isLoading && <p>要約中・・・</p>}
        </div>
      )}
      {summary && (
        <div>
          <h2>要約</h2>
          <p>{summary}</p>
          <button onClick={fetchSummary}>再要約する</button>
        </div>
      )}
    </div>
  );
};
