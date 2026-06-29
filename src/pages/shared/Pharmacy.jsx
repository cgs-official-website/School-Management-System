import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Pharmacy() {
  const { role } = useAuth();
  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Paracetamol 500mg', generic: 'Acetaminophen', qty: 500, expiry: '2027-12', room: 'First-Aid Room A' },
    { id: 2, name: 'Antiseptic Solution 100ml', generic: 'Chlorhexidine', qty: 24, expiry: '2028-05', room: 'Main Dispensary' },
    { id: 3, name: 'Bandage Strips Box (100pcs)', generic: 'Adhesive Strip', qty: 10, expiry: '2030-01', room: 'First-Aid Room A' }
  ]);

  const [healthLogs, setHealthLogs] = useState([
    { id: 1, studentName: 'Rahul Sharma', class: '10-A', symptoms: 'Mild Fever & Headache', treatment: 'Given Paracetamol 500mg, advised rest.', date: '2026-06-29', time: '11:00 AM' },
    { id: 2, studentName: 'Deepa Jain', class: '8-B', symptoms: 'Knee Scrape (Playground)', treatment: 'Cleaned with antiseptic, applied bandage.', date: '2026-06-28', time: '02:30 PM' }
  ]);

  const [newLog, setNewLog] = useState({ studentName: '', class: '10-A', symptoms: '', treatment: '' });

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!newLog.studentName || !newLog.symptoms) {
      toast.error('Student Name and Symptoms are required');
      return;
    }
    const record = {
      id: healthLogs.length + 1,
      ...newLog,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setHealthLogs([record, ...healthLogs]);
    setNewLog({ studentName: '', class: '10-A', symptoms: '', treatment: '' });
    toast.success('Medical log recorded successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">School Dispensary & Pharmacy</h1>
        <p className="page-subtitle">Manage emergency medicine stocks, first-aid logs, and student medical checkups.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Medicine Stock Count" value="534 items" icon="local_pharmacy" color="primary" />
        <StatCard title="Medical Cases Logged" value={healthLogs.length.toString()} icon="medical_services" color="secondary" />
        <StatCard title="Assigned Doctor/Nurse" value="Dr. Preethi (On Duty)" icon="health_and_safety" color="tertiary" />
      </div>

      {role !== 'student' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-6 bg-white/80 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
              <Icon name="add" size={20} className="text-amber-500" /> Log Medical Case
            </h2>
            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">STUDENT NAME</label>
                <input
                  type="text"
                  value={newLog.studentName}
                  onChange={(e) => setNewLog({ ...newLog, studentName: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">CLASS</label>
                <select
                  value={newLog.class}
                  onChange={(e) => setNewLog({ ...newLog, class: e.target.value })}
                  className="input-field"
                >
                  <option value="10-A">Class 10-A</option>
                  <option value="10-B">Class 10-B</option>
                  <option value="8-A">Class 8-A</option>
                  <option value="8-B">Class 8-B</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">SYMPTOMS</label>
                <input
                  type="text"
                  value={newLog.symptoms}
                  onChange={(e) => setNewLog({ ...newLog, symptoms: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Stomach ache, Fever"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">TREATMENT APPLIED</label>
                <textarea
                  value={newLog.treatment}
                  onChange={(e) => setNewLog({ ...newLog, treatment: e.target.value })}
                  className="input-field h-20"
                  placeholder="e.g. Given oral rehydration, sent home."
                />
              </div>
              <button type="submit" className="btn-primary w-full">Record Incident</button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 bg-white/70">
              <h3 className="text-lg font-bold mb-4 text-slate-800">Recent Medical Visits</h3>
              <DataTable
                columns={[
                  { key: 'studentName', label: 'Student' },
                  { key: 'class', label: 'Class' },
                  { key: 'symptoms', label: 'Symptoms' },
                  { key: 'treatment', label: 'Treatment' },
                  { key: 'date', label: 'Date' },
                  { key: 'time', label: 'Time' }
                ]}
                data={healthLogs}
              />
            </div>

            <div className="card p-6 bg-white/70">
              <h3 className="text-lg font-bold mb-4 text-slate-800">First-Aid Medicine Stocks</h3>
              <DataTable
                columns={[
                  { key: 'name', label: 'Medicine Name' },
                  { key: 'generic', label: 'Generic Name' },
                  { key: 'qty', label: 'Stock Level' },
                  { key: 'expiry', label: 'Expiry Date' },
                  { key: 'room', label: 'Location' }
                ]}
                data={medicines}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-6 bg-white/70 space-y-6">
          <h2 className="text-xl font-bold text-slate-800">My Health Checkup & Treatment Log</h2>
          <DataTable
            columns={[
              { key: 'date', label: 'Date' },
              { key: 'time', label: 'Time' },
              { key: 'symptoms', label: 'Reported Symptoms' },
              { key: 'treatment', label: 'Dispensary Treatment / Recommendation' }
            ]}
            data={healthLogs.filter(h => h.studentName === 'Rahul Sharma')}
          />
        </div>
      )}
    </div>
  );
}
