import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Mess() {
  const { role } = useAuth();
  const [menu, setMenu] = useState([
    { id: 1, day: 'Monday', breakfast: 'Idli, Sambar, Chutney', lunch: 'Steamed Rice, Rasam, Veg Kootu', snacks: 'Tea, Banana Baji', dinner: 'Chappathi, Dal Fry' },
    { id: 2, day: 'Tuesday', breakfast: 'Poori Masala, Coffee', lunch: 'Veg Pulav, Onion Raitha, Potato Fry', snacks: 'Milk, Samosa', dinner: 'Idiyappam, Veg Kurma' },
    { id: 3, day: 'Wednesday', breakfast: 'Pongal, Medu Vada, Sambar', lunch: 'Steamed Rice, Kara Kuzhambu, Appalam', snacks: 'Tea, Sundal', dinner: 'Dosa, Tomato Chutney' },
    { id: 4, day: 'Thursday', breakfast: 'Kichadi, Coconut Chutney', lunch: 'Lemon Rice, Curd Rice, Pickle', snacks: 'Milk, Biscuits', dinner: 'Parotta, Veg Salna' },
    { id: 5, day: 'Friday', breakfast: 'Rava Upma, Chutney', lunch: 'Steamed Rice, Drumstick Sambar, Poriyal', snacks: 'Tea, Medu Pakoda', dinner: 'Idli, Sambar' }
  ]);

  const [activeTab, setActiveTab] = useState('menu');

  const [feedback, setFeedback] = useState([
    { id: 1, name: 'Rahul Sharma', class: 'Class 10-A', rating: 4, comment: 'Lunch Veg Pulav was excellent. Samosa snacks could be improved.', date: '2026-06-29' },
    { id: 2, name: 'Aadhya Nair', class: 'Class 10-A', rating: 5, comment: 'Dosa and Chutney dinner is very nice.', date: '2026-06-28' }
  ]);

  const [newFeedback, setNewFeedback] = useState({ rating: 5, comment: '' });

  const handleUpdateMenu = (row) => {
    toast.success(`Opening menu editor for ${row.day}`);
  };

  const handleAddFeedback = (e) => {
    e.preventDefault();
    if (!newFeedback.comment.trim()) {
      toast.error('Feedback comment is required');
      return;
    }
    const record = {
      id: feedback.length + 1,
      name: 'Rahul Sharma',
      class: 'Class 10-A',
      rating: newFeedback.rating,
      comment: newFeedback.comment,
      date: new Date().toISOString().split('T')[0]
    };
    setFeedback([record, ...feedback]);
    setNewFeedback({ rating: 5, comment: '' });
    toast.success('Mess feedback submitted successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">School Mess & Catering</h1>
        <p className="page-subtitle">Track mess weekly menu cards, student dining registries, and meal feedback.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Meals Served Daily" value="350 meals" icon="restaurant" color="primary" />
        <StatCard title="Menu Coverage" value="5 Days Active" icon="calendar_today" color="secondary" />
        <StatCard title="Catering Rating" value="4.5 / 5.0" icon="star" color="tertiary" />
      </div>

      <div className="border-b border-slate-200/50 flex gap-2">
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-4 py-2.5 rounded-t-xl font-semibold flex items-center gap-2 ${
            activeTab === 'menu' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
          }`}
        >
          <Icon name="restaurant_menu" size={18} /> Daily Weekly Menu
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2.5 rounded-t-xl font-semibold flex items-center gap-2 ${
            activeTab === 'feedback' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
          }`}
        >
          <Icon name="star" size={18} /> Dining Feedback
        </button>
      </div>

      {activeTab === 'menu' && (
        <div className="card p-6 bg-white/70">
          <DataTable
            columns={[
              { key: 'day', label: 'Day Schedule' },
              { key: 'breakfast', label: 'Breakfast (08:00 AM)' },
              { key: 'lunch', label: 'Lunch (12:30 PM)' },
              { key: 'snacks', label: 'Snacks (04:15 PM)' },
              { key: 'dinner', label: 'Dinner (07:30 PM)' },
              ...(role === 'admin' ? [{
                key: 'actions',
                label: 'Action',
                render: (_, row) => (
                  <button onClick={() => handleUpdateMenu(row)} className="text-amber-500 hover:underline font-bold text-xs">
                    Edit Menu
                  </button>
                )
              }] : [])
            ]}
            data={menu}
          />
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {role === 'student' && (
            <div className="card p-6 bg-white/80 h-fit">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
                <Icon name="edit" size={20} className="text-amber-500" /> Share Feedback
              </h2>
              <form onSubmit={handleAddFeedback} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">RATING (1-5)</label>
                  <select
                    value={newFeedback.rating}
                    onChange={(e) => setNewFeedback({ ...newFeedback, rating: parseInt(e.target.value, 10) })}
                    className="input-field"
                  >
                    <option value={5}>5 Stars (Excellent)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Average)</option>
                    <option value={2}>2 Stars (Poor)</option>
                    <option value={1}>1 Star (Unsatisfactory)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">COMMENTS</label>
                  <textarea
                    value={newFeedback.comment}
                    onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                    className="input-field h-24"
                    placeholder="Tell us about food quality, hygiene..."
                  />
                </div>
                <button type="submit" className="btn-primary w-full">Submit Review</button>
              </form>
            </div>
          )}

          <div className={`${role === 'student' ? 'lg:col-span-2' : 'lg:col-span-3'} card p-6 bg-white/70`}>
            <h2 className="text-lg font-bold mb-4 text-slate-800">Reviews & Submissions Registry</h2>
            <DataTable
              columns={[
                { key: 'name', label: 'Reviewer' },
                { key: 'class', label: 'Class' },
                { key: 'rating', label: 'Rating', render: (v) => '⭐'.repeat(v) },
                { key: 'comment', label: 'Comments' },
                { key: 'date', label: 'Date Logged' }
              ]}
              data={feedback}
            />
          </div>
        </div>
      )}
    </div>
  );
}
