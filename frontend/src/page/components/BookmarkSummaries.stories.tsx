import type { Meta, StoryObj } from '@storybook/react';

import { BookmarkSummariesUI } from "./BookmarkSummaries";
import { fn } from '@storybook/test';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'panel/BookmarkSummaries',
  component: BookmarkSummariesUI,
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
} satisfies Meta<typeof BookmarkSummariesUI>;

export default meta;
type Story = StoryObj<typeof meta>;

const summary = {
  id: "hoge",
  title: "何かしらのタイトルああああああああああ",
  body: "要約がここに入ります。要約がここに入ります。要約がここに入ります。要約がここに入ります。要約がここに入ります。要約がここに入ります。要約がここに入ります。要約がここに入ります。要約がここに入ります。",
  url: "https://google.com",
  bookmarkId: "bookmarkId",
} as const;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    summaries: [summary, summary, summary],
    loading: false,
    error: null,
  },
};

export const NoSummaries: Story = {
  args: {
    summaries: [],
    loading: false,
    error: null,
  },
};

export const Loading: Story = {
  args: {
    summaries: [],
    loading: true,
    error: null,
  },
};

export const Error: Story = {
  args: {
    summaries: [],
    loading: false,
    error: "エラーがあるよ",
  },
};
