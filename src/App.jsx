import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Loader from './components/common/Loader';
import ProtectedRoute from './components/common/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';

// Layout
import AdminLayout from './components/layout/AdminLayout';

// Superadmin pages
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import SuperAdminSchools from './pages/superadmin/Schools';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminAttendance from './pages/admin/Attendance';
import AdminHomework from './pages/admin/Homework';
import AdminMarks from './pages/admin/Marks';
import AdminFees from './pages/admin/Fees';
import AdminLeaves from './pages/admin/Leaves';
import AdminReports from './pages/admin/Reports';
import AdminStudents from './pages/admin/Students';

// Student pages
import StudentDashboard from './pages/StudentDashboard';
import StudentAttendance from './pages/student/Attendance';
import StudentHomework from './pages/student/Homework';
import StudentMarks from './pages/student/Marks';
import StudentFees from './pages/student/Fees';
import StudentLeaves from './pages/student/Leaves';

// Shared pages
import Profile from './pages/shared/Profile';
import Settings from './pages/shared/Settings';

// Teacher pages
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherAttendance from './pages/teacher/Attendance';
import TeacherHomework from './pages/teacher/Homework';
import TeacherMarks from './pages/teacher/Marks';
import TeacherLeaves from './pages/teacher/Leaves';
import TeacherStudents from './pages/teacher/Students';

// Admin Teachers page
import AdminTeachers from './pages/admin/Teachers';

function RoleDashboardRedirect() {
  const { role } = useAuth();
  const redirectMap = { superadmin: '/superadmin/dashboard', admin: '/admin/dashboard', teacher: '/teacher/dashboard', student: '/student/dashboard' };
  return <Navigate to={redirectMap[role] || '/login'} replace />;
}

function App() {
  return (
    <>
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1e293b',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            borderRadius: '16px',
            padding: '16px 20px',
            fontSize: '14px',
            fontWeight: '600',
            border: '1px solid #f1f5f9',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
        <Routes>
          {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/:schoolSlug/login" element={<Login />} />
        <Route path="/:schoolSlug/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Superadmin Routes */}
        <Route path="/superadmin" element={
          <ProtectedRoute role="superadmin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="schools" element={<SuperAdminSchools />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="homework" element={<AdminHomework />} />
          <Route path="marks" element={<AdminMarks />} />
          <Route path="fees" element={<AdminFees />} />
          <Route path="leaves" element={<AdminLeaves />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="teachers" element={<AdminTeachers />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={
          <ProtectedRoute role="student">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="homework" element={<StudentHomework />} />
          <Route path="marks" element={<StudentMarks />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="leaves" element={<StudentLeaves />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Teacher Routes */}
        <Route path="/teacher" element={
          <ProtectedRoute role="teacher">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="homework" element={<TeacherHomework />} />
          <Route path="marks" element={<TeacherMarks />} />
          <Route path="leaves" element={<TeacherLeaves />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="fees" element={<AdminFees />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Role-based dashboard redirect */}
        <Route path="/dashboard" element={<RoleDashboardRedirect />} />

        {/* Default redirect */}
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
