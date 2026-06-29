import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Certificate() {
  const { role } = useAuth();
  const [logs, setLogs] = useState([
    { id: 1, type: 'Transfer Certificate (TC)', studentName: 'Rahul Sharma', class: 'Class 10-A', issueDate: '2026-06-29', issuedBy: 'Principal Office' },
    { id: 2, type: 'Student ID Card', studentName: 'Aadhya Nair', class: 'Class 10-A', issueDate: '2026-06-28', issuedBy: 'Admin Desk' }
  ]);

  const [studentName, setStudentName] = useState('');
  const [certType, setCertType] = useState('Transfer Certificate (TC)');

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!studentName.trim()) {
      toast.error('Student Name is required');
      return;
    }
    const record = {
      id: logs.length + 1,
      type: certType,
      studentName: studentName,
      class: 'Class 10-A',
      issueDate: new Date().toISOString().split('T')[0],
      issuedBy: 'Admin Desk'
    };
    setLogs([record, ...logs]);
    setStudentName('');
    toast.success(`${certType} generated successfully!`);
  };

  const handleDownload = (cert) => {
    toast.success(`Downloading ${cert.type} PDF for ${cert.studentName}...`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Certificate & ID Cards Center</h1>
        <p className="page-subtitle">Design digital templates, generate transfer certificates (TC), character sheets, and student ID cards.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Certificates Issued" value={logs.length.toString()} icon="card_membership" color="primary" />
        <StatCard title="Active Card Templates" value="3 Templates" icon="style" color="secondary" />
        <StatCard title="Pending Approvals" value="0" icon="pending_actions" color="tertiary" />
      </div>

      {role === 'admin' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-6 bg-white/80 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
              <Icon name="design_services" size={20} className="text-amber-500" /> Generate Certificate
            </h2>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">SELECT TEMPLATE</label>
                <select
                  value={certType}
                  onChange={(e) => setCertType(e.target.value)}
                  className="input-field"
                >
                  <option value="Transfer Certificate (TC)">Transfer Certificate (TC)</option>
                  <option value="Character Certificate">Character Certificate</option>
                  <option value="Student ID Card">Student ID Card</option>
                  <option value="Excellence Certificate">Certificate of Excellence</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">STUDENT NAME</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="input-field"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
              <button type="submit" className="btn-primary w-full">Generate Digital Doc</button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="card p-6 bg-white/70">
              <h3 className="text-lg font-bold mb-4 text-slate-800">Generation Audit History</h3>
              <DataTable
                columns={[
                  { key: 'type', label: 'Document Type' },
                  { key: 'studentName', label: 'Student' },
                  { key: 'class', label: 'Class' },
                  { key: 'issueDate', label: 'Issue Date' },
                  { key: 'issuedBy', label: 'Authorized Desk' },
                  {
                    key: 'actions',
                    label: 'Download',
                    render: (_, row) => (
                      <button onClick={() => handleDownload(row)} className="text-amber-500 hover:text-amber-600 font-bold text-xs flex items-center gap-1">
                        <Icon name="download" size={16} /> PDF
                      </button>
                    )
                  }
                ]}
                data={logs}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6 bg-gradient-to-br from-amber-500 to-orange-400 text-white rounded-3xl relative overflow-hidden shadow-xl max-w-md mx-auto w-full">
            {/* Background design elements */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute left-0 bottom-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-6 -mb-6" />

            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-headline-sm font-bold tracking-tight">SAGAR INT. SCHOOL</h3>
                <p className="text-[10px] tracking-widest uppercase opacity-80">Student ID Card</p>
              </div>
              <div className="w-10 h-10 bg-white rounded-xl p-1 shadow">
                <img src="/logo.png" alt="School" className="w-full h-full object-contain" />
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="w-20 h-24 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border border-white/30 overflow-hidden shadow-sm">
                <Icon name="person" size={48} className="text-white/60" />
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <h4 className="text-lg font-bold truncate">Rahul Sharma</h4>
                <p className="text-xs opacity-95">Roll No: <span className="font-bold">1001</span></p>
                <p className="text-xs opacity-95">Grade: <span className="font-bold">Class 10-A</span></p>
                <p className="text-xs opacity-95">Validity: <span className="font-bold">2026-27</span></p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center text-[10px] opacity-90">
              <p>Blood Group: O+ve</p>
              <p>Emergency: +91 98765 43210</p>
            </div>
          </div>

          <div className="card p-6 bg-white/70">
            <h3 className="text-lg font-bold mb-4 text-slate-800">My Certificates Directory</h3>
            <DataTable
              columns={[
                { key: 'type', label: 'Document Name' },
                { key: 'issueDate', label: 'Issue Date' },
                {
                  key: 'actions',
                  label: 'Action',
                  render: (_, row) => (
                    <button onClick={() => handleDownload(row)} className="btn-secondary py-1 px-3 text-xs flex items-center gap-1">
                      <Icon name="download" size={14} /> Download PDF
                    </button>
                  )
                }
              ]}
              data={logs.filter(l => l.studentName === 'Rahul Sharma')}
            />
          </div>
        </div>
      )}
    </div>
  );
}
