import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';
import { ShieldAlert, ArrowRight } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { currentRole, setRole } = useAuth();

  if (allowedRoles.includes(currentRole)) {
    return <>{children}</>;
  }

  return (
    <div className="flex-1 p-8 flex items-center justify-center min-h-[500px]">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-rose-100 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800">Role-Based Access Restricted</h2>
          <p className="text-xs text-slate-500">
            You are currently signed in as <span className="font-semibold capitalize text-slate-700">{currentRole}</span>. This view requires{' '}
            <span className="font-semibold text-rose-600">{allowedRoles.join(' or ')}</span> permissions.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setRole(allowedRoles[0])}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <span>Switch to {allowedRoles[0].toUpperCase()} Role</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
