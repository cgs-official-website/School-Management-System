import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Store() {
  const { role } = useAuth();
  const [storeItems, setStoreItems] = useState([
    { id: 1, name: 'Standard Grade 10 Math Book', category: 'Books', quantity: 200, unitPrice: 250, supplier: 'Saraswati Publications', status: 'In Stock' },
    { id: 2, name: 'Science Laboratory Kit', category: 'Lab Equipment', quantity: 15, unitPrice: 1200, supplier: 'Apex Sci Supplies', status: 'Low Stock' },
    { id: 3, name: 'School Uniform Blazer (Medium)', category: 'Uniforms', quantity: 45, unitPrice: 950, supplier: 'Vogue Outfitters', status: 'In Stock' },
    { id: 4, name: 'Double Ruled Notebook 120pg', category: 'Stationery', quantity: 500, unitPrice: 35, supplier: 'Classmate Pvt Ltd', status: 'In Stock' }
  ]);

  const [newItem, setNewItem] = useState({ name: '', category: 'Books', quantity: '', unitPrice: '', supplier: '' });

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.quantity) {
      toast.error('Please enter Item Name and Quantity');
      return;
    }
    const record = {
      id: storeItems.length + 1,
      name: newItem.name,
      category: newItem.category,
      quantity: parseInt(newItem.quantity, 10),
      unitPrice: parseFloat(newItem.unitPrice) || 0,
      supplier: newItem.supplier || 'Local Supplier',
      status: parseInt(newItem.quantity, 10) > 20 ? 'In Stock' : 'Low Stock'
    };
    setStoreItems([...storeItems, record]);
    setNewItem({ name: '', category: 'Books', quantity: '', unitPrice: '', supplier: '' });
    toast.success('Store item added to database!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">School Store Directory</h1>
        <p className="page-subtitle">Track stationery, books, uniforms, lab tools, and manage supplier listings.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total Catalog Items" value={storeItems.length.toString()} icon="store" color="primary" />
        <StatCard title="Total Inventory Value" value="₹1,25,000" icon="payments" color="secondary" />
        <StatCard title="Critical Stock Alerts" value={storeItems.filter(i => i.status === 'Low Stock').length.toString()} icon="priority_high" color="error" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {role === 'admin' && (
          <div className="card p-6 bg-white/80 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
              <Icon name="add_shopping_cart" size={20} className="text-amber-500" /> Register Item
            </h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">ITEM NAME</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Science Lab Test Tubes"
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
                    <option value="Books">Books</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Uniforms">Uniforms</option>
                    <option value="Lab Equipment">Lab Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">QUANTITY</label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    className="input-field"
                    placeholder="e.g. 50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">UNIT PRICE (₹)</label>
                <input
                  type="number"
                  value={newItem.unitPrice}
                  onChange={(e) => setNewItem({ ...newItem, unitPrice: e.target.value })}
                  className="input-field"
                  placeholder="Unit Price in INR"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">SUPPLIER</label>
                <input
                  type="text"
                  value={newItem.supplier}
                  onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                  className="input-field"
                  placeholder="Supplier Company"
                />
              </div>
              <button type="submit" className="btn-primary w-full">Add To Inventory</button>
            </form>
          </div>
        )}

        <div className={`${role === 'admin' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <DataTable
            columns={[
              { key: 'name', label: 'Item Name' },
              { key: 'category', label: 'Category' },
              { key: 'quantity', label: 'Stock Level' },
              { key: 'unitPrice', label: 'Price (₹)', render: (v) => `₹${v}` },
              { key: 'supplier', label: 'Supplier' },
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
            data={storeItems}
          />
        </div>
      </div>
    </div>
  );
}
