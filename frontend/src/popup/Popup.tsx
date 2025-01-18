import React, { useEffect, useState } from "react";

export const Popup: React.FC = () => {
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab || !activeTab.id) return;

      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          func: () => window.getSelection()?.toString(),
        },
        (injectionResults) => {
          if (chrome.runtime.lastError) {
            console.error("Error:", chrome.runtime.lastError.message);
            return;
          }
          const selectedText =
            injectionResults?.[0]?.result || "No text selected.";
          setQuestion(selectedText);
        }
      );
    });
  }, []);

  const handleAsk = () => {
    setResponse("考え中...");

    const apiUrl = "http://localhost:8888/predict";

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: question }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data?.predictions) {
          setResponse(data.predictions);
        } else {
          setResponse("APIからの応答が不正です。");
        }
      })
      .catch((err) => {
        console.error("Error during API call:", err);
        setResponse("エラーが発生しました。");
      });
  };

  return (
    <div style={{ width: 300, padding: 10 }}>
      <h1>AI家庭教師くん（popup）</h1>
      <textarea
        style={{ width: "100%", height: 100, marginBottom: 10 }}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="質問を入力してください~~"
      />
      <button style={{ padding: "10px 20px" }} onClick={handleAsk}>
        質問する
      </button>
      <div style={{ marginTop: 10, whiteSpace: "pre-line" }}>{response}</div>
    </div>
  );
};
