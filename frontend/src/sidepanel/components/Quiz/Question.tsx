import React from "react";
import Markdown from "react-markdown";

export const Question = ({
  questionText,
  isQuestionLoading,
  handleMakeQuestion,
}: {
  questionText: string | null;
  isQuestionLoading: boolean;
  handleMakeQuestion: () => void;
}) => {
  if (isQuestionLoading) {
    return <div>問題を作成中...</div>;
  }
  if (questionText == null) {
    return <button onClick={handleMakeQuestion}>出題する</button>;
  }
  return (
    <div>
      <Markdown>{questionText}</Markdown>
    </div>
  );
};
