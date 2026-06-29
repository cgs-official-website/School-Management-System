import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function DownloadCenter() {
  const { role } = useAuth();
  const [downloads, setDownloads] = useState([
    { id: 1, title: 'Term 1 Mathematics Syllabus', type: 'Syllabus', className: 'Class 10-A', date: '2026-06-28', filename: 'Maths_Syllabus_T1.pdf', size: '1.2 MB' },
    { id: 2, title: 'Physics Chapter 3 Homework Assignment', type: 'Assignment', className: 'Class 10-A', date: '2026-06-29', filename: 'Physics_Ch3_Assig.pdf', size: '850 KB' },
    { id: 3, title: 'Chemistry Lab Safety Guideline Manual', type: 'Study Material', className: 'All Grades', date: '2026-06-15', filename: 'Chemistry_Lab_Safety.pdf', size: '3.4 MB' },
    { id: 4, title: 'Term 1 Detailed Examination Timetable', type: 'Other Download', className: 'All Grades', date: '2026-06-27', filename: 'Exam_Datesheet_Term1.pdf', size: '540 KB' }
  ]);

  const [newDownload, setNewDownload] = useState({ title: '', type: 'Syllabus', className: 'Class 10-A', filename: '' });

  const handleUpload = (e) => {
    e.preventDefault();
    if (!newDownload.title || !newDownload.filename) {
      toast.error('Title and Filename cannot be empty');
      return;
    }
    const record = {
      id: downloads.length + 1,
      title: newDownload.title,
      type: newDownload.type,
      className: newDownload.className,
      date: new Date().toISOString().split('T')[0],
      filename: newDownload.filename.replace(/^.*[\\\/]/, ''), // strip path if any
      size: '1.5 MB'
    };
    setDownloads([record, ...downloads]);
    setNewDownload({ title: '', type: 'Syllabus', className: 'Class 10-A', filename: '' });
    toast.success('Document uploaded and published to Download Center!');
  };

  const handleDownloadFile = (row) => {
    toast.success(`Downloading file: ${row.filename} (${row.size})`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Download Center</h1>
        <p className="page-subtitle">Access student syllabus documents, school worksheets, study materials, and examination schedules.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total Syllabus Docs" value={downloads.filter(d => d.type === 'Syllabus').length.toString()} icon="menu_book" color="primary" />
        <StatCard title="Active Assignments" value={downloads.filter(d => d.type === 'Assignment').length.toString()} icon="assignment" color="secondary" />
        <StatCard title="Study Material Guides" value={downloads.filter(d => d.type === 'Study Material').length.toString()} icon="import_contacts" color="tertiary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {role !== 'student' && (
          <div className="card p-6 bg-white/80 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
              <Icon name="upload" size={20} className="text-amber-500" /> Publish Material
            </h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">DOCUMENT TITLE</label>
                <input
                  type="text"
                  value={newDownload.title}
                  onChange={(e) => setNewDownload({ ...newDownload, title: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Maths Chapter 2 Assignment"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">TYPE</label>
                  <select
                    value={newDownload.type}
                    onChange={(e) => setNewDownload({ ...newDownload, type: e.target.value })}
                    className="input-field"
                  >
                    <option value="Syllabus">Syllabus</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Study Material">Study Material</option>
                    <option value="Other Download">Other Download</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">CLASS ASSIGNED</label>
                  <select
                    value={newDownload.className}
                    onChange={(e) => setNewDownload({ ...newDownload, className: e.target.value })}
                    className="input-field"
                  >
                    <option value="Class 10-A">Class 10-A</option>
                    <option value="Class 10-B">Class 10-B</option>
                    <option value="Class 8-A">Class 8-A</option>
                    <option value="Class 8-B">Class 8-B</option>
                    <option value="All Grades">All Grades</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">FILE NAME / PATH</label>
                <input
                  type="text"
                  value={newDownload.filename}
                  onChange={(e) => setNewDownload({ ...newDownload, filename: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Maths_Ch2.pdf"
                />
              </div>
              <button type="submit" className="btn-primary w-full">Upload Document</button>
            </form>
          </div>
        )}

        <div className={`${role !== 'student' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <DataTable
            columns={[
              { key: 'title', label: 'Document Title' },
              { 
                key: 'type', 
                label: 'Type',
                render: (v) => (
                  <span className={`chip ${v === 'Syllabus' ? 'chip-info' : v === 'Assignment' ? 'chip-warning' : 'chip-success'}`}>
                    {v}
                  </span>
                )
              },
              { key: 'className', label: 'Target Class' },
              { key: 'date', label: 'Upload Date' },
              { key: 'size', label: 'File Size' },
              {
                key: 'actions',
                label: 'Download',
                render: (_, row) => (
                  <button onClick={() => handleDownloadFile(row)} className="btn-secondary py-1 px-3 text-xs flex items-center gap-1">
                    <Icon name="download" size={14} /> Save File
                  </button>
                )
              }
            ]}
            data={downloads}
          />
        </div>
      </div>
    </div>
  );
}
