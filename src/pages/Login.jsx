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
      const redirectMap = { 
        superadmin: '/superadmin/dashboard', 
        admin: '/admin/dashboard', 
        teacher: '/teacher/dashboard', 
        student: '/student/dashboard' 
      };
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
    } catch (err) {
      setSubmitError(err.message || 'An error occurred. Please try again.');
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
          alt="Branding Education" 
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay" 
        />
        <div className="relative z-20 text-center px-12 flex flex-col items-center max-w-lg">
          <motion.div 
            animate={{ y: [-8, 8, -8] }} 
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
            className="w-20 h-20 flex items-center justify-center shrink-0 mb-8 bg-amber-500/10 border border-amber-500/25 rounded-3xl p-4 shadow-[0_0_50px_-12px_rgba(245,158,11,0.3)]"
          >
            <img src={tenantSchool?.schoolLogo || "/logo.png"} alt="Logo" className="w-full h-full object-contain filter drop-shadow-md" />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            {tenantSchool ? `Welcome to ${tenantSchool.name}` : 'Welcome to Zuna'}
          </h1>
          <p className="text-stone-400 text-sm leading-relaxed">
            {tenantSchool?.details || 'The next generation school management platform designed for modern educational excellence.'}
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-10">
          {tenantError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-semibold text-center">
              {tenantError}
            </div>
          )}

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Sign In</h2>
            <p className="text-sm text-stone-400 font-medium">Please enter your credentials to login.</p>
          </div>

          {successMessage && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <Icon name="check_circle" size={16} className="text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {submitError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-semibold">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <Icon name="mail" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="email"
                  required
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Please enter a valid email address' },
                  })}
                  placeholder="Enter email ID"
                  className="w-full px-4 py-3.5 pl-12 rounded-2xl border border-stone-800 bg-stone-900/30 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 text-sm transition-all shadow-inner"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Icon name="lock" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  placeholder="Enter password"
                  className="w-full px-4 py-3.5 pl-12 pr-12 rounded-2xl border border-stone-800 bg-stone-900/30 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 text-sm transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
                >
                  <Icon name={showPassword ? 'visibility_off' : 'visibility'} size={18} />
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-stone-800 text-amber-500 bg-stone-900/50 accent-amber-500 focus:ring-0" />
                <span className="text-xs text-stone-400 font-medium">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-xs text-amber-500 font-bold hover:text-amber-400 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3.5 px-6 rounded-2xl font-bold shadow-[0_4px_20px_-4px_rgba(245,158,11,0.25)] hover:shadow-[0_6px_24px_-4px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-0.5 active:scale-95 text-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-stone-500 font-medium">
            Don't have an account?{' '}
            <Link 
              to={schoolSlug ? `/${schoolSlug}/register` : "/register-school"} 
              className="text-amber-500 font-bold hover:text-amber-400 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
