import React, { useState } from 'react';
import { useAuth, DEMO_CREDENTIALS } from '../../context/AuthContext';
import { Tractor, Lock, Mail, ArrowRight, AlertCircle, KeyRound, Store, User, Phone, MapPin } from 'lucide-react';

interface FarmerLoginFormProps {
  onSuccess: () => void;
}

export const FarmerLoginForm: React.FC<FarmerLoginFormProps> = ({ onSuccess }) => {
  const { login, registerFarmer } = useAuth();
  const demo = DEMO_CREDENTIALS.vendor;

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState(demo.email);
  const [loginPassword, setLoginPassword] = useState(demo.password);

  // Registration form state (Strictly matching SRS fields: stall name, contact person, phone, email, address)
  const [stallName, setStallName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [address, setAddress] = useState('');
  const [marketName, setMarketName] = useState('Downtown Fresh Pavilion');
  const [registerPassword, setRegisterPassword] = useState('farmer123');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login('vendor', loginEmail, loginPassword);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.message || 'Login failed. Please verify credentials.');
      }
    } catch {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await registerFarmer({
        stallName,
        contactPerson,
        contactNumber: phone,
        email: registerEmail,
        address,
        marketName,
        password: registerPassword,
      });

      if (res.success) {
        onSuccess();
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch {
      setError('An error occurred during stall registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemo = () => {
    setLoginEmail(demo.email);
    setLoginPassword(demo.password);
    setError(null);
  };

  return (
    <div className="space-y-5">
      {/* Role Header Banner */}
      <div className="p-4 rounded-2xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#22c55e] text-white flex items-center justify-center shrink-0 shadow-sm">
          <Tractor className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-800">Farmer & Stall Vendor Portal</h4>
            <span className="text-[10px] font-bold bg-[#22c55e]/15 text-[#22c55e] px-2 py-0.5 rounded-full border border-[#22c55e]/30">
              Producers
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Manage weekly harvest inventory, pre-orders, pickup windows, and stall profiles.
          </p>
        </div>
      </div>

      {/* Login vs Register Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => {
            setActiveTab('login');
            setError(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'login'
              ? 'bg-white text-slate-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Farmer Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('register');
            setError(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'register'
              ? 'bg-white text-slate-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Register Stall (SRS Form)
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {activeTab === 'login' ? (
        /* Sign In Form */
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Farmer Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="marcus@greenvalleyfarms.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Farmer Password
              </label>
              <span className="text-[11px] text-slate-400">SRS Demo: farmer123</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#22c55e] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
          >
            <span>{loading ? 'Entering Stall Portal...' : 'Sign In as Farmer'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
            <span className="text-[11px] text-slate-400">Demo Farmer: Marcus Vance</span>
            <button
              type="button"
              onClick={handleUseDemo}
              className="text-[11px] font-bold text-[#22c55e] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <KeyRound className="w-3 h-3" />
              <span>Fill Farmer Credentials</span>
            </button>
          </div>
        </form>
      ) : (
        /* Stall Registration Form (SRS Section 1.6: stall/business name, contact person, contact number, e-mail ID, address) */
        <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Stall / Farm Business Name *
              </label>
              <div className="relative">
                <Store className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={stallName}
                  onChange={(e) => setStallName(e.target.value)}
                  placeholder="e.g. Sunny Brook Orchards"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#22c55e]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Person *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Thomas Wayne"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#22c55e]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 345-6789"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#22c55e]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                E-mail ID *
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="thomas@sunnybrook.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#22c55e]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Farm & Stall Physical Address *
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Route 9, Valley View County, Stall #28"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#22c55e]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Operating Market
              </label>
              <select
                value={marketName}
                onChange={(e) => setMarketName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#22c55e]"
              >
                <option value="Downtown Fresh Pavilion">Downtown Fresh Pavilion</option>
                <option value="Uptown Community Green">Uptown Community Green</option>
                <option value="Riverside Artisans Market">Riverside Artisans Market</option>
                <option value="Westside Heritage Market">Westside Heritage Market</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#22c55e]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#22c55e] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
          >
            <span>{loading ? 'Submitting Registration...' : 'Complete Stall Registration (SRS)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
};
