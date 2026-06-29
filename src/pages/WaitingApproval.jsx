import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/common/Icon';
import { motion } from 'framer-motion';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

export default function WaitingApproval() {
  const { user, school, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in or role is not admin, redirect
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    // Direct listener to check if school is approved
    if (user.schoolId) {
      const unsub = onSnapshot(doc(db, 'schools', user.schoolId), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.status === 'Active') {
            toast.success('Your school has been approved! Launching portal...', { id: 'approved-toast' });
            navigate('/admin/dashboard');
          }
        }
      });
      return () => unsub();
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-amber-500/20 selection:text-amber-500">
      {/* Background Orbits */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[500px] h-[500px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 border border-stone-800/60 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-16 border border-stone-800/40 border-dashed rounded-full"
        />
        <div className="absolute inset-32 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg card p-8 sm:p-12 text-center bg-stone-900/40 border border-stone-800/80 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Glowing top line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600" />

        <div className="flex flex-col items-center mb-8">
          <div className="relative flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 border-2 border-amber-500/10 border-t-amber-500 rounded-full"
            />
            <div className="absolute w-12 h-12 flex items-center justify-center bg-amber-500/10 border border-amber-500/25 rounded-2xl p-2 shadow-lg">
              <img src="/logo.png" alt="Zuna Logo" className="w-full h-full object-contain" />
            </div>
          </div>

          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Awaiting Superadmin Approval
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-tight leading-tight">
          School Registration Submitted
        </h2>

        <div className="bg-stone-950/40 rounded-2xl p-4 border border-stone-800/50 mb-6 text-left space-y-2 shadow-inner">
          <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">Institution Details</p>
          <p className="text-sm font-semibold text-white">
            Name: <span className="text-amber-500">{school?.name || 'Loading...'}</span>
          </p>
          <p className="text-sm font-semibold text-white">
            Workspace Slug: <span className="text-stone-400 font-mono">/{school?.slug || 'loading'}</span>
          </p>
          <p className="text-sm font-semibold text-white">
            Plan Selected: <span className="text-stone-400">{school?.planName || 'Demo Plan'}</span>
          </p>
        </div>

        <p className="text-stone-400 text-sm leading-relaxed mb-8">
          We are currently verifying and provisioning your institution's hosting workspace. Once approved, this screen will instantly refresh and take you to your dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => toast.loading('Re-checking portal verification...')}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-2xl font-bold shadow-[0_4px_20px_-4px_rgba(245,158,11,0.25)] hover:shadow-[0_6px_24px_-4px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-0.5 active:scale-95 text-xs flex items-center justify-center gap-2"
          >
            Check Verification Status
          </button>
          <button
            onClick={handleSignOut}
            className="w-full sm:w-auto bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-white py-3 px-6 rounded-2xl font-bold shadow-sm transition-all transform hover:-translate-y-0.5 active:scale-95 text-xs flex items-center justify-center gap-2"
          >
            Sign Out & Return Home
          </button>
        </div>
      </div>
    </div>
  );
}
