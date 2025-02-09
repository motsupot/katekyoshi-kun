import type { Meta, StoryObj } from '@storybook/react';
import "../../sidepanel.css"
import { QuizCard } from './Quiz';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'sidepanel/Quiz',
  component: QuizCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // backgroundColor: { control: 'boolean' },
  },
  // args: { onClick: fn() },
} satisfies Meta<typeof QuizCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    pageInfo: null,
  },
};
