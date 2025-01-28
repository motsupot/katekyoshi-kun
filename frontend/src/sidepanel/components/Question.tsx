import React, { useEffect, useState } from "react";
import { Card, CardBase } from "./base";
import { PageInfo } from "../../types/Page";
import { useFetch } from "../../shared/hooks";
import { API_HOST } from "../../constants";

type Props = {
  pageInfo: PageInfo | null;
  model: string;
};

export const QuestionCard: React.FC<Props> = ({ pageInfo }) => {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string | null>(null);

  const {
    data: responseData,
    loading: isQuestionLoading,
    fetchData: fetchAnswer,
  } = useFetch<typeof answer>(`${API_HOST}/predict`, null);

  useEffect(() => {
    if (responseData !== null) setAnswer(responseData);
  }, [responseData]);

  const handleQuestion = () => {
    if (pageInfo && question) {
      fetchAnswer({
        text: `「${question}」と言う質問に対して、以下の情報を踏まえて回答せよ。: ${pageInfo.content}`,
      });
    }
  };

  return (
    <Card title="質問する">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="質問を入力してください"
        />
      <button onClick={handleQuestion}>質問する</button>
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
        }}
      >
        {isQuestionLoading ? "考え中..." : answer ?? "ここに回答が入ります"}
      </div>
    </Card>
  );
};

export type Question = CardBase &
  Props & {
    type: "Question";
  };
