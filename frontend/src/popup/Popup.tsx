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
    <div className="w-[300px] p-4 bg-gradient-to-b from-blue-50 to-purple-100 rounded shadow-lg">
      <h1 className="text-lg font-bold text-purple-600 mb-4">
        AI家庭教師くん（popup）
      </h1>
      <textarea
        className="w-full h-24 p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4 bg-white"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="質問を入力してください~~"
      />
      <button
        className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded hover:from-green-400 hover:to-teal-400 transition-colors"
        onClick={handleAsk}
      >
        質問する
      </button>
      <div
        className="mt-4 p-2 bg-white border border-gray-300 rounded text-gray-700 whitespace-pre-line"
      >
        {response || "ここに回答が表示されます"}
      </div>
    </div>
  );
};
