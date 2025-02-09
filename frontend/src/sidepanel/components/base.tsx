import React from "react";
import { BaseItem } from "../../shared/components/SortableList/SortableList";

type CardType = "Summary" | "Question" | "Quiz";

export type CardBase = BaseItem & {
  type: CardType;
};

export const Card: React.FC<{
  title: string;
  children: React.ReactNode;
  rightElement?: React.ReactNode;
}> = ({ title, children, rightElement }) => {
  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: "#f9f9f9",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "bottom",
          marginBottom: "12px",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            margin: 0,
            color: "#333",
          }}
        >
          {title}
        </h3>
        {rightElement && <div>{rightElement}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
};
