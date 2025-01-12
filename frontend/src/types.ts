export type MessageActionsId = {
  action: 'get-zenn-articles';
};

export type ZennArticleData = {
  title: string;
  url: string;
  emoji: string;
};

export type ResponseMessageData = {
  data: ZennArticleData[];
};
