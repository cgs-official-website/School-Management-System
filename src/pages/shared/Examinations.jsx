import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Examinations() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState('internal');

  const [exams, setExams] = useState([
    { id: 1, title: 'Term 1 Mid-Term Examination', date: '2026-07-15', classes: 'Class 8 to 12', session: '2026-27', status: 'Scheduled' },
    { id: 2, title: 'Class 10 Board Preparatory Exam', date: '2026-08-01', classes: 'Class 10', session: '2026-27', status: 'Scheduled' },
    { id: 3, title: 'Weekly Assessment Test 2', date: '2026-06-25', classes: 'Class 10-A', session: '2026-27', status: 'Completed' }
  ]);

  const [onlineExams, setOnlineExams] = useState([
    { id: 1, title: 'Mathematics Chapter 1 Quiz', subject: 'Maths', date: '2026-06-29', duration: '30 mins', questions: 20, status: 'Active' },
    { id: 2, title: 'Physics Light Assessment', subject: 'Physics', date: '2026-07-02', duration: '45 mins', questions: 30, status: 'Upcoming' }
  ]);

  const [marks, setMarks] = useState([
    { id: 1, studentName: 'Rahul Sharma', math: 85, science: 90, english: 88, social: 92, total: 355 },
    { id: 2, studentName: 'Aadhya Nair', math: 95, science: 94, english: 92, social: 89, total: 370 }
  ]);

  const [newExam, setNewExam] = useState({ title: '', date: '', classes: 'Class 10', session: '2026-27' });

  const handleCreateExam = (e) => {
    e.preventDefault();
    if (!newExam.title || !newExam.date) {
      toast.error('Exam Title and Date are required');
      return;
    }
    const record = {
      id: exams.length + 1,
      ...newExam,
      status: 'Scheduled'
    };
    setExams([record, ...exams]);
    setNewExam({ title: '', date: '', classes: 'Class 10', session: '2026-27' });
    toast.success('Internal examination scheduled successfully!');
  };

  const handleStartExam = (exam) => {
    toast.success(`Starting Online Exam: ${exam.title}. Best of luck!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Examinations Board</h1>
        <p className="page-subtitle">Schedule term tests, design marksheet templates, deploy online quizzes, and publish academic records.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Active Exam Schedules" value={exams.filter(e => e.status === 'Scheduled').length.toString()} icon="quiz" color="primary" />
        <StatCard title="Online Quizzes Running" value={onlineExams.filter(o => o.status === 'Active').length.toString()} icon="computer" color="secondary" />
        <StatCard title="Average Batch Class Mark" value="88%" icon="assessment" color="tertiary" />
      </div>

      <div className="border-b border-slate-200/50 flex gap-2">
        <button
          onClick={() => setActiveTab('internal')}
          className={`px-4 py-2.5 rounded-t-xl font-semibold flex items-center gap-2 ${
            activeTab === 'internal' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
          }`}
        >
          <Icon name="quiz" size={18} /> Internal Exams
        </button>
        <button
          onClick={() => setActiveTab('online')}
          className={`px-4 py-2.5 rounded-t-xl font-semibold flex items-center gap-2 ${
            activeTab === 'online' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
          }`}
        >
          <Icon name="computer" size={18} /> Online Tests
        </button>
        <button
          onClick={() => setActiveTab('reportcard')}
          className={`px-4 py-2.5 rounded-t-xl font-semibold flex items-center gap-2 ${
            activeTab === 'reportcard' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
          }`}
        >
          <Icon name="assignment" size={18} /> Report Cards
        </button>
      </div>

      {activeTab === 'internal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {role === 'admin' && (
            <div className="card p-6 bg-white/80 h-fit">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
                <Icon name="add" size={20} className="text-amber-500" /> Schedule Exam
              </h2>
              <form onSubmit={handleCreateExam} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">EXAMINATION NAME</label>
                  <input
                    type="text"
                    value={newExam.title}
                    onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Term 2 Examination"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">START DATE</label>
                  <input
                    type="date"
                    value={newExam.date}
                    onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">GRADES ELIGIBLE</label>
                  <input
                    type="text"
                    value={newExam.classes}
                    onChange={(e) => setNewExam({ ...newExam, classes: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Class 8-12"
                  />
                </div>
                <button type="submit" className="btn-primary w-full">Deploy Schedule</button>
              </form>
            </div>
          )}

          <div className={`${role === 'admin' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <DataTable
              columns={[
                { key: 'title', label: 'Examination Title' },
                { key: 'date', label: 'Start Date' },
                { key: 'classes', label: 'Eligible Grades' },
                { key: 'session', label: 'Academic Session' },
                { 
                  key: 'status', 
                  label: 'Status',
                  render: (v) => (
                    <span className={`chip ${v === 'Scheduled' ? 'chip-info' : 'chip-success'}`}>
                      {v}
                    </span>
                  )
                }
              ]}
              data={exams}
            />
          </div>
        </div>
      )}

      {activeTab === 'online' && (
        <DataTable
          columns={[
            { key: 'title', label: 'Quiz Title' },
            { key: 'subject', label: 'Subject' },
            { key: 'date', label: 'Publish Date' },
            { key: 'duration', label: 'Duration limit' },
            { key: 'questions', label: 'Total MCQ Questions' },
            { 
              key: 'status', 
              label: 'Portal Status',
              render: (v) => (
                <span className={`chip ${v === 'Active' ? 'chip-success' : 'chip-warning'}`}>
                  {v}
                </span>
              )
            },
            {
              key: 'actions',
              label: 'Action',
              render: (_, row) => (
                <button 
                  onClick={() => handleStartExam(row)} 
                  disabled={row.status !== 'Active'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm ${
                    row.status === 'Active' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  Start Exam
                </button>
              )
            }
          ]}
          data={onlineExams}
        />
      )}

      {activeTab === 'reportcard' && (
        <div className="card p-6 bg-white/70 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-800">
              {role === 'student' ? 'My Term Progress Card' : 'Student Grade Index'}
            </h3>
            {role !== 'student' && (
              <button onClick={() => toast.success('Publishing marks to parent SMS portal...')} className="btn-primary">
                Publish All Report Cards
              </button>
            )}
          </div>

          {role === 'student' ? (
            <DataTable
              columns={[
                { key: 'subject', label: 'Subject Name' },
                { key: 'maxMarks', label: 'Maximum Marks' },
                { key: 'passingMarks', label: 'Passing Marks' },
                { key: 'obtainedMarks', label: 'Obtained Marks' },
                { 
                  key: 'grade', 
                  label: 'Grade / Status',
                  render: (v) => <span className="chip chip-success font-bold">{v}</span>
                }
              ]}
              data={[
                { subject: 'Mathematics', maxMarks: 100, passingMarks: 35, obtainedMarks: 85, grade: 'A+' },
                { subject: 'Science', maxMarks: 100, passingMarks: 35, obtainedMarks: 90, grade: 'O (Outstanding)' },
                { subject: 'English', maxMarks: 100, passingMarks: 35, obtainedMarks: 88, grade: 'A+' },
                { subject: 'Social Studies', maxMarks: 100, passingMarks: 35, obtainedMarks: 92, grade: 'O (Outstanding)' }
              ]}
            />
          ) : (
            <DataTable
              columns={[
                { key: 'studentName', label: 'Student' },
                { key: 'math', label: 'Maths' },
                { key: 'science', label: 'Science' },
                { key: 'english', label: 'English' },
                { key: 'social', label: 'Social' },
                { key: 'total', label: 'Total (Out of 400)' },
                {
                  key: 'actions',
                  label: 'Action',
                  render: (_, row) => (
                    <button 
                      onClick={() => toast.success(`Opening edit marks sheet for ${row.studentName}`)} 
                      className="text-amber-500 hover:underline font-bold text-xs"
                    >
                      Edit Grade
                    </button>
                  )
                }
              ]}
              data={marks}
            />
          )}
        </div>
      )}
    </div>
  );
}
