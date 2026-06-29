import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function PayrollManagement() {
  const { role } = useAuth();
  const [payrolls, setPayrolls] = useState([
    { id: 1, staffId: 'EMP-201', name: 'Rajinikanth', role: 'Teacher', basicSalary: 45000, allowance: 5000, deduction: 2000, netSalary: 48000, month: 'June 2026', status: 'Paid' },
    { id: 2, staffId: 'EMP-202', name: 'Kamal Haasan', role: 'Teacher', basicSalary: 48000, allowance: 5000, deduction: 2500, netSalary: 50500, month: 'June 2026', status: 'Paid' },
    { id: 3, staffId: 'EMP-203', name: 'Vijay', role: 'Librarian', basicSalary: 30000, allowance: 3000, deduction: 1000, netSalary: 32000, month: 'June 2026', status: 'Paid' },
    { id: 4, staffId: 'EMP-204', name: 'Ajith Kumar', role: 'Accountant', basicSalary: 35000, allowance: 4000, deduction: 1500, netSalary: 37500, month: 'June 2026', status: 'Generated' }
  ]);

  const [selectedMonth, setSelectedMonth] = useState('June 2026');

  const handlePaySalary = (id) => {
    setPayrolls(payrolls.map(p => p.id === id ? { ...p, status: 'Paid' } : p));
    toast.success('Salary marked as paid!');
  };

  const handleDownloadPayslip = (row) => {
    toast.success(`Downloading payslip for ${row.name} - ${row.month}`);
  };

  // If user is teacher, filter to show only their payslips
  const displayData = role === 'teacher' 
    ? payrolls.filter(p => p.name === 'Rajinikanth') 
    : payrolls.filter(p => p.month === selectedMonth);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Payroll Management</h1>
        <p className="page-subtitle">Track staff salaries, payslips, basic allowances, and deductions.</p>
      </div>

      {role === 'admin' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard title="Total Basic Payroll" value="₹1,58,000" icon="payments" color="primary" />
          <StatCard title="Total Paid (This Month)" value="₹1,30,500" icon="check_circle" color="secondary" />
          <StatCard title="Pending Payments" value="₹37,500" icon="hourglass_empty" color="tertiary" />
        </div>
      )}

      <div className="card p-6 bg-white/70">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            {role === 'admin' ? 'Staff Payroll Registry' : 'My Payslip Records'}
          </h2>
          {role === 'admin' && (
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="input-field py-2"
              >
                <option value="June 2026">June 2026</option>
                <option value="May 2026">May 2026</option>
              </select>
              <button 
                onClick={() => toast.success('New monthly payroll generated for all active staff!')} 
                className="btn-primary"
              >
                Generate Payroll
              </button>
            </div>
          )}
        </div>

        <DataTable
          columns={[
            ...(role === 'admin' ? [
              { key: 'staffId', label: 'Staff ID' },
              { key: 'name', label: 'Employee' },
              { key: 'role', label: 'Role' }
            ] : []),
            { key: 'basicSalary', label: 'Basic (₹)', render: (v) => `₹${v.toLocaleString('en-IN')}` },
            { key: 'allowance', label: 'Allowances (₹)', render: (v) => `₹${v.toLocaleString('en-IN')}` },
            { key: 'deduction', label: 'Deductions (₹)', render: (v) => `₹${v.toLocaleString('en-IN')}` },
            { key: 'netSalary', label: 'Net Pay (₹)', render: (v) => `₹${v.toLocaleString('en-IN')}` },
            { key: 'month', label: 'Month' },
            { 
              key: 'status', 
              label: 'Status',
              render: (v) => (
                <span className={`chip ${v === 'Paid' ? 'chip-success' : 'chip-warning'}`}>
                  {v}
                </span>
              )
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (_, row) => (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDownloadPayslip(row)} 
                    className="p-1 text-slate-500 hover:text-amber-500"
                    title="Download Payslip"
                  >
                    <Icon name="download" size={20} />
                  </button>
                  {role === 'admin' && row.status === 'Generated' && (
                    <button 
                      onClick={() => handlePaySalary(row.id)} 
                      className="px-2 py-1 text-xs bg-emerald-500 text-white rounded-md font-bold"
                    >
                      Release
                    </button>
                  )}
                </div>
              )
            }
          ]}
          data={displayData}
        />
      </div>
    </div>
  );
}
