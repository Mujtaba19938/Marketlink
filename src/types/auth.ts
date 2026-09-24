export type UserRole = 'admin' | 'vendor' | 'customer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  badge?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  stallName?: string;
  marketName?: string;
}

export interface RoleConfig {
  role: UserRole;
  title: string;
  description: string;
  defaultPath: string;
  badgeColor: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  role?: UserRole;
}

export interface CustomerRegistrationData {
  name: string;
  contactNumber: string;
  email: string;
  address: string;
  password?: string;
}

export interface FarmerRegistrationData {
  stallName: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  address: string;
  marketName?: string;
  password?: string;
}
