import React, { useState, useEffect } from 'react';
import { collection, getDocs, setDoc, doc, serverTimestamp, query, orderBy, limit, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/common/Icon';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

export default function Schools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { registerUser } = useAuth();

  const [newSchool, setNewSchool] = useState({
    name: '',
    adminEmail: '',
    adminPassword: Math.random().toString(36).slice(-8), // generate random password
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

  const handleCancelSubscription = async (school) => {
    if (window.confirm(`Are you sure you want to cancel the subscription for ${school.name}?`)) {
      try {
        await updateDoc(doc(db, 'schools', school.id), { status: 'Cancelled' });
        toast.success('Subscription cancelled successfully.');
        fetchSchools();
      } catch (err) {
        console.error('Error cancelling subscription:', err);
        toast.error('Failed to cancel subscription.');
      }
    }
  };

  const handleDeleteSchool = async (school) => {
    if (window.confirm(`Are you sure you want to completely delete ${school.name}? This action cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, 'schools', school.id));
        if (school.adminUid) {
          await deleteDoc(doc(db, 'users', school.adminUid));
        }
        toast.success('School and associated admin data deleted.');
        fetchSchools();
      } catch (err) {
        console.error('Error deleting school:', err);
        toast.error('Failed to delete school.');
      }
    }
  };

  const handleCreateSchool = async (e) => {
    e.preventDefault();
    try {
      // 1. Generate unique sequential school ID
      let nextIdNumber = 1;
      try {
        const q = query(collection(db, 'schools'), orderBy('__name__', 'desc'), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const lastId = snap.docs[0].id; // e.g. ZUNA0001
          if (lastId.startsWith('ZUNA')) {
            const numPart = parseInt(lastId.replace('ZUNA', ''), 10);
            if (!isNaN(numPart)) {
              nextIdNumber = numPart + 1;
            }
          }
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
        status: 'Active'
      });

      toast.success('School Provisioned Successfully!');
      setIsAddOpen(false);
      fetchSchools();
      setNewSchool({
        name: '',
        adminEmail: '',
        adminPassword: Math.random().toString(36).slice(-8),
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
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>School Name</th>
                <th>School ID</th>
                <th>URL Slug</th>
                <th>Admin Email</th>
                <th>Status</th>
                <th>Joined On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schools.map(school => (
                <tr key={school.id}>
                  <td className="font-semibold text-gray-800">{school.name}</td>
                  <td className="text-gray-500 text-sm font-mono">{school.id}</td>
                  <td className="text-primary-600 text-sm">{school.slug}</td>
                  <td>{school.adminEmail}</td>
                  <td>
                    <span className={`chip ${school.status === 'Active' ? 'chip-success' : 'chip-warning'}`}>
                      {school.status || 'Active'}
                    </span>
                  </td>
                  <td>
                    {school.createdAt?.toDate ? school.createdAt.toDate().toLocaleDateString() : 'New'}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {school.status !== 'Cancelled' && (
                        <button onClick={() => handleCancelSubscription(school)} className="btn-secondary py-1 px-2 text-xs text-amber-700 hover:bg-amber-50" title="Cancel Subscription">
                          Cancel Plan
                        </button>
                      )}
                      <button onClick={() => handleDeleteSchool(school)} className="btn-secondary py-1 px-2 text-xs text-red-700 hover:bg-red-50" title="Delete School">
                        <Icon name="delete" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
}
