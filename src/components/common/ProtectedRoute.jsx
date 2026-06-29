import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ role, children }) {
  const { isAuthenticated, role: userRole, school } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect admin users to waiting page if their school registration is pending superadmin approval
  if (userRole === 'admin' && school && school.status === 'Pending Approval') {
    return <Navigate to="/waiting-approval" replace />;
  }

  if (role && userRole !== role) {
    const redirectMap = { 
      superadmin: '/superadmin/dashboard',
      admin: '/admin/dashboard', 
      teacher: '/teacher/dashboard', 
      student: '/student/dashboard', 
      onboarding: '/onboarding' 
    };
    return <Navigate to={redirectMap[userRole] || '/login'} replace />;
  }

  return children;
}