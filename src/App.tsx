import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './Login';
import { Signup } from './Signup';
import { MentorshipHub } from './MentorshipHub';
import { RoleSelection } from './RoleSelection';
import { LearnerDashboard } from './LearnerDashboard';
import { MentorDashboard } from './MentorDashboard';
import { ForumFeed } from './ForumFeed';
import { MentorProfile } from './MentorProfile';
import { Contact } from './Contact';
import { Settings } from './Settings';
import { ChatLayout } from './ChatLayout';
import { LearnerProfile } from './LearnerProfile';
import { MedicalHub } from './MedicalHub';
import { About } from './About';
import { MentorWallet } from './MentorWallet';
import { Notifications } from './Notifications';
import { MedicalRegistration } from './MedicalRegistration';
import { MedicalDashboard } from './MedicalDashboard';
import { MedicalLogin } from './MedicalLogin';
import { PatientConsultations } from './PatientConsultations';
import { MedicalProfile } from './MedicalProfile';
import { DoctorsDirectory } from './DoctorsDirectory';

import { LandingPage } from './LandingPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/role-selection" element={<RoleSelection />} />
      <Route path="/learner-dashboard" element={<LearnerDashboard />} />
      <Route path="/mentor-dashboard" element={<MentorDashboard />} />
      <Route path="/mentor/wallet" element={<MentorWallet />} />
      <Route path="/mentorship-hub" element={<MentorshipHub />} />
      <Route path="/mentor/:id" element={<MentorProfile />} />
      <Route path="/medical-profile/:id" element={<MedicalProfile />} />
      <Route path="/forum" element={<ForumFeed />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/messages" element={<ChatLayout />} />
      <Route path="/learner/:id" element={<LearnerProfile />} />
      <Route path="/medical" element={<MedicalHub />} />
      <Route path="/doctors" element={<DoctorsDirectory />} />
      <Route path="/medical-registration" element={<MedicalRegistration />} />
      <Route path="/medical-login" element={<MedicalLogin />} />
      <Route path="/medical-dashboard" element={<MedicalDashboard />} />
      <Route path="/my-consultations" element={<PatientConsultations />} />
      {/* Redirect old hub route to learner dashboard */}
      <Route path="/hub" element={<Navigate to="/learner-dashboard" replace />} />
      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
