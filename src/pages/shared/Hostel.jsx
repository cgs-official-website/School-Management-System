import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Hostel() {
  const { role } = useAuth();
  const [hostels, setHostels] = useState([
    { id: 1, hostelName: 'Tagore Boy\'s Residency', type: 'Boys Hostel', wardenName: 'Natarajan', wardenContact: '9842954881', capacity: 150, occupied: 120 },
    { id: 2, hostelName: 'Sarojini Girl\'s Residency', type: 'Girls Hostel', wardenName: 'Vasantha Kumari', wardenContact: '9001234772', capacity: 150, occupied: 135 }
  ]);

  const [rooms, setRooms] = useState([
    { id: 1, hostelName: 'Tagore Boy\'s Residency', roomNo: 'Room 101', roomType: '3-Bed Ac', cost: 4500, activeAllocations: 'Rahul Sharma, Sujith Kumar, Kishore' },
    { id: 2, hostelName: 'Sarojini Girl\'s Residency', roomNo: 'Room 202', roomType: '2-Bed Non-Ac', cost: 3200, activeAllocations: 'Deepa Jain, Pavithra' }
  ]);

  const [newRoom, setNewRoom] = useState({ hostelName: 'Tagore Boy\'s Residency', roomNo: '', roomType: '3-Bed Ac', cost: '', activeAllocations: '' });

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!newRoom.roomNo || !newRoom.cost) {
      toast.error('Room Number and Cost/Month are required');
      return;
    }
    const record = {
      id: rooms.length + 1,
      hostelName: newRoom.hostelName,
      roomNo: newRoom.roomNo,
      roomType: newRoom.roomType,
      cost: parseFloat(newRoom.cost) || 0,
      activeAllocations: newRoom.activeAllocations || 'Vacant'
    };
    setRooms([...rooms, record]);
    setNewRoom({ hostelName: 'Tagore Boy\'s Residency', roomNo: '', roomType: '3-Bed Ac', cost: '', activeAllocations: '' });
    toast.success('Room logged successfully into hostel database!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">School Hostel Portals</h1>
        <p className="page-subtitle">Track hostel residency capacities, allocate student room blocks, and view warden assignments.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Hostels Operating" value={hostels.length.toString()} icon="domain" color="primary" />
        <StatCard title="Occupancy Rate" value="85%" icon="people" color="secondary" />
        <StatCard title="Average Annual Dues" value="₹45,000" icon="payments" color="tertiary" />
      </div>

      {role === 'admin' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-6 bg-white/80 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
              <Icon name="add" size={20} className="text-amber-500" /> Allocate / Add Room
            </h2>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">SELECT HOSTEL BLOCK</label>
                <select
                  value={newRoom.hostelName}
                  onChange={(e) => setNewRoom({ ...newRoom, hostelName: e.target.value })}
                  className="input-field"
                >
                  {hostels.map(h => (
                    <option key={h.id} value={h.hostelName}>{h.hostelName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">ROOM NO</label>
                  <input
                    type="text"
                    value={newRoom.roomNo}
                    onChange={(e) => setNewRoom({ ...newRoom, roomNo: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Room 104"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">MONTHLY COST (₹)</label>
                  <input
                    type="number"
                    value={newRoom.cost}
                    onChange={(e) => setNewRoom({ ...newRoom, cost: e.target.value })}
                    className="input-field"
                    placeholder="₹ Rent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">ROOM SPECIFICATION</label>
                <select
                  value={newRoom.roomType}
                  onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value })}
                  className="input-field"
                >
                  <option value="3-Bed Ac">3-Bed Ac</option>
                  <option value="2-Bed Ac">2-Bed Ac</option>
                  <option value="3-Bed Non-Ac">3-Bed Non-Ac</option>
                  <option value="2-Bed Non-Ac">2-Bed Non-Ac</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">ALLOCATED MEMBERS</label>
                <input
                  type="text"
                  value={newRoom.activeAllocations}
                  onChange={(e) => setNewRoom({ ...newRoom, activeAllocations: e.target.value })}
                  className="input-field"
                  placeholder="Student Names (Comma separated)"
                />
              </div>
              <button type="submit" className="btn-primary w-full">Save Allocation</button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 bg-white/70">
              <h3 className="text-lg font-bold mb-4 text-slate-800">Hostel Block Overviews</h3>
              <DataTable
                columns={[
                  { key: 'hostelName', label: 'Hostel Block' },
                  { key: 'type', label: 'Residency Type' },
                  { key: 'wardenName', label: 'Chief Warden' },
                  { key: 'wardenContact', label: 'Warden Contact' },
                  { key: 'capacity', label: 'Capacity' },
                  { key: 'occupied', label: 'Occupants' }
                ]}
                data={hostels}
              />
            </div>

            <div className="card p-6 bg-white/70">
              <h3 className="text-lg font-bold mb-4 text-slate-800">Room Status & Members</h3>
              <DataTable
                columns={[
                  { key: 'hostelName', label: 'Hostel Block' },
                  { key: 'roomNo', label: 'Room' },
                  { key: 'roomType', label: 'Specification' },
                  { key: 'cost', label: 'Cost/Month (₹)', render: (v) => `₹${v.toLocaleString('en-IN')}` },
                  { key: 'activeAllocations', label: 'Allocations / Occupants' }
                ]}
                data={rooms}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-6 bg-white/70 space-y-6">
          <h2 className="text-xl font-bold text-slate-800">My Hostel Accommodation</h2>
          <DataTable
            columns={[
              { key: 'hostelName', label: 'Hostel Block' },
              { key: 'roomNo', label: 'Allocated Room' },
              { key: 'roomType', label: 'Specification' },
              { key: 'cost', label: 'Monthly Cost (₹)', render: (v) => `₹${v.toLocaleString('en-IN')}` },
              { key: 'activeAllocations', label: 'Roommates' }
            ]}
            data={rooms.filter(r => r.activeAllocations.includes('Rahul Sharma') || r.activeAllocations.includes('Deepa Jain'))}
          />
        </div>
      )}
    </div>
  );
}
