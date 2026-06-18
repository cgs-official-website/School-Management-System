import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/common/Icon';
import { motion } from 'framer-motion';

export default function Login() {
  const { schoolSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, role } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const [tenantSchool, setTenantSchool] = useState(null);
  const [tenantLoading, setTenantLoading] = useState(!!schoolSlug);
  const [tenantError, setTenantError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const redirectMap = { superadmin: '/superadmin/dashboard', admin: '/admin/dashboard', teacher: '/teacher/dashboard', student: '/student/dashboard' };
      navigate(redirectMap[role] || '/login', { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

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
      await login(formData);
      // Redirection is handled automatically by the useEffect watching user state
    } catch (err) {
      setSubmitError(err.message || 'An error occurred. Please try again.');
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
            {tenantSchool ? `Welcome to ${tenantSchool.name}` : 'Welcome to Zuna'}
          </h1>
          <p className="text-primary-100 text-lg max-w-md leading-relaxed">
            {tenantSchool?.details || 'The next generation school management platform designed for modern educational excellence.'}
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

          <h2 className="text-headline-lg text-on-surface mb-2">Welcome back</h2>
          <p className="text-body-lg text-on-surface-variant mb-8">
            Please enter your details to sign in.
          </p>

          {successMessage && (
            <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
              <Icon name="check_circle" size={20} className="text-emerald-700" />
              <span>{successMessage}</span>
            </div>
          )}

          {submitError && (
            <div className="bg-error/10 text-error p-3 rounded-lg mb-6 text-sm">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                  })}
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-outline-variant text-primary-container focus:ring-primary-container/20" />
                <span className="text-body-md text-on-surface-variant">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-body-md text-primary-container hover:text-primary transition-colors font-medium">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3 text-body-lg">
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-body-md text-on-surface-variant mt-6">
            Don't have an account?{' '}
            <Link to={schoolSlug ? `/${schoolSlug}/register` : "/register"} className="text-primary-container hover:text-primary font-medium transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
