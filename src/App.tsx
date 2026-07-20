import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./Login";
import { Signup } from "./Signup";
import { MentorshipHub } from "./MentorshipHub";
import { RoleSelection } from "./RoleSelection";
import { LearnerDashboard } from "./LearnerDashboard";
import { MentorDashboard } from "./MentorDashboard";
import { OnboardingWizard } from "./OnboardingWizard";
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
import { ProtectedRoute } from "./components/guards/ProtectedRoute";
import { MedicalGuard } from "./components/guards/MedicalGuard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/medical" element={<MedicalHub />} />
        <Route path="/doctors" element={<DoctorsDirectory />} />
        <Route path="/medical-registration" element={<MedicalRegistration />} />
        <Route path="/medical-login" element={<MedicalLogin />} />
        <Route path="/medical-profile/:id" element={<MedicalProfile />} />
        <Route path="/mentor/:id" element={<MentorProfile />} />
        <Route path="/learner/:id" element={<LearnerProfile />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected Routes — any authenticated user */}
        <Route
          path="/session-history"
          element={
            <ProtectedRoute>
              <SessionHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentorship-hub"
          element={
            <ProtectedRoute>
              <MentorshipHub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum"
          element={
            <ProtectedRoute>
              <ForumFeed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <ChatLayout />
            </ProtectedRoute>
          }
        />

        {/* Mentor-only Routes */}
        <Route
          path="/mentor-dashboard"
          element={
            <ProtectedRoute requiredRole="mentor">
              <MentorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute requiredRole="mentor">
              <OnboardingWizard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/wallet"
          element={
            <ProtectedRoute requiredRole="mentor">
              <MentorWallet />
            </ProtectedRoute>
          }
        />

        {/* Learner-only Routes */}
        <Route
          path="/learner-dashboard"
          element={
            <ProtectedRoute requiredRole="learner">
              <LearnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Medical-only Routes (checked against medicalProfessionals store) */}
        <Route
          path="/medical-dashboard"
          element={
            <MedicalGuard>
              <MedicalDashboard />
            </MedicalGuard>
          }
        />
        <Route
          path="/my-consultations"
          element={
            <MedicalGuard>
              <PatientConsultations />
            </MedicalGuard>
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
