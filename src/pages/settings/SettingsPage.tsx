import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketData } from '../../context/MarketDataContext';
import { ThemeColorSelector } from '../../components/common/ThemeColorSelector';
import { Settings, Palette, User, Lock, Save, ShieldCheck } from 'lucide-react';

/**
 * Settings: theme (stored in the browser), profile and password (stored in MongoDB via /api/updateprofile and /api/changepwd).
 */
export const SettingsPage: React.FC = () => {
  const { currentRole, currentUser, updateProfile, changePassword } = useAuth();
  const { triggerToast } = useMarketData();
  const [activeSubTab, setActiveSubTab] = useState<'appearance' | 'account' | 'password'>('account');

  const [profile, setProfile] = useState({ name: '', phone: '', address: '', city: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  const [pwd, setPwd] = useState({ oldPwd: '', newPwd: '', confirm: '' });
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    setProfile({
      name: currentUser.name || '',
      phone: currentUser.phone || '',
      address: currentUser.address || '',
      city: currentUser.city || '',
    });
  }, [currentUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      triggerToast('Name cannot be empty', 'error');
      return;
    }
    setSavingProfile(true);
    const res = await updateProfile({
      name: profile.name.trim(),
      phone: profile.phone.trim(),
      address: profile.address.trim(),
      city: profile.city.trim(),
    });
    setSavingProfile(false);
    triggerToast(res.message || (res.success ? 'Profile updated' : 'Could not update profile'), res.success ? 'success' : 'error');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.newPwd.length < 8) {
      triggerToast('New password must be at least 8 characters', 'error');
      return;
    }
    if (pwd.newPwd !== pwd.confirm) {
      triggerToast('New passwords do not match', 'error');
      return;
    }
    setSavingPwd(true);
    const res = await changePassword(pwd.oldPwd, pwd.newPwd);
    setSavingPwd(false);
    triggerToast(res.message || '', res.success ? 'success' : 'error');
    if (res.success) setPwd({ oldPwd: '', newPwd: '', confirm: '' });
  };

  const tabClass = (tab: string) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
      activeSubTab === tab ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
    }`;
  const inputClass = 'w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Account Settings</h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">Update your profile and password, or change the dashboard colors.</p>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        <button onClick={() => setActiveSubTab('account')} className={tabClass('account')}>
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
        <button onClick={() => setActiveSubTab('password')} className={tabClass('password')}>
          <Lock className="w-4 h-4" />
          <span>Password</span>
        </button>
        <button onClick={() => setActiveSubTab('appearance')} className={tabClass('appearance')}>
          <Palette className="w-4 h-4" />
          <span>Appearance</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        {activeSubTab === 'appearance' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Theme Color & Display Mode</h3>
              <p className="text-xs text-slate-500 mt-0.5">Saved in this browser.</p>
            </div>
            <ThemeColorSelector />
          </div>
        )}

        {activeSubTab === 'account' && (
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl text-xs">
            <div>
              <h3 className="text-base font-bold text-slate-800">Profile</h3>
              <p className="text-slate-500 mt-0.5">
                {currentRole === 'vendor'
                  ? 'Your contact details. Stall details (stall name, location, markets) are edited in the Stall Profile tab.'
                  : 'These details are used for your pre-orders.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{currentRole === 'vendor' ? 'Contact Person' : 'Full Name'}</label>
                <input type="text" required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email (login)</label>
                <input type="email" disabled value={currentUser.email} className={`${inputClass} text-slate-500`} />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Number</label>
                <input type="text" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">City</label>
                <input type="text" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Address</label>
                <input type="text" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Role</label>
                <input type="text" disabled value={currentRole === 'vendor' ? 'FARMER' : currentRole.toUpperCase()} className={`${inputClass} font-bold text-slate-500`} />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Account Status</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-[#22c55e] font-bold capitalize">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{currentUser.farmerStatus ? `Active • stall ${currentUser.farmerStatus}` : 'Active'}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{savingProfile ? 'Saving…' : 'Save Profile'}</span>
            </button>
          </form>
        )}

        {activeSubTab === 'password' && (
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md text-xs">
            <div>
              <h3 className="text-base font-bold text-slate-800">Change Password</h3>
              <p className="text-slate-500 mt-0.5">At least 8 characters.</p>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Current password</label>
              <input type="password" required value={pwd.oldPwd} onChange={(e) => setPwd({ ...pwd, oldPwd: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">New password</label>
              <input type="password" required minLength={8} value={pwd.newPwd} onChange={(e) => setPwd({ ...pwd, newPwd: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Confirm new password</label>
              <input type="password" required minLength={8} value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} className={inputClass} />
            </div>
            <button
              type="submit"
              disabled={savingPwd}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{savingPwd ? 'Updating…' : 'Update Password'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
