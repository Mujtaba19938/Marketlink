import React from 'react';
import { useAuth, DEMO_CREDENTIALS } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';
import { Zap, ShieldCheck, Tractor, ShoppingBag, ArrowRight } from 'lucide-react';

interface DemoCredentialsHelperProps {
  onSelectRole?: (role: UserRole) => void;
  onInstantLogin?: (role: UserRole) => void;
}

export const DemoCredentialsHelper: React.FC<DemoCredentialsHelperProps> = ({
  onSelectRole,
  onInstantLogin,
}) => {
  const { login } = useAuth();

  const handleQuickLogin = async (role: UserRole) => {
    const cred = DEMO_CREDENTIALS[role];
    await login(role, cred.email, cred.password);
    onInstantLogin?.(role);
  };

  const roleMeta = [
    {
      role: 'admin' as UserRole,
      title: 'SuperAdmin Portal',
      user: 'Eleanor Vance',
      email: DEMO_CREDENTIALS.admin.email,
      pass: DEMO_CREDENTIALS.admin.password,
      icon: ShieldCheck,
      badge: 'System Governance',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      btnColor: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
    },
    {
      role: 'vendor' as UserRole,
      title: 'Farmer / Stall Portal',
      user: 'Marcus Vance',
      email: DEMO_CREDENTIALS.vendor.email,
      pass: DEMO_CREDENTIALS.vendor.password,
      icon: Tractor,
      badge: 'Produce Vendor',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      btnColor: 'bg-[#22c55e] hover:bg-emerald-600 text-white shadow-emerald-500/20',
    },
    {
      role: 'customer' as UserRole,
      title: 'Customer Market',
      user: 'Clara Higgins',
      email: DEMO_CREDENTIALS.customer.email,
      pass: DEMO_CREDENTIALS.customer.password,
      icon: ShoppingBag,
      badge: 'Shopper Pre-Orders',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      btnColor: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20',
    },
  ];

  return (
    <div className="bg-slate-50/90 rounded-2xl p-5 border border-slate-200/80 space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-600 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 fill-amber-500" />
          </div>
          <span className="text-xs font-bold text-slate-800">
            SRS Section 1.9 Test Credentials
          </span>
        </div>
        <span className="text-[10px] font-semibold text-slate-400">
          Mandatory Deliverable
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {roleMeta.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.role}
              className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3 group hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs font-bold text-slate-800 truncate">{item.title}</span>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <div className="truncate"><strong className="text-slate-700">User:</strong> {item.user}</div>
                  <div className="truncate text-slate-500 font-mono text-[10px]">{item.email}</div>
                  <div className="text-slate-400 text-[10px]">Pass: <code className="font-mono text-slate-600">{item.pass}</code></div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => onSelectRole?.(item.role)}
                  className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition cursor-pointer text-center"
                >
                  View Form
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin(item.role)}
                  className={`py-1.5 px-3 text-[11px] font-bold rounded-lg transition shadow-xs flex items-center justify-center gap-1 cursor-pointer shrink-0 ${item.btnColor}`}
                >
                  <span>1-Click Sign In</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
