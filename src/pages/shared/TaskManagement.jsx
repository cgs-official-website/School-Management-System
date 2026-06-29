import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function TaskManagement() {
  const { role } = useAuth();
  
  // Custom default tasks based on user role
  const getTasksForRole = () => {
    if (role === 'admin') {
      return [
        { id: 1, title: 'Verify new student registrations', priority: 'High', dueDate: '2026-06-30', completed: false },
        { id: 2, title: 'Approve teacher leave applications', priority: 'Medium', dueDate: '2026-06-29', completed: true },
        { id: 3, title: 'Review outstanding term fees', priority: 'High', dueDate: '2026-07-02', completed: false }
      ];
    } else if (role === 'teacher') {
      return [
        { id: 1, title: 'Grade 10th Math homework', priority: 'High', dueDate: '2026-06-30', completed: false },
        { id: 2, title: 'Submit weekly lesson plan updates', priority: 'Medium', dueDate: '2026-06-29', completed: false },
        { id: 3, title: 'Mark student class attendance', priority: 'High', dueDate: '2026-06-29', completed: true }
      ];
    } else {
      return [
        { id: 1, title: 'Complete Physics Lab report', priority: 'High', dueDate: '2026-07-01', completed: false },
        { id: 2, title: 'Prepare for online maths quiz', priority: 'High', dueDate: '2026-06-30', completed: false },
        { id: 3, title: 'Pay Term 2 pending fees', priority: 'Medium', dueDate: '2026-07-10', completed: false }
      ];
    }
  };

  const [tasks, setTasks] = useState(getTasksForRole());
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newDueDate, setNewDueDate] = useState('');

  const handleToggleComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    toast.success('Task status updated!');
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Task title is required');
      return;
    }
    const record = {
      id: tasks.length + 1,
      title: newTitle,
      priority: newPriority,
      dueDate: newDueDate || new Date().toISOString().split('T')[0],
      completed: false
    };
    setTasks([...tasks, record]);
    setNewTitle('');
    setNewPriority('Medium');
    setNewDueDate('');
    toast.success('Task scheduled!');
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    toast.success('Task removed!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Task Management</h1>
        <p className="page-subtitle">Track your personal and professional action checklists, goals, and due schedules.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Active Goals" value={tasks.filter(t => !t.completed).length.toString()} icon="task" color="primary" />
        <StatCard title="Completed Tasks" value={tasks.filter(t => t.completed).length.toString()} icon="check_circle" color="secondary" />
        <StatCard title="Task Success Rate" value={tasks.length > 0 ? `${Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%` : '0%'} icon="trending_up" color="tertiary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 bg-white/80 h-fit">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
            <Icon name="add" size={20} className="text-amber-500" /> Create Task
          </h2>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">TASK DESCRIPTION</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="input-field"
                placeholder="e.g. Schedule parent meet"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">PRIORITY</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="input-field"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">DUE DATE</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">Schedule Task</button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="card p-6 bg-white/70">
            <h2 className="text-lg font-bold mb-4 text-slate-800">My Checklist</h2>
            <DataTable
              columns={[
                {
                  key: 'completed',
                  label: 'Done',
                  render: (v, row) => (
                    <input
                      type="checkbox"
                      checked={v}
                      onChange={() => handleToggleComplete(row.id)}
                      className="w-4 h-4 rounded border-slate-300 accent-amber-500"
                    />
                  )
                },
                {
                  key: 'title',
                  label: 'Task Details',
                  render: (v, row) => (
                    <span className={row.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                      {v}
                    </span>
                  )
                },
                {
                  key: 'priority',
                  label: 'Priority',
                  render: (v) => (
                    <span className={`chip ${v === 'High' ? 'chip-danger' : v === 'Medium' ? 'chip-warning' : 'chip-info'}`}>
                      {v}
                    </span>
                  )
                },
                { key: 'dueDate', label: 'Due Date' },
                {
                  key: 'actions',
                  label: 'Delete',
                  render: (_, row) => (
                    <button 
                      onClick={() => handleDelete(row.id)} 
                      className="p-1 text-slate-400 hover:text-red-500"
                    >
                      <Icon name="delete" size={18} />
                    </button>
                  )
                }
              ]}
              data={tasks}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
