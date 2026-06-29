import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Communicate() {
  const { role } = useAuth();
  const [notices, setNotices] = useState([
    { id: 1, title: 'Independence Day Celebrations', message: 'Flag hoisting ceremony will commence at 08:00 AM on August 15th. Attendance is mandatory for all classes.', date: '2026-06-29', target: 'All', author: 'Principal Office' },
    { id: 2, title: 'Term 1 Exam Schedule Out', message: 'The datesheets for Term 1 examinations are published. Please check the downloads center for detailed schedule.', date: '2026-06-27', target: 'Students', author: 'Academic Dean' },
    { id: 3, title: 'Staff Meeting at 04:00 PM', message: 'A review meeting regarding new student profiles is scheduled in Conference Hall A.', date: '2026-06-26', target: 'Teachers', author: 'School Admin' }
  ]);

  const [newNotice, setNewNotice] = useState({ title: '', message: '', target: 'All' });
  const [channel, setChannel] = useState('email');
  const [msgSubject, setMsgSubject] = useState('');
  const [msgContent, setMsgContent] = useState('');
  const [msgTarget, setMsgTarget] = useState('Class 10-A Parents');

  const handlePublishNotice = (e) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.message) {
      toast.error('Please enter Title and Message content');
      return;
    }
    const record = {
      id: notices.length + 1,
      title: newNotice.title,
      message: newNotice.message,
      date: new Date().toISOString().split('T')[0],
      target: newNotice.target,
      author: role === 'admin' ? 'School Admin' : 'Class Teacher'
    };
    setNotices([record, ...notices]);
    setNewNotice({ title: '', message: '', target: 'All' });
    toast.success('Notice published successfully on Board!');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!msgSubject || !msgContent) {
      toast.error('Subject and Content cannot be blank');
      return;
    }
    toast.success(`Broadcasting ${channel.toUpperCase()} to ${msgTarget} completed!`);
    setMsgSubject('');
    setMsgContent('');
  };

  // Filter notices based on role
  const displayNotices = notices.filter(n => {
    if (role === 'student') return n.target === 'All' || n.target === 'Students';
    if (role === 'teacher') return n.target === 'All' || n.target === 'Teachers';
    return true; // Admin sees everything
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">School Communications Board</h1>
        <p className="page-subtitle">Post global announcements on notice boards, send parental SMS alerts, and dispatch school newsletters.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Active Notices" value={displayNotices.length.toString()} icon="campaign" color="primary" />
        <StatCard title="SMS Delivery Status" value="100% Sent" icon="sms" color="secondary" />
        <StatCard title="Newsletter Subscribers" value="284 members" icon="mail" color="tertiary" />
      </div>

      {role !== 'student' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="card p-6 bg-white/80">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
                <Icon name="add" size={20} className="text-amber-500" /> Create Notice
              </h2>
              <form onSubmit={handlePublishNotice} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">NOTICE TITLE</label>
                  <input
                    type="text"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Science Fair Postponed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">AUDIENCE GROUP</label>
                  <select
                    value={newNotice.target}
                    onChange={(e) => setNewNotice({ ...newNotice, target: e.target.value })}
                    className="input-field"
                  >
                    <option value="All">All Portal Users</option>
                    <option value="Students">Students & Parents Only</option>
                    <option value="Teachers">Teachers & Staff Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">MESSAGE CONTENT</label>
                  <textarea
                    value={newNotice.message}
                    onChange={(e) => setNewNotice({ ...newNotice, message: e.target.value })}
                    className="input-field h-24"
                    placeholder="Type details here..."
                  />
                </div>
                <button type="submit" className="btn-primary w-full">Broadcast On Notice Board</button>
              </form>
            </div>

            <div className="card p-6 bg-white/80">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
                <Icon name="send" size={20} className="text-amber-500" /> Send Email / SMS
              </h2>
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel('email')}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-xs ${channel === 'email' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'}`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('sms')}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-xs ${channel === 'sms' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'}`}
                  >
                    SMS Alert
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">TARGET AUDIENCE</label>
                  <input
                    type="text"
                    value={msgTarget}
                    onChange={(e) => setMsgTarget(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">SUBJECT</label>
                  <input
                    type="text"
                    value={msgSubject}
                    onChange={(e) => setMsgSubject(e.target.value)}
                    className="input-field"
                    placeholder="Message Heading"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">BODY CONTENT</label>
                  <textarea
                    value={msgContent}
                    onChange={(e) => setMsgContent(e.target.value)}
                    className="input-field h-24"
                    placeholder="Write detailed notification..."
                  />
                </div>
                <button type="submit" className="btn-primary w-full">Dispatch Broadcast</button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Recent Notices Registry</h2>
            <div className="space-y-4">
              {displayNotices.map(n => (
                <div key={n.id} className="card p-5 bg-white/70 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        To: {n.target}
                      </span>
                      <h3 className="text-lg font-bold mt-1 text-slate-800">{n.title}</h3>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{n.date}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{n.message}</p>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Posted By: {n.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800">Official Notice Board</h2>
          <div className="space-y-4">
            {displayNotices.map(n => (
              <div key={n.id} className="card p-5 bg-white/70 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-slate-800">{n.title}</h3>
                  <span className="text-xs text-slate-400 font-medium">{n.date}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{n.message}</p>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Posted By: {n.author}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
