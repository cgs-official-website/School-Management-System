import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function StudentInformation() {
  const { role } = useAuth();
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [students, setStudents] = useState([
    { id: 1, rollNo: '1001', name: 'Rahul Sharma', class: '10-A', gender: 'Male', phone: '9876543210', status: 'Active' },
    { id: 2, rollNo: '1002', name: 'Aadhya Nair', class: '10-A', gender: 'Female', phone: '9842954111', status: 'Active' },
    { id: 3, rollNo: '1003', name: 'Sujith Kumar', class: '10-A', gender: 'Male', phone: '9123456780', status: 'Active' },
    { id: 4, rollNo: '801', name: 'Deepa Jain', class: '8-B', gender: 'Female', phone: '9443210999', status: 'Active' }
  ]);

  const [newStudent, setNewStudent] = useState({ name: '', class: '10-A', gender: 'Male', phone: '', parentName: '', dob: '' });

  const filteredStudents = students.filter(student => {
    const matchesClass = student.class === selectedClass;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.rollNo.includes(searchQuery);
    return matchesClass && matchesSearch;
  });

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudent.name) {
      toast.error('Please enter name');
      return;
    }
    const record = {
      id: students.length + 1,
      rollNo: (1000 + students.length + 1).toString(),
      name: newStudent.name,
      class: newStudent.class,
      gender: newStudent.gender,
      phone: newStudent.phone || '--',
      status: 'Active'
    };
    setStudents([...students, record]);
    setNewStudent({ name: '', class: '10-A', gender: 'Male', phone: '', parentName: '', dob: '' });
    toast.success('Student added successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Student Information</h1>
        <p className="page-subtitle">View class registers, search student folders, and process new student admissions.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Students" value={students.length.toString()} icon="school" color="primary" />
        <StatCard title="Active In Class 10-A" value={students.filter(s => s.class === '10-A').length.toString()} icon="groups" color="secondary" />
        <StatCard title="New Admissions (This Month)" value="4" icon="person_add" color="tertiary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {role === 'admin' && (
          <div className="card p-6 bg-white/80 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
              <Icon name="person_add" size={20} className="text-amber-500" /> Student Admission
            </h2>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">STUDENT FULL NAME</label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">CLASS/SECTION</label>
                  <select
                    value={newStudent.class}
                    onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                    className="input-field"
                  >
                    <option value="10-A">10-A</option>
                    <option value="10-B">10-B</option>
                    <option value="8-A">8-A</option>
                    <option value="8-B">8-B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">GENDER</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                    className="input-field"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">PARENT/GUARDIAN NAME</label>
                <input
                  type="text"
                  value={newStudent.parentName}
                  onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                  className="input-field"
                  placeholder="Guardian's Name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">CONTACT PHONE</label>
                <input
                  type="text"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                  className="input-field"
                  placeholder="Contact Number"
                />
              </div>
              <button type="submit" className="btn-primary w-full">Admit Student</button>
            </form>
          </div>
        )}

        <div className={`${role === 'admin' ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
          <div className="card p-4 bg-white/70 flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:w-1/3">
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="input-field"
              >
                <option value="10-A">Class 10-A</option>
                <option value="10-B">Class 10-B</option>
                <option value="8-A">Class 8-A</option>
                <option value="8-B">Class 8-B</option>
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Search Students</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Search by name or roll number..."
                />
                <Icon name="search" size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          <DataTable
            columns={[
              { key: 'rollNo', label: 'Roll Number' },
              { key: 'name', label: 'Name' },
              { key: 'class', label: 'Class' },
              { key: 'gender', label: 'Gender' },
              { key: 'phone', label: 'Phone' },
              { 
                key: 'status', 
                label: 'Status',
                render: (v) => (
                  <span className="chip chip-success">{v}</span>
                )
              }
            ]}
            data={filteredStudents}
          />
        </div>
      </div>
    </div>
  );
}
