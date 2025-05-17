"use client";

import { auth, db } from './config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userData: unknown| null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userData: null
});

interface FirebaseAuthProviderProps {
  children: ReactNode;
}

export const FirebaseAuthProvider: React.FC<FirebaseAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<unknown| null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, userData }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// باقي الكود يبقى كما هو
export const registerUser = async (userData: {
  name: string;
  phone: string;
  password: string;
  accountType: string;
  agreeToTerms: boolean;
}) => {
  try {
    const email = `${userData.phone}@hagzzgo.com`;
    const userCredential = await createUserWithEmailAndPassword(auth, email, userData.password);

    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name: userData.name,
      phone: userData.phone,
      accountType: userData.accountType,
      agreeToTerms: userData.agreeToTerms,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return userCredential.user;
  } catch (error: any) {
    console.error('خطأ في التسجيل:', error.message);
<<<<<<< HEAD
    throw new Error(error.message);
=======
    throw error;
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
  }
};

export const loginUser = async (phone: string, password: string) => {
  try {
    const email = `${phone}@hagzzgo.com`;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('خطأ في تسجيل الدخول:', error.message);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await auth.signOut();
  } catch (error: any) {
    console.error('خطأ في تسجيل الخروج:', error.message);
    throw error;
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth يجب استخدامه داخل FirebaseAuthProvider');
  }
  return context;
};