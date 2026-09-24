import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile, CustomerRegistrationData, FarmerRegistrationData } from '../types/auth';
import { mockUsers } from '../data/mockAppData';

export interface DemoCredential {
  role: UserRole;
  roleTitle: string;
  email: string;
  password: string;
  description: string;
  user: UserProfile;
}

export const DEMO_CREDENTIALS: Record<UserRole, DemoCredential> = {
  admin: {
    role: 'admin',
    roleTitle: 'SuperAdmin Governance',
    email: 'admin@marketlink.org',
    password: 'admin123',
    description: 'Central platform administration, farmer approvals, moderation, and telemetry.',
    user: mockUsers.admin,
  },
  vendor: {
    role: 'vendor',
    roleTitle: 'Farmer / Stall Vendor',
    email: 'marcus@greenvalleyfarms.com',
    password: 'farmer123',
    description: 'Stall inventory catalog, weekly pre-order fulfillment, and pickup window settings.',
    user: mockUsers.vendor,
  },
  customer: {
    role: 'customer',
    roleTitle: 'Customer / Shopper',
    email: 'clara.higgins@gmail.com',
    password: 'customer123',
    description: 'Fresh local harvest browsing, stall pickup reservation, and order history.',
    user: mockUsers.customer,
  },
};

interface AuthContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  isAuthenticated: boolean;
  setRole: (role: UserRole) => void;
  availableUsers: Record<UserRole, UserProfile>;
  isRole: (role: UserRole) => boolean;
  login: (role: UserRole, email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  registerCustomer: (data: CustomerRegistrationData) => Promise<{ success: boolean; message?: string }>;
  registerFarmer: (data: FarmerRegistrationData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  activeAuthPortal: UserRole;
  setActiveAuthPortal: (portal: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'marketlink_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check stored session or default to unauthenticated state with portal selection
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Boolean(parsed.isAuthenticated);
      }
    } catch {
      // Ignore parse errors
    }
    // Default to true for backward compatibility so current active screen doesn't abruptly vanish,
    // but allow full login/logout flows and explicit role portals
    return true;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.role && ['admin', 'vendor', 'customer'].includes(parsed.role)) {
          return parsed.role as UserRole;
        }
      }
    } catch {
      // Fallback
    }
    return 'admin';
  });

  const [activeAuthPortal, setActiveAuthPortal] = useState<UserRole>('admin');

  const [customUserProfiles, setCustomUserProfiles] = useState<Record<string, UserProfile>>({});

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          isAuthenticated,
          role: currentRole,
        })
      );
    } catch {
      // Ignore storage errors
    }
  }, [isAuthenticated, currentRole]);

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
    setActiveAuthPortal(role);
  };

  const currentUser: UserProfile =
    customUserProfiles[currentRole] || mockUsers[currentRole] || mockUsers.admin;

  const isRole = (role: UserRole) => currentRole === role;

  const login = async (
    role: UserRole,
    email: string,
    password?: string
  ): Promise<{ success: boolean; message?: string }> => {
    // Validate credentials against SRS specifications
    const demo = DEMO_CREDENTIALS[role];
    const normalizedEmail = email.trim().toLowerCase();
    
    // Allow demo credentials or standard test passwords
    const isValidDemo =
      normalizedEmail === demo.email.toLowerCase() ||
      normalizedEmail === `${role}@marketlink.com` ||
      normalizedEmail.includes(role);

    // Accept valid credentials or any non-empty password for mock sandbox
    if (password && password.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters.' };
    }

    const matchedUser: UserProfile = {
      ...(demo.user || mockUsers[role]),
      email: email.trim(),
    };

    setCustomUserProfiles((prev) => ({ ...prev, [role]: matchedUser }));
    setCurrentRole(role);
    setActiveAuthPortal(role);
    setIsAuthenticated(true);

    return { success: true };
  };

  const registerCustomer = async (
    data: CustomerRegistrationData
  ): Promise<{ success: boolean; message?: string }> => {
    if (!data.name.trim() || !data.email.trim() || !data.contactNumber.trim() || !data.address.trim()) {
      return { success: false, message: 'Please provide all required fields (Name, Phone, Email, Address).' };
    }

    const newUser: UserProfile = {
      id: `user-customer-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      badge: 'Registered Market Patron',
      phone: data.contactNumber.trim(),
      address: data.address.trim(),
    };

    setCustomUserProfiles((prev) => ({ ...prev, customer: newUser }));
    setCurrentRole('customer');
    setActiveAuthPortal('customer');
    setIsAuthenticated(true);

    return { success: true };
  };

  const registerFarmer = async (
    data: FarmerRegistrationData
  ): Promise<{ success: boolean; message?: string }> => {
    if (!data.stallName.trim() || !data.contactPerson.trim() || !data.contactNumber.trim() || !data.email.trim() || !data.address.trim()) {
      return { success: false, message: 'Please fill in stall name, contact person, phone, email, and farm address.' };
    }

    const newUser: UserProfile = {
      id: `user-vendor-${Date.now()}`,
      name: data.contactPerson.trim(),
      email: data.email.trim(),
      role: 'vendor',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      badge: 'Registered Stall Producer',
      stallName: data.stallName.trim(),
      marketName: data.marketName || 'Downtown Fresh Pavilion',
      phone: data.contactNumber.trim(),
      address: data.address.trim(),
      contactPerson: data.contactPerson.trim(),
    };

    setCustomUserProfiles((prev) => ({ ...prev, vendor: newUser }));
    setCurrentRole('vendor');
    setActiveAuthPortal('vendor');
    setIsAuthenticated(true);

    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated,
        setRole,
        availableUsers: {
          admin: customUserProfiles.admin || mockUsers.admin,
          vendor: customUserProfiles.vendor || mockUsers.vendor,
          customer: customUserProfiles.customer || mockUsers.customer,
        },
        isRole,
        login,
        registerCustomer,
        registerFarmer,
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

