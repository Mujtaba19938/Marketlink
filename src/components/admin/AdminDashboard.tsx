import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { FarmerManagement } from './FarmerManagement';
import { CustomerManagement } from './CustomerManagement';
import { MarketManagement } from './MarketManagement';
import { ContentModeration } from './ContentModeration';
import { SystemConfig } from './SystemConfig';
import { AdminAnalytics } from './AdminAnalytics';
import { Modal } from '../common/Modal';
import {
  Tractor,
  Users,
  Store,
  ShoppingBag,
  DollarSign,
  ShieldAlert,
  Sliders,
  Send,
  Sparkles,
  BarChart3,
  Megaphone,
} from 'lucide-react';

interface AdminDashboardProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const { farmers, customers, markets, moderationItems, broadcastAnnouncement } = useMarketData();
  const [selectedMetricTab, setSelectedMetricTab] = useState('farmers');
  const [internalTab, setInternalTab] = useState<'analytics' | 'farmers' | 'customers' | 'markets' | 'moderation' | 'config'>('analytics');
  
  const validTabs = ['analytics', 'farmers', 'customers', 'markets', 'moderation', 'config'];
  const activeAdminTab = currentTab && validTabs.includes(currentTab)
    ? (currentTab as 'analytics' | 'farmers' | 'customers' | 'markets' | 'moderation' | 'config')
    : internalTab;

  const setActiveAdminTab = (tab: 'analytics' | 'farmers' | 'customers' | 'markets' | 'moderation' | 'config') => {
    setInternalTab(tab);
    onSelectTab?.(tab);
  };

  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // Broadcast modal form state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastAudience, setBroadcastAudience] = useState<'all' | 'vendors' | 'customers'>('all');

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    broadcastAnnouncement({
      title: broadcastTitle.trim(),
      message: broadcastMessage.trim(),
      targetAudience: broadcastAudience,
      priority: 'important',
    });
    setBroadcastTitle('');
    setBroadcastMessage('');
    setShowBroadcastModal(false);
  };

  // 5 Quick Metric Chips matching Categories & Stock 5-card visual layout in screenshot
  const adminMetricChips = [
    {
      id: 'farmers',
      name: 'Farmers',
      stock: `${farmers.length} active`,
      count: farmers.length,
      icon: Tractor,
    },
    {
      id: 'customers',
      name: 'Customers',
      stock: `${customers.length} users`,
      count: customers.length,
      icon: Users,
    },
    {
      id: 'markets',
      name: 'Markets',
      stock: `${markets.length} active`,
      count: markets.length,
      icon: Store,
    },
    {
      id: 'orders',
      name: 'Orders',
      stock: '12,490 orders',
      count: 12490,
      icon: ShoppingBag,
    },
    {
      id: 'revenue',
      name: 'Platform GMV',
      stock: '$184.2k GMV',
      count: 184250,
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Hero Card matching screenshot green banner */}
      <div className="relative overflow-hidden bg-[#22c55e] rounded-2xl sm:rounded-3xl p-6 sm:p-7 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-black/5 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-2.5 py-0.5 rounded-full text-white text-[11px] font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Platform Governance & Central Administration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-white">
            MarketLink SuperAdmin<br className="hidden sm:inline" /> Governance Hub
          </h2>
          <p className="mt-1 text-sm text-white/90 font-medium">
            Monitor regional gross volume, approve farmer registrations, and broadcast alerts.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="w-full sm:w-auto px-6 py-2.5 bg-white text-slate-800 hover:bg-slate-50 font-bold text-sm rounded-xl transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
          >
            Broadcast Announcement
          </button>
        </div>
      </div>

      {/* 2. Quick Metric Chips matching the exact "Categories and Stock" 5-card horizontal layout */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            Platform Key Metrics
          </h3>
          <span className="text-xs font-semibold text-[#22c55e]">
            Live Network Telemetry
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {adminMetricChips.map((chip) => {
            const isSelected = selectedMetricTab === chip.id;
            const Icon = chip.icon;

            return (
              <button
                key={chip.id}
                onClick={() => {
                  setSelectedMetricTab(chip.id);
                  if (chip.id === 'farmers') setActiveAdminTab('farmers');
                  else if (chip.id === 'customers') setActiveAdminTab('customers');
                  else if (chip.id === 'markets') setActiveAdminTab('markets');
                  else setActiveAdminTab('analytics');
                }}
                className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl transition-all duration-150 text-center cursor-pointer ${
                  isSelected
                    ? 'bg-[#22c55e] text-white shadow-md shadow-emerald-500/20 scale-[1.02]'
                    : 'bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-xs shadow-2xs text-slate-700'
                }`}
              >
                {/* Icon */}
                <div className="mb-2.5 flex items-center justify-center h-8">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-[#22c55e]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Metric count */}
                <div
                  className={`text-[12px] font-bold leading-tight ${
                    isSelected ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  {chip.stock}
                </div>

                {/* Metric label */}
                <div
                  className={`text-[11px] font-semibold mt-0.5 leading-tight ${
                    isSelected ? 'text-white/90' : 'text-slate-400'
                  }`}
                >
                  {chip.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Management Panels with MarketEase Pill Tabs */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveAdminTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeAdminTab === 'analytics'
                  ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Reports & Analytics</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('farmers')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeAdminTab === 'farmers'
                  ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Tractor className="w-4 h-4" />
              <span>Farmer Approvals</span>
              {farmers.filter((f) => f.status === 'pending').length > 0 && (
                <span className="bg-[#22c55e] text-white text-[10px] px-1.5 py-0.2 rounded-full">
                  {farmers.filter((f) => f.status === 'pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveAdminTab('customers')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeAdminTab === 'customers'
                  ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customer Accounts</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('markets')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeAdminTab === 'markets'
                  ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Market Locations</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('moderation')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeAdminTab === 'moderation'
                  ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Content Moderation</span>
              {moderationItems.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                  {moderationItems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveAdminTab('config')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeAdminTab === 'config'
                  ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>System Configuration</span>
            </button>
          </div>
        </div>

        {/* Panel View */}
        <div>
          {activeAdminTab === 'analytics' && <AdminAnalytics />}
          {activeAdminTab === 'farmers' && <FarmerManagement />}
          {activeAdminTab === 'customers' && <CustomerManagement />}
          {activeAdminTab === 'markets' && <MarketManagement />}
          {activeAdminTab === 'moderation' && <ContentModeration />}
          {activeAdminTab === 'config' && <SystemConfig />}
        </div>
      </div>

      {/* Broadcast Announcement Modal */}
      {showBroadcastModal && (
        <Modal
          isOpen={showBroadcastModal}
          onClose={() => setShowBroadcastModal(false)}
          title="Broadcast Platform Announcement"
          subtitle="Send push announcements across all market stalls and customer devices"
          maxWidth="md"
        >
          <form onSubmit={handleBroadcastSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Announcement Title *</label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g. Extended Stall Hours for Weekend Harvest Market"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#22c55e]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
              <select
                value={broadcastAudience}
                onChange={(e) => setBroadcastAudience(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#22c55e]"
              >
                <option value="all">All Users (Vendors & Shoppers)</option>
                <option value="vendors">Vendors / Farmers Only</option>
                <option value="customers">Customers Only</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Message Content *</label>
              <textarea
                rows={3}
                required
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Details on gate closures, curbside parking, or weather updates..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#22c55e] resize-none"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-xs"
              >
                Broadcast Now
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
