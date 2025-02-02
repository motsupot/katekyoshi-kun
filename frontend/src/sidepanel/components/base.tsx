import React from "react";
import { BaseItem } from "../../shared/components/SortableList/SortableList";

type CardType = "Summary" | "Question" | "Quiz";

export type CardBase = BaseItem & {
  type: CardType;
};

export const Card: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: "#f9f9f9",
        width: "100%",
      }}
    >
      <h3
        style={{
          fontSize: "18px",
          margin: "0 0 12px",
          color: "#333",
        }}
      >
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
};
