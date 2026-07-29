import type { Meta, StoryObj } from "@storybook/react";
import { EditProfileModal } from "./EditProfileModal";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { useEffect } from "react";

// Set up mock user
function StoryWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const mockUser = {
      id: "storybook-user-1",
      name: "Jane Doe",
      email: "jane@example.com",
      role: "mentor" as const,
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
      title: "Senior Software Engineer",
      about:
        "Experienced software engineer passionate about mentoring the next generation of developers.",
      phone: "+1 (555) 123-4567",
      state: "California",
      country: "United States",
      specializations: [
        { name: "Frontend Development", price: 50 },
        { name: "UI/UX Design", price: 45 },
      ],
    };
    localStorage.setItem("currentUser", JSON.stringify(mockUser));
    return () => localStorage.removeItem("currentUser");
  }, []);
  return <>{children}</>;
}

const meta: Meta<typeof EditProfileModal> = {
  title: "Components/EditProfileModal",
  component: EditProfileModal,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Modal for editing user profile details including basic info and mentor expertise/pricing. Shows tabs based on user role.",
      },
    },
  },
  argTypes: {
    isOpen: { control: "boolean" },
    onClose: { action: "closed" },
    initialTab: { control: "radio", options: ["details", "expertise"] },
  },
  decorators: [
    (Story) => (
      <StoryWrapper>
        <ThemeProvider>
          <AuthProvider>
            <Story />
          </AuthProvider>
        </ThemeProvider>
      </StoryWrapper>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EditProfileModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    initialTab: "details",
  },
};

export const ExpertiseTab: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    initialTab: "expertise",
  },
};

export const DarkMode: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    initialTab: "details",
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
    initialTab: "details",
  },
  play: async ({ canvasElement }) => {
    const saveBtn = canvasElement.querySelector<HTMLButtonElement>(
      'button[type="submit"]',
    );
    if (saveBtn) {
      saveBtn.click();
    }
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    initialTab: "details",
  },
};
