import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/common/Icon';
import { motion } from 'framer-motion';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, role: userRole, completeOnboarding } = useAuth();
  const [role, setRole] = useState('student');
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    // If they aren't authenticated or don't need onboarding, redirect them
    if (!user) {
      navigate('/login');
    } else if (userRole && userRole !== 'onboarding') {
      navigate('/dashboard');
    }
  }, [user, userRole, navigate]);

  const onSubmit = async (formData) => {
    setSubmitError('');
    try {
      await completeOnboarding(formData.schoolId, role, role === 'teacher' ? formData.employeeId : null);
      navigate('/dashboard');
    } catch (err) {
      setSubmitError(err.message || 'Failed to complete profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-stone-950 font-sans selection:bg-amber-500/20 selection:text-amber-500">
      {/* Left Side - Premium Branding */}
      <div className="hidden lg:flex w-1/2 bg-stone-900 relative items-center justify-center overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-stone-950 via-stone-900/80 to-stone-950/40 z-10" />
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070" 
          alt="Education Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay" 
        />
        <div className="relative z-20 text-center px-12 flex flex-col items-center max-w-lg">
          <motion.div 
            animate={{ y: [-10, 10, -10] }} 
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
            className="w-20 h-20 flex items-center justify-center shrink-0 mb-8 bg-amber-500/10 border border-amber-500/25 rounded-3xl p-4 shadow-[0_0_50px_-12px_rgba(245,158,11,0.3)]"
          >
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain filter drop-shadow-md" />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
            Complete Your Profile
          </h1>
          <p className="text-stone-400 text-sm leading-relaxed">
            Just a few more details before we can get you into your school's dashboard.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-10">
          
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome, {user?.displayName || 'User'}!</h2>
            <p className="text-sm text-stone-400 font-medium">
              We need a bit more info to connect you to your school.
            </p>
          </div>

          {submitError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-semibold">
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 p-1 bg-stone-900/50 border border-stone-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                role === 'student' ? 'bg-amber-500 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                role === 'teacher' ? 'bg-amber-500 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Teacher
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
                School ID
              </label>
              <div className="relative">
                <Icon name="business" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  {...register('schoolId', {
                    required: 'School ID is required to join a school',
                  })}
                  placeholder="e.g. ZUNA0001"
                  className={`w-full px-4 py-3.5 pl-12 rounded-2xl border ${errors.schoolId ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : 'border-stone-800 focus:border-amber-500 focus:ring-amber-500/15'} bg-stone-900/30 text-white placeholder-stone-600 focus:outline-none focus:ring-4 text-sm transition-all shadow-inner`}
                />
              </div>
              {errors.schoolId && (
                <p className="text-red-400 text-xs mt-1">{errors.schoolId.message}</p>
              )}
              <p className="text-[10px] text-stone-500 font-semibold mt-1.5">Ask your school administrator for your School ID.</p>
            </div>

            {role === 'teacher' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
                  Employee ID
                </label>
                <div className="relative">
                  <Icon name="badge" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="text"
                    {...register('employeeId', {
                      required: 'Employee ID is required for teachers',
                    })}
                    placeholder="e.g. EMP-12345"
                    className={`w-full px-4 py-3.5 pl-12 rounded-2xl border ${errors.employeeId ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : 'border-stone-800 focus:border-amber-500 focus:ring-amber-500/15'} bg-stone-900/30 text-white placeholder-stone-600 focus:outline-none focus:ring-4 text-sm transition-all shadow-inner`}
                  />
                </div>
                {errors.employeeId && (
                  <p className="text-red-400 text-xs mt-1">{errors.employeeId.message}</p>
                )}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3.5 px-6 rounded-2xl font-bold shadow-[0_4px_20px_-4px_rgba(245,158,11,0.25)] hover:shadow-[0_6px_24px_-4px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-0.5 active:scale-95 text-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Completing Profile...' : 'Complete Profile'}
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
}
