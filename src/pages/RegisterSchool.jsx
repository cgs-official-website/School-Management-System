import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Icon from '../components/common/Icon';
import { motion } from 'framer-motion';
import { collection, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function RegisterSchool() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('Demo Plan');
  const [logoBase64, setLogoBase64] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) {
        toast.error('Image size must be less than 500KB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (formData) => {
    setSubmitError('');
    try {
      // 1. Create the user on the primary auth client first to authenticate!
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const createdUser = userCredential.user;

      // 2. Fetch/calculate the next school ID (now authenticated!)
      let nextIdNumber = 1;
      const snap = await getDocs(collection(db, 'schools'));
      const zunaIds = snap.docs
        .map(d => d.id)
        .filter(id => id.startsWith('ZUNA'))
        .map(id => parseInt(id.replace('ZUNA', ''), 10))
        .filter(num => !isNaN(num));
      
      if (zunaIds.length > 0) {
        nextIdNumber = Math.max(...zunaIds) + 1;
      }
      const schoolId = `ZUNA${String(nextIdNumber).padStart(4, '0')}`;

      // 3. Generate slug
      const schoolSlug = formData.schoolName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      // 4. Create the User metadata record
      await setDoc(doc(db, 'users', createdUser.uid), {
        uid: createdUser.uid,
        email: createdUser.email,
        name: formData.adminName,
        role: 'admin',
        schoolId: schoolId,
        createdAt: new Date().toISOString()
      });

      // 5. Create the School record with Pending status
      const fallbackLogo = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2Y1OWUwYiI+PHBhdGggZD0iTTEyIDNMMiAxMmwzIDEuNXY2aDR2LTVoNnY1aDR2LTZMMjIgMTJMMTIgM3oiLz48L3N2Zz4=';
      
      await setDoc(doc(db, 'schools', schoolId), {
        name: formData.schoolName,
        slug: schoolSlug,
        adminEmail: formData.email,
        adminPhone: formData.phone || '--',
        adminUid: createdUser.uid,
        createdAt: serverTimestamp(),
        status: 'Pending Approval',
        planName: selectedPlan,
        schoolLogo: logoBase64 || fallbackLogo,
        details: `${formData.schoolName} is registered and awaiting administration setup.`
      });

      toast.success('Registration submitted! Awaiting Superadmin Approval.');
      navigate('/waiting-approval');
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || 'Failed to register school. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-stone-950 font-sans selection:bg-amber-500/20 selection:text-amber-500">
      {/* Left side - Dynamic Visuals */}
      <div className="hidden lg:flex w-1/2 bg-stone-900 relative items-center justify-center overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-stone-950 via-stone-900/80 to-stone-950/40 z-10" />
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070" 
          alt="College Campus" 
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay" 
        />
        <div className="relative z-20 text-left px-16 max-w-xl">
          <motion.div 
            animate={{ y: [-8, 8, -8] }} 
            transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
            className="w-16 h-16 flex items-center justify-center mb-8 bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3 shadow-[0_0_50px_-12px_rgba(245,158,11,0.3)]"
          >
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain filter drop-shadow-md" />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Deploy Zuna at Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">Institution</span>
          </h1>
          <p className="text-stone-400 text-sm leading-relaxed mb-8">
            Empower your faculty, students, and parent community with the next generation school management platform. Just register and start in minutes.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-stone-300">
              <Icon name="check_circle" className="text-amber-500" size={20} />
              <span>Real-time school performance analytics</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-stone-300">
              <Icon name="check_circle" className="text-amber-500" size={20} />
              <span>Comprehensive role-based portals</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-stone-300">
              <Icon name="check_circle" className="text-amber-500" size={20} />
              <span>Automated fee invoices & notifications</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Register Your School</h2>
            <p className="text-sm text-stone-400 font-medium">Provide details to create your school database workspace.</p>
          </div>

          {submitError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-semibold">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">School / College Name</label>
              <div className="relative">
                <Icon name="business" className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={20} />
                <input
                  type="text"
                  required
                  {...register('schoolName', { required: 'School Name is required' })}
                  className="w-full px-4 py-3.5 pl-12 rounded-2xl border border-stone-800 bg-stone-900/30 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 text-sm transition-all shadow-inner"
                  placeholder="e.g. Sagar International School"
                />
              </div>
              {errors.schoolName && <p className="text-red-400 text-xs mt-1">{errors.schoolName.message}</p>}
            </div>

            {/* School Logo upload field */}
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">School Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-stone-900/50 border border-stone-800 rounded-2xl flex items-center justify-center p-2 text-stone-500 overflow-hidden shadow-inner">
                  {logoBase64 ? (
                    <img src={logoBase64} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <Icon name="add_a_photo" size={24} />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="school-logo-input"
                  />
                  <label
                    htmlFor="school-logo-input"
                    className="inline-block px-4 py-2.5 bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    Choose Image File
                  </label>
                  <p className="text-[10px] text-stone-500 mt-1">Recommended: Square format, under 500KB.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Admin Name</label>
                <div className="relative">
                  <Icon name="person" className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={20} />
                  <input
                    type="text"
                    required
                    {...register('adminName', { required: 'Admin Name is required' })}
                    className="w-full px-4 py-3.5 pl-12 rounded-2xl border border-stone-800 bg-stone-900/30 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 text-sm transition-all shadow-inner"
                    placeholder="e.g. Asfaque M"
                  />
                </div>
                {errors.adminName && <p className="text-red-400 text-xs mt-1">{errors.adminName.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Contact Phone</label>
                <div className="relative">
                  <Icon name="phone" className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={20} />
                  <input
                    type="text"
                    {...register('phone')}
                    className="w-full px-4 py-3.5 pl-12 rounded-2xl border border-stone-800 bg-stone-900/30 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 text-sm transition-all shadow-inner"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Admin Email</label>
              <div className="relative">
                <Icon name="mail" className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={20} />
                <input
                  type="email"
                  required
                  {...register('email', { required: 'Email is required' })}
                  className="w-full px-4 py-3.5 pl-12 rounded-2xl border border-stone-800 bg-stone-900/30 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 text-sm transition-all shadow-inner"
                  placeholder="admin@school.edu"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Workspace Password</label>
              <div className="relative">
                <Icon name="lock" className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                  className="w-full px-4 py-3.5 pl-12 pr-12 rounded-2xl border border-stone-800 bg-stone-900/30 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 text-sm transition-all shadow-inner"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                >
                  <Icon name={showPassword ? 'visibility_off' : 'visibility'} size={18} />
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Select Subscription Plan</label>
              <div className="grid grid-cols-3 gap-3">
                {['Demo Plan', 'Monthly Plan', 'Yearly Plan'].map(plan => (
                  <button
                    key={plan}
                    type="button"
                    onClick={() => setSelectedPlan(plan)}
                    className={`py-3 px-2 rounded-2xl border text-xs font-bold transition-all ${
                      selectedPlan === plan
                        ? 'border-amber-500 bg-amber-500/10 text-amber-400 shadow-md'
                        : 'border-stone-800 bg-stone-900/10 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    {plan}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3.5 px-6 rounded-2xl font-bold shadow-[0_4px_20px_-4px_rgba(245,158,11,0.25)] hover:shadow-[0_6px_24px_-4px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-0.5 active:scale-95 text-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Create Institution Portal</span>
                  <Icon name="chevron_right" size={16} />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-stone-500 font-medium">
              Already registered your school?{' '}
              <Link to="/login" className="text-amber-500 font-bold hover:text-amber-400 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
