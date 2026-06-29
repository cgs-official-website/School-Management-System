import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Library() {
  const { role } = useAuth();
  const [books, setBooks] = useState([
    { id: 1, isbn: '978-3-16-148410-0', title: 'A Brief History of Time', author: 'Stephen Hawking', subject: 'Physics', qty: 5, rackNo: 'A-4' },
    { id: 2, isbn: '978-0-14-044913-6', title: 'The Republic', author: 'Plato', subject: 'Philosophy', qty: 2, rackNo: 'C-2' },
    { id: 3, isbn: '978-0-7432-7356-5', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', subject: 'English Lit', qty: 8, rackNo: 'B-1' },
    { id: 4, isbn: '978-0-262-03384-8', title: 'Introduction to Algorithms', author: 'Cormen et al.', subject: 'Computer Sci', qty: 3, rackNo: 'D-5' }
  ]);

  const [issuedBooks, setIssuedBooks] = useState([
    { id: 1, bookTitle: 'A Brief History of Time', borrowerName: 'Rahul Sharma', borrowerRole: 'Student', issueDate: '2026-06-15', dueDate: '2026-06-30', status: 'Issued' },
    { id: 2, bookTitle: 'The Republic', borrowerName: 'Rajinikanth', borrowerRole: 'Teacher', issueDate: '2026-06-10', dueDate: '2026-06-25', status: 'Overdue' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [newIssue, setNewIssue] = useState({ bookTitle: 'A Brief History of Time', borrowerName: '', days: 14 });

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIssueBook = (e) => {
    e.preventDefault();
    if (!newIssue.borrowerName) {
      toast.error('Please enter Borrower Name');
      return;
    }
    const issue = {
      id: issuedBooks.length + 1,
      bookTitle: newIssue.bookTitle,
      borrowerName: newIssue.borrowerName,
      borrowerRole: 'Student',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + newIssue.days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Issued'
    };
    setIssuedBooks([issue, ...issuedBooks]);
    setNewIssue({ bookTitle: 'A Brief History of Time', borrowerName: '', days: 14 });
    toast.success('Book issued successfully!');
  };

  const handleReturnBook = (id) => {
    setIssuedBooks(issuedBooks.map(b => b.id === id ? { ...b, status: 'Returned' } : b));
    toast.success('Book marked as returned!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">School Library Center</h1>
        <p className="page-subtitle">Search global book index, manage borrower check-outs, returns, and track fine dues.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total Library Books" value="1,840" icon="local_library" color="primary" />
        <StatCard title="Active Issued Books" value={issuedBooks.filter(b => b.status === 'Issued' || b.status === 'Overdue').length.toString()} icon="book" color="secondary" />
        <StatCard title="Overdue Books" value={issuedBooks.filter(b => b.status === 'Overdue').length.toString()} icon="event_busy" color="error" />
      </div>

      {/* Book Search Directory */}
      <div className="card p-6 bg-white/70 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-800">Global Book Directory</h2>
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
              placeholder="Search by Title, Author, Subject..."
            />
            <Icon name="search" size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
          </div>
        </div>

        <DataTable
          columns={[
            { key: 'isbn', label: 'ISBN Code' },
            { key: 'title', label: 'Book Title' },
            { key: 'author', label: 'Author' },
            { key: 'subject', label: 'Subject / Genre' },
            { key: 'qty', label: 'Total Copies' },
            { key: 'rackNo', label: 'Rack Location' }
          ]}
          data={filteredBooks}
        />
      </div>

      {role !== 'student' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {role === 'admin' && (
            <div className="card p-6 bg-white/80 h-fit">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
                <Icon name="assignment_ind" size={20} className="text-amber-500" /> Issue Book
              </h2>
              <form onSubmit={handleIssueBook} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">SELECT BOOK</label>
                  <select
                    value={newIssue.bookTitle}
                    onChange={(e) => setNewIssue({ ...newIssue, bookTitle: e.target.value })}
                    className="input-field"
                  >
                    {books.map(b => (
                      <option key={b.id} value={b.title}>{b.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">BORROWER NAME</label>
                  <input
                    type="text"
                    value={newIssue.borrowerName}
                    onChange={(e) => setNewIssue({ ...newIssue, borrowerName: e.target.value })}
                    className="input-field"
                    placeholder="Student or Staff name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">BORROW PERIOD (DAYS)</label>
                  <select
                    value={newIssue.days}
                    onChange={(e) => setNewIssue({ ...newIssue, days: parseInt(e.target.value, 10) })}
                    className="input-field"
                  >
                    <option value={7}>7 Days</option>
                    <option value={14}>14 Days</option>
                    <option value={30}>30 Days</option>
                  </select>
                </div>
                <button type="submit" className="btn-primary w-full">Complete Check-out</button>
              </form>
            </div>
          )}

          <div className={`${role === 'admin' ? 'lg:col-span-2' : 'lg:col-span-3'} card p-6 bg-white/70`}>
            <h2 className="text-lg font-bold mb-4 text-slate-800">Borrower Logs</h2>
            <DataTable
              columns={[
                { key: 'bookTitle', label: 'Book Title' },
                { key: 'borrowerName', label: 'Borrower' },
                { key: 'borrowerRole', label: 'Role' },
                { key: 'issueDate', label: 'Issue Date' },
                { key: 'dueDate', label: 'Due Date' },
                { 
                  key: 'status', 
                  label: 'Status',
                  render: (v) => (
                    <span className={`chip ${v === 'Returned' ? 'chip-success' : v === 'Overdue' ? 'chip-danger' : 'chip-warning'}`}>
                      {v}
                    </span>
                  )
                },
                ...(role === 'admin' ? [{
                  key: 'actions',
                  label: 'Actions',
                  render: (_, row) => row.status !== 'Returned' && (
                    <button 
                      onClick={() => handleReturnBook(row.id)} 
                      className="px-2 py-1 text-xs bg-amber-500 text-white rounded font-bold"
                    >
                      Return
                    </button>
                  )
                }] : [])
              ]}
              data={issuedBooks}
            />
          </div>
        </div>
      ) : (
        <div className="card p-6 bg-white/70">
          <h2 className="text-xl font-bold mb-4 text-slate-800">My Issued Books History</h2>
          <DataTable
            columns={[
              { key: 'bookTitle', label: 'Book Title' },
              { key: 'issueDate', label: 'Issue Date' },
              { key: 'dueDate', label: 'Due Date' },
              { 
                key: 'status', 
                label: 'Status',
                render: (v) => (
                  <span className={`chip ${v === 'Returned' ? 'chip-success' : v === 'Overdue' ? 'chip-danger' : 'chip-warning'}`}>
                    {v}
                  </span>
                )
              }
            ]}
            data={issuedBooks.filter(b => b.borrowerName === 'Rahul Sharma')}
          />
        </div>
      )}
    </div>
  );
}
