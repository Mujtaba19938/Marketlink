import React from 'react';
import { RouteGuard } from '../../routes/RouteGuard';
import { UserRole } from '../../types/auth';

export interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Backward compatibility wrapper for RoleGuard
 * Re-exports RouteGuard from src/routes/
 */
export const RoleGuard: React.FC<RoleGuardProps> = (props) => {
  return <RouteGuard {...props} />;
};

export default RoleGuard;
