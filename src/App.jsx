import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Loader from './components/common/Loader';
import ProtectedRoute from './components/common/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Layout
import AdminLayout from './components/layout/AdminLayout';

// Auth pages (Lazy loaded for faster initial load)
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const NotFound = lazy(() => import('./pages/NotFound'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Onboarding = lazy(() => import('./pages/Onboarding'));

// Superadmin pages
const SuperAdminDashboard = lazy(() => import('./pages/superadmin/Dashboard'));
const SuperAdminSchools = lazy(() => import('./pages/superadmin/Schools'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminAttendance = lazy(() => import('./pages/admin/Attendance'));
const AdminHomework = lazy(() => import('./pages/admin/Homework'));
const AdminMarks = lazy(() => import('./pages/admin/Marks'));
const AdminFees = lazy(() => import('./pages/admin/Fees'));
const AdminLeaves = lazy(() => import('./pages/admin/Leaves'));
const AdminReports = lazy(() => import('./pages/admin/Reports'));
const AdminStudents = lazy(() => import('./pages/admin/Students'));

// Student pages
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const StudentAttendance = lazy(() => import('./pages/student/Attendance'));
const StudentHomework = lazy(() => import('./pages/student/Homework'));
const StudentMarks = lazy(() => import('./pages/student/Marks'));
const StudentFees = lazy(() => import('./pages/student/Fees'));
const StudentLeaves = lazy(() => import('./pages/student/Leaves'));

// Shared pages
const Profile = lazy(() => import('./pages/shared/Profile'));
const Settings = lazy(() => import('./pages/shared/Settings'));

// Teacher pages
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'));
const TeacherAttendance = lazy(() => import('./pages/teacher/Attendance'));
const TeacherHomework = lazy(() => import('./pages/teacher/Homework'));
const TeacherMarks = lazy(() => import('./pages/teacher/Marks'));
const TeacherLeaves = lazy(() => import('./pages/teacher/Leaves'));
const TeacherStudents = lazy(() => import('./pages/teacher/Students'));

// Admin Teachers page
const AdminTeachers = lazy(() => import('./pages/admin/Teachers'));

function RoleDashboardRedirect() {
  const { role } = useAuth();
  const redirectMap = { superadmin: '/superadmin/dashboard', admin: '/admin/dashboard', teacher: '/teacher/dashboard', student: '/student/dashboard', onboarding: '/onboarding' };
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
      <Suspense fallback={<Loader fullScreen />}>
        <Routes>
          {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/:schoolSlug/login" element={<Login />} />
        <Route path="/:schoolSlug/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/onboarding" element={<Onboarding />} />

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
      </Suspense>
    </>
  );
}

export default App;
