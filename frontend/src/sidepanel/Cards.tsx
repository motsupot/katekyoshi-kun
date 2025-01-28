import React from "react";
import { SortableList } from "../shared/components/SortableList/SortableList";
import { Card } from "./components/base";
import { CardProps, renderCard } from "./components";

const ImageCard: React.FC<{ imageUrl: string; caption: string }> = ({
  imageUrl,
  caption,
}) => {
  return (
    <Card title="画像表示">
      <div style={{ textAlign: "center" }}>
        <img
          src={imageUrl}
          alt={caption}
          style={{ maxWidth: "100%", borderRadius: "4px", marginBottom: "8px" }}
        />
        <p style={{ color: "#777", fontSize: "12px" }}>{caption}</p>
      </div>
    </Card>
  );
};

const QuizCard: React.FC<{ quizText: string }> = ({ quizText }) => {
  return (
    <Card title="クイズ">
      <p style={{ color: "#555", fontSize: "14px", lineHeight: "1.6" }}>
        {quizText}
      </p>
    </Card>
  );
};

const ChatCard: React.FC<{ links: string[] }> = ({ links }) => {
  return (
    <Card title="関連ページ情報">
      <ul
        style={{
          paddingLeft: "20px",
          color: "#0073e6",
          fontSize: "14px",
          lineHeight: "1.8",
        }}
      >
        {links.map((link, index) => (
          <li key={index}>
            <a
              href="https://yahoo.co.jp"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
};

// Main component
const CardList: React.FC = () => {
  const [cards, setCards] = React.useState<CardProps[]>([
    { id: "1", type: "Summary", content: "漸く要約", hasGenerated: true },
    { id: "3", type: "Question", model: "ahiahi" },
  ]);

  return (
    <>
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

export default CardList;
