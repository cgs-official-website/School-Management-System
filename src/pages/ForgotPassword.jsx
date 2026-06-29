import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
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
            <img src="/logo.png" alt="Zuna Logo" className="w-full h-full object-contain filter drop-shadow-md" />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Recover Account</h1>
          <p className="text-stone-400 text-sm leading-relaxed">
            Get back to managing your educational institution with confidence.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Reset Password</h2>
            <p className="text-sm text-stone-400 font-medium">Enter your email address and we'll send you a link to reset your password.</p>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <Icon name="mail" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" />
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="w-full px-4 py-3.5 pl-12 rounded-2xl border border-stone-800 bg-stone-900/30 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 text-sm transition-all shadow-inner" 
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3.5 px-6 rounded-2xl font-bold shadow-[0_4px_20px_-4px_rgba(245,158,11,0.25)] hover:shadow-[0_6px_24px_-4px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-0.5 active:scale-95 text-sm flex items-center justify-center gap-2"
            >
              Send Reset Link
            </button>
          </form>
          <div className="text-center">
            <Link to="/login" className="text-xs text-amber-500 font-bold hover:text-amber-400 hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
