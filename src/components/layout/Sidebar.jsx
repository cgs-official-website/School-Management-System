import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../common/Icon';

const superadminNavItems = [
  { label: 'Platform Stats', icon: 'dashboard', path: '/superadmin/dashboard' },
  { label: 'Manage Schools', icon: 'business', path: '/superadmin/schools' },
];

const adminNavItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
  { 
    label: 'Front Office', 
    icon: 'contact_mail', 
    path: '/admin/front-office',
    children: [
      { label: 'Admission Enquiry', path: '/admin/front-office?tab=enquiry' },
      { label: 'Google Meet', path: '/admin/front-office?tab=gmeet' },
      { label: 'Visitor Book', path: '/admin/front-office?tab=visitor' },
      { label: 'Phone Call Log', path: '/admin/front-office?tab=calls' },
      { label: 'Postal Dispatch', path: '/admin/front-office?tab=postal' },
      { label: 'Postal Receive', path: '/admin/front-office?tab=postal' },
      { label: 'Suggestion', path: '/admin/front-office?tab=visitor' },
      { label: 'Setup Front Office', path: '/admin/front-office' }
    ]
  },
  { 
    label: 'Student Information', 
    icon: 'school', 
    path: '/admin/student-info',
    children: [
      { label: 'Student Directory', path: '/admin/student-info' },
      { label: 'Student Admission', path: '/admin/student-info' }
    ]
  },
  { label: 'Attendance', icon: 'calendar_month', path: '/admin/attendance' },
  { label: 'Faculty Details', icon: 'badge', path: '/admin/faculty' },
  { label: 'Payroll Management', icon: 'paid', path: '/admin/payroll' },
  { label: 'Store', icon: 'store', path: '/admin/store' },
  { label: 'Pharmacy', icon: 'local_pharmacy', path: '/admin/pharmacy' },
  { label: 'Library', icon: 'local_library', path: '/admin/library' },
  { label: 'Transport', icon: 'directions_bus', path: '/admin/transport' },
  { label: 'Fees Collection', icon: 'payments', path: '/admin/fees' },
  { label: 'Accounts', icon: 'account_balance', path: '/admin/accounts' },
  { label: 'Task Management', icon: 'check_circle', path: '/admin/tasks' },
  { 
    label: 'Academics', 
    icon: 'school', 
    path: '/admin/academics',
    children: [
      { label: 'Class Timetable', path: '/admin/academics' },
      { label: 'Classes & Sections', path: '/admin/academics' }
    ]
  },
  { label: 'Homework', icon: 'assignment', path: '/admin/homework' },
  { label: 'Certificate', icon: 'workspace_premium', path: '/admin/certificate' },
  { 
    label: 'Communicate', 
    icon: 'campaign', 
    path: '/admin/communicate',
    children: [
      { label: 'Notice Board', path: '/admin/communicate' },
      { label: 'Send Email', path: '/admin/communicate' },
      { label: 'Send SMS', path: '/admin/communicate' }
    ]
  },
  { label: 'Download Center', icon: 'download', path: '/admin/download-center' },
  { 
    label: 'Internal Examinations', 
    icon: 'quiz', 
    path: '/admin/examinations',
    children: [
      { label: 'Exam Group', path: '/admin/examinations?tab=internal' },
      { label: 'Exam Schedule', path: '/admin/examinations?tab=internal' },
      { label: 'Exam Results', path: '/admin/examinations?tab=reportcard' },
      { label: 'Design Marksheet', path: '/admin/examinations' }
    ]
  },
  { label: 'Online Examinations', icon: 'computer', path: '/admin/examinations?tab=online' },
  { label: 'Lesson Plan', icon: 'menu_book', path: '/admin/lesson-plan' },
  { label: 'Hostel', icon: 'domain', path: '/admin/hostel' },
  { label: 'Inventory', icon: 'inventory', path: '/admin/inventory' },
  { 
    label: 'Mess', 
    icon: 'restaurant', 
    path: '/admin/mess',
    children: [
      { label: 'Mess Menu', path: '/admin/mess?tab=menu' },
      { label: 'Dining Feedback', path: '/admin/mess?tab=feedback' }
    ]
  },
  { label: 'Income', icon: 'trending_up', path: '/admin/accounts' },
  { label: 'Expenses', icon: 'trending_down', path: '/admin/accounts' },
  { 
    label: 'Alumni', 
    icon: 'groups', 
    path: '/admin/alumni',
    children: [
      { label: 'Manage Alumni', path: '/admin/alumni?tab=directory' },
      { label: 'Events', path: '/admin/alumni?tab=events' }
    ]
  },
  { label: 'Front CMS', icon: 'web', path: '/admin/front-cms' },
  { label: 'Reports', icon: 'assessment', path: '/admin/reports' },
  { label: 'System Setting', icon: 'settings', path: '/admin/settings' }
];

const teacherNavItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/teacher/dashboard' },
  { label: 'Student Information', icon: 'school', path: '/teacher/student-info' },
  { label: 'Attendance Tracking', icon: 'calendar_month', path: '/teacher/attendance' },
  { label: 'Academics', icon: 'school', path: '/teacher/academics' },
  { label: 'Homework Verify', icon: 'assignment', path: '/teacher/homework' },
  { label: 'Marks Entry', icon: 'grade', path: '/teacher/marks' },
  { label: 'Examinations', icon: 'quiz', path: '/teacher/examinations' },
  { label: 'Lesson Plan', icon: 'menu_book', path: '/teacher/lesson-plan' },
  { label: 'Communicate', icon: 'campaign', path: '/teacher/communicate' },
  { label: 'Download Center', icon: 'download', path: '/teacher/download-center' },
  { label: 'Library', icon: 'local_library', path: '/teacher/library' },
  { label: 'Transport', icon: 'directions_bus', path: '/teacher/transport' },
  { label: 'Hostel', icon: 'domain', path: '/teacher/hostel' },
  { label: 'Mess', icon: 'restaurant', path: '/teacher/mess' },
  { label: 'Payroll Details', icon: 'paid', path: '/teacher/payroll' },
  { label: 'Task Management', icon: 'check_circle', path: '/teacher/tasks' },
  { label: 'Leave Approvals', icon: 'event_busy', path: '/teacher/leaves' }
];

const studentNavItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/student/dashboard' },
  { label: 'My Attendance', icon: 'calendar_month', path: '/student/attendance' },
  { label: 'My Homework', icon: 'assignment', path: '/student/homework' },
  { label: 'My Marks', icon: 'grade', path: '/student/marks' },
  { label: 'Examinations', icon: 'quiz', path: '/student/examinations' },
  { label: 'Download Center', icon: 'download', path: '/student/download-center' },
  { label: 'My Fees', icon: 'payments', path: '/student/fees' },
  { label: 'Library', icon: 'local_library', path: '/student/library' },
  { label: 'Transport', icon: 'directions_bus', path: '/student/transport' },
  { label: 'Hostel', icon: 'domain', path: '/student/hostel' },
  { label: 'Mess', icon: 'restaurant', path: '/student/mess' },
  { label: 'Certificate', icon: 'workspace_premium', path: '/student/certificate' },
  { label: 'Task Management', icon: 'check_circle', path: '/student/tasks' },
  { label: 'Communicate', icon: 'campaign', path: '/student/communicate' },
  { label: 'Leave Requests', icon: 'event_busy', path: '/student/leaves' }
];

const superadminBottomItems = [
  { label: 'Profile', icon: 'person', path: '/superadmin/profile' },
  { label: 'Settings', icon: 'settings', path: '/superadmin/settings' },
];

const adminBottomItems = [
  { label: 'Students', icon: 'school', path: '/admin/students' },
  { label: 'Teachers', icon: 'supervisor_account', path: '/admin/teachers' },
  { label: 'Profile', icon: 'person', path: '/admin/profile' },
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
  const location = useLocation();
  const { user, role: userRole, school, logout } = useAuth();
  const role = userRole || 'student';
  const navItems = role === 'superadmin' ? superadminNavItems : role === 'admin' ? adminNavItems : role === 'teacher' ? teacherNavItems : studentNavItems;
  const bottomItems = role === 'superadmin' ? superadminBottomItems : role === 'admin' ? adminBottomItems : role === 'teacher' ? teacherBottomItems : studentBottomItems;

  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (label) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

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
        <div className={`flex items-center shrink-0 py-5 ${collapsed ? 'justify-center px-0' : 'gap-3 px-6'}`}>
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
        <div className="px-4 py-3 shrink-0">
          {collapsed ? (
            <div className="flex justify-center">
              <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100/80 p-2">
                <img src={school?.schoolLogo || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2Y1OWUwYiI+PHBhdGggZD0iTTEyIDNMMiAxMmwzIDEuNXY2aDR2LTVoNnY1aDR2LTZMMjIgMTJMMTIgM3oiLz48L3N2Zz4='} alt="School Logo" className="w-full h-full object-contain" />
              </div>
            </div>
          ) : (
            <div className="bg-amber-500/5 border border-amber-500/10 dark:bg-slate-800/40 dark:border-slate-700/50 rounded-2xl p-3.5 flex items-center gap-3 overflow-hidden shadow-[0_2px_8px_-3px_rgba(245,158,11,0.08)]">
              <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl shadow-sm flex-shrink-0 border border-slate-100/80 p-2">
                <img src={school?.schoolLogo || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2Y1OWUwYiI+PHBhdGggZD0iTTEyIDNMMiAxMmwzIDEuNXY2aDR2LTVoNnY1aDR2LTZMMjIgMTJMMTIgM3oiLz48L3N2Zz4='} alt="School Logo" className="w-full h-full object-contain" />
              </div>
              <div className="animate-fade-in flex-1 min-w-0">
                <h2 className="text-[12px] font-extrabold text-slate-800 dark:text-white leading-snug line-clamp-2" title={school?.name || 'Zuna School'}>
                  {school?.name || 'Zuna School'}
                </h2>
                <p className="text-[9px] font-extrabold tracking-wider text-amber-600 dark:text-amber-400 uppercase mt-1">
                  ATTENDANCE SYSTEM
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = !!expandedMenus[item.label];

              if (hasChildren) {
                return (
                  <div key={item.label} className="space-y-1">
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className={`sidebar-link w-full text-left flex items-center justify-between ${
                        location.pathname.startsWith(item.path) ? 'bg-slate-100/70 text-slate-900 font-semibold' : ''
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <Icon name={item.icon} size={22} />
                        {!collapsed && <span className="text-body-md">{item.label}</span>}
                      </div>
                      {!collapsed && (
                        <Icon name={isExpanded ? 'expand_more' : 'chevron_right'} size={18} className="text-slate-400" />
                      )}
                    </button>

                    {isExpanded && !collapsed && (
                      <div className="pl-4 space-y-1 bg-slate-50/50 rounded-xl py-1 mt-1 border-l-2 border-amber-300">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.label + child.path}
                            to={child.path}
                            className={({ isActive }) =>
                              `flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide text-slate-500 hover:text-amber-500 transition-colors ${
                                isActive ? 'text-amber-500 font-bold bg-amber-50/50' : ''
                              }`
                            }
                          >
                            <span>»</span>
                            <span>{child.label}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
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
              );
            })}
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

        {/* User Profile Footer Card */}
        <div className="mt-auto px-4 py-4 border-t border-slate-100 dark:border-slate-800">
          {collapsed ? (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-slate-800 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'MA'}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar circle */}
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-slate-800 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'MA'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-white truncate" title={user?.name || 'Microsoft Admin'}>
                    {user?.name || 'Microsoft Admin'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                    {role || 'ADMIN'}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
                title="Logout"
              >
                <Icon name="logout" size={20} />
              </button>
            </div>
          )}
        </div>

      </aside>
    </>
  );
}
