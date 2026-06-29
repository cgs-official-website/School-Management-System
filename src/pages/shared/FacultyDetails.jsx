import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function FacultyDetails() {
  const { role } = useAuth();
  const [faculty, setFaculty] = useState([
    { id: 1, staffId: 'EMP-201', name: 'Rajinikanth', role: 'Teacher', qualification: 'M.Sc. B.Ed.', email: 'rajini@school.edu', status: 'Active' },
    { id: 2, staffId: 'EMP-202', name: 'Kamal Haasan', role: 'Teacher', qualification: 'M.A. M.Ed.', email: 'kamal@school.edu', status: 'Active' },
    { id: 3, staffId: 'EMP-203', name: 'Vijay', role: 'Librarian', qualification: 'B.Lib.Sc.', email: 'vijay@school.edu', status: 'Active' },
    { id: 4, staffId: 'EMP-204', name: 'Ajith Kumar', role: 'Accountant', qualification: 'M.Com. MBA', email: 'ajith@school.edu', status: 'Active' }
  ]);

  const [newStaff, setNewStaff] = useState({ name: '', role: 'Teacher', qualification: '', email: '', phone: '' });

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) {
      toast.error('Please enter Name and Email');
      return;
    }
    const record = {
      id: faculty.length + 1,
      staffId: `EMP-${200 + faculty.length + 1}`,
      name: newStaff.name,
      role: newStaff.role,
      qualification: newStaff.qualification || 'N/A',
      email: newStaff.email,
      status: 'Active'
    };
    setFaculty([...faculty, record]);
    setNewStaff({ name: '', role: 'Teacher', qualification: '', email: '', phone: '' });
    toast.success('Staff member registered successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Faculty & Staff Details</h1>
        <p className="page-subtitle">Manage faculty rosters, qualifications, teaching positions, and operational staff contracts.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total Staff Members" value={faculty.length.toString()} icon="badge" color="primary" />
        <StatCard title="Active Teaching Staff" value={faculty.filter(f => f.role === 'Teacher').length.toString()} icon="supervisor_account" color="secondary" />
        <StatCard title="Operational Staff" value={faculty.filter(f => f.role !== 'Teacher').length.toString()} icon="engineering" color="tertiary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {role === 'admin' && (
          <div className="card p-6 bg-white/80 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
              <Icon name="person_add" size={20} className="text-amber-500" /> Add Staff Member
            </h2>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">STAFF FULL NAME</label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Kamal Haasan"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">ROLE / DESIGNATION</label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  className="input-field"
                >
                  <option value="Teacher">Teacher</option>
                  <option value="Librarian">Librarian</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Warden">Warden</option>
                  <option value="Clerk">Clerk</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">QUALIFICATION</label>
                <input
                  type="text"
                  value={newStaff.qualification}
                  onChange={(e) => setNewStaff({ ...newStaff, qualification: e.target.value })}
                  className="input-field"
                  placeholder="e.g. M.Sc. B.Ed."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="input-field"
                  placeholder="e.g. staff@school.edu"
                />
              </div>
              <button type="submit" className="btn-primary w-full">Register Staff</button>
            </form>
          </div>
        )}

        <div className={`${role === 'admin' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <DataTable
            columns={[
              { key: 'staffId', label: 'Staff ID' },
              { key: 'name', label: 'Name' },
              { key: 'role', label: 'Designation' },
              { key: 'qualification', label: 'Qualifications' },
              { key: 'email', label: 'Email' },
              { 
                key: 'status', 
                label: 'Status',
                render: (v) => (
                  <span className="chip chip-success">{v}</span>
                )
              }
            ]}
            data={faculty}
          />
        </div>
      </div>
    </div>
  );
}
