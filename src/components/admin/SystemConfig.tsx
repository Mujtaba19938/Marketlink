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
  Palette,
  Trash2,
  Mail,
  Eye,
  EyeOff,
} from 'lucide-react';
import { ThemeColorSelector } from '../common/ThemeColorSelector';


export const SystemConfig: React.FC = () => {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    announcements,
    broadcastAnnouncement,
    toggleAnnouncement,
    contactMessages,
    markContactRead,
  } = useMarketData();
  const [sending, setSending] = useState(false);

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

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) return;
    setSending(true);
    await broadcastAnnouncement({
      title: annTitle.trim(),
      message: annMessage.trim(),
      targetAudience: annAudience,
      priority: annPriority,
    });
    setSending(false);
    setAnnTitle('');
    setAnnMessage('');
  };

  const handleDeleteCategory = (id: string, name: string, count: number) => {
    if (count > 0) {
      if (window.confirm(`"${name}" is used by ${count} product(s) and cannot be deleted. Deactivate it instead? It will be hidden from new listings.`)) {
        updateCategory(id, { isActive: false });
      }
      return;
    }
    if (window.confirm(`Delete category "${name}"?`)) deleteCategory(id);
  };

  return (
    <div className="space-y-6">
      {/* 1. Marketplace Theme & Color Selector Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Marketplace Theme & Color Customization</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select your color palette (Artisan Brown, Emerald, Amber, Teal, Berry, Slate) and display mode (Light / Dark).
            </p>
          </div>
        </div>

        <ThemeColorSelector />
      </div>

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
                className={`flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors text-xs group ${
                  cat.isActive === false ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${cat.isActive === false ? 'bg-slate-300' : 'bg-emerald-500'}`} />
                  <span className="font-bold text-slate-800">{cat.name}</span>
                  {cat.isActive === false && <span className="text-[10px] text-slate-400">(inactive)</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">
                    {cat.itemCount > 0 ? `${cat.itemCount} products` : 'No products'}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCategory(cat.id, { isActive: cat.isActive === false })}
                    title={cat.isActive === false ? 'Activate' : 'Deactivate'}
                    className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    {cat.isActive === false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id, cat.name, cat.itemCount)}
                    title={`Delete category ${cat.name}`}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
                Saved and sent as an in-app notification to every matching user.
              </span>
              <button
                type="submit"
                disabled={sending || !annTitle.trim() || !annMessage.trim()}
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
              {announcements.length === 0 && <p className="text-xs text-slate-400">Nothing broadcast yet.</p>}
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 text-xs space-y-1 ${ann.active ? '' : 'opacity-60'}`}
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
                    <span className="flex items-center gap-2">
                      {ann.createdAt}
                      <button
                        type="button"
                        onClick={() => toggleAnnouncement(ann.id)}
                        className="font-bold text-indigo-600 hover:underline cursor-pointer"
                      >
                        {ann.active ? 'Hide banner' : 'Show banner'}
                      </button>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Us inbox */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Contact Inbox</h3>
            <p className="text-xs text-slate-500">Messages sent through the Contact Us forms.</p>
          </div>
          <span className="ml-auto text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full">
            {contactMessages.filter((m) => !m.isRead).length} unread
          </span>
        </div>
        <div className="space-y-2 text-xs">
          {contactMessages.length === 0 && <p className="text-slate-400">No messages yet.</p>}
          {contactMessages.map((m) => (
            <div key={m.id} className={`p-3 rounded-2xl border ${m.isRead ? 'border-slate-100 bg-white' : 'border-sky-200 bg-sky-50/50'}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="font-bold text-slate-800">
                  {m.name} <span className="font-normal text-slate-500">&lt;{m.email}&gt;</span>
                  {m.phone && <span className="font-normal text-slate-400"> • {m.phone}</span>}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  {m.createdAt}
                  {!m.isRead && (
                    <button type="button" onClick={() => markContactRead(m.id)} className="font-bold text-sky-700 hover:underline cursor-pointer">
                      Mark read
                    </button>
                  )}
                </div>
              </div>
              {m.subject && <div className="text-[11px] text-slate-500 capitalize">{m.subject.replace(/_/g, ' ')}</div>}
              <p className="text-slate-700 mt-1 whitespace-pre-line">{m.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
