import React, { useEffect, useState } from "react";
import { CardProps, renderCard } from "./components";
import { SortableList } from "../shared/components/SortableList/SortableList";
import { usePageInfo } from "../shared/hooks";

const SidePanelHeader: React.FC = () => <h1>AI家庭教師くん（サイドパネル）</h1>;

export const SidePanel: React.FC = () => {
  const [, setQuestion] = useState<string>("");
  const [, setSummary] = useState<string | null>(null);
  const [, setResponse] = useState<string | null>(null);

  const resetStates = () => {
    setSummary(null);
    setResponse(null);
    setQuestion("");
  };

  const pageInfo = usePageInfo(resetStates);

  const [cards, setCards] = React.useState<CardProps[]>([
    {
      id: "1",
      type: "Summary",
      pageInfo,
    },
    { id: "3", type: "Question", pageInfo, model: "ahiahi" },
  ]);

  useEffect(() => {
    if (pageInfo == null) return;
    setCards(cards.map((card) => ({ ...card, pageInfo })));
  }, [pageInfo]);

  return (
    <>
      <SidePanelHeader />
      <div style={{ maxWidth: 400, margin: "30px auto" }}>
        <SortableList
          items={cards}
          onChange={setCards}
          renderItem={(item) => (
            <SortableList.Item id={item.id}>
              {renderCard(item)}
              <SortableList.DragHandle />
            </SortableList.Item>
          )}
        />
      </div>
    </>
  );
};
