import React, { useState, useEffect } from 'react';
import { collection, getDocs, setDoc, doc, serverTimestamp, query, orderBy, limit, deleteDoc, updateDoc, writeBatch, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/common/Icon';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

export default function Schools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewSchool, setViewSchool] = useState(null);
  const [confirmDeleteSchool, setConfirmDeleteSchool] = useState(null);
  const [confirmCancelSchool, setConfirmCancelSchool] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Active'); // 'Active' or 'Pending Approval' or 'All'
  const { registerUser } = useAuth();

  const [newSchool, setNewSchool] = useState({
    name: '',
    adminEmail: '',
    adminPassword: Math.random().toString(36).slice(-8), // generate random password
    planName: 'Demo Plan', // default plan
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'schools'));
      setSchools(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Error fetching schools:', err);
      toast.error('Failed to fetch schools');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSchool = async (targetSchool) => {
    const approvePromise = updateDoc(doc(db, 'schools', targetSchool.id), { status: 'Active' });
    
    // Update local state optimistically
    setSchools(prev => prev.map(s => s.id === targetSchool.id ? { ...s, status: 'Active' } : s));
    
    toast.promise(approvePromise, {
      loading: `Approving ${targetSchool.name}...`,
      success: `${targetSchool.name} is now approved and live!`,
      error: 'Failed to approve school.',
    });
  };

  const executeCancelSubscription = async () => {
    if (!confirmCancelSchool) return;
    const targetSchool = confirmCancelSchool;
    setConfirmCancelSchool(null);
    setSchools(prev => prev.map(s => s.id === targetSchool.id ? { ...s, status: 'Cancelled' } : s));

    const cancelPromise = updateDoc(doc(db, 'schools', targetSchool.id), { status: 'Cancelled' });
    
    toast.promise(cancelPromise, {
      loading: 'Cancelling subscription...',
      success: 'Subscription cancelled successfully.',
      error: 'Failed to cancel subscription.',
    });
  };

  const executeDeleteSchool = async () => {
    if (!confirmDeleteSchool) return;
    const targetSchool = confirmDeleteSchool;
    setConfirmDeleteSchool(null);
    setSchools(prev => prev.filter(s => s.id !== targetSchool.id));

    const deletePromise = (async () => {
      const batch = writeBatch(db);
      const usersQ = query(collection(db, 'users'), where('schoolId', '==', targetSchool.id));
      const collectionsToDelete = ['attendance', 'leaves', 'homework', 'marks', 'fees'];
      
      const queries = [getDocs(usersQ)];
      for (const coll of collectionsToDelete) {
        queries.push(getDocs(query(collection(db, coll), where('schoolId', '==', targetSchool.id))));
      }

      const snapshots = await Promise.all(queries);
      snapshots.forEach(snap => {
        snap.forEach(d => batch.delete(d.ref));
      });
      
      if (targetSchool.adminUid) {
        batch.delete(doc(db, 'users', targetSchool.adminUid));
      }
      batch.delete(doc(db, 'schools', targetSchool.id));
      await batch.commit();
    })();

    toast.promise(deletePromise, {
      loading: `Deleting ${targetSchool.name}...`,
      success: 'School completely deleted!',
      error: 'Failed to delete school.',
    });
  };

  const handleCreateSchool = async (e) => {
    e.preventDefault();
    try {
      let nextIdNumber = 1;
      const snap = await getDocs(collection(db, 'schools'));
      const zunaIds = snap.docs
        .map(d => d.id)
        .filter(id => id.startsWith('ZUNA'))
        .map(id => parseInt(id.replace('ZUNA', ''), 10))
        .filter(num => !isNaN(num));
      
      if (zunaIds.length > 0) {
        nextIdNumber = Math.max(...zunaIds) + 1;
      }
      const schoolId = `ZUNA${String(nextIdNumber).padStart(4, '0')}`;
      const schoolSlug = newSchool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const createdUser = await registerUser({
        email: newSchool.adminEmail,
        password: newSchool.adminPassword,
        name: `${newSchool.name} Admin`,
        roleToSet: 'admin'
      });

      await setDoc(doc(db, 'users', createdUser.uid), {
        schoolId: schoolId
      }, { merge: true });

      await setDoc(doc(db, 'schools', schoolId), {
        name: newSchool.name,
        slug: schoolSlug,
        adminEmail: newSchool.adminEmail,
        adminUid: createdUser.uid,
        createdAt: serverTimestamp(),
        status: 'Active',
        planName: newSchool.planName
      });

      toast.success('School Provisioned Successfully!');
      setIsAddOpen(false);
      fetchSchools();
      setNewSchool({
        name: '',
        adminEmail: '',
        adminPassword: Math.random().toString(36).slice(-8),
        planName: 'Demo Plan',
      });
    } catch (err) {
      console.error('Error provisioning school:', err);
      toast.error(err.message || 'Failed to provision school');
    }
  };

  const filteredSchools = schools.filter(s => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Pending Approval') return s.status === 'Pending Approval';
    // Defaults to active or other cancelled statuses
    return s.status === 'Active' || s.status === 'Cancelled';
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header text-2xl font-bold">Manage Schools</h1>
          <p className="page-subtitle text-slate-500">Onboard, review, and approve institution workspaces.</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setIsAddOpen(true)}>
          <Icon name="add" size={18} /> Provision New School
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-slate-200/50 flex gap-2">
        <button
          onClick={() => setActiveFilter('Active')}
          className={`px-4 py-2.5 rounded-t-xl font-semibold flex items-center gap-2 ${
            activeFilter === 'Active' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
          }`}
        >
          <Icon name="business" size={18} /> Active Schools ({schools.filter(s => s.status === 'Active').length})
        </button>
        <button
          onClick={() => setActiveFilter('Pending Approval')}
          className={`px-4 py-2.5 rounded-t-xl font-semibold flex items-center gap-2 ${
            activeFilter === 'Pending Approval' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
          }`}
        >
          <Icon name="pending_actions" size={18} /> Pending Approvals ({schools.filter(s => s.status === 'Pending Approval').length})
        </button>
        <button
          onClick={() => setActiveFilter('All')}
          className={`px-4 py-2.5 rounded-t-xl font-semibold flex items-center gap-2 ${
            activeFilter === 'All' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
          }`}
        >
          <Icon name="list" size={18} /> All ({schools.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredSchools.length === 0 ? (
        <div className="card p-12 text-center text-on-surface-variant bg-white border border-slate-100 rounded-2xl">
          <Icon name="business" size={48} className="mx-auto mb-3 text-slate-300" />
          <p className="text-title-md font-bold text-slate-700">No schools in this registry.</p>
          <p className="text-body-md text-slate-500 mt-1">Schools registered by users or provisioned manually will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school, i) => (
            <div 
              key={school.id} 
              className="card p-5 flex flex-col h-full bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 ${school.status === 'Pending Approval' ? 'bg-amber-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}></div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${school.status === 'Pending Approval' ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-500/10 text-amber-600'}`}>
                  <Icon name="school" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-title-md font-bold text-slate-800 truncate" title={school.name}>{school.name}</h3>
                  <p className="text-label-sm font-mono text-slate-400 mt-0.5">{school.id}</p>
                </div>
              </div>
              
              <div className="space-y-2.5 flex-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2.5 text-xs text-slate-600">
                  <Icon name="mail" size={16} className="text-slate-400 shrink-0" />
                  <span className="truncate" title={school.adminEmail}>{school.adminEmail}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-600 group/link">
                  <Icon name="link" size={16} className="text-slate-400 shrink-0" />
                  <span className="truncate text-amber-600 font-medium">{window.location.origin}/{school.slug}</span>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      navigator.clipboard.writeText(`${window.location.origin}/${school.slug}`); 
                      toast.success('URL copied!'); 
                    }}
                    className="opacity-0 group-hover/link:opacity-100 p-1 hover:bg-slate-200 rounded text-slate-500 transition-opacity ml-auto shrink-0"
                    title="Copy URL"
                  >
                    <Icon name="content_copy" size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md border border-slate-200">
                    {school.planName || 'Demo Plan'}
                  </span>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${
                    school.status === 'Active' 
                      ? 'bg-green-50 text-green-700 border-green-100' 
                      : school.status === 'Pending Approval' 
                      ? 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
                      : 'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {school.status || 'Active'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between gap-2 mt-1">
                  {school.status === 'Pending Approval' ? (
                    <button
                      onClick={() => handleApproveSchool(school)}
                      className="flex-1 py-2 px-3 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Icon name="check_circle" size={16} /> Approve Access
                    </button>
                  ) : (
                    <button 
                      onClick={() => setConfirmCancelSchool(school)} 
                      disabled={school.status === 'Cancelled'}
                      className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-xl border transition-colors ${school.status === 'Cancelled' ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                    >
                      Cancel Plan
                    </button>
                  )}
                  <button 
                    onClick={() => setConfirmDeleteSchool(school)} 
                    className="p-1.5 text-red-600 bg-white hover:bg-red-50 rounded-xl border border-red-100 transition-colors shrink-0"
                    title="Delete School"
                  >
                    <Icon name="delete" size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Provision Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Provision New School">
        <form onSubmit={handleCreateSchool} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">School Name</label>
            <input
              required
              type="text"
              className="input-field"
              value={newSchool.name}
              placeholder="e.g. Sagar International School"
              onChange={e => setNewSchool({ ...newSchool, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Admin Email</label>
            <input
              required
              type="email"
              className="input-field"
              value={newSchool.adminEmail}
              placeholder="admin@school.edu"
              onChange={e => setNewSchool({ ...newSchool, adminEmail: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Admin Password</label>
              <input
                required
                type="text"
                className="input-field font-mono"
                value={newSchool.adminPassword}
                onChange={e => setNewSchool({ ...newSchool, adminPassword: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Active Plan</label>
              <select
                className="input-field"
                value={newSchool.planName}
                onChange={e => setNewSchool({ ...newSchool, planName: e.target.value })}
              >
                <option value="Demo Plan">Demo Plan</option>
                <option value="Monthly Plan">Monthly Plan (₹4,999)</option>
                <option value="Yearly Plan">Yearly Plan (₹49,999)</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full py-2.5">Provision Portal</button>
        </form>
      </Modal>

      {/* Cancel Confirm Modal */}
      <Modal isOpen={!!confirmCancelSchool} onClose={() => setConfirmCancelSchool(null)} title="Cancel Subscription">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Are you sure you want to cancel the subscription plan for <span className="font-bold text-slate-800">{confirmCancelSchool?.name}</span>? This will lock portal write capabilities.</p>
          <div className="flex justify-end gap-3">
            <button className="btn-secondary py-2" onClick={() => setConfirmCancelSchool(null)}>Discard</button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold" onClick={executeCancelSubscription}>Confirm Cancel</button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!confirmDeleteSchool} onClose={() => setConfirmDeleteSchool(null)} title="Delete School">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">This action is <span className="font-bold text-red-600">irreversible</span>. Deleting <span className="font-bold text-slate-800">{confirmDeleteSchool?.name}</span> will erase all student data, staff logins, attendance logs, and financial records.</p>
          <div className="flex justify-end gap-3">
            <button className="btn-secondary py-2" onClick={() => setConfirmDeleteSchool(null)}>Discard</button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold" onClick={executeDeleteSchool}>Complete Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
