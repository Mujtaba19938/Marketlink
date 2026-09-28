import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { UserRole, UserProfile, CustomerRegistrationData, FarmerRegistrationData } from '../types/auth';
import { api, errorMessage, setUnauthorizedHandler, tokenStore } from '../services/api';
import { mapUser } from '../services/mappers';

export interface DemoCredential {
  role: UserRole;
  roleTitle: string;
  email: string;
  password: string;
  description: string;
  userName: string;
}

/** Accounts created by `npm run seeddemodata` in /server (SRS 1.9: credentials for all user types) */
export const DEMO_CREDENTIALS: Record<UserRole, DemoCredential> = {
  admin: {
    role: 'admin',
    roleTitle: 'Administrator',
    email: 'admin@marketlink.com',
    password: 'Admin@12345',
    description: 'Farmer approvals, customers, markets, moderation, reports and announcements.',
    userName: 'Admin',
  },
  vendor: {
    role: 'vendor',
    roleTitle: 'Farmer / Stall Vendor',
    email: 'ali.farm@marketlink.com',
    password: 'Farmer123!',
    description: 'Weekly stock, pre-orders, pickup slots, stall profile and reviews.',
    userName: 'Ali Hassan (Ali Farm)',
  },
  customer: {
    role: 'customer',
    roleTitle: 'Customer / Shopper',
    email: 'customer@marketlink.com',
    password: 'Customer123!',
    description: 'Browse markets, pre-order for pickup, favorites, order history and reviews.',
    userName: 'Test Customer',
  },
};

const ROLE_LABEL: Record<UserRole, string> = { admin: 'Admin', vendor: 'Farmer', customer: 'Customer' };

// shown in headers before anyone signs in, so components never have to null-check the user
const GUEST: UserProfile = {
  id: '',
  name: 'Guest',
  email: '',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  badge: 'Guest',
};

type Result = { success: boolean; message?: string };

interface AuthContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  isAuthenticated: boolean;
  authReady: boolean; // false while an existing session is being restored
  setRole: (role: UserRole) => void; // only selects the login portal; the real role comes from the server
  isRole: (role: UserRole) => boolean;
  login: (role: UserRole, email: string, password: string) => Promise<Result>;
  registerCustomer: (data: CustomerRegistrationData) => Promise<Result>;
  registerFarmer: (data: FarmerRegistrationData) => Promise<Result>;
  updateProfile: (data: { name?: string; phone?: string; address?: string; city?: string }) => Promise<Result>;
  changePassword: (oldPwd: string, newPwd: string) => Promise<Result>;
  refreshUser: () => Promise<void>;
  logout: () => void;
  activeAuthPortal: UserRole;
  setActiveAuthPortal: (portal: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(() => !tokenStore.get());
  const [activeAuthPortal, setActiveAuthPortal] = useState<UserRole>('customer');

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!tokenStore.get()) return;
    try {
      const res = await api.get('/getme');
      setUser(mapUser(res.user, res.farmer));
    } catch {
      logout();
    }
  }, [logout]);

  // restore the session from the stored token on first load
  useEffect(() => {
    setUnauthorizedHandler(logout);
    if (tokenStore.get()) {
      refreshUser().finally(() => setAuthReady(true));
    }
    return () => setUnauthorizedHandler(null);
  }, [logout, refreshUser]);

  const login = async (role: UserRole, email: string, password: string): Promise<Result> => {
    try {
      const res = await api.post('/authlogin', { email: email.trim(), pwd: password });
      const profile = mapUser(res.user, res.farmer);
      if (profile.role !== role) {
        return {
          success: false,
          message: `This is a ${ROLE_LABEL[profile.role]} account. Please use the ${ROLE_LABEL[profile.role]} portal to sign in.`,
        };
      }
      tokenStore.set(res.token);
      setUser(profile);
      setActiveAuthPortal(profile.role);
      return { success: true };
    } catch (err) {
      return { success: false, message: errorMessage(err, 'Login failed') };
    }
  };

  const registerCustomer = async (data: CustomerRegistrationData): Promise<Result> => {
    if (!data.name.trim() || !data.email.trim() || !data.contactNumber.trim() || !data.address.trim()) {
      return { success: false, message: 'Please provide all required fields (Name, Phone, Email, Address).' };
    }
    try {
      await api.post('/addcustomer', {
        name: data.name.trim(),
        email: data.email.trim(),
        pwd: data.password,
        phone: data.contactNumber.trim(),
        address: data.address.trim(),
        city: data.city?.trim() || undefined,
      });
      return await login('customer', data.email, data.password);
    } catch (err) {
      return { success: false, message: errorMessage(err, 'Registration failed') };
    }
  };

  const registerFarmer = async (data: FarmerRegistrationData): Promise<Result> => {
    if (!data.stallName.trim() || !data.contactPerson.trim() || !data.contactNumber.trim() || !data.email.trim() || !data.address.trim()) {
      return { success: false, message: 'Please fill in stall name, contact person, phone, email, and address.' };
    }
    try {
      await api.post('/addfarmer', {
        name: data.contactPerson.trim(),
        email: data.email.trim(),
        pwd: data.password,
        phone: data.contactNumber.trim(),
        address: data.address.trim(),
        city: data.city?.trim() || undefined,
        stallName: data.stallName.trim(),
      });
      // pending farmers can sign in and complete their profile while they wait for approval
      return await login('vendor', data.email, data.password);
    } catch (err) {
      return { success: false, message: errorMessage(err, 'Registration failed') };
    }
  };

  const updateProfile = async (data: { name?: string; phone?: string; address?: string; city?: string }): Promise<Result> => {
    try {
      await api.post('/updateprofile', data);
      await refreshUser();
      return { success: true, message: 'Profile updated' };
    } catch (err) {
      return { success: false, message: errorMessage(err, 'Could not update profile') };
    }
  };

  const changePassword = async (oldPwd: string, newPwd: string): Promise<Result> => {
    try {
      await api.post('/changepwd', { oldPwd, newPwd });
      return { success: true, message: 'Password updated' };
    } catch (err) {
      return { success: false, message: errorMessage(err, 'Could not change password') };
    }
  };

  const currentUser = user || GUEST;
  const currentRole: UserRole = user ? user.role : activeAuthPortal;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated: Boolean(user),
        authReady,
        setRole: setActiveAuthPortal,
        isRole: (role) => Boolean(user) && currentRole === role,
        login,
        registerCustomer,
        registerFarmer,
        updateProfile,
        changePassword,
        refreshUser,
        logout,
        activeAuthPortal,
        setActiveAuthPortal,
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
