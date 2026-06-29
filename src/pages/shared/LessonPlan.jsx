import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function LessonPlan() {
  const { role } = useAuth();
  const [lessons, setLessons] = useState([
    { id: 1, subject: 'Mathematics', lesson: 'Chapter 1: Quadratic Equations', topic: 'Nature of Roots, Formula Method', date: '2026-06-15', status: 'Completed' },
    { id: 2, subject: 'Mathematics', lesson: 'Chapter 2: Arithmetic Progression', topic: 'Sum of n terms, Word Problems', date: '2026-06-28', status: 'In Progress' },
    { id: 3, subject: 'Physics', lesson: 'Chapter 3: Light Reflection', topic: 'Spherical Mirrors, Focal Length', date: '2026-06-20', status: 'Completed' },
    { id: 4, subject: 'Physics', lesson: 'Chapter 4: Refraction', topic: 'Snell\'s Law, Lens Formula', date: '2026-07-05', status: 'Pending' }
  ]);

  const [newLesson, setNewLesson] = useState({ subject: 'Mathematics', lesson: '', topic: '', status: 'Pending' });

  const handleCreatePlan = (e) => {
    e.preventDefault();
    if (!newLesson.lesson || !newLesson.topic) {
      toast.error('Lesson and Topic details are required');
      return;
    }
    const record = {
      id: lessons.length + 1,
      ...newLesson,
      date: new Date().toISOString().split('T')[0]
    };
    setLessons([...lessons, record]);
    setNewLesson({ subject: 'Mathematics', lesson: '', topic: '', status: 'Pending' });
    toast.success('Lesson plan topic scheduled successfully!');
  };

  const handleToggleStatus = (id) => {
    setLessons(lessons.map(l => {
      if (l.id === id) {
        const nextStatus = l.status === 'Pending' ? 'In Progress' : l.status === 'In Progress' ? 'Completed' : 'Pending';
        return { ...l, status: nextStatus };
      }
      return l;
    }));
    toast.success('Lesson status updated!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Lesson & Syllabus Planning</h1>
        <p className="page-subtitle">Map subject structures, log daily lesson topic milestones, and audit syllabus coverage progress.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total Planned Topics" value={lessons.length.toString()} icon="import_contacts" color="primary" />
        <StatCard title="Topics Completed" value={lessons.filter(l => l.status === 'Completed').length.toString()} icon="check_circle" color="secondary" />
        <StatCard title="Syllabus Completion" value={`${Math.round((lessons.filter(l => l.status === 'Completed').length / lessons.length) * 100)}%`} icon="donut_large" color="tertiary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {role !== 'student' && (
          <div className="card p-6 bg-white/80 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
              <Icon name="add" size={20} className="text-amber-500" /> Plan Lesson
            </h2>
            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">SUBJECT NAME</label>
                <select
                  value={newLesson.subject}
                  onChange={(e) => setNewLesson({ ...newLesson, subject: e.target.value })}
                  className="input-field"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="English">English</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">LESSON / CHAPTER</label>
                <input
                  type="text"
                  value={newLesson.lesson}
                  onChange={(e) => setNewLesson({ ...newLesson, lesson: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Chapter 5: Trigonometry"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">TOPICS TO COVER</label>
                <input
                  type="text"
                  value={newLesson.topic}
                  onChange={(e) => setNewLesson({ ...newLesson, topic: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Height and Distances"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">INITIAL STATUS</label>
                <select
                  value={newLesson.status}
                  onChange={(e) => setNewLesson({ ...newLesson, status: e.target.value })}
                  className="input-field"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <button type="submit" className="btn-primary w-full">Save Lesson Schedule</button>
            </form>
          </div>
        )}

        <div className={`${role !== 'student' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="card p-6 bg-white/70">
            <h2 className="text-lg font-bold mb-4 text-slate-800">Syllabus Registry Logs</h2>
            <DataTable
              columns={[
                { key: 'subject', label: 'Subject' },
                { key: 'lesson', label: 'Lesson / Chapter' },
                { key: 'topic', label: 'Topics Mapped' },
                { key: 'date', label: 'Scheduled Date' },
                { 
                  key: 'status', 
                  label: 'Status',
                  render: (v) => (
                    <span className={`chip ${v === 'Completed' ? 'chip-success' : v === 'In Progress' ? 'chip-warning' : 'chip-danger'}`}>
                      {v}
                    </span>
                  )
                },
                ...(role !== 'student' ? [{
                  key: 'actions',
                  label: 'Toggle Status',
                  render: (_, row) => (
                    <button 
                      onClick={() => handleToggleStatus(row.id)} 
                      className="px-2 py-1 text-xs bg-slate-200 text-slate-700 rounded font-bold hover:bg-slate-300"
                    >
                      Cycle Status
                    </button>
                  )
                }] : [])
              ]}
              data={lessons}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
