export type UserRole = 'admin' | 'vendor' | 'customer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  badge?: string;
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
