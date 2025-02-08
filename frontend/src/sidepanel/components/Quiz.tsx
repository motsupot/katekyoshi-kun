import React, { useState } from "react";
import { PageInfo } from "../../types/Page";
import { Card, CardBase } from "./base";

type Props = {
  pageInfo: PageInfo | null;
};

export const QuizCard: React.FC<Props> = ({ pageInfo }) => {
  const [questionText, setQuestionText] = useState<string | null>("ああああ");
  const [answerText, setAnswerText] = useState<string>("");
  const handleAnswer = () => {
    alert(`ans: ${answerText}`);
  }

  return (
    <Card title="クイズで理解度チェック">
      {questionText && <div>
        問題：{questionText}
      </div>}
      <textarea
        value={answerText}
        disabled={questionText == null}
        onChange={(e) => setAnswerText(e.target.value)}
        placeholder="解答を入力してください"
        rows={6}
        style={{ width: "100%", marginBottom: "4px" }}
      />
      <button onClick={handleAnswer}>送信</button>
    </Card>
  );
};

export type Quiz = CardBase &
  Props & {
    type: "Quiz";
  };
