import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Alumni() {
  const { role } = useAuth();
  const [alumni, setAlumni] = useState([
    { id: 1, name: 'Vikram Seth', passoutYear: 2022, class: 'Class 12-A', occupation: 'Software Engineer at Google', contact: 'vikram@alumni.com' },
    { id: 2, name: 'Shreya Ghoshal', passoutYear: 2021, class: 'Class 12-B', occupation: 'Singer & Musician', contact: 'shreya@alumni.com' },
    { id: 3, name: 'Vijay Sethupathi', passoutYear: 2019, class: 'Class 12-A', occupation: 'Artist & Actor', contact: 'vjs@alumni.com' }
  ]);

  const [events, setEvents] = useState([
    { id: 1, title: 'Annual Alumni Meet 2026', date: '2026-12-15', time: '10:00 AM', venue: 'Main Auditorium', status: 'Scheduled' },
    { id: 2, title: 'Interactive Career Guidance Talk', date: '2026-07-20', time: '02:00 PM', venue: 'Seminar Hall 1', status: 'Upcoming' }
  ]);

  const [activeTab, setActiveTab] = useState('directory');
  const [newAlumni, setNewAlumni] = useState({ name: '', passoutYear: '', class: 'Class 12-A', occupation: '', contact: '' });
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', venue: '' });

  const handleAddAlumni = (e) => {
    e.preventDefault();
    if (!newAlumni.name || !newAlumni.passoutYear) {
      toast.error('Name and Passout Year are required');
      return;
    }
    const record = {
      id: alumni.length + 1,
      name: newAlumni.name,
      passoutYear: parseInt(newAlumni.passoutYear, 10),
      class: newAlumni.class,
      occupation: newAlumni.occupation || 'N/A',
      contact: newAlumni.contact || '--'
    };
    setAlumni([record, ...alumni]);
    setNewAlumni({ name: '', passoutYear: '', class: 'Class 12-A', occupation: '', contact: '' });
    toast.success('Alumni profiles saved successfully!');
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) {
      toast.error('Event Title and Date are required');
      return;
    }
    const record = {
      id: events.length + 1,
      ...newEvent,
      status: 'Scheduled'
    };
    setEvents([record, ...events]);
    setNewEvent({ title: '', date: '', time: '', venue: '' });
    toast.success('Alumni portal event published successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Alumni Portal</h1>
        <p className="page-subtitle">Track passout student careers, organize guest lectures, and manage alumni networks.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Registered Alumni" value={alumni.length.toString()} icon="groups" color="primary" />
        <StatCard title="Alumni Meets Held" value="5 Meets" icon="event" color="secondary" />
        <StatCard title="Industry Chapters" value="8 chapters" icon="business" color="tertiary" />
      </div>

      <div className="border-b border-slate-200/50 flex gap-2">
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2.5 rounded-t-xl font-semibold flex items-center gap-2 ${
            activeTab === 'directory' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
          }`}
        >
          <Icon name="groups" size={18} /> Alumni Directory
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2.5 rounded-t-xl font-semibold flex items-center gap-2 ${
            activeTab === 'events' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
          }`}
        >
          <Icon name="event" size={18} /> Alumni Events
        </button>
      </div>

      {activeTab === 'directory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {role === 'admin' && (
            <div className="card p-6 bg-white/80 h-fit">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
                <Icon name="person_add" size={20} className="text-amber-500" /> Log Alumnus
              </h2>
              <form onSubmit={handleAddAlumni} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">FULL NAME</label>
                  <input
                    type="text"
                    value={newAlumni.name}
                    onChange={(e) => setNewAlumni({ ...newAlumni, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Vikram Seth"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">PASSOUT YEAR</label>
                    <input
                      type="number"
                      value={newAlumni.passoutYear}
                      onChange={(e) => setNewAlumni({ ...newAlumni, passoutYear: e.target.value })}
                      className="input-field"
                      placeholder="e.g. 2022"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">GRADE PASSEDOUT</label>
                    <select
                      value={newAlumni.class}
                      onChange={(e) => setNewAlumni({ ...newAlumni, class: e.target.value })}
                      className="input-field"
                    >
                      <option value="Class 12-A">Class 12-A</option>
                      <option value="Class 12-B">Class 12-B</option>
                      <option value="Class 10-A">Class 10-A</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">CURRENT PROFESSION</label>
                  <input
                    type="text"
                    value={newAlumni.occupation}
                    onChange={(e) => setNewAlumni({ ...newAlumni, occupation: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Engineer at Microsoft"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">EMAIL / CONTACT</label>
                  <input
                    type="email"
                    value={newAlumni.contact}
                    onChange={(e) => setNewAlumni({ ...newAlumni, contact: e.target.value })}
                    className="input-field"
                    placeholder="Email or phone"
                  />
                </div>
                <button type="submit" className="btn-primary w-full">Record Alumnus Profile</button>
              </form>
            </div>
          )}

          <div className={`${role === 'admin' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <DataTable
              columns={[
                { key: 'name', label: 'Alumnus Name' },
                { key: 'passoutYear', label: 'Graduation Year' },
                { key: 'class', label: 'Class / Stream' },
                { key: 'occupation', label: 'Current Profession / Higher Studies' },
                { key: 'contact', label: 'Contact Details' }
              ]}
              data={alumni}
            />
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {role === 'admin' && (
            <div className="card p-6 bg-white/80 h-fit">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
                <Icon name="event" size={20} className="text-amber-500" /> Plan Alumni Meet
              </h2>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">MEET TITLE</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Silver Jubilee Batch Reunion"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">DATE</label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">TIME</label>
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">VENUE</label>
                  <input
                    type="text"
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Seminar Hall"
                  />
                </div>
                <button type="submit" className="btn-primary w-full">Schedule Event</button>
              </form>
            </div>
          )}

          <div className={`${role === 'admin' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <DataTable
              columns={[
                { key: 'title', label: 'Event Schedule' },
                { key: 'date', label: 'Date' },
                { key: 'time', label: 'Time' },
                { key: 'venue', label: 'Venue' },
                { 
                  key: 'status', 
                  label: 'Status',
                  render: (v) => (
                    <span className="chip chip-success">{v}</span>
                  )
                }
              ]}
              data={events}
            />
          </div>
        </div>
      )}
    </div>
  );
}
