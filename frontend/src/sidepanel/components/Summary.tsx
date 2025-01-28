import React from "react";
import { Card, CardBase } from "./base";

export type Summary = CardBase & {
  content: string;
  hasGenerated: boolean;
};

export const SummaryCard: React.FC<Summary> = ({ content, hasGenerated }) => {
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
        {hasGenerated ? content : "ここに要約が入ります"}
      </div>
    </Card>
  );
};
