import React, { useState } from "react";
import { Card, CardBase } from "./base";

type Props = {
  content: string;
  hasGenerated: boolean;
}

export const SummaryCard: React.FC<Props> = ({}) => {
  const [summaryText, setSummaryText] = useState("ここに要約が入ります");

  const onClick = () => {
    setSummaryText("要約しました。");
  }

  return (
    <Card title="要約">
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
        {summaryText}
      </div>
      <button onClick={onClick}>要約する</button>
    </Card>
  );
};

export type Summary = CardBase & Props & {
  type: "Summary"
};
