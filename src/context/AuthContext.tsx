import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { useCartStore } from '../store/cartStore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<import('firebase/auth').UserCredential>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { hydrateFromBackend, clearCart } = useCartStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          await hydrateFromBackend(token, false);
        } catch (error) {
          console.error('Failed to hydrate cart:', error);
        }
      }
    });
    return () => unsubscribe();
  }, [hydrateFromBackend]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const cred = await signInWithEmailAndPassword(auth, email, password);
    setUser(cred.user);
    setLoading(false);
    if (cred.user) {
      const token = await cred.user.getIdToken();
      await hydrateFromBackend(token);
    }
  };

  const signup = async (email: string, password: string) => {
    setLoading(true);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    setUser(cred.user);
    setLoading(false);
    if (cred.user) {
      const token = await cred.user.getIdToken();
      await hydrateFromBackend(token);
    }
    return cred;
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (user) {
        const token = await user.getIdToken();
        await clearCart(token);
      }
      clearCart();
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}; 