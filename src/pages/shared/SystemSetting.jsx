import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function SystemSetting() {
  const { role } = useAuth();
  
  const [activeSession, setActiveSession] = useState('2026-27');
  const [smsGateway, setSmsGateway] = useState('Twilio Gateway');
  const [emailProvider, setEmailProvider] = useState('Google Workspace SMTP');
  const [notificationConfig, setNotificationConfig] = useState({
    parentSms: true,
    studentEmail: true,
    teacherLeaves: true,
    dailyBackup: false
  });

  if (role !== 'admin' && role !== 'superadmin') {
    return (
      <div className="card p-8 bg-rose-50/50 border-rose-100 flex flex-col items-center justify-center text-center animate-fade-in">
        <Icon name="error" size={48} className="text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Access Restricted</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md">
          System settings and global configurations console are restricted to portal administrators.
        </p>
      </div>
    );
  }

  const handleSaveSettings = (e) => {
    e.preventDefault();
    toast.success('System global settings updated successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">System Settings</h1>
        <p className="page-subtitle">Configure current academic session dates, SMS API credentials, SMTP details, and automated database backups.</p>
      </div>

      <div className="card p-6 bg-white/70">
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Icon name="business" className="text-amber-500" /> Academic & Sessions Configuration
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">ACTIVE ACADEMIC SESSION</label>
                  <select
                    value={activeSession}
                    onChange={(e) => setActiveSession(e.target.value)}
                    className="input-field"
                  >
                    <option value="2026-27">Academic Session 2026-27 (Current)</option>
                    <option value="2025-26">Academic Session 2025-26 (Archive)</option>
                    <option value="2027-28">Academic Session 2027-28 (Upcoming Planning)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">SCHOOL ADMISSIONS STATUS</label>
                  <span className="chip chip-success font-bold mt-1">Open & Receiving Applications</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Icon name="settings_applications" className="text-amber-500" /> API Gateway Credentials
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">SMS GATEWAY MAPPING</label>
                  <select
                    value={smsGateway}
                    onChange={(e) => setSmsGateway(e.target.value)}
                    className="input-field"
                  >
                    <option value="Twilio Gateway">Twilio Inc Gateway (USA)</option>
                    <option value="Msg91 Gateway">Msg91 Enterprise Gateway (India)</option>
                    <option value="Dummy Console">Disabled (Log to System Console)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">EMAIL DELIVERY SMTP</label>
                  <select
                    value={emailProvider}
                    onChange={(e) => setEmailProvider(e.target.value)}
                    className="input-field"
                  >
                    <option value="Google Workspace SMTP">Google Workspace SMTP Relay</option>
                    <option value="SendGrid SMTP">SendGrid Email Delivery API</option>
                    <option value="AWS SES">Amazon Simple Email Service (SES)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/50 pt-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icon name="notifications" className="text-amber-500" /> Automated Trigger Notifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center gap-3 p-4 bg-white/50 border border-slate-200/50 rounded-xl cursor-pointer hover:shadow-sm">
                <input
                  type="checkbox"
                  checked={notificationConfig.parentSms}
                  onChange={(e) => setNotificationConfig({ ...notificationConfig, parentSms: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 accent-amber-500"
                />
                <span className="text-xs font-semibold text-slate-700">SMS Alerts to Parents</span>
              </label>

              <label className="flex items-center gap-3 p-4 bg-white/50 border border-slate-200/50 rounded-xl cursor-pointer hover:shadow-sm">
                <input
                  type="checkbox"
                  checked={notificationConfig.studentEmail}
                  onChange={(e) => setNotificationConfig({ ...notificationConfig, studentEmail: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 accent-amber-500"
                />
                <span className="text-xs font-semibold text-slate-700">Email Alerts to Students</span>
              </label>

              <label className="flex items-center gap-3 p-4 bg-white/50 border border-slate-200/50 rounded-xl cursor-pointer hover:shadow-sm">
                <input
                  type="checkbox"
                  checked={notificationConfig.teacherLeaves}
                  onChange={(e) => setNotificationConfig({ ...notificationConfig, teacherLeaves: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 accent-amber-500"
                />
                <span className="text-xs font-semibold text-slate-700">Staff Leave Notifications</span>
              </label>

              <label className="flex items-center gap-3 p-4 bg-white/50 border border-slate-200/50 rounded-xl cursor-pointer hover:shadow-sm">
                <input
                  type="checkbox"
                  checked={notificationConfig.dailyBackup}
                  onChange={(e) => setNotificationConfig({ ...notificationConfig, dailyBackup: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 accent-amber-500"
                />
                <span className="text-xs font-semibold text-slate-700">Automated Daily Database Backups</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="btn-primary w-full sm:w-48">Save System Config</button>
          </div>
        </form>
      </div>
    </div>
  );
}
