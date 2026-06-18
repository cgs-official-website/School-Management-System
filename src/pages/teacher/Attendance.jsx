import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';
import Icon from '../../components/common/Icon';

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      // 1. Fetch all students
      const qStudents = query(collection(db, 'users'), where('role', '==', 'student'));
      const studentSnap = await getDocs(qStudents);
      const students = studentSnap.docs.map(d => ({
        id: d.id,
        name: d.data().name || 'Unknown',
        rollNo: d.data().studentId || d.id.substring(0, 5),
        status: 'Present' // Default status
      }));

      // 2. Fetch attendance for selected date
      const qAtt = query(collection(db, 'attendance'), where('date', '==', selectedDate));
      const attSnap = await getDocs(qAtt);
      
      if (!attSnap.empty) {
        // We have records for this date, merge them
        const savedRecords = attSnap.docs[0].data().records || [];
        const savedMap = {};
        savedRecords.forEach(r => { savedMap[r.studentId] = r.status; });
        
        students.forEach(s => {
          if (savedMap[s.id]) {
            s.status = savedMap[s.id];
          }
        });
      }

      setRecords(students);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      toast.error('Failed to fetch roster');
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setRecords(records.map(r => r.id === studentId ? { ...r, status } : r));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        date: selectedDate,
        records: records.map(r => ({
          studentId: r.id,
          name: r.name,
          status: r.status,
          time: r.status === 'Present' ? '8:00 AM' : r.status === 'Late' ? '9:15 AM' : '-'
        }))
      };

      // Query if document for this date already exists
      const qAtt = query(collection(db, 'attendance'), where('date', '==', selectedDate));
      const attSnap = await getDocs(qAtt);
      
      let docId = selectedDate; // default to date string as ID
      if (!attSnap.empty) {
        docId = attSnap.docs[0].id;
      }

      await setDoc(doc(db, 'attendance', docId), payload);
      
      setSaving(false);
      toast.success('Attendance records updated successfully!');
      fetchAttendance();
    } catch (err) {
      console.error('Error saving attendance:', err);
      setSaving(false);
      toast.error('Failed to update attendance records.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Attendance Tracking</h1>
        <p className="page-subtitle">Track daily attendance status for students by class and date.</p>
      </div>

      {/* Select Controls */}
      <div className="card p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Date</label>
            <input
              type="date"
              className="input-field"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading || saving || records.length === 0}
              className="btn-primary w-full md:w-auto"
            >
              {saving ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      {/* Toastify handles messages now, removing old message UI */}

      {/* Student List */}
      {loading ? (
        <div className="flex justify-center items-center py-12 text-on-surface-variant">
          <p>Loading class roster...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="card p-12 text-center text-on-surface-variant">
          <Icon name="group" size={48} className="mx-auto mb-3 text-outline-variant" />
          <p className="text-title-md">No students found in this class.</p>
          <p className="text-body-md mt-1">No students enrolled in your class.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id}>
                  <td className="font-semibold text-gray-600">{r.rollNo}</td>
                  <td>
                    <div className="font-medium text-gray-800">{r.name}</div>
                  </td>
                  <td>
                    <span className={`chip ${
                      r.status === 'Present' ? 'chip-success' :
                      r.status === 'Late' ? 'bg-amber-100 text-amber-800' :
                      'chip-danger'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusChange(r.id, 'Present')}
                        className={`px-3 py-1.5 rounded-lg text-label-md transition-colors ${
                          r.status === 'Present'
                            ? 'bg-green-600 text-white font-semibold'
                            : 'bg-surface-container hover:bg-green-50 text-green-700'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleStatusChange(r.id, 'Late')}
                        className={`px-3 py-1.5 rounded-lg text-label-md transition-colors ${
                          r.status === 'Late'
                            ? 'bg-amber-500 text-white font-semibold'
                            : 'bg-surface-container hover:bg-amber-50 text-amber-700'
                        }`}
                      >
                        Late
                      </button>
                      <button
                        onClick={() => handleStatusChange(r.id, 'Absent')}
                        className={`px-3 py-1.5 rounded-lg text-label-md transition-colors ${
                          r.status === 'Absent'
                            ? 'bg-red-600 text-white font-semibold'
                            : 'bg-surface-container hover:bg-red-50 text-red-700'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
