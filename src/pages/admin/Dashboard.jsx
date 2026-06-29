import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/common/StatCard';
import Icon from '../../components/common/Icon';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { school, user } = useAuth();
  const [stats, setStats] = useState({
    overallAttendance: '0%',
    overallAttendanceTrend: '0%',
    homeworkPending: '0',
    totalFeesDue: '₹0',
    pendingLeaves: '0',
    attendanceTrends: [],
    homeworkProgress: [],
    outstandingFees: {
      amount: 0,
      overdueDays: '0'
    },
    recentActivity: []
  });

  useEffect(() => {
    if (!school?.id) return;
    const fetchStats = async () => {
      try {
        const qHw = query(collection(db, 'homework'), where('schoolId', '==', school.id), where('status', '==', 'Active'));
        const hwSnap = await getDocs(qHw);
        const hwPending = hwSnap.docs.length;

        const qLeaves = query(collection(db, 'leaves'), where('schoolId', '==', school.id), where('status', '==', 'Pending'));
        const leavesSnap = await getDocs(qLeaves);
        const leavesPending = leavesSnap.docs.length;
        
        const qFees = query(collection(db, 'fees'), where('schoolId', '==', school.id), where('status', '==', 'Overdue'));
        const feesSnap = await getDocs(qFees);
        let feesTotal = 0;
        feesSnap.forEach(d => {
          feesTotal += (Number(d.data().amountVal) - Number(d.data().amountPaidVal)) || 0;
        });

        setStats({
          overallAttendance: '92%',
          overallAttendanceTrend: '+2.1%',
          homeworkPending: hwPending.toString(),
          totalFeesDue: `₹${feesTotal.toLocaleString('en-IN')}`,
          pendingLeaves: leavesPending.toString(),
          attendanceTrends: [
            { month: 'Jan', rate: 88 },
            { month: 'Feb', rate: 91 },
            { month: 'Mar', rate: 89 },
            { month: 'Apr', rate: 94 },
            { month: 'May', rate: 92 },
            { month: 'Jun', rate: 95 }
          ],
          homeworkProgress: [
            { subject: 'Maths', submitted: 45, pending: 5 },
            { subject: 'Science', submitted: 38, pending: 12 },
            { subject: 'English', submitted: 42, pending: 8 },
            { subject: 'Tamil', submitted: 48, pending: 2 },
            { subject: 'Social', submitted: 40, pending: 10 }
          ],
          outstandingFees: {
            amount: feesTotal,
            overdueDays: '14'
          },
          recentActivity: [
            { icon: 'payments', color: 'text-emerald-600', title: 'Fee Payment', description: 'Rahul collected ₹50,000 for Class 10.', time: '2 hours ago' },
            { icon: 'event', color: 'text-amber-600', title: 'Leave Request', description: 'New leave requests pending approval.', time: '4 hours ago' }
          ]
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };
    fetchStats();
  }, [school?.id]);

  const handleCopyLink = (path) => {
    const fullUrl = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Invitation link copied!');
  };

  const loginLink = school ? `/${school.slug}/login` : '/login';
  const registerLink = school ? `/${school.slug}/register` : '/register';

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="page-header text-2xl font-bold">{school?.name || 'Zuna'} Dashboard</h1>
          <p className="page-subtitle text-slate-500">Welcome back, {user?.name || 'Admin'}. Here's what's happening today.</p>
        </div>
        <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full border border-amber-500/20">
          School ID: {school?.id || 'ZUNA0001'}
        </span>
      </div>

      {/* Portal Invite Links and Environment Setup */}
      <div className="card p-6 bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 text-white shadow-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Icon name="link" className="text-amber-400" /> Institution Invite Links
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Use these custom slug-based URLs to invite teachers, students, and parents to join **{school?.name}**. Registering via these links automatically links profiles to your school database.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button 
              onClick={() => handleCopyLink(loginLink)}
              className="flex-1 md:flex-none btn-primary py-2.5 px-4 text-xs font-bold whitespace-nowrap flex items-center justify-center gap-2"
            >
              <Icon name="content_copy" size={14} /> Copy Portal Login URL
            </button>
            <button 
              onClick={() => handleCopyLink(registerLink)}
              className="flex-1 md:flex-none btn-secondary border-slate-800 text-slate-300 hover:text-white bg-slate-900/50 py-2.5 px-4 text-xs font-bold whitespace-nowrap flex items-center justify-center gap-2"
            >
              <Icon name="content_copy" size={14} /> Copy Portal Register URL
            </button>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-800/50 flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
              <Icon name="badge" size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-300">Staff Portal link</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{window.location.origin}{loginLink}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-800/50 flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
              <Icon name="groups" size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-300">Parent / Student link</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{window.location.origin}{registerLink}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-800/50 flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
              <Icon name="security" size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-300">Superadmin Credentials</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Assigned & Verified securely.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall Attendance"
          value={stats.overallAttendance}
          icon="calendar_month"
          trend="up"
          trendValue={stats.overallAttendanceTrend}
          color="primary"
        />
        <StatCard
          title="Homework Pending"
          value={stats.homeworkPending}
          subtitle="tasks"
          icon="assignment"
          color="secondary"
        />
        <StatCard
          title="Total Fees Due"
          value={stats.totalFeesDue}
          icon="payments"
          trend="down"
          trendValue="-3.1%"
          color="tertiary"
        />
        <StatCard
          title="Pending Leaves"
          value={stats.pendingLeaves}
          subtitle="requests"
          icon="event_busy"
          color="error"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trends */}
        <div className="card p-6">
          <h3 className="text-title-lg text-on-surface mb-4">Attendance Trends</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={stats.attendanceTrends}>
              <defs>
                <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#737686" fontSize={12} />
              <YAxis domain={[85, 100]} stroke="#737686" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                }}
              />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#attendanceGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Homework Progress */}
        <div className="card p-6">
          <h3 className="text-title-lg text-on-surface mb-4">Homework Progress</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.homeworkProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="subject" stroke="#737686" fontSize={12} />
              <YAxis stroke="#737686" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                }}
              />
              <Bar dataKey="submitted" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Submitted" />
              <Bar dataKey="pending" fill="#fef3c7" radius={[4, 4, 0, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Outstanding Fees */}
        <div className="card p-6">
          <h3 className="text-title-lg text-on-surface mb-2">Outstanding Fees</h3>
          <p className="text-body-md text-on-surface-variant mb-4">Action required for overdue accounts.</p>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
            <p className="text-headline-md text-red-600 font-bold">₹{stats.outstandingFees.amount.toLocaleString('en-IN')}</p>
            <p className="text-body-md text-red-500">Overdue by {stats.outstandingFees.overdueDays} days</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-title-lg text-on-surface mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats.recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0`}>
                  <Icon name={item.icon} size={20} className={item.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-md text-on-surface font-medium">{item.title}</p>
                  <p className="text-body-md text-on-surface-variant">{item.description}</p>
                </div>
                <span className="text-label-md text-on-surface-variant whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
