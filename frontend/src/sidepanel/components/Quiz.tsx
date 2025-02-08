import React, { useEffect, useState } from "react";
import { PageInfo } from "../../types/Page";
import { Card, CardBase } from "./base";
import { useFetch } from "../../shared/hooks";
import { API_HOST } from "../../constants";

type Props = {
  pageInfo: PageInfo | null;
};

export const QuizCard: React.FC<Props> = ({ pageInfo }) => {
  const [questionText, setQuestionText] = useState<string | null>("ああああ");
  const [answerText, setAnswerText] = useState<string>("");
  const [feedback, setFeedback] = useState<string>(null);
  const handleAnswer = () => {
    alert(`ans: ${answerText}`);
  };

  // クイズの問題を取得.
  const {
    data: resQuestion,
    loading: isQuestionLoading,
    fetchData: fetchQuestion,
  } = useFetch<string | null>(`${API_HOST}/predict`, null);

  useEffect(() => {

  }, [resQuestion])

  // 解答に対する答え合わせ（フィードバック）
  const {
    data: resFeedback,
    loading: isFeekbackLoading,
    fetchData: fetchFeedback,
  } = useFetch<string | null>(`${API_HOST}/predict`, null);

  useEffect(() => {

  }, [resFeedback])

  return (
    <Card title="クイズで理解度チェック">
      {questionText && <div>問題：{questionText}</div>}
      <textarea
        value={answerText}
        disabled={questionText == null}
        onChange={(e) => setAnswerText(e.target.value)}
        placeholder="解答を入力してください"
        rows={6}
        style={{ width: "100%", marginBottom: "4px" }}
      />
      <button onClick={handleAnswer}>送信</button>
      <div>
        フィードバック：{feedback}
      </div>
    </Card>
  );
};

export type Quiz = CardBase &
  Props & {
    type: "Quiz";
  };
