import React, { useEffect } from "react";
import { CardProps, renderCard } from "./components";
import { SortableList } from "../shared/components/SortableList/SortableList";
import { usePageInfo } from "../shared/hooks";

const SidePanelHeader: React.FC = () => <h1>AI家庭教師くん</h1>;

export const SidePanel: React.FC = () => {
  const resetStates = () => {
    setCards([]); // 一度空配列にしてリセットを明示的にする

    setTimeout(() => {
      setCards([
        { id: "1", type: "Summary", pageInfo },
        { id: "2", type: "Question", pageInfo },
        { id: "3", type: "Quiz", pageInfo },
      ]);
    }, 0); // 次のレンダリングタイミングで状態を更新
  };

  const pageInfo = usePageInfo(resetStates);

  const [cards, setCards] = React.useState<CardProps[]>([
    { id: "1", type: "Summary", pageInfo },
    { id: "2", type: "Question", pageInfo },
    { id: "3", type: "Quiz", pageInfo },
  ]);

  useEffect(() => {
    if (pageInfo == null) return;
    setCards(cards.map((card) => ({ ...card, pageInfo })));
  }, [pageInfo]);

  const handleOpenAnalysis = () => {
    const url = "dist/page/index.html";
    // chrome.tabs.create は Chrome Extension 環境向け
    if (chrome && chrome.tabs && chrome.tabs.create) {
      chrome.tabs
        .create({ url })
        .catch((err) => console.log("タブ作成エラー:", err));
    } else {
      // 拡張機能でない場合は window.open にフォールバック
      window.open(url, "_blank");
    }
  };

  return (
    <>
      <SidePanelHeader />
      <div>
        <button onClick={resetStates}>リセット</button>
        <button onClick={handleOpenAnalysis}>ダッシュボードを開く</button>
      </div>
      <div style={{ margin: "30px auto" }}>
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
