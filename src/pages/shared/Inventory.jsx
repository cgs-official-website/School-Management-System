import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Inventory() {
  const { role } = useAuth();
  const [items, setItems] = useState([
    { id: 1, name: 'A4 Copier Paper Bundle', category: 'Office Supplies', totalQty: 100, issuedQty: 40, status: 'In Stock' },
    { id: 2, name: 'Projector HDMI Cables (5m)', category: 'Media/IT', totalQty: 12, issuedQty: 10, status: 'Low Stock' },
    { id: 3, name: 'Whiteboard Markers Black (Pack 10)', category: 'Classroom Supplies', totalQty: 50, issuedQty: 15, status: 'In Stock' }
  ]);

  const [issueLog, setIssueLog] = useState([
    { id: 1, itemName: 'A4 Copier Paper Bundle', issuedTo: 'Kamal Haasan (Teacher)', qty: 2, issueDate: '2026-06-25', returnDate: '--' },
    { id: 2, itemName: 'Projector HDMI Cables (5m)', issuedTo: 'Rajinikanth (Teacher)', qty: 1, issueDate: '2026-06-20', returnDate: '--' }
  ]);

  const [newItem, setNewItem] = useState({ name: '', category: 'Office Supplies', totalQty: '', status: 'In Stock' });
  const [newIssue, setNewIssue] = useState({ itemName: 'A4 Copier Paper Bundle', issuedTo: '', qty: 1 });

  if (role !== 'admin' && role !== 'superadmin') {
    return (
      <div className="card p-8 bg-rose-50/50 border-rose-100 flex flex-col items-center justify-center text-center animate-fade-in">
        <Icon name="error" size={48} className="text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Access Restricted</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md">
          Inventory control modules and item check-outs logs are restricted to school administrative staff.
        </p>
      </div>
    );
  }

  const handleCreateItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.totalQty) {
      toast.error('Item name and quantity are required');
      return;
    }
    const record = {
      id: items.length + 1,
      name: newItem.name,
      category: newItem.category,
      totalQty: parseInt(newItem.totalQty, 10),
      issuedQty: 0,
      status: parseInt(newItem.totalQty, 10) > 10 ? 'In Stock' : 'Low Stock'
    };
    setItems([record, ...items]);
    setNewItem({ name: '', category: 'Office Supplies', totalQty: '', status: 'In Stock' });
    toast.success('Inventory stock item logged successfully!');
  };

  const handleIssueItem = (e) => {
    e.preventDefault();
    if (!newIssue.issuedTo) {
      toast.error('Issued to recipient name is required');
      return;
    }
    const record = {
      id: issueLog.length + 1,
      itemName: newIssue.itemName,
      issuedTo: newIssue.issuedTo,
      qty: newIssue.qty,
      issueDate: new Date().toISOString().split('T')[0],
      returnDate: '--'
    };
    setIssueLog([record, ...issueLog]);
    setNewIssue({ itemName: 'A4 Copier Paper Bundle', issuedTo: '', qty: 1 });
    toast.success('Asset check-out registered!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Inventory Control & Assets</h1>
        <p className="page-subtitle">Track school property stocks, classroom items utilities, and staff asset checkout lists.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total Asset Classes" value={items.length.toString()} icon="inventory" color="primary" />
        <StatCard title="Active Issued Units" value={items.reduce((sum, i) => sum + i.issuedQty, 0).toString()} icon="outbox" color="secondary" />
        <StatCard title="Under Stock Threshold" value={items.filter(i => i.status === 'Low Stock').length.toString()} icon="priority_high" color="error" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="card p-6 bg-white/80">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
              <Icon name="add" size={20} className="text-amber-500" /> Log Stock Item
            </h2>
            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">ASSET DESCRIPTION</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Acer HDMI Projector"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">CATEGORY</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Media/IT">Media / IT</option>
                    <option value="Classroom Supplies">Classroom Supplies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">STOCK QTY</label>
                  <input
                    type="number"
                    value={newItem.totalQty}
                    onChange={(e) => setNewItem({ ...newItem, totalQty: e.target.value })}
                    className="input-field"
                    placeholder="Units"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full">Record Asset Stock</button>
            </form>
          </div>

          <div className="card p-6 bg-white/80">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
              <Icon name="outbox" size={20} className="text-amber-500" /> Issue Asset Item
            </h2>
            <form onSubmit={handleIssueItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">SELECT STOCK ITEM</label>
                <select
                  value={newIssue.itemName}
                  onChange={(e) => setNewIssue({ ...newIssue, itemName: e.target.value })}
                  className="input-field"
                >
                  {items.map(i => (
                    <option key={i.id} value={i.name}>{i.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">ISSUED TO</label>
                  <input
                    type="text"
                    value={newIssue.issuedTo}
                    onChange={(e) => setNewIssue({ ...newIssue, issuedTo: e.target.value })}
                    className="input-field"
                    placeholder="Staff/Teacher name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">QUANTITY</label>
                  <input
                    type="number"
                    value={newIssue.qty}
                    onChange={(e) => setNewIssue({ ...newIssue, qty: parseInt(e.target.value, 10) })}
                    className="input-field"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full">Complete Checkout</button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 bg-white/70">
            <h3 className="text-lg font-bold mb-4 text-slate-800">Active Stock Inventory</h3>
            <DataTable
              columns={[
                { key: 'name', label: 'Item Name' },
                { key: 'category', label: 'Category' },
                { key: 'totalQty', label: 'Stock Limit' },
                { key: 'issuedQty', label: 'Checked Out' },
                { 
                  key: 'status', 
                  label: 'Status',
                  render: (v) => (
                    <span className={`chip ${v === 'In Stock' ? 'chip-success' : 'chip-danger'}`}>
                      {v}
                    </span>
                  )
                }
              ]}
              data={items}
            />
          </div>

          <div className="card p-6 bg-white/70">
            <h3 className="text-lg font-bold mb-4 text-slate-800">Asset Checkout History</h3>
            <DataTable
              columns={[
                { key: 'itemName', label: 'Asset Item' },
                { key: 'issuedTo', label: 'Issued Recipient' },
                { key: 'qty', label: 'Qty' },
                { key: 'issueDate', label: 'Checkout Date' },
                { key: 'returnDate', label: 'Returned Date' }
              ]}
              data={issueLog}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
