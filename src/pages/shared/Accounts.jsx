import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Accounts() {
  const { role } = useAuth();
  const [incomes, setIncomes] = useState([
    { id: 1, title: 'Term 1 Tuition Fees', category: 'Tuition Fees', amount: 450000, date: '2026-06-25', source: 'Online Gateway' },
    { id: 2, title: 'Uniform Purchases Store', category: 'Store Sales', amount: 25000, date: '2026-06-28', source: 'Cash' }
  ]);

  const [expenses, setExpenses] = useState([
    { id: 1, title: 'June Electricity Invoice', category: 'Utility Bills', amount: 12000, date: '2026-06-24', checkNo: 'CHK-901' },
    { id: 2, title: 'Supplier Books Payment', category: 'Store Refills', amount: 35000, date: '2026-06-26', checkNo: 'CHK-902' }
  ]);

  const [activeView, setActiveView] = useState('income');
  const [newTransaction, setNewTransaction] = useState({ title: '', category: 'General', amount: '', date: '', sourceOrCheck: '' });

  if (role !== 'admin' && role !== 'superadmin') {
    return (
      <div className="card p-8 bg-rose-50/50 border-rose-100 flex flex-col items-center justify-center text-center animate-fade-in">
        <Icon name="error" size={48} className="text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Access Restricted</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md">
          Financial accounts ledger and transactions databases are restricted. Please contact school administrator.
        </p>
      </div>
    );
  }

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!newTransaction.title || !newTransaction.amount) {
      toast.error('Transaction Title and Amount are required');
      return;
    }
    const record = {
      id: (activeView === 'income' ? incomes.length : expenses.length) + 1,
      title: newTransaction.title,
      category: newTransaction.category,
      amount: parseFloat(newTransaction.amount) || 0,
      date: newTransaction.date || new Date().toISOString().split('T')[0],
      source: activeView === 'income' ? newTransaction.sourceOrCheck : undefined,
      checkNo: activeView === 'expense' ? newTransaction.sourceOrCheck : undefined
    };
    if (activeView === 'income') {
      setIncomes([record, ...incomes]);
    } else {
      setExpenses([record, ...expenses]);
    }
    setNewTransaction({ title: '', category: 'General', amount: '', date: '', sourceOrCheck: '' });
    toast.success('Financial transaction recorded successfully!');
  };

  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">School Accounts Ledger</h1>
        <p className="page-subtitle">Manage incomes, track expenses, record ledger invoices, and audit school balances.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total Income" value={`₹${totalIncome.toLocaleString('en-IN')}`} icon="trending_up" color="primary" />
        <StatCard title="Total Expenses" value={`₹${totalExpense.toLocaleString('en-IN')}`} icon="trending_down" color="error" />
        <StatCard title="Net Balance" value={`₹${netBalance.toLocaleString('en-IN')}`} icon="account_balance_wallet" color="secondary" />
      </div>

      <div className="border-b border-slate-200/50 flex gap-2">
        <button
          onClick={() => { setActiveView('income'); setNewTransaction({ title: '', category: 'Tuition Fees', amount: '', date: '', sourceOrCheck: '' }); }}
          className={`px-4 py-2.5 rounded-t-xl font-semibold flex items-center gap-2 ${
            activeView === 'income' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
          }`}
        >
          <Icon name="trending_up" size={18} /> Incomes
        </button>
        <button
          onClick={() => { setActiveView('expense'); setNewTransaction({ title: '', category: 'Utility Bills', amount: '', date: '', sourceOrCheck: '' }); }}
          className={`px-4 py-2.5 rounded-t-xl font-semibold flex items-center gap-2 ${
            activeView === 'expense' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
          }`}
        >
          <Icon name="trending_down" size={18} /> Expenses
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 bg-white/80 h-fit">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
            <Icon name="add" size={20} className="text-amber-500" /> Record {activeView === 'income' ? 'Income' : 'Expense'}
          </h2>
          <form onSubmit={handleAddTransaction} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">TRANSACTION TITLE</label>
              <input
                type="text"
                value={newTransaction.title}
                onChange={(e) => setNewTransaction({ ...newTransaction, title: e.target.value })}
                className="input-field"
                placeholder="e.g. Science Lab Supplies"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">AMOUNT (₹)</label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  className="input-field"
                  placeholder="₹ Amount"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">DATE</label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">CATEGORY</label>
              {activeView === 'income' ? (
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  className="input-field"
                >
                  <option value="Tuition Fees">Tuition Fees</option>
                  <option value="Store Sales">Store Sales</option>
                  <option value="Donations">Donations</option>
                  <option value="Sponsorships">Sponsorships</option>
                </select>
              ) : (
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  className="input-field"
                >
                  <option value="Utility Bills">Utility Bills</option>
                  <option value="Store Refills">Store Refills</option>
                  <option value="Staff Salary">Staff Salary</option>
                  <option value="Logistics">Logistics</option>
                </select>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                {activeView === 'income' ? 'PAYMENT SOURCE (CASH/CARD)' : 'CHECK / INVOICE REF NO'}
              </label>
              <input
                type="text"
                value={newTransaction.sourceOrCheck}
                onChange={(e) => setNewTransaction({ ...newTransaction, sourceOrCheck: e.target.value })}
                className="input-field"
                placeholder={activeView === 'income' ? 'e.g. Bank Transfer' : 'e.g. CHK-905'}
              />
            </div>
            <button type="submit" className="btn-primary w-full">Save Entry</button>
          </form>
        </div>

        <div className="lg:col-span-2">
          {activeView === 'income' ? (
            <DataTable
              columns={[
                { key: 'title', label: 'Particulars' },
                { key: 'category', label: 'Category' },
                { key: 'amount', label: 'Amount (₹)', render: (v) => `₹${v.toLocaleString('en-IN')}` },
                { key: 'date', label: 'Received Date' },
                { key: 'source', label: 'Source' }
              ]}
              data={incomes}
            />
          ) : (
            <DataTable
              columns={[
                { key: 'title', label: 'Particulars' },
                { key: 'category', label: 'Category' },
                { key: 'amount', label: 'Spent Amount (₹)', render: (v) => `₹${v.toLocaleString('en-IN')}` },
                { key: 'date', label: 'Expense Date' },
                { key: 'checkNo', label: 'Invoice No' }
              ]}
              data={expenses}
            />
          )}
        </div>
      </div>
    </div>
  );
}
