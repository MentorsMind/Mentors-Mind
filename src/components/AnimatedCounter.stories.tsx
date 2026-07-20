import type { Meta, StoryObj } from "@storybook/react";
import { AnimatedCounter } from "./AnimatedCounter";

const meta: Meta<typeof AnimatedCounter> = {
  title: "Components/AnimatedCounter",
  component: AnimatedCounter,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Animated number counter that increments from 0 to a target value using IntersectionObserver. Starts animation when scrolled into view.",
      },
    },
  },
  argTypes: {
    end: { control: "number", description: "Target number to count up to" },
    duration: {
      control: "number",
      description: "Animation duration in milliseconds",
    },
    suffix: {
      control: "text",
      description: 'Text suffix after the number (e.g., "+", "K")',
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AnimatedCounter>;

export const Default: Story = {
  args: {
    end: 100,
    duration: 2000,
    suffix: "+",
  },
  decorators: [
    (Story) => (
      <div className="text-4xl font-bold text-primary p-8">
        <Story />
      </div>
    ),
  ],
};

export const Fast: Story = {
  args: {
    end: 5000,
    duration: 500,
    suffix: "",
  },
  decorators: [
    (Story) => (
      <div className="text-4xl font-bold text-blue-600 p-8">
        <Story />
      </div>
    ),
  ],
};

export const Slow: Story = {
  args: {
    end: 42,
    duration: 5000,
    suffix: " answers",
  },
  decorators: [
    (Story) => (
      <div className="text-3xl font-bold text-purple-600 p-8">
        <Story />
      </div>
    ),
  ],
};

export const LargeNumber: Story = {
  args: {
    end: 1000000,
    duration: 3000,
    suffix: "+",
  },
  decorators: [
    (Story) => (
      <div className="text-5xl font-bold text-emerald-600 p-8">
        <Story />
      </div>
    ),
  ],
};

export const ZeroToNegative: Story = {
  args: {
    end: 0,
    duration: 1000,
    suffix: "",
  },
  decorators: [
    (Story) => (
      <div className="text-4xl font-bold text-gray-600 p-8">
        <Story />
      </div>
    ),
  ],
};

export const DarkMode: Story = {
  args: {
    end: 999,
    duration: 2000,
    suffix: " users",
  },
  decorators: [
    (Story) => (
      <div className="dark dark:bg-[#050B0A] p-8 rounded-lg min-h-[200px] flex items-center">
        <span className="text-4xl font-bold text-primary">
          <Story />
        </span>
      </div>
    ),
  ],
};
