import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketData } from '../../context/MarketDataContext';
import { ThemeColorSelector } from '../../components/common/ThemeColorSelector';
import {
  Settings,
  Palette,
  User,
  Bell,
  Globe,
  ShieldCheck,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentRole, currentUser } = useAuth();
  const { triggerToast } = useMarketData();
  const [activeSubTab, setActiveSubTab] = useState<'appearance' | 'account' | 'notifications' | 'market'>('appearance');

  // Preferences mock state
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [currency, setCurrency] = useState('USD ($)');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [saved, setSaved] = useState(false);

  const handleSavePreferences = () => {
    setSaved(true);
    triggerToast('Settings and appearance saved successfully!', 'success');
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Application Settings & Appearance</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Customize display mode (light / dark), color palette accents, account settings, and notification preferences.
          </p>
        </div>

        <button
          onClick={handleSavePreferences}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Preferences Saved!' : 'Save Preferences'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setActiveSubTab('appearance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'appearance'
              ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Appearance & Colors</span>
        </button>

        <button
          onClick={() => setActiveSubTab('account')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'account'
              ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Persona</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'notifications'
              ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Alerts & Notifications</span>
        </button>

        <button
          onClick={() => setActiveSubTab('market')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'market'
              ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Localization & Units</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        {activeSubTab === 'appearance' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Theme Color & Display Mode</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose between warm earthy brown (chestnut for light, roasted dark espresso for dark), fresh emerald, terracotta, teal, or berry.
              </p>
            </div>

            <ThemeColorSelector />
          </div>
        )}

        {activeSubTab === 'account' && (
          <div className="space-y-4 max-w-xl text-xs">
            <div>
              <h3 className="text-base font-bold text-slate-800">Active Persona & Account</h3>
              <p className="text-slate-500 mt-0.5">Current profile details for {currentUser.name}.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.name}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Role Persona</label>
                <input
                  type="text"
                  disabled
                  value={currentRole.toUpperCase()}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Stall Designation</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.stallName || 'N/A (Central SuperAdmin)'}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Account Status</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-[#22c55e] font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified & Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'notifications' && (
          <div className="space-y-4 max-w-xl text-xs">
            <div>
              <h3 className="text-base font-bold text-slate-800">Notification Preferences</h3>
              <p className="text-slate-500 mt-0.5">Control how and when you receive real-time alerts.</p>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Push Notification Alerts</span>
                  <span className="text-[11px] text-slate-400">Receive toasts when orders or approvals update</span>
                </div>
                <input
                  type="checkbox"
                  checked={pushNotifs}
                  onChange={(e) => setPushNotifs(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Weekly Digest Email</span>
                  <span className="text-[11px] text-slate-400">Receive weekly harvest breakdown and order statements</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}

        {activeSubTab === 'market' && (
          <div className="space-y-4 max-w-xl text-xs">
            <div>
              <h3 className="text-base font-bold text-slate-800">Units & Currency</h3>
              <p className="text-slate-500 mt-0.5">Regional formatting for price tags and produce weights.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Currency Display</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                  <option value="CAD ($)">CAD ($)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Produce Weight Unit</label>
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="lb">Pounds (lb)</option>
                  <option value="bunch">Bunches / Units</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
