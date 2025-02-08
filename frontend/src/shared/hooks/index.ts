import { useEffect, useState } from "react";
import { PageInfo } from "../../types/Page";
import { getUserId } from "../functions/getUserId";
import { API_HOST } from "../../constants";

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
      const userId = await getUserId();

      const requestBody = {
        ...body,
        user_id: userId,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
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

export const useFetchData = <T>(defaultState: T) => {
  const [data, setData] = useState<T>(defaultState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // ユーザーIDを取得
      const userId = await getUserId();

      // データを取得
      const response = await fetch(`${API_HOST}/data?user_id=${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result.qa_sessions || []);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError("エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
};

export const useBookmark = (type: "summary" | "question" | "quiz") => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [bookmarkId, setBookmarkId] = useState<boolean>(false);

  const registerBookmark = (contentId: string) => {
    setIsRegistering(true);
    getUserId()
      .then((userId) =>
        fetch(`${API_HOST}/bookmarks/${type}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: contentId,
            user_id: userId,
          }),
        })
      )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        setIsBookmarked(true);
        return res.json();
      })
      .then((result) => setBookmarkId(result.id))
      .finally(() => setIsRegistering(false));
  };

  return { isBookmarked, isRegistering, bookmarkId, registerBookmark };
};
