import React from "react";
import { Question, QuestionCard } from "./Question";
import { Summary, SummaryCard } from "./Summary";

export type CardProps = Summary | Question;

// FIXME: type でどの型か確定するので型ガード無しでもいけないかな.

const isSummary = (p: CardProps): p is Summary => p.type === "Summary";
const isQuestion = (p: CardProps): p is Question => p.type === "Question";

export const renderCard = (props: CardProps) => {
  if (isSummary(props)) {
    return <SummaryCard {...props} />;
  }
  if (isQuestion(props)) {
    return <QuestionCard {...props} />;
  }
};
