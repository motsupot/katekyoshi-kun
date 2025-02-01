import React, { ChangeEventHandler, useState } from "react";

export const Page: React.FC<{
  selectedText: string | null;
}> = ({ selectedText }) => {
  const [question, setQuestion] = useState<string>(
    selectedText ?? "なっしんぐ",
  );

  const onClick = () => {
    alert("押され番長");
  };

  const onQuestionChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setQuestion(e.target.value);
  };

  return (
    <>
      <h1>AI家庭教師くん</h1>
      <textarea
        id="question"
        placeholder="質問を入力してください~~"
        value={question}
        onChange={onQuestionChange}
      ></textarea>
      <button id="askButton">質問する</button>
      <div id="response"></div>
      <button onClick={onClick} />
    </>
  );
};
