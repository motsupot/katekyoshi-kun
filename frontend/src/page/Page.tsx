import React from "react";

export const Page: React.FC<{
  selectedText: string | null;
}> = ({ selectedText }) => {
  const onClick = () => {
    alert("押され番長");
  };

  return (
    <>
      <div>選択中のテキスト: {selectedText ?? "なっしんぐ"}</div>
      <div>こここ人んちなh</div>
      <button onClick={onClick} />
    </>
  );
};
