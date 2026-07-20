import type { Meta, StoryObj } from "@storybook/react";
import { PasswordStrength } from "./PasswordStrength";

const meta: Meta<typeof PasswordStrength> = {
  title: "Components/PasswordStrength",
  component: PasswordStrength,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Password strength indicator with visual bar and label. Evaluates length, character variety, and provides feedback.",
      },
    },
  },
  argTypes: {
    password: {
      control: "text",
      description: "The password string to evaluate",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PasswordStrength>;

export const Empty: Story = {
  args: {
    password: "",
  },
  parameters: {
    docs: {
      description: {
        story:
          "When no password is provided, the component returns null (nothing rendered).",
      },
    },
  },
};

export const Weak: Story = {
  args: {
    password: "abc",
  },
  parameters: {
    docs: {
      description: {
        story: "Score < 40 — too short, no variety.",
      },
    },
  },
};

export const Fair: Story = {
  args: {
    password: "Password1",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Score 40-59 — has length and some variety but missing special chars.",
      },
    },
  },
};

export const Good: Story = {
  args: {
    password: "Password1!",
  },
  parameters: {
    docs: {
      description: {
        story: "Score 60-79 — good length, upper/lower/numbers/special chars.",
      },
    },
  },
};

export const Strong: Story = {
  args: {
    password: "MyStr0ng!Passw0rd#2024",
  },
  parameters: {
    docs: {
      description: {
        story: "Score 80+ — excellent length with all character varieties.",
      },
    },
  },
};

export const DarkMode: Story = {
  args: {
    password: "MyStr0ng!Passw0rd#2024",
  },
  decorators: [
    (Story) => (
      <div className="dark dark:bg-[#050B0A] p-8 rounded-lg min-w-[300px]">
        <Story />
      </div>
    ),
  ],
};
