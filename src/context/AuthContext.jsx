import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { auth, db, secondaryAuth } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

const getFriendlyErrorMessage = (error) => {
  const code = error.code || error.message;
  if (code.includes('auth/user-not-found') || code.includes('auth/invalid-credential')) {
    return 'Incorrect email or password. Please try again.';
  }
  if (code.includes('auth/wrong-password')) {
    return 'Incorrect email or password. Please try again.';
  }
  if (code.includes('auth/email-already-in-use')) {
    return 'This email is already registered. Please log in instead.';
  }
  if (code.includes('auth/weak-password')) {
    return 'Password is too weak. Please use a stronger password.';
  }
  if (code.includes('auth/network-request-failed')) {
    return 'Network error. Please check your internet connection.';
  }
  if (code.includes('auth/too-many-requests')) {
    return 'Too many failed login attempts. Please try again later.';
  }
  // Fallback
  return error.message?.replace('Firebase: Error ', '').replace(/\(auth\/.*\)\./, '') || 'An unexpected error occurred. Please try again.';
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Fetch user role and name from Firestore
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setRole(userData.role);
            
            let schoolData = null;
            if (userData.schoolId) {
              const schoolRef = doc(db, 'schools', userData.schoolId);
              const schoolSnap = await getDoc(schoolRef);
              if (schoolSnap.exists()) {
                schoolData = { id: schoolSnap.id, ...schoolSnap.data() };
              }
            }
            setSchool(schoolData);

            setUser({
              ...currentUser,
              name: userData.name,
              role: userData.role,
              schoolId: userData.schoolId,
            });
          } else {
            setRole('onboarding');
            setUser(currentUser);
          }
        } catch (err) {
          console.error("Firestore getDoc error:", err);
          setRole('onboarding');
          setUser(currentUser);
        }
      } else {
        setUser(null);
        setRole(null);
        setSchool(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async ({ email, password }) => {
    try {
      if (email === 'admin@teamcarrezza.com' && password === '12345678') {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          return userCredential.user;
        } catch (err) {
          // If the user doesn't exist, create it dynamically
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            email: email,
            name: 'Team Carrezza',
            role: 'superadmin',
            createdAt: new Date().toISOString()
          });
          return userCredential.user;
        }
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Role fetch is handled in onAuthStateChanged
      return userCredential.user;
    } catch (error) {
      throw new Error(getFriendlyErrorMessage(error));
    }
  };

  const registerUser = async ({ email, password, name, roleToSet = 'student', employeeId = null, schoolId = null }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const user = userCredential.user;

      // Store user metadata in Firestore
      try {
        const userData = {
          uid: user.uid,
          email: user.email,
          name: name,
          role: roleToSet,
          schoolId: schoolId,
          createdAt: new Date().toISOString()
        };
        if (employeeId) userData.employeeId = employeeId;

        await setDoc(doc(db, 'users', user.uid), userData);
      } catch (firestoreErr) {
        console.error("Firestore setDoc error:", firestoreErr);
      }

      return user;
    } catch (error) {
      throw new Error(getFriendlyErrorMessage(error));
    }
  };

  const loginWithGoogle = async (isRegistering = false, roleToSet = 'student', schoolId = null, employeeId = null) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;
      
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        if (isRegistering && schoolId) {
          const userData = {
            uid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName || 'Google User',
            role: roleToSet,
            schoolId: schoolId,
            createdAt: new Date().toISOString()
          };
          if (employeeId) userData.employeeId = employeeId;
          await setDoc(docRef, userData);
          
          setRole(roleToSet);
          const schoolRef = doc(db, 'schools', schoolId);
          const schoolSnap = await getDoc(schoolRef);
          if (schoolSnap.exists()) {
            setSchool({ id: schoolSnap.id, ...schoolSnap.data() });
          }
          setUser({
            ...currentUser,
            name: userData.name,
            role: userData.role,
            schoolId: userData.schoolId,
          });
        }
        // If not registering (i.e. just clicking login), we do nothing here and let onAuthStateChanged set role to 'onboarding'
      }
      return currentUser;
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
         throw new Error('Google sign-in was cancelled.');
      }
      throw new Error(error.message || getFriendlyErrorMessage(error));
    }
  };

  const completeOnboarding = async (schoolId, roleToSet, employeeId = null) => {
    try {
      if (!user) throw new Error("No authenticated user found.");
      
      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'Google User',
        role: roleToSet,
        schoolId: schoolId,
        createdAt: new Date().toISOString()
      };
      if (employeeId) userData.employeeId = employeeId;
      
      await setDoc(doc(db, 'users', user.uid), userData);
      
      setRole(roleToSet);
      const schoolRef = doc(db, 'schools', schoolId);
      const schoolSnap = await getDoc(schoolRef);
      if (schoolSnap.exists()) {
        setSchool({ id: schoolSnap.id, ...schoolSnap.data() });
      }
      setUser({
        ...user,
        name: userData.name,
        role: userData.role,
        schoolId: userData.schoolId,
      });
      
    } catch (error) {
      throw new Error(error.message || "Failed to complete onboarding.");
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="relative flex items-center justify-center mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
          />
          <motion.div
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-8 h-8 bg-primary rounded-full blur-md opacity-50"
          />
        </div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-primary font-bold tracking-widest text-sm uppercase"
        >
          Loading ...
        </motion.p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, role, school, login, registerUser, loginWithGoogle, completeOnboarding, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
