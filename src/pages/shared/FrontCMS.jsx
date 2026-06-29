import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function FrontCMS() {
  const { role } = useAuth();
  const [pages, setPages] = useState([
    { id: 1, title: 'Home Landing Page', slug: '/home', type: 'Static Page', lastUpdated: '2026-06-25', status: 'Published' },
    { id: 2, title: 'About Sagar International', slug: '/about-us', type: 'Static Page', lastUpdated: '2026-06-20', status: 'Published' },
    { id: 3, title: 'Annual Admissions Open 2026-27', slug: '/admissions', type: 'Event Page', lastUpdated: '2026-06-29', status: 'Published' },
    { id: 4, title: 'Careers - Work With Us', slug: '/careers', type: 'Form Page', lastUpdated: '2026-06-10', status: 'Draft' }
  ]);

  const [banners, setBanners] = useState([
    { id: 1, imageTitle: 'Welcome Sagar International School Campus Banner', linkUrl: '#', activeStatus: 'Active' },
    { id: 2, imageTitle: 'Independence Day Event Banner', linkUrl: '#', activeStatus: 'Active' }
  ]);

  const [activeTab, setActiveTab] = useState('pages');
  const [newPage, setNewPage] = useState({ title: '', slug: '', type: 'Static Page' });

  if (role !== 'admin' && role !== 'superadmin') {
    return (
      <div className="card p-8 bg-rose-50/50 border-rose-100 flex flex-col items-center justify-center text-center animate-fade-in">
        <Icon name="error" size={48} className="text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Access Restricted</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md">
          Website Front CMS dashboard tools are reserved for school administrators and webmaster configurations.
        </p>
      </div>
    );
  }

  const handleCreatePage = (e) => {
    e.preventDefault();
    if (!newPage.title || !newPage.slug) {
      toast.error('Page Title and URL Slug are required');
      return;
    }
    const record = {
      id: pages.length + 1,
      title: newPage.title,
      slug: newPage.slug.startsWith('/') ? newPage.slug : `/${newPage.slug}`,
      type: newPage.type,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'Draft'
    };
    setPages([...pages, record]);
    setNewPage({ title: '', slug: '', type: 'Static Page' });
    toast.success('Page draft created in Front CMS!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Front CMS Website Configurator</h1>
        <p className="page-subtitle">Configure school landing website pages, news feeds, media banners, and event calendars.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="CMS Site Pages" value={pages.length.toString()} icon="web" color="primary" />
        <StatCard title="Active Media Banners" value={banners.length.toString()} icon="image" color="secondary" />
        <StatCard title="Total Visitors / Month" value="4,240 clicks" icon="trending_up" color="tertiary" />
      </div>

      <div className="border-b border-slate-200/50 flex gap-2">
        <button
          onClick={() => setActiveTab('pages')}
          className={`px-4 py-2.5 rounded-t-xl font-semibold flex items-center gap-2 ${
            activeTab === 'pages' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
          }`}
        >
          <Icon name="web" size={18} /> Manage Pages
        </button>
        <button
          onClick={() => setActiveTab('banners')}
          className={`px-4 py-2.5 rounded-t-xl font-semibold flex items-center gap-2 ${
            activeTab === 'banners' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
          }`}
        >
          <Icon name="image" size={18} /> Media Banners
        </button>
      </div>

      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-6 bg-white/80 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
              <Icon name="add" size={20} className="text-amber-500" /> Create Draft Page
            </h2>
            <form onSubmit={handleCreatePage} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">PAGE TITLE</label>
                <input
                  type="text"
                  value={newPage.title}
                  onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Terms of Service"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">URL SLUG</label>
                <input
                  type="text"
                  value={newPage.slug}
                  onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                  className="input-field"
                  placeholder="e.g. /terms"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">PAGE TEMPLATE</label>
                <select
                  value={newPage.type}
                  onChange={(e) => setNewPage({ ...newPage, type: e.target.value })}
                  className="input-field"
                >
                  <option value="Static Page">Static Page</option>
                  <option value="Form Page">Interactive Form Page</option>
                  <option value="Event Page">Event Page</option>
                </select>
              </div>
              <button type="submit" className="btn-primary w-full">Save Draft</button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <DataTable
              columns={[
                { key: 'title', label: 'Page Title' },
                { key: 'slug', label: 'Slug Path' },
                { key: 'type', label: 'Template Type' },
                { key: 'lastUpdated', label: 'Last Modified' },
                { 
                  key: 'status', 
                  label: 'Status',
                  render: (v) => (
                    <span className={`chip ${v === 'Published' ? 'chip-success' : 'chip-warning'}`}>
                      {v}
                    </span>
                  )
                },
                {
                  key: 'actions',
                  label: 'Publish',
                  render: (_, row) => row.status === 'Draft' && (
                    <button 
                      onClick={() => toast.success(`Page ${row.title} published to live school website!`)} 
                      className="px-2 py-1 text-xs bg-emerald-500 text-white rounded font-bold hover:bg-emerald-600"
                    >
                      Publish
                    </button>
                  )
                }
              ]}
              data={pages}
            />
          </div>
        </div>
      )}

      {activeTab === 'banners' && (
        <div className="card p-6 bg-white/70 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-slate-800">Live Website Image Sliders</h2>
            <button onClick={() => toast.success('Upload interface ready')} className="btn-primary">
              Upload Slide Image
            </button>
          </div>
          <DataTable
            columns={[
              { key: 'imageTitle', label: 'Slide Description' },
              { key: 'linkUrl', label: 'Click URL Redirect' },
              { 
                key: 'activeStatus', 
                label: 'Status',
                render: (v) => (
                  <span className="chip chip-success">{v}</span>
                )
              }
            ]}
            data={banners}
          />
        </div>
      )}
    </div>
  );
}
