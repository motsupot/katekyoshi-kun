import React, { useEffect, useState } from "react";
import { PageInfo } from "../../../types/Page";
import { Card, CardBase } from "../base";
import { useFetch } from "../../../shared/hooks";
import { API_HOST } from "../../../constants";
import { buildFeedbackPrompt, buildQuestionPrompt } from "./prompt";
import { Question } from "./Question";
import { Feedback } from "./Feedback";
import { Answer } from "./Answer";

type Props = {
  pageInfo: PageInfo | null;
};

export const QuizCard: React.FC<Props> = ({ pageInfo }) => {
  const [questionText, setQuestionText] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);

  // クイズの問題を取得.
  const {
    data: resQuestion,
    loading: isQuestionLoading,
    fetchData: fetchQuestion,
  } = useFetch<string | null>(`${API_HOST}/predict/quiz`, null);

  useEffect(() => {
    if (resQuestion != null) setQuestionText(resQuestion);
  }, [resQuestion]);

  // 解答に対する答え合わせ（フィードバック）
  const {
    data: resFeedback,
    loading: isFeedbackLoading,
    fetchData: fetchFeedback,
  } = useFetch<string | null>(`${API_HOST}/predict/scoring`, null);

  useEffect(() => {
    if (resFeedback != null) setFeedback(resFeedback);
  }, [resFeedback]);

  const handleMakeQuestion = () => {
    if (pageInfo) {
      fetchQuestion({
        url: pageInfo.url,
        title: pageInfo.title,
        page_info: pageInfo.content,
      });
    }
  };

  const handleAnswer = () => {
    if (pageInfo && questionText) {
      fetchFeedback({
        text: buildFeedbackPrompt(pageInfo.content, questionText, answerText),
        chat_type: "scoring",
      });
    }
  };

  return (
    <Card title="クイズで理解度チェック">
      <Question
        questionText={questionText}
        isQuestionLoading={isQuestionLoading}
        handleMakeQuestion={handleMakeQuestion}
      />
      <Answer
        answerText={answerText}
        questionText={questionText}
        setAnswerText={setAnswerText}
        handleAnswer={handleAnswer}
      />
      <Feedback feedback={feedback} isFeedbackLoading={isFeedbackLoading} />
    </Card>
  );
};

export type Quiz = CardBase &
  Props & {
    type: "Quiz";
  };
