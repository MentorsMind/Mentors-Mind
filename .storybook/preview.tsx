import React, { useEffect } from "react";
import type { Preview } from "@storybook/react";
import { ThemeProvider } from "../src/contexts/ThemeContext";
import { AuthProvider } from "../src/contexts/AuthContext";
import { NotificationProvider } from "../src/contexts/NotificationContext";
import { BookingProvider } from "../src/contexts/BookingContext";
import "../src/index.css";

// Mock user for story rendering
const MOCK_USER = {
  id: "storybook-user-1",
  name: "Jane Doe",
  email: "jane@example.com",
  role: "mentor" as const,
  image:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
  title: "Senior Software Engineer",
  about: "Experienced software engineer passionate about mentoring.",
  specializations: [
    { name: "Frontend Development", price: 50 },
    { name: "UI/UX Design", price: 45 },
  ],
};

// Inject mock user into localStorage for stories that depend on auth context
function StoryAuthWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(MOCK_USER));
    return () => {
      localStorage.removeItem("currentUser");
    };
  }, []);
  return <>{children}</>;
}

// Theme decorator that wraps all stories in ThemeContext and AuthProvider
const ThemeDecorator = (Story: React.ComponentType, context: any) => {
  const { theme } = context.globals;

  return (
    <StoryAuthWrapper>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <BookingProvider>
              <div className={theme === "dark" ? "dark" : ""}>
                <Story />
              </div>
            </BookingProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </StoryAuthWrapper>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
        showName: true,
      },
    },
  },
  decorators: [ThemeDecorator],
};

export default preview;
