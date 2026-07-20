import type { Meta, StoryObj } from "@storybook/react";
import { BookingModal } from "./BookingModal";
import { BookingProvider } from "../contexts/BookingContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { useEffect } from "react";

const MOCK_MENTOR = {
  mentorId: "mentor-1",
  mentorName: "Sarah Chen",
  mentorImage:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
};

// Wrapper to set up mock auth user
function StoryWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const mockUser = {
      id: "storybook-user-1",
      name: "Jane Doe",
      email: "jane@example.com",
      role: "learner" as const,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100",
    };
    localStorage.setItem("currentUser", JSON.stringify(mockUser));
    return () => localStorage.removeItem("currentUser");
  }, []);
  return <>{children}</>;
}

const meta: Meta<typeof BookingModal> = {
  title: "Components/BookingModal",
  component: BookingModal,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Modal for requesting a mentorship session with a mentor.",
      },
    },
  },
  argTypes: {
    isOpen: { control: "boolean" },
    onClose: { action: "closed" },
    mentorId: { control: "text" },
    mentorName: { control: "text" },
    mentorImage: { control: "text" },
  },
  decorators: [
    (Story) => (
      <StoryWrapper>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <BookingProvider>
                <Story />
              </BookingProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </StoryWrapper>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BookingModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    ...MOCK_MENTOR,
  },
};

export const DarkMode: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    ...MOCK_MENTOR,
  },
  parameters: {
    themes: { theme: "dark" },
  },
  decorators: [
    (Story) => (
      <div className="dark dark:bg-[#050B0A] min-h-screen">
        <Story />
      </div>
    ),
  ],
};

export const Loading: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    ...MOCK_MENTOR,
  },
  play: async ({ canvasElement }) => {
    const textarea =
      canvasElement.querySelector<HTMLTextAreaElement>("textarea");
    const submitBtn = canvasElement.querySelector<HTMLButtonElement>(
      'button[type="submit"]',
    );
    if (textarea) {
      textarea.value = "I want to learn React and advanced frontend patterns";
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (submitBtn) {
      submitBtn.click();
    }
  },
};

export const Error: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    ...MOCK_MENTOR,
  },
  play: async ({ canvasElement }) => {
    const textarea =
      canvasElement.querySelector<HTMLTextAreaElement>("textarea");
    const submitBtn = canvasElement.querySelector<HTMLButtonElement>(
      'button[type="submit"]',
    );
    if (textarea) {
      textarea.value = "Test booking";
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (submitBtn) {
      submitBtn.click();
    }
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    ...MOCK_MENTOR,
  },
};
