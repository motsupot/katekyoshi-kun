import React, { useState } from "react";
import { Card, CardBase } from "./base";

type Props = {
  model: string;
};

export const QuestionCard: React.FC<Props> = ({}) => {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState("ここに回答が入ります");

  const onClick = () => {
    setAnswer("回答しました。");
  };

  return (
    <Card title="質問する">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="質問を入力してください"
        />
      <button onClick={onClick}>質問する</button>
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
        {answer}
      </div>
    </Card>
  );
};

export type Question = CardBase &
  Props & {
    type: "Question";
  };
