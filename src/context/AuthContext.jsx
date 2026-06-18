import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { auth, db, secondaryAuth } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

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
            setRole('student');
            setUser(currentUser);
          }
        } catch (err) {
          console.error("Firestore getDoc error:", err);
          setRole('student');
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
      throw new Error(error.message || 'Login failed');
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
      throw new Error(error.message || 'Registration failed');
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
    <AuthContext.Provider value={{ user, role, school, login, registerUser, logout, isAuthenticated: !!user }}>
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
