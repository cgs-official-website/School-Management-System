import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../components/common/Icon';

export default function ResetPassword() {
  const { token } = useParams();
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
            <img src="/logo.png" alt="Zuna Logo" className="w-full h-full object-contain drop-shadow-2xl" />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Secure Your Account</h1>
          <p className="text-primary-100 text-lg max-w-md leading-relaxed">
            Get back to managing your educational institution with confidence.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in py-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="Zuna Logo" className="w-full h-full object-contain drop-shadow-sm" />
          </div>
          <h1 className="text-headline-md text-on-surface font-bold">Zuna</h1>
        </div>
        <h2 className="text-title-lg text-on-surface mb-2">Set New Password</h2>
        <p className="text-body-md text-on-surface-variant mb-6">Please enter your new password below.</p>
        <form className="space-y-4">
          <div>
            <label className="block text-body-md text-on-surface font-medium mb-2">New Password</label>
            <input type="password" placeholder="Enter new password" className="input-field" />
          </div>
          <div>
            <label className="block text-body-md text-on-surface font-medium mb-2">Confirm Password</label>
            <input type="password" placeholder="Confirm new password" className="input-field" />
          </div>
          <button type="submit" className="btn-primary w-full justify-center py-3">Update Password</button>
        </form>
        <Link to="/login" className="block text-center text-body-md text-primary-container hover:text-primary mt-4 font-medium">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
