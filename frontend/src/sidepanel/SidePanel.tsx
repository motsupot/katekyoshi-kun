import React, { useEffect } from "react";
import { CardProps, renderCard } from "./components";
import { SortableList } from "../shared/components/SortableList/SortableList";
import { usePageInfo } from "../shared/hooks";

const SidePanelHeader: React.FC = () => <h1>AI家庭教師くん（サイドパネル）</h1>;

export const SidePanel: React.FC = () => {
  const resetStates = () => {
    setCards([]); // 一度空配列にしてリセットを明示的にする

    setTimeout(() => {
      setCards([
        { id: "1", type: "Summary", pageInfo },
        { id: "2", type: "Question", pageInfo },
      ]);
    }, 0); // 次のレンダリングタイミングで状態を更新
  };

  const pageInfo = usePageInfo(resetStates);

  const [cards, setCards] = React.useState<CardProps[]>([
    { id: "1", type: "Summary", pageInfo },
    { id: "2", type: "Question", pageInfo },
  ]);

  useEffect(() => {
    if (pageInfo == null) return;
    setCards(cards.map((card) => ({ ...card, pageInfo })));
  }, [pageInfo]);

  return (
    <>
      <SidePanelHeader />
      <div>
        <button onClick={resetStates}>リセット</button>
      </div>
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
