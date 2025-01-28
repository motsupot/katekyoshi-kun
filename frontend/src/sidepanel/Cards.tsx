import React from "react";
import { SortableList } from "../shared/components/SortableList/SortableList";

// Base card component
const Card: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: "#f9f9f9",
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

// Card variations
const SummaryCard: React.FC<{ content: string }> = ({ content }) => {
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
        {content}
      </div>
    </Card>
  );
};

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
  const [cards, setCards] = React.useState([
    { id: "1", component: <SummaryCard content="ここに要約が入ります" /> },
    {
      id: "2",
      component: (
        <ImageCard
          imageUrl="https://avatars.githubusercontent.com/u/19949534?v=4"
          caption="表示している部分について図示"
        />
      ),
    },
    {
      id: "3",
      component: <QuizCard quizText="ページ全体についてクイズ出題。" />,
    },
    {
      id: "4",
      component: (
        <ChatCard
          links={[
            "関連ページ情報その1",
            "関連ページ情報その2",
            "関連ページ情報その3",
          ]}
        />
      ),
    },
  ]);

  return (
    <>
      <div style={{ maxWidth: 400, margin: "30px auto" }}>
        <SortableList
          items={cards}
          onChange={setCards}
          renderItem={(item) => (
            <SortableList.Item id={item.id}>
              {item.component}
              <SortableList.DragHandle />
            </SortableList.Item>
          )}
        />
      </div>
    </>
  );
};

export default CardList;
