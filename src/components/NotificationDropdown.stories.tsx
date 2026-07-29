import type { Meta, StoryObj } from "@storybook/react";
import { NotificationDropdown } from "./NotificationDropdown";
import { NotificationProvider } from "../contexts/NotificationContext";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

// Set up mock user and notifications
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

    // Seed notifications
    const notifications = [
      {
        id: "notif-1",
        userId: "storybook-user-1",
        type: "booking",
        title: "Session Accepted",
        message:
          "Sarah Chen has accepted your mentorship request for React fundamentals.",
        link: "/learner-dashboard",
        read: false,
        timestamp: new Date(Date.now() - 60000).toISOString(),
      },
      {
        id: "notif-2",
        userId: "storybook-user-1",
        type: "message",
        title: "New Message",
        message:
          "You have a new message from Michael Obi regarding your project.",
        link: "/messages",
        read: false,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "notif-3",
        userId: "storybook-user-1",
        type: "system",
        title: "Welcome!",
        message:
          "Welcome to MentorMinds! Complete your profile to get started.",
        link: "/settings",
        read: true,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
    ];
    localStorage.setItem("notifications", JSON.stringify(notifications));
    return () => {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("notifications");
    };
  }, []);
  return <>{children}</>;
}

const meta: Meta<typeof NotificationDropdown> = {
  title: "Components/NotificationDropdown",
  component: NotificationDropdown,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Dropdown notification panel with bell icon trigger. Shows unread notifications and allows marking as read.",
      },
    },
  },
  decorators: [
    (Story) => (
      <StoryWrapper>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <BrowserRouter>
                <div style={{ minHeight: "400px", padding: "40px" }}>
                  <Story />
                </div>
              </BrowserRouter>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </StoryWrapper>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NotificationDropdown>;

export const Default: Story = {
  args: {},
};

export const DarkMode: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="dark dark:bg-[#050B0A] min-h-screen">
        <Story />
      </div>
    ),
  ],
};

export const NoNotifications: Story = {
  args: {},
  decorators: [
    (Story) => {
      useEffect(() => {
        localStorage.setItem("notifications", JSON.stringify([]));
        return () => localStorage.removeItem("notifications");
      }, []);
      return (
        <div style={{ minHeight: "400px", padding: "40px" }}>
          <Story />
        </div>
      );
    },
  ],
};

export const AllRead: Story = {
  args: {},
  decorators: [
    (Story) => {
      useEffect(() => {
        const notifications = [
          {
            id: "notif-4",
            userId: "storybook-user-1",
            type: "system",
            title: "Profile Updated",
            message: "Your profile has been updated successfully.",
            link: "/settings",
            read: true,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
        ];
        localStorage.setItem("notifications", JSON.stringify(notifications));
        return () => localStorage.removeItem("notifications");
      }, []);
      return (
        <div style={{ minHeight: "400px", padding: "40px" }}>
          <Story />
        </div>
      );
    },
  ],
};
