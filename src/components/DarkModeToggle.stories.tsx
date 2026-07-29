import type { Meta, StoryObj } from "@storybook/react";
import { DarkModeToggle } from "./DarkModeToggle";
import { ThemeProvider } from "../contexts/ThemeContext";

const meta: Meta<typeof DarkModeToggle> = {
  title: "Components/DarkModeToggle",
  component: DarkModeToggle,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Dark mode toggle button that cycles between Light, Dark, and System themes. Displays appropriate icons (Sun, Moon, Monitor).",
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="min-h-[200px] flex items-center justify-center p-8">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DarkModeToggle>;

export const Default: Story = {
  args: {},
};

export const DarkMode: Story = {
  args: {},
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="dark dark:bg-[#050B0A] min-h-[200px] flex items-center justify-center p-8">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export const SystemMode: Story = {
  args: {},
  decorators: [
    (Story) => {
      // Override theme to system via localStorage
      localStorage.setItem("theme", "system");
      return (
        <ThemeProvider>
          <div className="min-h-[200px] flex items-center justify-center p-8 bg-gray-50 dark:bg-[#050B0A]">
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
};

export const WithCustomPosition: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          "Shows how the toggle looks in a custom layout context (not fixed positioned).",
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="relative min-h-[200px] flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export const DarkModeWithCustomBg: Story = {
  args: {},
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="dark dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 min-h-[200px] flex items-center justify-center p-8">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};
