import React from "react";
import Markdown from "react-markdown";

export const Feedback = ({
  feedback,
  isFeedbackLoading,
}: {
  feedback: string | null;
  isFeedbackLoading: boolean;
}) => {
  if (isFeedbackLoading) {
    return <div>解答を採点中...</div>;
  }
  if (feedback == null) {
    return <></>;
  }
  return (
    <div>
      <Markdown>{feedback}</Markdown>
    </div>
  );
};
