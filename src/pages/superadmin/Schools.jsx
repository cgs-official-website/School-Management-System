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

  const executeCancelSubscription = async () => {
    if (!confirmCancelSchool) return;
    const targetSchool = confirmCancelSchool;
    
    // Optimistic UI update instantly
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
    
    // Optimistic UI update instantly
    setConfirmDeleteSchool(null);
    setSchools(prev => prev.filter(s => s.id !== targetSchool.id));

    const deletePromise = (async () => {
      const batch = writeBatch(db);
      
      // Run queries concurrently for maximum speed
      const usersQ = query(collection(db, 'users'), where('schoolId', '==', targetSchool.id));
      const collectionsToDelete = ['attendance', 'leaves', 'homework', 'marks', 'fees'];
      
      const queries = [getDocs(usersQ)];
      for (const coll of collectionsToDelete) {
        queries.push(getDocs(query(collection(db, coll), where('schoolId', '==', targetSchool.id))));
      }

      const snapshots = await Promise.all(queries);
      
      // Add all deletions to batch
      snapshots.forEach(snap => {
        snap.forEach(d => batch.delete(d.ref));
      });
      
      // Delete admin
      if (targetSchool.adminUid) {
        batch.delete(doc(db, 'users', targetSchool.adminUid));
      }

      // Delete school record
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
      // 1. Generate unique sequential school ID safely
      let nextIdNumber = 1;
      try {
        const snap = await getDocs(collection(db, 'schools'));
        const zunaIds = snap.docs
          .map(d => d.id)
          .filter(id => id.startsWith('ZUNA'))
          .map(id => parseInt(id.replace('ZUNA', ''), 10))
          .filter(num => !isNaN(num));
        
        if (zunaIds.length > 0) {
          nextIdNumber = Math.max(...zunaIds) + 1;
        }
      } catch (e) {
        console.warn("Could not fetch latest ID, falling back to ZUNA0001", e);
      }
      const schoolId = `ZUNA${String(nextIdNumber).padStart(4, '0')}`;

      // 1.b Generate URL Slug
      const schoolSlug = newSchool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      // 2. Create the Admin user for this school
      // This will call createUserWithEmailAndPassword in Firebase
      const createdUser = await registerUser({
        email: newSchool.adminEmail,
        password: newSchool.adminPassword,
        name: `${newSchool.name} Admin`,
        roleToSet: 'admin'
      });

      // 3. We also need to add schoolId to the user's document
      // The registerUser function already created the doc, let's update it.
      await setDoc(doc(db, 'users', createdUser.uid), {
        schoolId: schoolId
      }, { merge: true });

      // 4. Create the School record in 'schools' collection
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header">Manage Schools (Vendors)</h1>
          <p className="page-subtitle">Onboard and manage schools on the platform.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsAddOpen(true)}>
          <Icon name="add" size={18} /> Provision New School
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : schools.length === 0 ? (
        <div className="card p-12 text-center text-on-surface-variant">
          <Icon name="business" size={48} className="mx-auto mb-3 text-outline-variant" />
          <p className="text-title-md">No schools onboarded yet.</p>
          <p className="text-body-md mt-1">Click "Provision New School" to add your first vendor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school, i) => (
            <div 
              key={school.id} 
              onClick={() => setViewSchool(school)}
              className="card p-5 card-hover flex flex-col h-full bg-white border border-outline-variant/50 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-container"></div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <Icon name="school" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-title-md font-bold text-gray-900 truncate" title={school.name}>{school.name}</h3>
                  <p className="text-label-sm font-mono text-gray-500 mt-0.5">{school.id}</p>
                </div>
              </div>
              
              <div className="space-y-2.5 flex-1 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2.5 text-body-sm text-gray-600">
                  <Icon name="mail" size={16} className="text-gray-400 shrink-0" />
                  <span className="truncate" title={school.adminEmail}>{school.adminEmail}</span>
                </div>
                <div className="flex items-center gap-2.5 text-body-sm text-gray-600 group">
                  <Icon name="link" size={16} className="text-gray-400 shrink-0" />
                  <span className="truncate text-primary">{window.location.origin}/{school.slug}</span>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      navigator.clipboard.writeText(`${window.location.origin}/${school.slug}`); 
                      toast.success('URL copied!'); 
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded text-gray-500 transition-opacity ml-auto shrink-0"
                    title="Copy URL"
                  >
                    <Icon name="content_copy" size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-2.5 text-body-sm text-gray-600">
                  <Icon name="event" size={16} className="text-gray-400 shrink-0" />
                  <span>{school.createdAt?.toDate ? school.createdAt.toDate().toLocaleDateString() : 'New'}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md border border-blue-100">
                    {school.planName || 'Demo Plan'}
                  </span>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${school.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                    {school.status || 'Active'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between gap-2 mt-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setConfirmCancelSchool(school); }} 
                    disabled={school.status === 'Cancelled'}
                    className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md border transition-colors ${school.status === 'Cancelled' ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                  >
                    Cancel Plan
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setConfirmDeleteSchool(school); }} 
                    className="p-1.5 text-red-600 bg-white hover:bg-red-50 rounded-md border border-red-200 transition-colors shrink-0"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
            <input
              required
              type="text"
              className="input-field"
              value={newSchool.name}
              onChange={e => setNewSchool({ ...newSchool, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
            <input
              required
              type="email"
              className="input-field"
              value={newSchool.adminEmail}
              onChange={e => setNewSchool({ ...newSchool, adminEmail: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Active Plan</label>
            <select
              className="input-field"
              value={newSchool.planName}
              onChange={e => setNewSchool({ ...newSchool, planName: e.target.value })}
            >
              <option value="Demo Plan">Demo Plan</option>
              <option value="Basic Plan">Basic Plan</option>
              <option value="Standard Plan">Standard Plan</option>
              <option value="Premium Plan">Premium Plan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Generated Admin Password</label>
            <input
              required
              type="text"
              className="input-field bg-gray-50"
              value={newSchool.adminPassword}
              onChange={e => setNewSchool({ ...newSchool, adminPassword: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">Provide these credentials to the school principal so they can log in.</p>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button type="button" className="btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Create & Provision</button>
          </div>
        </form>
      </Modal>

      {/* View School Modal */}
      <Modal isOpen={!!viewSchool} onClose={() => setViewSchool(null)} title="Vendor Profile">
        {viewSchool && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                <Icon name="business" size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 truncate">{viewSchool.name}</h3>
                <p className="text-gray-500 font-mono text-sm mt-0.5">{viewSchool.id}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-semibold rounded-md border ${viewSchool.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                {viewSchool.status || 'Active'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Admin Email</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-gray-800 truncate">{viewSchool.adminEmail}</p>
                  <button 
                    onClick={() => { navigator.clipboard.writeText(viewSchool.adminEmail); toast.success('Email copied!'); }}
                    className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                    title="Copy Email"
                  >
                    <Icon name="content_copy" size={16} />
                  </button>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Portal URL</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-primary truncate">{window.location.origin}/{viewSchool.slug}</p>
                  <button 
                    onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/${viewSchool.slug}`); toast.success('URL copied!'); }}
                    className="p-1.5 hover:bg-primary/10 rounded text-primary/70 hover:text-primary transition-colors shrink-0"
                    title="Copy URL"
                  >
                    <Icon name="content_copy" size={16} />
                  </button>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Active Plan</p>
                <p className="font-semibold text-gray-800">{viewSchool.planName || 'Demo Plan'}</p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Provisioned On</p>
                <p className="font-medium text-gray-800">
                  {viewSchool.createdAt?.toDate ? viewSchool.createdAt.toDate().toLocaleDateString() : 'New'}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button type="button" className="btn-secondary" onClick={() => setViewSchool(null)}>Close</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal isOpen={!!confirmDeleteSchool} onClose={() => setConfirmDeleteSchool(null)} title="Delete School">
        <div className="p-2 space-y-4">
          <div className="flex items-center gap-3 text-error">
            <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center shrink-0">
              <Icon name="warning" size={24} />
            </div>
            <h3 className="text-title-md font-semibold">Critical Warning</h3>
          </div>
          <p className="text-body-md text-on-surface-variant">
            Are you sure you want to completely delete <strong>{confirmDeleteSchool?.name}</strong>?
          </p>
          <p className="text-body-sm text-error bg-error/5 p-3 rounded-lg border border-error/20">
            This action cannot be undone and will delete ALL associated users (students, teachers, admins), attendance records, homework, leaves, marks, and fees.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <button className="btn-secondary" onClick={() => setConfirmDeleteSchool(null)}>Cancel</button>
            <button className="btn-primary bg-error hover:bg-error/90 border-error" onClick={executeDeleteSchool}>
              Yes, Delete Completely
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm Cancel Subscription Modal */}
      <Modal isOpen={!!confirmCancelSchool} onClose={() => setConfirmCancelSchool(null)} title="Cancel Subscription">
        <div className="p-2 space-y-4">
          <div className="flex items-center gap-3 text-amber-600">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
              <Icon name="cancel" size={24} />
            </div>
            <h3 className="text-title-md font-semibold">Cancel Plan</h3>
          </div>
          <p className="text-body-md text-on-surface-variant">
            Are you sure you want to cancel the subscription for <strong>{confirmCancelSchool?.name}</strong>?
          </p>
          <p className="text-body-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
            This will freeze the school's account and prevent any further access until the subscription is renewed.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <button className="btn-secondary" onClick={() => setConfirmCancelSchool(null)}>Keep Subscription</button>
            <button className="btn-primary bg-amber-600 hover:bg-amber-700 border-amber-600" onClick={executeCancelSubscription}>
              Cancel Subscription
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
