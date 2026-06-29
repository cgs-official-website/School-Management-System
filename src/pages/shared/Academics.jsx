import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Academics() {
  const { role } = useAuth();
  
  const [classes, setClasses] = useState([
    { id: 1, name: 'Class 10-A', room: 'Room 101', teacher: 'Rajinikanth', subjects: 'Maths, Science, English, Tamil' },
    { id: 2, name: 'Class 10-B', room: 'Room 102', teacher: 'Kamal Haasan', subjects: 'Maths, Science, English, Social' },
    { id: 3, name: 'Class 8-A', room: 'Room 801', teacher: 'Vijay', subjects: 'Maths, Science, English, History' },
    { id: 4, name: 'Class 8-B', room: 'Room 802', teacher: 'Suriya', subjects: 'Maths, Geography, English, Tamil' }
  ]);

  const [timetable, setTimetable] = useState([
    { id: 1, day: 'Monday', period1: 'Maths (Rajini)', period2: 'Science (Kamal)', period3: 'English (Vijay)', period4: 'Tamil (Suriya)' },
    { id: 2, day: 'Tuesday', period1: 'Science (Kamal)', period2: 'Maths (Rajini)', period3: 'Social (Vijay)', period4: 'Tamil (Suriya)' },
    { id: 3, day: 'Wednesday', period1: 'English (Vijay)', period2: 'Maths (Rajini)', period3: 'Science (Kamal)', period4: 'Lab Practice' },
    { id: 4, day: 'Thursday', period1: 'Maths (Rajini)', period2: 'History (Vijay)', period3: 'English (Suriya)', period4: 'Library Session' },
    { id: 5, day: 'Friday', period1: 'Social (Vijay)', period2: 'Science (Kamal)', period3: 'Revision Class', period4: 'Physical Ed' }
  ]);

  const [newClass, setNewClass] = useState({ name: '', room: '', teacher: '', subjects: '' });

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newClass.name || !newClass.teacher) {
      toast.error('Class Name and Teacher are required');
      return;
    }
    const record = {
      id: classes.length + 1,
      name: newClass.name,
      room: newClass.room || 'N/A',
      teacher: newClass.teacher,
      subjects: newClass.subjects || 'General'
    };
    setClasses([...classes, record]);
    setNewClass({ name: '', room: '', teacher: '', subjects: '' });
    toast.success('New Class & Teacher assignment recorded!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Academic Directory & Schedules</h1>
        <p className="page-subtitle">Configure class timetables, section coordinates, and subject mappings.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total School Grades" value="12 Grades" icon="school" color="primary" />
        <StatCard title="Active Class Sections" value={classes.length.toString()} icon="groups" color="secondary" />
        <StatCard title="Total Teaching Hours/Week" value="40 Hours" icon="schedule" color="tertiary" />
      </div>

      {role === 'admin' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-6 bg-white/80 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
              <Icon name="add" size={20} className="text-amber-500" /> Configure Class Section
            </h2>
            <form onSubmit={handleAddClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">CLASS & SECTION NAME</label>
                <input
                  type="text"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Class 11-A"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">ROOM ASSIGNMENT</label>
                <input
                  type="text"
                  value={newClass.room}
                  onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Room 304"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">CLASS TEACHER</label>
                <input
                  type="text"
                  value={newClass.teacher}
                  onChange={(e) => setNewClass({ ...newClass, teacher: e.target.value })}
                  className="input-field"
                  placeholder="Teacher's Full Name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">SUBJECTS MAPPED</label>
                <input
                  type="text"
                  value={newClass.subjects}
                  onChange={(e) => setNewClass({ ...newClass, subjects: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Maths, Science, History"
                />
              </div>
              <button type="submit" className="btn-primary w-full">Save Class Setup</button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 bg-white/70">
              <h3 className="text-lg font-bold mb-4 text-slate-800">Active Class Mappings</h3>
              <DataTable
                columns={[
                  { key: 'name', label: 'Class / Grade' },
                  { key: 'room', label: 'Room' },
                  { key: 'teacher', label: 'Class Teacher' },
                  { key: 'subjects', label: 'Subjects Mapped' }
                ]}
                data={classes}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-6 bg-white/70 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">
              {role === 'teacher' ? 'My Teaching Timetable' : 'My Weekly Class Schedule'}
            </h2>
            <button 
              onClick={() => toast.success('Downloading weekly schedule PDF...')} 
              className="btn-secondary py-2 text-xs flex items-center gap-1.5"
            >
              <Icon name="download" size={16} /> Save Timetable
            </button>
          </div>
          <DataTable
            columns={[
              { key: 'day', label: 'Day' },
              { key: 'period1', label: '09:00 AM - 10:00 AM' },
              { key: 'period2', label: '10:15 AM - 11:15 AM' },
              { key: 'period3', label: '11:30 AM - 12:30 PM' },
              { key: 'period4', label: '01:30 PM - 02:30 PM' }
            ]}
            data={timetable}
          />
        </div>
      )}
    </div>
  );
}
