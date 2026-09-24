import React, { createContext, useContext, useState } from 'react';
import { UserRole, UserProfile } from '../types/auth';
import { mockUsers } from '../data/mockAppData';

interface AuthContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  availableUsers: Record<UserRole, UserProfile>;
  isRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const currentUser = mockUsers[currentRole] || mockUsers.admin;

  const isRole = (role: UserRole) => currentRole === role;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        setRole,
        availableUsers: mockUsers as Record<UserRole, UserProfile>,
        isRole,
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
