import React from "react";

export const Answer = ({
  answerText,
  questionText,
  setAnswerText,
  handleAnswer,
}: {
  answerText: string;
  questionText: string | null;
  setAnswerText: (newAnswer: string) => void;
  handleAnswer: () => void;
}) => {
  return (
    <>
      <textarea
        value={answerText}
        disabled={questionText == null}
        onChange={(e) => setAnswerText(e.target.value)}
        placeholder="解答を入力してください"
        rows={6}
        style={{ width: "100%", marginBottom: "4px" }}
      />
      <button onClick={handleAnswer}>解答する</button>
    </>
  );
};
