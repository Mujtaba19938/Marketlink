import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Store, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onBackToHome?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onBackToHome }) => {
  const { currentRole, setRole } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[480px] p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-2xs">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#22c55e] flex items-center justify-center mb-4">
        <Store className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">404 - Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        The produce stall or market destination you are looking for does not exist or has been relocated.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (onBackToHome) {
              onBackToHome();
            } else {
              setRole(currentRole);
            }
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );
};
