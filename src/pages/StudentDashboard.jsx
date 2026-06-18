import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/common/StatCard';
import Icon from '../components/common/Icon';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { school, user } = useAuth();
  const [showSchedule, setShowSchedule] = useState(false);

  // Helper functions for dynamic dates
  const dateOffset = (days) => {
    const d = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const futureDateOffset = (days, format = { month: 'short', day: 'numeric' }) => {
    const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    return d.toLocaleDateString('en-US', format);
  };

  const getWeekdayDate = (days) => {
    const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // State for fetched data
  const email = localStorage.getItem('edutrack_email') || 'student@edutrack.pro';
  const [loading, setLoading] = useState(true);
  const [attendancePercent, setAttendancePercent] = useState(null);
  const [pendingHomework, setPendingHomework] = useState(0);
  const [feeDuesAmount, setFeeDuesAmount] = useState(0);
  const [recentMarks, setRecentMarks] = useState([]);
  const [overallGrade, setOverallGrade] = useState('N/A');
  const [overallSubText, setOverallSubText] = useState('');
  const [leaveRequests, setLeaveRequests] = useState([]);

  const getGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    if (score >= 40) return 'D';
    return 'F';
  };

  const getSubText = (grade) => {
    if (grade.startsWith('A')) return 'Excellent standing';
    if (grade.startsWith('B')) return 'Good standing';
    if (grade === 'N/A') return 'No grades yet';
    return 'Satisfactory standing';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!email || !school?.id) return;

        // Attendance
        const attQ = query(collection(db, 'attendance'), where('studentEmail', '==', email), where('schoolId', '==', school.id));
        const attSnap = await getDocs(attQ);
        const safeAtt = attSnap.docs.map(d => d.data());
        if (safeAtt.length > 0) {
          const presentCount = safeAtt.filter(a => a.status === 'Present').length;
          const lateCount = safeAtt.filter(a => a.status === 'Late').length;
          setAttendancePercent(Math.round(((presentCount + lateCount) / safeAtt.length) * 100));
        } else {
          setAttendancePercent(null);
        }

        // Homework
        const hwQ = query(collection(db, 'homework'), where('schoolId', '==', school.id));
        const hwSnap = await getDocs(hwQ);
        const safeHw = hwSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        // Only active homework assigned to this student or class (simplification: show all active for now)
        setPendingHomework(safeHw.filter(h => h.status === 'Active').length);

        // Fees
        const feeQ = query(collection(db, 'fees'), where('studentEmail', '==', email), where('schoolId', '==', school.id));
        const feeSnap = await getDocs(feeQ);
        const safeFees = feeSnap.docs.map(d => d.data());
        const dues = safeFees.filter(f => f.status === 'Pending').reduce((sum, f) => sum + (f.amount || 0), 0);
        setFeeDuesAmount(dues);

        // Marks
        const marksQ = query(collection(db, 'marks'), where('studentEmail', '==', email), where('schoolId', '==', school.id));
        const marksSnap = await getDocs(marksQ);
        const safeMarks = marksSnap.docs.map(d => d.data());

        let displayMarks = [];
        if (safeMarks.length > 0) {
          const sorted = [...safeMarks].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          displayMarks = sorted.slice(0, 4).map(m => ({
            subject: m.subject,
            score: m.marks,
            max: m.max,
            grade: m.grade,
            date: m.term
          }));

          const subjectMap = {};
          safeMarks.forEach(m => {
            if (!subjectMap[m.subject]) {
              subjectMap[m.subject] = { total: 0, max: 0 };
            }
            subjectMap[m.subject].total += m.marks;
            subjectMap[m.subject].max += m.max;
          });

          const subjectAverages = Object.keys(subjectMap).map(subj => {
            const s = subjectMap[subj];
            return s.max > 0 ? (s.total / s.max) * 100 : 0;
          });

          const avg = subjectAverages.length > 0 ? (subjectAverages.reduce((sum, val) => sum + val, 0) / subjectAverages.length) : 0;
          const oGrade = getGrade(avg);
          setOverallGrade(oGrade);
          setOverallSubText(getSubText(oGrade));
        }
        setRecentMarks(displayMarks);

        // Leaves
        const leavesQ = query(collection(db, 'leaves'), where('studentEmail', '==', email), where('schoolId', '==', school.id));
        const leavesSnap = await getDocs(leavesQ);
        const safeLeaves = leavesSnap.docs.map(d => d.data());
        setLeaveRequests(safeLeaves);
      } catch (err) {
        console.error('Error fetching dashboard data:', err.message || err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [email]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="page-header">{school?.name || 'Zuna'} Student Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user?.name || 'Student'}. Here is your academic progress.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Attendance"
          value={attendancePercent !== null ? `${attendancePercent}%` : 'N/A'}
          icon="calendar_check"
          trend="up"
          trendValue={attendancePercent !== null ? '+0%' : 'No records'}
          color="primary"
          onClick={() => navigate('/student/attendance')}
        />
        <StatCard
          title="Pending Homework"
          value={String(pendingHomework)}
          subtitle="tasks"
          icon="menu_book"
          color="secondary"
          onClick={() => navigate('/student/homework')}
        />
        <StatCard
          title="Fee Dues"
          value={feeDuesAmount > 0 ? `₹${feeDuesAmount.toLocaleString('en-IN')}` : 'No Dues'}
          icon="account_balance_wallet"
          trend={feeDuesAmount > 0 ? 'up' : 'down'}
          trendValue={feeDuesAmount > 0 ? `Due ${futureDateOffset(4)}` : 'Cleared'}
          color="error"
          onClick={() => navigate('/student/fees')}
        />
        <StatCard
          title="Overall Grade"
          value={overallGrade}
          subtitle={overallSubText}
          icon="military_tech"
          color="tertiary"
          onClick={() => navigate('/student/marks')}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Marks */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-title-lg text-on-surface">Recent Performance</h3>
            <button 
              onClick={() => navigate('/student/marks')}
              className="text-primary-container hover:text-primary transition-colors text-label-lg font-medium flex items-center gap-1"
            >
              View All <Icon name="arrow_forward" size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentMarks.map((mark, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container-low transition-colors border border-outline-variant/10"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary-container font-bold text-title-md">
                    {mark.subject[0]}
                  </div>
                  <div>
                    <p className="text-title-md text-on-surface font-medium">{mark.subject}</p>
                    <p className="text-body-md text-on-surface-variant flex items-center gap-1">
                      <Icon name="event" size={14} /> {mark.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-title-lg text-primary font-bold">{mark.score}<span className="text-body-sm text-on-surface-variant font-normal">/{mark.max}</span></p>
                  <p className="text-label-md px-2 py-0.5 rounded bg-tertiary-container text-on-tertiary-container inline-block mt-1 font-medium">Grade {mark.grade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Requests & Notifications */}
        <div className="space-y-6">
          <div className="card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-bl-full -z-10" />
            <h3 className="text-title-lg text-on-surface mb-4">Leave Status</h3>
            
            {leaveRequests.length > 0 ? (
              <div className="space-y-3 max-h-56 overflow-y-auto">
                {leaveRequests.slice(0, 3).map((leave, i) => {
                  const isApproved = leave.status === 'Approved';
                  const isPending = leave.status === 'Pending';
                  const statusIcon = isApproved ? 'check_circle' : isPending ? 'hourglass_empty' : 'cancel';
                  const statusColor = isApproved ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : isPending ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-red-50 border-red-100 text-red-700';
                  return (
                    <div key={i} className={`p-3 rounded-xl border ${statusColor}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon name={statusIcon} size={18} />
                        <span className="font-semibold text-body-md">{leave.status}</span>
                      </div>
                      <p className="text-body-sm">{leave.type} ({new Date(leave.from).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(leave.to).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-surface-container-low text-on-surface-variant text-body-sm mb-4 text-center">
                No leave requests yet
              </div>
            )}
            
            <button 
              onClick={() => navigate('/student/leaves')}
              className="btn-secondary w-full justify-center mt-2 group"
            >
              <Icon name="add" size={18} className="group-hover:rotate-90 transition-transform" />
              Apply for Leave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
