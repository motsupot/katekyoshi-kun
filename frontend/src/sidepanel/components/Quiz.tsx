import React, { useEffect, useState } from "react";
import { PageInfo } from "../../types/Page";
import { Card, CardBase } from "./base";
import { useFetch } from "../../shared/hooks";
import { API_HOST } from "../../constants";

type Props = {
  pageInfo: PageInfo | null;
};

export const QuizCard: React.FC<Props> = ({ pageInfo }) => {
  const [questionText, setQuestionText] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);

  // クイズの問題を取得.
  const {
    data: resQuestion,
    loading: isQuestionLoading,
    fetchData: fetchQuestion,
  } = useFetch<string | null>(`${API_HOST}/predict`, null);

  useEffect(() => {
    if (resQuestion != null) setQuestionText(resQuestion);
  }, [resQuestion]);

  // 解答に対する答え合わせ（フィードバック）
  const {
    data: resFeedback,
    loading: isFeekbackLoading,
    fetchData: fetchFeedback,
  } = useFetch<string | null>(`${API_HOST}/predict`, null);

  useEffect(() => {
    if (resFeedback != null) setFeedback(resFeedback);
  }, [resFeedback]);

  const handleMakeQuestion = () => {
    if (pageInfo) {
      fetchQuestion({
        text: buildQuestionPrompt(pageInfo.content),
        chat_type: "quiz",
      });
    }
  };

  const handleAnswer = () => {
    if (pageInfo && questionText) {
      fetchFeedback({
        text: buildFeedbackPrompt(pageInfo.content, questionText, answerText),
        chat_type: "quiz",
      });
    }
  };

  return (
    <Card title="クイズで理解度チェック">
      <Question
        questionText={questionText}
        isQuestionLoading={isQuestionLoading}
        handleMakeQuestion={handleMakeQuestion}
      ></Question>
      <textarea
        value={answerText}
        disabled={questionText == null}
        onChange={(e) => setAnswerText(e.target.value)}
        placeholder="解答を入力してください"
        rows={6}
        style={{ width: "100%", marginBottom: "4px" }}
      />
      <button onClick={handleAnswer}>解答する</button>
      <div>フィードバック：{feedback}</div>
    </Card>
  );
};

const Question = ({
  questionText,
  isQuestionLoading,
  handleMakeQuestion,
}: {
  questionText: string | null;
  isQuestionLoading: boolean;
  handleMakeQuestion: () => void;
}) => {
  if (isQuestionLoading) {
    return <div>問題を作成中...</div>;
  }
  if (questionText == null) {
    return <button onClick={handleMakeQuestion}>出題する</button>;
  }
  return <div>問題：{questionText}</div>;
};

export type Quiz = CardBase &
  Props & {
    type: "Quiz";
  };

const buildQuestionPrompt = (pageContent: PageInfo["content"]): string => {
  return `
指示:

与えられたターゲットテキストの内容をもとに、読者の理解度を確認する自由記述形式のクイズを1問作成してください。

要件:

問題はターゲットテキスト内の情報に基づいたものとする。
解答者が説明・記述する形のオープンクエスチョンにする。
枝葉の内容ではなく、ターゲットテキストの主題や重要な概念・ポイントを問う問題にする。
具体例を求めたり、ターゲットテキスト内の概念を他と比較させたりする問いも含める。
ただし、問題および解答が200文字を超えないように注意する。

出力例:

○○とは何か？ ターゲットテキストの説明をもとに、○○の定義とその特徴を説明してください。
○○の主要な要素は何か？ ターゲットテキストの内容をもとに、○○を構成する重要な要素を挙げ、それぞれの役割を説明してください。
○○の具体的な例を挙げて説明してください。 ターゲットテキストの内容に基づき、○○がどのような場面で使われるかを具体的に説明してください。
○○と□□の違いは何か？ ターゲットテキストの説明を参考にしながら、○○と□□の違いを明確に述べてください。
○○を適切に活用するために注意すべき点は？ ターゲットテキストの内容に基づいて、○○を実践する際のポイントや注意点を説明してください。

ターゲットテキスト:
${pageContent}
`;
};

const buildFeedbackPrompt = (
  pageContent: PageInfo["content"],
  question: string,
  answer: string
): string => {
  return `
#指示:

あなたは採点者です。「ターゲットテキスト」をもとに「問題」が出題されました。解答者の「解答」を評価し、以下の要素を含めて採点してください。

## 得点 (100点満点で適切なスコアリングを設定)

完全正解 (100点)：ターゲットテキストの内容と一致し、重要なポイントを正しく説明している
部分正解 (50～90点)：一部のポイントは正しいが、説明不足や細かい誤りがある
誤答 (0～40点)：主要なポイントが欠落している、または誤った情報が含まれている

## 正しい部分

解答のどの点がターゲットテキストと合致しているかを具体的に指摘

## 間違っている・不足している部分

解答のどの点が間違っているか、または重要な情報が不足しているかを指摘
必要に応じて、正しい答えの一例を示す

## 改善点 (誤答や部分正解の場合)

どの部分を復習すれば満点に近づくかアドバイス

---

出力フォーマット例:
採点結果

## 得点: 70/100

## 正しい部分:

1. 「○○の定義」を正しく説明している。
2. 「○○と□□の違い」の一部が適切に述べられている。

## 間違っている・不足している部分:

「○○の応用例」が抜けているため、具体的な事例を挙げるとより良い解答になる。
「○○の特徴」の説明が不十分で、ターゲットテキストには「△△」という特徴も記載されていたが、これが欠けている。

## 改善点:

「○○の応用例」について資料を読み返すと良いでしょう。
「○○の特徴」に関する部分で「△△との比較」を注意深く読むと、より正確な理解が得られるでしょう。


---

ターゲットテキスト:

${pageContent}

問題:

${question}


解答:

${answer}

  `;
};
