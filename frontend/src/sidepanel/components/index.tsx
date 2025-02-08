import React from "react";
import { Question, QuestionCard } from "./Question";
import { Summary, SummaryCard } from "./Summary";
import { Quiz, QuizCard } from "./Quiz/Quiz";

export type CardProps = Summary | Question | Quiz;

// FIXME: type でどの型か確定するので型ガード無しでもいけないかな.

const isSummary = (p: CardProps): p is Summary => p.type === "Summary";
const isQuestion = (p: CardProps): p is Question => p.type === "Question";
const isQuiz = (p: CardProps): p is Quiz => p.type === "Quiz";

export const renderCard = (props: CardProps) => {
  if (isSummary(props)) {
    return <SummaryCard {...props} />;
  }
  if (isQuestion(props)) {
    return <QuestionCard {...props} />;
  }
  if (isQuiz(props)) {
    return <QuizCard {...props} />;
  }
};
