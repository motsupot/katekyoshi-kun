import type { Meta, StoryObj } from '@storybook/react';

import { fn } from '@storybook/test';
import { BookmarkQuizzesUI } from './BookmarkQuizzes';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'panel/BookmarkQuizzes',
  component: BookmarkQuizzesUI,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'boolean' },
  },
  args: {
    deleteBookmark: fn(),
  }
} satisfies Meta<typeof BookmarkQuizzesUI>;

export default meta;
type Story = StoryObj<typeof meta>;

const quiz = {
  id: "hoge",
  title: "何かしらのタイトルああああああああああ",
  question: "質問がここに入ります。質問がここに入ります。質問がここに入ります。質問がここに入ります。質問がここに入ります。質問がここに入ります。質問がここに入ります。質問がここに入ります。質問がここに入ります。質問がここに入ります。",
  answer: "解答がここに入ります。解答がここに入ります。解答がここに入ります。解答がここに入ります。解答がここに入ります。解答がここに入ります。解答がここに入ります。",
  score: 80,
  explanation: "フィードバックがここに入ります。フィードバックがここに入ります。フィードバックがここに入ります。フィードバックがここに入ります。フィードバックがここに入ります。フィードバックがここに入ります。フィードバックがここに入ります。",
  url: "https://google.com",
  bookmark_id: "bookmarkId",
} as const;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    quizzes: [quiz, quiz, quiz],
    loading: false,
    error: null,
  },
};

export const NoSummaries: Story = {
  args: {
    quizzes: [],
    loading: false,
    error: null,
  },
};

export const Loading: Story = {
  args: {
    quizzes: [],
    loading: true,
    error: null,
  },
};

export const Error: Story = {
  args: {
    quizzes: [],
    loading: false,
    error: "エラーがあるよ",
  },
};
