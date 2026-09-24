import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { Badge } from '../common/Badge';
import {
  Sliders,
  Tag,
  Radio,
  Plus,
  Send,
  Bell,
  CheckCircle,
  AlertCircle,
  Megaphone,
} from 'lucide-react';

export const SystemConfig: React.FC = () => {
  const { categories, addCategory, announcements, broadcastAnnouncement } = useMarketData();

  // New Category State
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('bg-emerald-50 text-emerald-700 border-emerald-200');

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annAudience, setAnnAudience] = useState<'all' | 'vendors' | 'customers'>('all');
  const [annPriority, setAnnPriority] = useState<'normal' | 'important' | 'urgent'>('important');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName.trim(),
      badgeColor: newCatColor,
      iconName: 'veggies',
    });
    setNewCatName('');
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) return;
    broadcastAnnouncement({
      title: annTitle.trim(),
      message: annMessage.trim(),
      targetAudience: annAudience,
      priority: annPriority,
    });
    setAnnTitle('');
    setAnnMessage('');
  };

  return (
    <div className="space-y-6">
      {/* 2-Column Section: Category Master Data & Announcement Broadcast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Product Categories Master Data */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Tag className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Product Categories Master Data</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Add and classify marketplace tags for vendor listings and search discovery.
            </p>
          </div>

          {/* Existing Categories List */}
          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-bold text-slate-800">{cat.name}</span>
                </div>
                <span className="text-slate-400 font-medium">
                  {cat.itemCount > 0 ? `${cat.itemCount} items listed` : 'New tag'}
                </span>
              </div>
            ))}
          </div>

          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} className="pt-3 border-t border-slate-100 space-y-3">
            <h4 className="font-bold text-slate-800 text-xs">Add New Category Tag</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Microgreens & Sprouts"
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!newCatName.trim()}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Platform Announcement Broadcaster */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Megaphone className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Broadcast Platform Announcement</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Dispatch push notifications and header alerts to farmers, shoppers, or all participants.
            </p>
          </div>

          {/* Broadcast Form */}
          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Announcement Title *</label>
              <input
                type="text"
                required
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                placeholder="e.g. Extended Stall Hours for Weekend Harvest Market"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
                <select
                  value={annAudience}
                  onChange={(e) => setAnnAudience(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="all">All Users (Vendors & Customers)</option>
                  <option value="vendors">Vendors / Farmers Only</option>
                  <option value="customers">Customers / Shoppers Only</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Priority Level</label>
                <select
                  value={annPriority}
                  onChange={(e) => setAnnPriority(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="normal">Normal Information</option>
                  <option value="important">Important Notice</option>
                  <option value="urgent">Urgent Alert (Weather / Schedule)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Announcement Body *</label>
              <textarea
                required
                rows={3}
                value={annMessage}
                onChange={(e) => setAnnMessage(e.target.value)}
                placeholder="Provide detailed instructions regarding cutoffs, parking, or stall procedures..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Will be dispatched across notification drawers immediately.
              </span>
              <button
                type="submit"
                disabled={!annTitle.trim() || !annMessage.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Announcement</span>
              </button>
            </div>
          </form>

          {/* Active Broadcasts History */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="font-bold text-slate-800 text-xs">Recent Platform Broadcasts</h4>
            <div className="space-y-2">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{ann.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        ann.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : ann.priority === 'important'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {ann.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{ann.message}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Audience: <strong className="text-slate-600 capitalize">{ann.targetAudience}</strong></span>
                    <span>{ann.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
