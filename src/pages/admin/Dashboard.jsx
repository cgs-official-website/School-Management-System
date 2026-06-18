import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/common/StatCard';
import Icon from '../../components/common/Icon';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="page-header">{school?.name || 'Zuna'} Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user?.name || 'Admin'}. Here's what's happening today.</p>
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
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5eeff" />
              <XAxis dataKey="month" stroke="#737686" fontSize={12} />
              <YAxis domain={[85, 100]} stroke="#737686" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #c3c6d7',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#2563eb"
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
              <CartesianGrid strokeDasharray="3 3" stroke="#e5eeff" />
              <XAxis dataKey="subject" stroke="#737686" fontSize={12} />
              <YAxis stroke="#737686" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #c3c6d7',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              />
              <Bar dataKey="submitted" fill="#2563eb" radius={[4, 4, 0, 0]} name="Submitted" />
              <Bar dataKey="pending" fill="#dbe1ff" radius={[4, 4, 0, 0]} name="Pending" />
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
          <div className="bg-error/5 border border-error/20 rounded-lg p-4">
            <p className="text-headline-md text-error font-bold">₹{stats.outstandingFees.amount.toLocaleString('en-IN')}</p>
            <p className="text-body-md text-error/80">Overdue by {stats.outstandingFees.overdueDays} days</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-title-lg text-on-surface mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats.recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-surface-container-low transition-colors animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0`}>
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
