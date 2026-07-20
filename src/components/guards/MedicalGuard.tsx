import { Navigate, useLocation } from 'react-router-dom';
import type { MedicalProfessional } from '../../data';

interface MedicalGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function MedicalGuard({ children, redirectTo }: MedicalGuardProps) {
  const location = useLocation();

  // Get current user from localStorage
  const currentUserStr = localStorage.getItem('currentUser');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

  // Not authenticated as medical
  if (!currentUser || currentUser.role !== 'medical') {
    return (
      <Navigate
        to={redirectTo || '/medical-login'}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Get medical professionals from localStorage
  const medicalProfessionals = JSON.parse(localStorage.getItem('medicalProfessionals') || '[]');

  // Check if current user email matches any medical professional
  const matchedProfessional = medicalProfessionals.find(
    (p: MedicalProfessional) => p.email === currentUser.email
  );

  // No matching entry found - redirect to registration
  if (!matchedProfessional) {
    return <Navigate to='/medical-registration' replace />;
  }

  return <>{children}</>;
}
