import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/common/Icon';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

export default function Students() {
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  
  // Modal & Form States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', password: '' });
  const [addError, setAddError] = useState('');
  const [showAddPassword, setShowAddPassword] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '', grade: '10-A', status: 'Active', gpa: '0.0', phone: '', address: '' });
  const [editError, setEditError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // New states for onboarding options
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isShareLinkOpen, setIsShareLinkOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');

  const validateLoginEmail = (email) => email.trim().toLowerCase().endsWith('@gmail.com');
  const emailError = 'Please enter a proper professional mail id ending with @gmail.com';

  const { school, registerUser } = useAuth();

  function fetchStudents() {
    if (!school?.id) return;
    setLoading(true);
    const q = query(collection(db, 'users'), where('role', '==', 'student'), where('schoolId', '==', school.id));
    getDocs(q)
      .then(snap => {
        setStudentList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching students:', err);
        setLoading(false);
      });
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchStudents();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setAddError('');

    if (!validateLoginEmail(newStudent.email)) {
      setAddError(emailError);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(newStudent.password)) {
      setAddError('Password must be at least 6 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
      return;
    }

    try {
      await registerUser({
        email: newStudent.email,
        password: newStudent.password,
        name: newStudent.name,
        roleToSet: 'student',
        schoolId: school.id
      });
      fetchStudents();
      setIsAddOpen(false);
      setNewStudent({ name: '', email: '', password: '' });
    } catch (err) {
      console.error('Error adding student:', err);
      setAddError(err.message || 'Error adding student');
    }
  };

  const handleImportCSV = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      setImportError('Please select a CSV file to upload.');
      return;
    }
    setImporting(true);
    setImportError('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const rows = text.split('\n').map(row => row.trim()).filter(row => row);
        
        if (rows.length <= 1) {
          throw new Error('CSV file appears to be empty or missing data rows.');
        }

        const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
        
        // expected headers: name, email, password
        const nameIdx = headers.indexOf('name');
        const emailIdx = headers.indexOf('email');
        const passIdx = headers.indexOf('password');

        if (nameIdx === -1 || emailIdx === -1 || passIdx === -1) {
          throw new Error('CSV must contain "name", "email", and "password" columns.');
        }

        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i].split(',').map(c => c.trim());
          const sName = cols[nameIdx];
          const sEmail = cols[emailIdx];
          const sPass = cols[passIdx];

          if (sName && sEmail && sPass) {
            await registerUser({
              email: sEmail,
              password: sPass,
              name: sName,
              roleToSet: 'student',
              schoolId: school.id
            });
          }
        }
        
        fetchStudents();
        setIsImportOpen(false);
        setCsvFile(null);
        toast.success('CSV Import Successful!');
      } catch (err) {
        console.error('CSV Import Error:', err);
        setImportError(err.message || 'Failed to import CSV data.');
      } finally {
        setImporting(false);
      }
    };
    reader.onerror = () => {
      setImportError('Failed to read file.');
      setImporting(false);
    };
    reader.readAsText(csvFile);
  };

  const handleStartEdit = (student) => {
    setEditingStudent(student);
    setEditForm({
      name: student.name,
      email: student.email,
      password: '', // blank by default, only updated if entered
      grade: student.grade || '',
      status: student.status || 'Active',
      gpa: student.gpa || '0.0',
      phone: student.phone || '',
      address: student.address || ''
    });
    setEditError('');
    setShowPassword(false);
    setIsEditOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setEditError('');

    const bodyData = { ...editForm };
    if (!validateLoginEmail(bodyData.email)) {
      setEditError(emailError);
      return;
    }

    if (!bodyData.password) {
      delete bodyData.password;
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
      if (!passwordRegex.test(bodyData.password)) {
        setEditError('Password must be at least 6 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
        return;
      }
    }

    delete bodyData.password; // Do not update password here, only superadmin or user themselves.
    
    updateDoc(doc(db, 'users', editingStudent.id), bodyData)
      .then(() => {
        fetchStudents();
        setIsEditOpen(false);
        setEditingStudent(null);
      })
      .catch(err => {
        console.error('Error updating student:', err);
        setEditError(err.message || 'Error updating student');
      });
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingStudent(null);
    setEditError('');
    setShowPassword(false);
    setIsDeleting(false);
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm('Are you sure you want to delete this student record? This will also delete their login account.')) {
      setEditError('');
      setIsDeleting(true);
      deleteDoc(doc(db, 'users', id))
        .then(() => {
          setStudentList(currentStudents => currentStudents.filter(s => s.id !== id));
          closeEditModal();
        })
        .catch(err => {
          console.error('Error deleting student:', err);
          setEditError(err.message || 'Error deleting student');
        })
        .finally(() => setIsDeleting(false));
    }
  };

  const filtered = studentList.filter(s => {
    const statusMatch = filterStatus === 'All Status' || s.status === filterStatus;
    const searchMatch =
      (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.rollNo || '').toLowerCase().includes(search.toLowerCase());

    return statusMatch && searchMatch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header">Class Roster</h1>
          <p className="page-subtitle">Manage enrolled students.</p>
        </div>
        <div className="relative">
          <button className="btn-primary" onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}>
            <Icon name="add" size={18} />Add Students
            <Icon name={isAddMenuOpen ? "expand_less" : "expand_more"} size={18} />
          </button>
          
          {isAddMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-card border border-outline-variant/20 z-50 overflow-hidden animate-fade-in">
              <button 
                onClick={() => { setIsAddOpen(true); setIsAddMenuOpen(false); }}
                className="w-full px-4 py-3 text-left hover:bg-surface-container-low transition-colors border-b border-outline-variant/10 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Icon name="person_add" size={18} /></div>
                <div>
                  <div className="text-body-md font-semibold text-gray-800">Add Manually</div>
                  <div className="text-label-sm text-gray-500">Fill a form to add one</div>
                </div>
              </button>
              <button 
                onClick={() => { setIsShareLinkOpen(true); setIsAddMenuOpen(false); }}
                className="w-full px-4 py-3 text-left hover:bg-surface-container-low transition-colors border-b border-outline-variant/10 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Icon name="link" size={18} /></div>
                <div>
                  <div className="text-body-md font-semibold text-gray-800">Share Reg Link</div>
                  <div className="text-label-sm text-gray-500">Students self-register</div>
                </div>
              </button>
              <button 
                onClick={() => { setIsImportOpen(true); setIsAddMenuOpen(false); }}
                className="w-full px-4 py-3 text-left hover:bg-surface-container-low transition-colors flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Icon name="upload_file" size={18} /></div>
                <div>
                  <div className="text-body-md font-semibold text-gray-800">Import CSV</div>
                  <div className="text-label-sm text-gray-500">Bulk upload students</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Select Controls & Filters */}
      <div className="card p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Filter Status</label>
            <select
              className="input-field"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Search Student</label>
            <div className="relative">
              <Icon name="search" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search by name, roll no, email..."
                className="input-field pl-10"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Class List Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12 text-on-surface-variant">
          <p>Loading roster...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center text-on-surface-variant">
          <Icon name="school" size={48} className="mx-auto mb-3 text-outline-variant" />
          <p className="text-title-md">No students found matching filters.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>GPA</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td className="font-semibold text-gray-600">{s.rollNo}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-container/15 flex items-center justify-center">
                        <span className="text-label-md text-primary-container font-semibold">{s.avatar}</span>
                      </div>
                      <span className="font-semibold text-gray-800">{s.name}</span>
                    </div>
                  </td>
                  <td>{s.email}</td>
                  <td>{s.phone || 'N/A'}</td>
                  <td>
                    <span className="font-medium text-gray-800">{s.gpa}</span>
                  </td>
                  <td>
                    <span className={`chip ${s.status === 'Active' ? 'chip-success' : 'chip-danger'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-ghost text-label-md py-1 text-primary-container" onClick={() => handleStartEdit(s)}>
                        <Icon name="edit" size={16} />Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Student Modal */}
      <Modal isOpen={isAddOpen} onClose={() => { setIsAddOpen(false); setAddError(''); setShowAddPassword(false); }} title="Add New Student">
        <form onSubmit={handleAddStudent} className="space-y-4">
          {addError && (
            <div className="bg-error/10 text-error p-3 rounded-lg text-sm font-medium">
              {addError}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input required type="text" className="input-field" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input required type="email" className="input-field" value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                required
                type={showAddPassword ? 'text' : 'password'}
                placeholder="Enter password"
                className="input-field pr-10"
                value={newStudent.password}
                onChange={e => setNewStudent({...newStudent, password: e.target.value})}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 flex items-center justify-center"
                onClick={() => setShowAddPassword(!showAddPassword)}
              >
                <Icon name={showAddPassword ? 'visibility_off' : 'visibility'} size={18} />
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" className="btn-secondary" onClick={() => { setIsAddOpen(false); setAddError(''); setShowAddPassword(false); }}>Cancel</button>
            <button type="submit" className="btn-primary">Add Student</button>
          </div>
        </form>
      </Modal>

      {/* Share Registration Link Modal */}
      <Modal isOpen={isShareLinkOpen} onClose={() => setIsShareLinkOpen(false)} title="Share Registration Link">
        <div className="space-y-4">
          <p className="text-body-md text-gray-600">
            Share this unique link with students. When they use this link to register, they will be automatically added to your school's roster.
          </p>
          <div className="p-3 bg-surface-container rounded-lg border border-outline-variant/20 flex items-center gap-3">
            <input 
              type="text" 
              readOnly 
              value={`${window.location.origin}/${school?.slug}/register`} 
              className="bg-transparent border-none outline-none flex-1 text-gray-800 font-medium"
            />
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/${school?.slug}/register`);
                toast.success('Copied to clipboard!');
              }}
              className="btn-secondary py-1 px-3 text-sm"
            >
              Copy
            </button>
          </div>
          <div className="flex justify-end pt-4">
            <button type="button" className="btn-secondary" onClick={() => setIsShareLinkOpen(false)}>Close</button>
          </div>
        </div>
      </Modal>

      {/* Import CSV Modal */}
      <Modal isOpen={isImportOpen} onClose={() => { setIsImportOpen(false); setImportError(''); setCsvFile(null); }} title="Import Students from CSV">
        <form onSubmit={handleImportCSV} className="space-y-4">
          <div className="bg-primary-container/10 p-4 rounded-xl border border-primary-container/20">
            <h4 className="text-title-sm font-semibold text-primary mb-2">CSV Format Requirements</h4>
            <p className="text-body-sm text-gray-600 mb-2">Your CSV file must include a header row with exact column names:</p>
            <code className="text-xs bg-white px-2 py-1 rounded border border-gray-200">name, email, password</code>
          </div>
          
          {importError && (
            <div className="bg-error/10 text-error p-3 rounded-lg text-sm font-medium">
              {importError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload CSV File</label>
            <input 
              required 
              type="file" 
              accept=".csv"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-container/10 file:text-primary hover:file:bg-primary-container/20 cursor-pointer border border-gray-200 rounded-lg p-1"
              onChange={e => setCsvFile(e.target.files[0])}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" className="btn-secondary" onClick={() => { setIsImportOpen(false); setImportError(''); setCsvFile(null); }} disabled={importing}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={importing}>
              {importing ? 'Importing...' : 'Upload & Import'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal isOpen={isEditOpen} onClose={closeEditModal} title="Edit Student Details">
        {editingStudent && (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            {editError && (
              <div className="bg-error/10 text-error p-3 rounded-lg text-sm font-medium">
                {editError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input required type="text" className="input-field" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input required type="email" className="input-field" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Leave blank to keep current password"
                  className="input-field pr-10"
                  value={editForm.password}
                  onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 flex items-center justify-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Icon name={showPassword ? 'visibility_off' : 'visibility'} size={18} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class/Grade</label>
                <input type="text" disabled className="input-field bg-gray-50 text-gray-500 cursor-not-allowed" value={editForm.grade || ''} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                <input type="text" className="input-field" value={editForm.gpa} onChange={e => setEditForm({...editForm, gpa: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="input-field" value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" className="input-field" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea className="input-field" rows={2} value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                type="button"
                className="btn-ghost text-red-600 hover:bg-red-50 mr-auto"
                onClick={() => handleDeleteStudent(editingStudent.id)}
                disabled={isDeleting}
              >
                <Icon name="delete" size={16} />{isDeleting ? 'Deleting...' : 'Delete Student'}
              </button>
              <button type="button" className="btn-secondary" onClick={closeEditModal}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={isDeleting}>Save Changes</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
