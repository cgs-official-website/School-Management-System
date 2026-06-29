import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function FrontOffice() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState('enquiry');
  
  // States for dynamic forms
  const [enquiries, setEnquiries] = useState([
    { id: 1, name: 'MD YAZH', phone: '8973327126', date: '2026-06-29', class: 'Class 10', source: 'Online', status: 'Active' },
    { id: 2, name: 'AADHYA', phone: '9842954111', date: '2026-06-28', class: 'Class 8', source: 'Advertisement', status: 'Pending' },
    { id: 3, name: 'Kabir Dev', phone: '9443210987', date: '2026-06-25', class: 'Class 11', source: 'Walk In', status: 'Resolved' }
  ]);
  const [newEnquiry, setNewEnquiry] = useState({ name: '', phone: '', class: '', source: '', note: '' });

  const [visitors, setVisitors] = useState([
    { id: 1, purpose: 'Meeting Principal', name: 'Raj Kumar', phone: '9001234567', date: '2026-06-29', inTime: '10:00 AM', outTime: '10:30 AM' },
    { id: 2, purpose: 'Fee Enquiry', name: 'Saravanan', phone: '9882345678', date: '2026-06-29', inTime: '11:15 AM', outTime: '11:45 AM' }
  ]);
  const [newVisitor, setNewVisitor] = useState({ name: '', phone: '', purpose: '', inTime: '' });

  const [calls, setCalls] = useState([
    { id: 1, name: 'Srinivasan', phone: '9443210111', date: '2026-06-29', callType: 'Incoming', duration: '2 min', description: 'Enquired about exam dates' },
    { id: 2, name: 'School Admin', phone: '0422-23456', date: '2026-06-29', callType: 'Outgoing', duration: '1 min', description: 'Called vendor for books' }
  ]);

  const [postals, setPostals] = useState([
    { id: 1, type: 'Receive', title: 'Board Exam Circular', from: 'Education Board', referenceNo: 'REF-889', date: '2026-06-27' },
    { id: 2, type: 'Dispatch', title: 'Sponsorship Letter', to: 'Zuna Tech Ltd', referenceNo: 'DISP-112', date: '2026-06-28' }
  ]);

  const handleCreateEnquiry = (e) => {
    e.preventDefault();
    if (!newEnquiry.name || !newEnquiry.phone) {
      toast.error('Please enter Name and Phone');
      return;
    }
    const record = {
      id: enquiries.length + 1,
      ...newEnquiry,
      date: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    setEnquiries([record, ...enquiries]);
    setNewEnquiry({ name: '', phone: '', class: '', source: '', note: '' });
    toast.success('Admission enquiry submitted successfully!');
  };

  const handleCreateVisitor = (e) => {
    e.preventDefault();
    if (!newVisitor.name || !newVisitor.purpose) {
      toast.error('Please fill in visitor name and purpose');
      return;
    }
    const record = {
      id: visitors.length + 1,
      name: newVisitor.name,
      phone: newVisitor.phone || '--',
      purpose: newVisitor.purpose,
      date: new Date().toISOString().split('T')[0],
      inTime: newVisitor.inTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      outTime: '--'
    };
    setVisitors([record, ...visitors]);
    setNewVisitor({ name: '', phone: '', purpose: '', inTime: '' });
    toast.success('Visitor log created successfully!');
  };

  const tabs = [
    { id: 'enquiry', label: 'Admission Enquiry', icon: 'contact_support' },
    { id: 'visitor', label: 'Visitor Book', icon: 'menu_book' },
    { id: 'calls', label: 'Phone Call Log', icon: 'phone' },
    { id: 'postal', label: 'Postal Dispatch/Receive', icon: 'mail' },
    { id: 'gmeet', label: 'Google Meet Schedule', icon: 'videocam' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Front Office Portal</h1>
        <p className="page-subtitle">Manage public enquiries, visitor registries, postal deliveries, and digital meetings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Enquiries" value={enquiries.length.toString()} icon="contact_support" color="primary" />
        <StatCard title="Visitors Today" value={visitors.length.toString()} icon="groups" color="secondary" />
        <StatCard title="Active Meetings" value="1" icon="video_call" color="tertiary" />
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200/50 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
            }`}
          >
            <Icon name={tab.icon} size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Panels */}
      {activeTab === 'enquiry' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {role === 'admin' && (
            <div className="card p-6 bg-white/80 h-fit">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
                <Icon name="add" size={20} className="text-amber-500" /> Add Enquiry
              </h2>
              <form onSubmit={handleCreateEnquiry} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">CANDIDATE NAME</label>
                  <input
                    type="text"
                    value={newEnquiry.name}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Adhavan"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">PHONE NUMBER</label>
                  <input
                    type="text"
                    value={newEnquiry.phone}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, phone: e.target.value })}
                    className="input-field"
                    placeholder="e.g. 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">DESIRED CLASS</label>
                  <select
                    value={newEnquiry.class}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, class: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select Class</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">SOURCE</label>
                  <input
                    type="text"
                    value={newEnquiry.source}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, source: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Website, Newspaper, Social Media"
                  />
                </div>
                <button type="submit" className="btn-primary w-full">Save Enquiry</button>
              </form>
            </div>
          )}
          
          <div className={`${role === 'admin' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <DataTable
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'phone', label: 'Phone' },
                { key: 'date', label: 'Date' },
                { key: 'class', label: 'Class' },
                { key: 'source', label: 'Source' },
                { 
                  key: 'status', 
                  label: 'Status',
                  render: (v) => (
                    <span className={`chip ${v === 'Active' ? 'chip-info' : v === 'Resolved' ? 'chip-success' : 'chip-warning'}`}>
                      {v}
                    </span>
                  )
                }
              ]}
              data={enquiries}
            />
          </div>
        </div>
      )}

      {activeTab === 'visitor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {role === 'admin' && (
            <div className="card p-6 bg-white/80 h-fit">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
                <Icon name="add" size={20} className="text-amber-500" /> Log Visitor
              </h2>
              <form onSubmit={handleCreateVisitor} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">VISITOR NAME</label>
                  <input
                    type="text"
                    value={newVisitor.name}
                    onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Ramesh Baboo"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">PHONE NUMBER</label>
                  <input
                    type="text"
                    value={newVisitor.phone}
                    onChange={(e) => setNewVisitor({ ...newVisitor, phone: e.target.value })}
                    className="input-field"
                    placeholder="e.g. 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">PURPOSE OF VISIT</label>
                  <input
                    type="text"
                    value={newVisitor.purpose}
                    onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Admissions, Meeting Staff"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">IN TIME (OPTIONAL)</label>
                  <input
                    type="time"
                    value={newVisitor.inTime}
                    onChange={(e) => setNewVisitor({ ...newVisitor, inTime: e.target.value })}
                    className="input-field"
                  />
                </div>
                <button type="submit" className="btn-primary w-full">Record Entry</button>
              </form>
            </div>
          )}

          <div className={`${role === 'admin' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <DataTable
              columns={[
                { key: 'name', label: 'Visitor Name' },
                { key: 'phone', label: 'Phone' },
                { key: 'purpose', label: 'Purpose' },
                { key: 'date', label: 'Date' },
                { key: 'inTime', label: 'In Time' },
                { key: 'outTime', label: 'Out Time' }
              ]}
              data={visitors}
            />
          </div>
        </div>
      )}

      {activeTab === 'calls' && (
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'phone', label: 'Phone Number' },
            { key: 'date', label: 'Date' },
            { 
              key: 'callType', 
              label: 'Type',
              render: (v) => (
                <span className={`chip ${v === 'Incoming' ? 'chip-success' : 'chip-info'}`}>
                  {v}
                </span>
              )
            },
            { key: 'duration', label: 'Duration' },
            { key: 'description', label: 'Description' }
          ]}
          data={calls}
        />
      )}

      {activeTab === 'postal' && (
        <DataTable
          columns={[
            { key: 'title', label: 'Subject / Document' },
            { 
              key: 'type', 
              label: 'Flow Type',
              render: (v) => (
                <span className={`chip ${v === 'Receive' ? 'chip-success' : 'chip-warning'}`}>
                  Postal {v}
                </span>
              )
            },
            { 
              key: 'from', 
              label: 'Sender/Receiver', 
              render: (v, row) => row.type === 'Receive' ? `From: ${row.from}` : `To: ${row.to}`
            },
            { key: 'referenceNo', label: 'Reference Number' },
            { key: 'date', label: 'Logged Date' }
          ]}
          data={postals}
        />
      )}

      {activeTab === 'gmeet' && (
        <div className="card p-6 bg-white/70">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-headline-sm font-bold text-slate-800">Google Meet Sessions</h3>
              <p className="text-body-md text-slate-500">Scheduled active online conferences.</p>
            </div>
            {role !== 'student' && (
              <button onClick={() => toast.success('Redirecting to Google Meet authorization...')} className="btn-primary">
                <Icon name="add" size={20} /> Schedule Meeting
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div className="border border-slate-200/50 rounded-xl p-4 bg-white/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-sm transition-all duration-300">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Class 10-A Math Session
                </span>
                <h4 className="text-lg font-bold mt-1.5 text-slate-800">Quadratic Equations Online Tutorial</h4>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Icon name="schedule" size={14} /> 29 Jun 2026, 03:00 PM - 04:00 PM
                </p>
              </div>
              <button 
                onClick={() => window.open('https://meet.google.com', '_blank')} 
                className="btn-secondary text-sm border-amber-500/30 hover:border-amber-500 bg-amber-50/20 text-amber-700 font-bold"
              >
                Join Meet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
