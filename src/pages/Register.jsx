import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/common/Icon';
import { motion } from 'framer-motion';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Register() {
  const { schoolSlug } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [role, setRole] = useState('student'); // 'student' or 'teacher'
  const { registerUser } = useAuth();

  const [tenantSchool, setTenantSchool] = useState(null);
  const [tenantLoading, setTenantLoading] = useState(!!schoolSlug);
  const [tenantError, setTenantError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (!schoolSlug) return;
    const fetchTenant = async () => {
      try {
        const q = query(collection(db, 'schools'), where('slug', '==', schoolSlug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setTenantSchool({ id: snap.docs[0].id, ...snap.docs[0].data() });
        } else {
          setTenantError('School not found. Please check the URL.');
        }
      } catch (e) {
        console.error(e);
        setTenantError('Failed to load school branding.');
      } finally {
        setTenantLoading(false);
      }
    };
    fetchTenant();
  }, [schoolSlug]);

  const onSubmit = async (formData) => {
    setSubmitError('');

    try {
      const finalSchoolId = tenantSchool ? tenantSchool.id : formData.schoolId;

      await registerUser({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        roleToSet: role,
        schoolId: finalSchoolId,
        employeeId: role === 'teacher' ? formData.employeeId : null,
      });
      navigate('/login', {
        state: { message: 'Registration successful! You can now log in.' },
      });
    } catch (err) {
      setSubmitError(err.message || 'Registration failed. Please try again.');
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
            <img src={tenantSchool?.schoolLogo || "/logo.png"} alt="Logo" className="w-full h-full object-contain drop-shadow-2xl" />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            {tenantSchool ? `Join ${tenantSchool.name}` : 'Join Zuna'}
          </h1>
          <p className="text-primary-100 text-lg max-w-md leading-relaxed">
            {tenantSchool?.details || 'Create an account and start managing your educational institution with confidence.'}
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in py-12">
          {tenantError && (
            <div className="bg-error/10 text-error p-3 rounded-lg mb-6 text-sm text-center">
              {tenantError}
            </div>
          )}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <img src={tenantSchool?.schoolLogo || "/logo.png"} alt="Logo" className="w-full h-full object-contain drop-shadow-sm" />
            </div>
            <h1 className="text-headline-md text-on-surface font-bold truncate">
              {tenantSchool ? tenantSchool.name : 'Zuna'}
            </h1>
          </div>
        <h2 className="text-title-lg text-on-surface mb-2">Registration</h2>
        <p className="text-body-md text-on-surface-variant mb-6">Create an account to join the platform.</p>

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
              Full Name
            </label>
            <div className="relative">
              <Icon name="person" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
                placeholder="John Doe"
                className={`input-field pl-12 ${errors.name ? 'border-error' : ''}`}
              />
            </div>
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-body-md text-on-surface font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Icon name="mail" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Please enter a valid email address' },
                })}
                placeholder="Enter email id"
                className={`input-field pl-12 ${errors.email ? 'border-error' : ''}`}
              />
            </div>
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {!tenantSchool && (
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
          )}

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

          <div>
            <label className="block text-body-md text-on-surface font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <Icon name="settings" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
                    message: 'Must include uppercase, lowercase, number, and special character',
                  },
                })}
                placeholder="Create a password"
                className={`input-field pl-12 pr-12 ${errors.password ? 'border-error' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <Icon name={showPassword ? 'visibility_off' : 'visibility'} size={20} />
              </button>
            </div>
            {errors.password && (
              <p className="text-error text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3 text-body-lg">
            {isSubmitting ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

          <p className="text-center text-body-md text-on-surface-variant mt-6">
            Already have an account?{' '}
            <Link to={schoolSlug ? `/${schoolSlug}/login` : "/login"} className="text-primary-container hover:text-primary font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
