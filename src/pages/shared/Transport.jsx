import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Transport() {
  const { role } = useAuth();
  const [routes, setRoutes] = useState([
    { id: 1, routeTitle: 'North Coimbatore Route 1', vehicleNo: 'TN-37-CA-1123', driverName: 'Subramani', driverPhone: '9443210456', routeFare: 1200, status: 'Active' },
    { id: 2, routeTitle: 'Singanallur Route 3', vehicleNo: 'TN-38-DB-5566', driverName: 'Murugan', driverPhone: '9842954332', routeFare: 1500, status: 'Active' },
    { id: 3, routeTitle: 'Gandhipuram Route 7', vehicleNo: 'TN-38-EF-9988', driverName: 'Sathish', driverPhone: '9001234001', routeFare: 1000, status: 'Active' }
  ]);

  const [newRoute, setNewRoute] = useState({ routeTitle: '', vehicleNo: '', driverName: '', driverPhone: '', routeFare: '' });

  const handleAddRoute = (e) => {
    e.preventDefault();
    if (!newRoute.routeTitle || !newRoute.vehicleNo) {
      toast.error('Route Title and Vehicle Number are required');
      return;
    }
    const record = {
      id: routes.length + 1,
      routeTitle: newRoute.routeTitle,
      vehicleNo: newRoute.vehicleNo,
      driverName: newRoute.driverName || '--',
      driverPhone: newRoute.driverPhone || '--',
      routeFare: parseFloat(newRoute.routeFare) || 0,
      status: 'Active'
    };
    setRoutes([...routes, record]);
    setNewRoute({ routeTitle: '', vehicleNo: '', driverName: '', driverPhone: '', routeFare: '' });
    toast.success('Transport route and driver mapped successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">School Transport Directory</h1>
        <p className="page-subtitle">Manage school bus routes, vehicle assignments, driver logs, and tracking parameters.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Active Transport Routes" value={routes.length.toString()} icon="directions_bus" color="primary" />
        <StatCard title="Operational Fleet" value={routes.length.toString()} icon="local_shipping" color="secondary" />
        <StatCard title="Students registered" value="124 students" icon="groups" color="tertiary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {role === 'admin' && (
          <div className="card p-6 bg-white/80 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
              <Icon name="add" size={20} className="text-amber-500" /> Register Bus Route
            </h2>
            <form onSubmit={handleAddRoute} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">ROUTE TITLE</label>
                <input
                  type="text"
                  value={newRoute.routeTitle}
                  onChange={(e) => setNewRoute({ ...newRoute, routeTitle: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Town Hall Route 4"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">VEHICLE NO</label>
                  <input
                    type="text"
                    value={newRoute.vehicleNo}
                    onChange={(e) => setNewRoute({ ...newRoute, vehicleNo: e.target.value })}
                    className="input-field"
                    placeholder="e.g. TN-38-A-1234"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">MONTHLY FARE (₹)</label>
                  <input
                    type="number"
                    value={newRoute.routeFare}
                    onChange={(e) => setNewRoute({ ...newRoute, routeFare: e.target.value })}
                    className="input-field"
                    placeholder="Monthly fee"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">DRIVER NAME</label>
                <input
                  type="text"
                  value={newRoute.driverName}
                  onChange={(e) => setNewRoute({ ...newRoute, driverName: e.target.value })}
                  className="input-field"
                  placeholder="Driver's Full Name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">DRIVER PHONE</label>
                <input
                  type="text"
                  value={newRoute.driverPhone}
                  onChange={(e) => setNewRoute({ ...newRoute, driverPhone: e.target.value })}
                  className="input-field"
                  placeholder="Contact details"
                />
              </div>
              <button type="submit" className="btn-primary w-full">Save Route</button>
            </form>
          </div>
        )}

        <div className={`${role === 'admin' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <DataTable
            columns={[
              { key: 'routeTitle', label: 'Route Plan / Destination' },
              { key: 'vehicleNo', label: 'Vehicle Number' },
              { key: 'driverName', label: 'Assigned Driver' },
              { key: 'driverPhone', label: 'Driver Contact' },
              { key: 'routeFare', label: 'Fare / Month (₹)', render: (v) => `₹${v.toLocaleString('en-IN')}` },
              { 
                key: 'status', 
                label: 'Status',
                render: (v) => (
                  <span className="chip chip-success">{v}</span>
                )
              }
            ]}
            data={routes}
          />
        </div>
      </div>
    </div>
  );
}
