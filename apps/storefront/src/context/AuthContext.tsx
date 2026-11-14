import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAccessToken } from '../services/api';

export interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  isEmailVerified: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (fullName: string, email: string, pass: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    // Check if user session exists on startup and restore across page refreshes
    const checkSession = async () => {
      try {
        const res = await api.auth.getSession();
        if (res?.data?.user) {
          setUser(res.data.user);
        }
      } catch {
        // Fallback: check if getMe succeeds
        try {
          const meRes = await api.auth.getMe();
          if (meRes?.data?.user) {
            setUser(meRes.data.user);
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.auth.login({ email, password: pass });
    if (res?.data?.user) {
      setUser(res.data.user);
      setIsAuthModalOpen(false);

      // Auto-sync guest cart from localStorage
      try {
        const localCart = localStorage.getItem('sangham_cart');
        if (localCart) {
          const parsed = JSON.parse(localCart);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const syncPayload = parsed.map((item: any) => ({
              id: item.product.id || item.product._id,
              quantity: item.quantity,
            }));
            await api.cart.sync(syncPayload);
          }
        }
      } catch {
        // Safe fallback
      }
    }
  };

  const register = async (fullName: string, email: string, pass: string, phone: string) => {
    const res = await api.auth.register({ fullName, email, password: pass, phone });
    if (res?.data?.user) {
      setUser(res.data.user);
      setIsAuthModalOpen(false);
    }
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
