import React from 'react';
import { RoleSwitcher } from '../components/common/RoleSwitcher';
import { ToastContainer } from '../components/common/ToastContainer';

export interface MinimalLayoutProps {
  children: React.ReactNode;
  hideRoleSwitcher?: boolean;
}

/**
 * Minimalist Clean Layout
 * Useful for focused single-purpose views, error pages, or standalone flows.
 */
export const MinimalLayout: React.FC<MinimalLayoutProps> = ({
  children,
  hideRoleSwitcher = false,
}) => {
  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {!hideRoleSwitcher && (
        <div className="w-full border-b border-slate-200/80 bg-white sticky top-0 z-50">
          <RoleSwitcher />
        </div>
      )}

      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-4xl">
          {children}
        </div>
      </main>

      <ToastContainer />
    </div>
  );
};
