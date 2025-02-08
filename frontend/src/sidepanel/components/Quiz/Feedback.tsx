import React from "react";

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
  return <div>採点結果：{feedback}</div>;
};
