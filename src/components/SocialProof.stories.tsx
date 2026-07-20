import type { Meta, StoryObj } from "@storybook/react";
import { SocialProof } from "./SocialProof";

const meta: Meta<typeof SocialProof> = {
  title: "Components/SocialProof",
  component: SocialProof,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Social proof component showing recent user activity and trust badges (SSL Secure, Verified Platform). Rotates through users every 4 seconds.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SocialProof>;

export const Default: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="w-[350px] p-6 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl">
        <Story />
      </div>
    ),
  ],
};

export const DarkMode: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="dark w-[350px] p-6 bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-2xl">
        <Story />
      </div>
    ),
  ],
};

export const LightBackground: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="w-[350px] p-6 bg-blue-600 rounded-2xl">
        <Story />
      </div>
    ),
  ],
};

export const Compact: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="w-[280px] p-4 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-xl">
        <Story />
      </div>
    ),
  ],
};

export const DarkModeCompact: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="dark w-[280px] p-4 bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-xl">
        <Story />
      </div>
    ),
  ],
};
