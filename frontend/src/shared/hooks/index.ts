import { useEffect, useState } from "react";
import { PageInfo } from "../../types/Page";

export const usePageInfo = (onPageChange: () => void) => {
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

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
  }, [onPageChange, pageInfo]);

  return pageInfo;
};

export const useFetch = <T>(url: string, defaultState: T) => {
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
