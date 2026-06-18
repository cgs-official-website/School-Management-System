import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../common/Icon';

const superadminNavItems = [
  { label: 'Platform Stats', icon: 'dashboard', path: '/superadmin/dashboard' },
  { label: 'Manage Schools', icon: 'business', path: '/superadmin/schools' },
];

const adminNavItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
  { label: 'Attendance', icon: 'calendar_month', path: '/admin/attendance' },
  { label: 'Homework', icon: 'assignment', path: '/admin/homework' },
  { label: 'Marks', icon: 'grade', path: '/admin/marks' },
  { label: 'Fees Management', icon: 'payments', path: '/admin/fees' },
  { label: 'Leave Requests', icon: 'event_busy', path: '/admin/leaves' },
  { label: 'Reports', icon: 'assessment', path: '/admin/reports' },
];

const teacherNavItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/teacher/dashboard' },
  { label: 'Attendance Tracking', icon: 'calendar_month', path: '/teacher/attendance' },
  { label: 'Homework Verify', icon: 'assignment', path: '/teacher/homework' },
  { label: 'Marks Entry', icon: 'grade', path: '/teacher/marks' },
  { label: 'Leave Approvals', icon: 'event_busy', path: '/teacher/leaves' },
  { label: 'Fees Setting', icon: 'payments', path: '/teacher/fees' },
];

const studentNavItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/student/dashboard' },
  { label: 'My Attendance', icon: 'calendar_month', path: '/student/attendance' },
  { label: 'My Homework', icon: 'assignment', path: '/student/homework' },
  { label: 'My Marks', icon: 'grade', path: '/student/marks' },
  { label: 'My Fees', icon: 'payments', path: '/student/fees' },
  { label: 'Leave Requests', icon: 'event_busy', path: '/student/leaves' },
];

const superadminBottomItems = [
  { label: 'Profile', icon: 'person', path: '/superadmin/profile' },
  { label: 'Settings', icon: 'settings', path: '/superadmin/settings' },
];

const adminBottomItems = [
  { label: 'Students', icon: 'school', path: '/admin/students' },
  { label: 'Teachers', icon: 'supervisor_account', path: '/admin/teachers' },
  { label: 'Profile', icon: 'person', path: '/admin/profile' },
  { label: 'Settings', icon: 'settings', path: '/admin/settings' },
];

const teacherBottomItems = [
  { label: 'Students', icon: 'school', path: '/teacher/students' },
  { label: 'Profile', icon: 'person', path: '/teacher/profile' },
  { label: 'Settings', icon: 'settings', path: '/teacher/settings' },
];

const studentBottomItems = [
  { label: 'Profile', icon: 'person', path: '/student/profile' },
  { label: 'Settings', icon: 'settings', path: '/student/settings' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const { role: userRole, school, logout } = useAuth();
  const role = userRole || 'student';
  const navItems = role === 'superadmin' ? superadminNavItems : role === 'admin' ? adminNavItems : role === 'teacher' ? teacherNavItems : studentNavItems;
  const bottomItems = role === 'superadmin' ? superadminBottomItems : role === 'admin' ? adminBottomItems : role === 'teacher' ? teacherBottomItems : studentBottomItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-white border-r border-outline-variant/30 
        flex flex-col transition-all duration-300 ease-in-out
        ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-sidebar'}
        lg:translate-x-0`}
      >
        {/* Top Branding (Zuna) */}
        <div className="flex items-center gap-3 px-6 py-5 overflow-hidden shrink-0">
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <img src="/logo.png" alt="Zuna Logo" className="w-full h-full object-contain" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in flex-1 min-w-0">
              <h1 className="text-title-lg font-bold text-on-surface">Zuna</h1>
            </div>
          )}
        </div>

        <div className="border-b border-outline-variant/20 w-full" />

        {/* School Info Card */}
        {school && role !== 'superadmin' && (
          <div className="px-4 py-4 shrink-0">
            <div className="bg-primary-50/40 border border-primary-100/50 dark:bg-slate-800/40 dark:border-slate-700/50 rounded-2xl p-3 flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl shadow-sm flex-shrink-0 border border-outline-variant/10 p-1.5">
                <img src={school?.schoolLogo || "/logo.png"} alt="School Logo" className="w-full h-full object-contain drop-shadow-sm" />
              </div>
              {!collapsed && (
                <div className="animate-fade-in flex-1 min-w-0">
                  <h2 className="text-body-sm font-bold text-on-surface leading-tight line-clamp-2" title={school?.name}>{school?.name}</h2>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1 font-bold">
                    {role === 'admin' ? 'Admin Portal' : role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Superadmin Info Card */}
        {!school && role === 'superadmin' && (
          <div className="px-4 py-4 shrink-0">
            <div className="bg-primary-50/40 border border-primary-100/50 dark:bg-slate-800/40 dark:border-slate-700/50 rounded-2xl p-3 flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl shadow-sm flex-shrink-0 border border-outline-variant/10 p-1.5">
                <img src="/logo.png" alt="Zuna Logo" className="w-full h-full object-contain drop-shadow-sm opacity-80 grayscale" />
              </div>
              {!collapsed && (
                <div className="animate-fade-in flex-1 min-w-0">
                  <h2 className="text-body-sm font-bold text-on-surface leading-tight line-clamp-2">Zuna Platform</h2>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1 font-bold">
                    Superadmin
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon name={item.icon} size={22} />
                {!collapsed && <span className="text-body-md">{item.label}</span>}
              </NavLink>
            ))}
          </div>

          <div className="my-4 border-t border-outline-variant/20" />

          <div className="space-y-1">
            {bottomItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon name={item.icon} size={22} />
                {!collapsed && <span className="text-body-md">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4">
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Icon name="logout" size={22} />
            {!collapsed && <span className="text-body-md">Logout</span>}
          </button>
        </div>


      </aside>
    </>
  );
}
