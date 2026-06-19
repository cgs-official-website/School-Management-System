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
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex w-1/2 bg-primary relative items-center justify-center overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-primary-900/40 z-10" />
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070" 
          alt="Education Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" 
        />
        <div className="relative z-20 text-center px-12 flex flex-col items-center">
          <motion.div 
            animate={{ y: [-10, 10, -10] }} 
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
            className="w-32 h-32 flex items-center justify-center shrink-0 mb-8"
          >
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-2xl" />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            Complete Your Profile
          </h1>
          <p className="text-primary-100 text-lg max-w-md leading-relaxed">
            Just a few more details before we can get you into your school's dashboard.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto flex justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in py-12 my-auto">
          
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-sm" />
            </div>
            <h1 className="text-headline-md text-on-surface font-bold truncate">Zuna</h1>
          </div>
          
          <h2 className="text-title-lg text-on-surface mb-2">Welcome, {user?.displayName || 'User'}!</h2>
          <p className="text-body-md text-on-surface-variant mb-6">
            We need a bit more info to connect you to your school.
          </p>

          {submitError && (
            <div className="bg-error/10 text-error p-3 rounded-lg mb-6 text-sm">
              {submitError}
            </div>
          )}

          <div className="flex p-1 bg-surface-variant rounded-lg mb-6">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === 'student' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === 'teacher' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Teacher
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mb-6">
            <div>
              <label className="block text-body-md text-on-surface font-medium mb-2">
                School ID
              </label>
              <div className="relative">
                <Icon name="business" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  {...register('schoolId', {
                    required: 'School ID is required to join a school',
                  })}
                  placeholder="e.g. ZUNA0001"
                  className={`input-field pl-12 ${errors.schoolId ? 'border-error' : ''}`}
                />
              </div>
              {errors.schoolId && (
                <p className="text-error text-sm mt-1">{errors.schoolId.message}</p>
              )}
              <p className="text-xs text-on-surface-variant mt-1">Ask your school administrator for your School ID.</p>
            </div>

            {role === 'teacher' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label className="block text-body-md text-on-surface font-medium mb-2">
                  Employee ID
                </label>
                <div className="relative">
                  <Icon name="badge" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    type="text"
                    {...register('employeeId', {
                      required: 'Employee ID is required for teachers',
                    })}
                    placeholder="e.g. EMP-12345"
                    className={`input-field pl-12 ${errors.employeeId ? 'border-error' : ''}`}
                  />
                </div>
                {errors.employeeId && (
                  <p className="text-error text-sm mt-1">{errors.employeeId.message}</p>
                )}
              </motion.div>
            )}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3 text-body-lg">
              {isSubmitting ? 'Completing Profile...' : 'Complete Profile'}
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
}
