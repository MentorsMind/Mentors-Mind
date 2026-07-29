import type { Meta, StoryObj } from "@storybook/react";
import { Confetti } from "./Confetti";
import { useState, useCallback } from "react";

// Interactive wrapper to demonstrate confetti activation
function ConfettiWrapper() {
  const [active, setActive] = useState(false);

  const handleClick = useCallback(() => {
    setActive(true);
  }, []);

  const handleComplete = useCallback(() => {
    setActive(false);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <button
        onClick={handleClick}
        className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg"
      >
        🎉 Launch Confetti
      </button>
      <p className="text-sm text-gray-500">
        Click the button to see confetti in action
      </p>
      <Confetti active={active} onComplete={handleComplete} />
    </div>
  );
}

const meta: Meta<typeof Confetti> = {
  title: "Components/Confetti",
  component: Confetti,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Canvas-based confetti celebration animation. Renders 150 colorful particles that fall with gravity for 3 seconds.",
      },
    },
  },
  argTypes: {
    active: {
      control: "boolean",
      description: "Triggers the confetti animation",
    },
    onComplete: {
      action: "completed",
      description: "Callback when animation finishes (3s)",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Confetti>;

export const Active: Story = {
  args: {
    active: true,
    onComplete: () => {},
  },
};

export const Inactive: Story = {
  args: {
    active: false,
    onComplete: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "When active is false, the component returns null (nothing rendered).",
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    active: false,
    onComplete: () => {},
  },
  render: () => <ConfettiWrapper />,
  parameters: {
    docs: {
      description: {
        story: "Interactive demo — click the button to trigger confetti.",
      },
    },
  },
};

export const DarkMode: Story = {
  args: {
    active: true,
    onComplete: () => {},
  },
  decorators: [
    (Story) => (
      <div className="dark dark:bg-[#050B0A] min-h-screen">
        <Story />
      </div>
    ),
  ],
};

export const QuickRelaunch: Story = {
  args: {
    active: true,
    onComplete: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Confetti can be triggered multiple times — each trigger shows a fresh burst.",
      },
    },
  },
};
