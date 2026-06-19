import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import { useAuth } from '../../context/AuthContext';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import toast from 'react-hot-toast';

export default function Profile() {
  const { role, user, school } = useAuth();
  const userEmail = user?.email || 'user@edutrack.pro';
  const userName = user?.name || `${role} User`;
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [cpLoading, setCpLoading] = useState(false);
  
  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Load initial data from localStorage or use defaults
  const [profileData, setProfileData] = useState(() => {
    const savedData = localStorage.getItem(`profileData_${userEmail}`);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      name: userName,
      phone: '+91 98765 43210',
      email: userEmail,
      dateJoined: currentMonthYear
    };
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      ...profileData,
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
    };
    setProfileData(updatedData);
    localStorage.setItem(`profileData_${userEmail}`, JSON.stringify(updatedData));
    localStorage.setItem('edutrack_name', updatedData.name);
    localStorage.setItem('edutrack_email', updatedData.email);
    setIsEditing(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const currentPassword = e.target.currentPassword.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setCpLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('No user logged in.');
      
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      
      toast.success('Password updated successfully');
      setIsChangingPassword(false);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        toast.error('Incorrect current password.');
      } else {
        toast.error(err.message || 'Failed to update password');
      }
    } finally {
      setCpLoading(false);
    }
  };

  const copyRegistrationLink = () => {
    if (!school?.slug) {
      toast.error('School URL configuration not found');
      return;
    }
    const url = `${window.location.origin}/${school.slug}/register`;
    navigator.clipboard.writeText(url);
    toast.success('Registration link copied to clipboard!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">My Profile</h1>
        <p className="page-subtitle">View and manage your personal information.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 md:col-span-1 flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container text-4xl font-bold mb-4">
            <Icon name="person" size={64} />
          </div>
          <h2 className="text-title-lg text-on-surface font-semibold capitalize">{profileData.name}</h2>
          <p className="text-body-md text-on-surface-variant capitalize">{role} {school?.name ? `• ${school.name}` : ''}</p>
          <div className="w-full mt-6 space-y-3">
            <button 
              onClick={() => { setIsEditing(true); setIsChangingPassword(false); }}
              className="btn-primary w-full justify-center"
            >
              Edit Profile
            </button>
            <button 
              onClick={() => { setIsChangingPassword(true); setIsEditing(false); }}
              className="btn-secondary w-full justify-center text-error hover:bg-error/10 hover:text-error border-error/30"
            >
              Change Password
            </button>
          </div>
        </div>

        <div className="card p-6 md:col-span-2">
          {isEditing ? (
            <div className="animate-fade-in">
              <h3 className="text-title-md text-on-surface mb-6 border-b border-outline-variant/20 pb-4 flex items-center gap-2">
                <Icon name="edit" size={20} className="text-primary" /> Edit Profile
              </h3>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body-md text-on-surface font-medium mb-1">Full Name</label>
                    <input type="text" name="name" className="input-field" defaultValue={profileData.name} required />
                  </div>
                  <div>
                    <label className="block text-body-md text-on-surface font-medium mb-1">Phone Number</label>
                    <input type="text" name="phone" className="input-field" defaultValue={profileData.phone} required />
                  </div>
                </div>
                <div>
                  <label className="block text-body-md text-on-surface font-medium mb-1">Email Address</label>
                  <input type="email" name="email" className="input-field" defaultValue={profileData.email} required />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          ) : isChangingPassword ? (
            <div className="animate-fade-in">
              <h3 className="text-title-md text-on-surface mb-6 border-b border-outline-variant/20 pb-4 flex items-center gap-2">
                <Icon name="lock" size={20} className="text-error" /> Change Password
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-body-md text-on-surface font-medium mb-1">Current Password</label>
                  <input type="password" name="currentPassword" className="input-field" required />
                </div>
                <div>
                  <label className="block text-body-md text-on-surface font-medium mb-1">New Password</label>
                  <input type="password" name="newPassword" className="input-field" required />
                </div>
                <div>
                  <label className="block text-body-md text-on-surface font-medium mb-1">Confirm New Password</label>
                  <input type="password" name="confirmPassword" className="input-field" required />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" className="btn-secondary" onClick={() => setIsChangingPassword(false)}>Cancel</button>
                  <button type="submit" className="btn-primary min-w-[150px] justify-center" disabled={cpLoading}>
                    {cpLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="animate-fade-in space-y-8">
              <div>
                <h3 className="text-title-md text-on-surface mb-6 border-b border-outline-variant/20 pb-4">Personal Details</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-label-sm text-on-surface-variant block mb-1">Full Name</label>
                    <p className="text-body-lg text-on-surface font-medium capitalize">{profileData.name}</p>
                  </div>
                  <div>
                    <label className="text-label-sm text-on-surface-variant block mb-1">Email Address</label>
                    <p className="text-body-lg text-on-surface font-medium">{profileData.email}</p>
                  </div>
                  <div>
                    <label className="text-label-sm text-on-surface-variant block mb-1">Phone Number</label>
                    <p className="text-body-lg text-on-surface font-medium">{profileData.phone}</p>
                  </div>
                  <div>
                    <label className="text-label-sm text-on-surface-variant block mb-1">Date Joined</label>
                    <p className="text-body-lg text-on-surface font-medium">{profileData.dateJoined}</p>
                  </div>
                </div>
              </div>

              {role === 'admin' && school?.slug && (
                <div>
                  <h3 className="text-title-md text-on-surface mb-4 border-b border-outline-variant/20 pb-4 flex items-center gap-2">
                    <Icon name="share" size={20} className="text-primary" /> Shareable Registration Link
                  </h3>
                  <p className="text-body-md text-on-surface-variant mb-4">
                    Share this unique URL with your teachers and students so they can register directly into your school's workspace.
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 text-body-md text-on-surface font-mono truncate select-all">
                      {window.location.origin}/{school.slug}/register
                    </div>
                    <button 
                      onClick={copyRegistrationLink}
                      className="btn-primary shrink-0 flex items-center gap-2 py-3"
                    >
                      <Icon name="content_copy" size={18} />
                      Copy Link
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
