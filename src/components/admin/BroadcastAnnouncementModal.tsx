import React, { useState } from 'react';
import { Modal } from '../common/Modal';

interface BroadcastAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcast: (data: {
    title: string;
    message: string;
    targetAudience: 'all' | 'vendors' | 'customers';
  }) => void;
}

export const BroadcastAnnouncementModal: React.FC<BroadcastAnnouncementModalProps> = ({
  isOpen,
  onClose,
  onBroadcast,
}) => {
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastAudience, setBroadcastAudience] = useState<'all' | 'vendors' | 'customers'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    onBroadcast({
      title: broadcastTitle.trim(),
      message: broadcastMessage.trim(),
      targetAudience: broadcastAudience,
    });
    setBroadcastTitle('');
    setBroadcastMessage('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Broadcast Platform Announcement"
      subtitle="Send push announcements across all market stalls and customer devices"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
            onClick={onClose}
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
  );
};
