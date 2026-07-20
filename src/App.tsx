import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./Login";
import { Signup } from "./Signup";
import { MentorshipHub } from "./MentorshipHub";
import { RoleSelection } from "./RoleSelection";
import { LearnerDashboard } from "./LearnerDashboard";
import { MentorDashboard } from "./MentorDashboard";
import { ForumFeed } from "./ForumFeed";
import { MentorProfile } from "./MentorProfile";
import { Contact } from "./Contact";
import { Settings } from "./Settings";
import { ChatLayout } from "./ChatLayout";
import { LearnerProfile } from "./LearnerProfile";
import { MedicalHub } from "./MedicalHub";
import { About } from "./About";
import { MentorWallet } from "./MentorWallet";
import { Notifications } from "./Notifications";
import { MedicalRegistration } from "./MedicalRegistration";
import { MedicalDashboard } from "./MedicalDashboard";
import { MedicalLogin } from "./MedicalLogin";
import { PatientConsultations } from "./PatientConsultations";
import { MedicalProfile } from "./MedicalProfile";
import { DoctorsDirectory } from "./DoctorsDirectory";
import { SessionHistory } from "./SessionHistory";

import { LandingPage } from "./LandingPage";
import { ToastContainer } from "./components/ToastContainer";
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ErrorBoundary>
              <LandingPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/about"
          element={
            <ErrorBoundary>
              <About />
            </ErrorBoundary>
          }
        />
        <Route
          path="/login"
          element={
            <ErrorBoundary>
              <Login />
            </ErrorBoundary>
          }
        />
        <Route
          path="/signup"
          element={
            <ErrorBoundary>
              <Signup />
            </ErrorBoundary>
          }
        />
        <Route
          path="/role-selection"
          element={
            <ErrorBoundary>
              <RoleSelection />
            </ErrorBoundary>
          }
        />
        <Route
          path="/learner-dashboard"
          element={
            <ErrorBoundary>
              <LearnerDashboard />
            </ErrorBoundary>
          }
        />
        <Route
          path="/mentor-dashboard"
          element={
            <ErrorBoundary>
              <MentorDashboard />
            </ErrorBoundary>
          }
        />
        <Route
          path="/session-history"
          element={
            <ErrorBoundary>
              <SessionHistory />
            </ErrorBoundary>
          }
        />
        <Route
          path="/mentor/wallet"
          element={
            <ErrorBoundary>
              <MentorWallet />
            </ErrorBoundary>
          }
        />
        <Route
          path="/mentorship-hub"
          element={
            <ErrorBoundary>
              <MentorshipHub />
            </ErrorBoundary>
          }
        />
        <Route
          path="/mentor/:id"
          element={
            <ErrorBoundary>
              <MentorProfile />
            </ErrorBoundary>
          }
        />
        <Route
          path="/medical-profile/:id"
          element={
            <ErrorBoundary>
              <MedicalProfile />
            </ErrorBoundary>
          }
        />
        <Route
          path="/forum"
          element={
            <ErrorBoundary>
              <ForumFeed />
            </ErrorBoundary>
          }
        />
        <Route
          path="/settings"
          element={
            <ErrorBoundary>
              <Settings />
            </ErrorBoundary>
          }
        />
        <Route
          path="/notifications"
          element={
            <ErrorBoundary>
              <Notifications />
            </ErrorBoundary>
          }
        />
        <Route
          path="/contact"
          element={
            <ErrorBoundary>
              <Contact />
            </ErrorBoundary>
          }
        />
        <Route
          path="/messages"
          element={
            <ErrorBoundary>
              <ChatLayout />
            </ErrorBoundary>
          }
        />
        <Route
          path="/learner/:id"
          element={
            <ErrorBoundary>
              <LearnerProfile />
            </ErrorBoundary>
          }
        />
        <Route
          path="/medical"
          element={
            <ErrorBoundary>
              <MedicalHub />
            </ErrorBoundary>
          }
        />
        <Route
          path="/doctors"
          element={
            <ErrorBoundary>
              <DoctorsDirectory />
            </ErrorBoundary>
          }
        />
        <Route
          path="/medical-registration"
          element={
            <ErrorBoundary>
              <MedicalRegistration />
            </ErrorBoundary>
          }
        />
        <Route
          path="/medical-login"
          element={
            <ErrorBoundary>
              <MedicalLogin />
            </ErrorBoundary>
          }
        />
        <Route
          path="/medical-dashboard"
          element={
            <ErrorBoundary>
              <MedicalDashboard />
            </ErrorBoundary>
          }
        />
        <Route
          path="/my-consultations"
          element={
            <ErrorBoundary>
              <PatientConsultations />
            </ErrorBoundary>
          }
        />
        {/* Redirect old hub route to learner dashboard */}
        <Route
          path="/hub"
          element={<Navigate to="/learner-dashboard" replace />}
        />
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
