import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { MarketRecord } from '../../types/admin';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { MockMap } from '../common/MockMap';
import {
  Store,
  Plus,
  MapPin,
  Clock,
  Calendar,
  Edit2,
  Trash2,
  Compass,
  ExternalLink,
  Users,
} from 'lucide-react';

export const MarketManagement: React.FC = () => {
  const { markets, addMarket, updateMarket, deleteMarket } = useMarketData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMarket, setEditingMarket] = useState<MarketRecord | null>(null);
  const [previewMarket, setPreviewMarket] = useState<MarketRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    operatingDays: ['Saturday', 'Sunday'],
    timings: '08:00 AM - 02:00 PM',
    lat: 37.7749,
    lng: -122.4194,
    status: 'open' as 'open' | 'closed' | 'seasonal',
  });

  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      address: '',
      operatingDays: ['Saturday', 'Sunday'],
      timings: '08:00 AM - 02:00 PM',
      lat: 37.7749,
      lng: -122.4194,
      status: 'open',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (m: MarketRecord) => {
    setEditingMarket(m);
    setFormData({
      name: m.name,
      address: m.address,
      operatingDays: [...m.operatingDays],
      timings: m.timings,
      lat: m.lat,
      lng: m.lng,
      status: m.status,
    });
  };

  const handleToggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      operatingDays: prev.operatingDays.includes(day)
        ? prev.operatingDays.filter((d) => d !== day)
        : [...prev.operatingDays, day],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) return;

    if (editingMarket) {
      updateMarket(editingMarket.id, formData);
      setEditingMarket(null);
    } else {
      addMarket(formData);
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Market Locations & Pavilions</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Maintain authorized regional farmers market locations, operating schedules, and GPS coordinates.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Market</span>
        </button>
      </div>

      {/* Markets Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 text-[11px] uppercase tracking-wider">
              <th className="pb-3 font-semibold">Market Name</th>
              <th className="pb-3 font-semibold">Address & GPS</th>
              <th className="pb-3 font-semibold">Operating Days</th>
              <th className="pb-3 font-semibold">Operating Hours</th>
              <th className="pb-3 font-semibold text-center">Active Stalls</th>
              <th className="pb-3 font-semibold text-center">Status</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {markets.map((market) => (
              <tr key={market.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-4 pr-3">
                  <div className="font-bold text-slate-900 text-sm">{market.name}</div>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {market.id}</span>
                </td>

                <td className="py-4 px-2 text-slate-600 max-w-[200px]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 truncate text-xs">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{market.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="font-mono">{market.lat.toFixed(4)}, {market.lng.toFixed(4)}</span>
                      <button
                        onClick={() => setPreviewMarket(market)}
                        className="text-emerald-600 hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                      >
                        <Compass className="w-3 h-3" /> Map View
                      </button>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-2">
                  <div className="flex flex-wrap gap-1 max-w-[150px]">
                    {market.operatingDays.map((d, i) => (
                      <span key={i} className="bg-amber-50 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-medium border border-amber-200/50">
                        {d.substring(0, 3)}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="py-4 px-2 text-slate-700 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{market.timings}</span>
                  </div>
                </td>

                <td className="py-4 px-2 text-center">
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold text-xs">
                    <Users className="w-3 h-3 text-slate-500" />
                    {market.activeVendorsCount} stalls
                  </span>
                </td>

                <td className="py-4 px-2 text-center">
                  {market.status === 'open' && <Badge variant="success">Open</Badge>}
                  {market.status === 'closed' && <Badge variant="error">Closed</Badge>}
                  {market.status === 'seasonal' && <Badge variant="warning">Seasonal</Badge>}
                </td>

                <td className="py-4 pl-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(market)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit Market"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMarket(market.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Market"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Market Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingMarket}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingMarket(null);
        }}
        title={editingMarket ? `Edit ${editingMarket.name}` : 'Add New Market Location'}
        subtitle="Specify official pavilion address, operating schedule, and pin GPS coordinates"
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Market Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Marina Green Farmers Market"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="open">Open (Active Weekly)</option>
                <option value="seasonal">Seasonal</option>
                <option value="closed">Temporarily Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Street Address *</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. 120 Marina Blvd, Gate 4"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Operating Hours</label>
              <input
                type="text"
                value={formData.timings}
                onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
                placeholder="e.g. 08:00 AM - 01:30 PM"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Operating Days</label>
              <div className="flex flex-wrap gap-1">
                {allDays.map((day) => {
                  const isChecked = formData.operatingDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => handleToggleDay(day)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {day.substring(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Map Picker */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Geographic Coordinates & Pin Location (Click map to position)
            </label>
            <MockMap
              lat={formData.lat}
              lng={formData.lng}
              marketName={formData.name || 'New Market'}
              address={formData.address || 'Click map to place pin'}
              isInteractivePicker={true}
              onCoordinatesChange={(lat, lng) => setFormData((prev) => ({ ...prev, lat, lng }))}
              height="h-56"
            />
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <span className="text-[10px] text-slate-400">Latitude</span>
                <input
                  type="number"
                  step="any"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Longitude</span>
                <input
                  type="number"
                  step="any"
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingMarket(null);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-sm"
            >
              {editingMarket ? 'Save Changes' : 'Create Market Location'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Map Preview Modal */}
      {previewMarket && (
        <Modal
          isOpen={!!previewMarket}
          onClose={() => setPreviewMarket(null)}
          title={previewMarket.name}
          subtitle={previewMarket.address}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <MockMap
              lat={previewMarket.lat}
              lng={previewMarket.lng}
              marketName={previewMarket.name}
              address={previewMarket.address}
              stallName="Central Information Kiosk"
              stallNumber="Main Hub"
              height="h-72"
            />
            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-500">
                Operating Days: <span className="font-bold text-slate-800">{previewMarket.operatingDays.join(', ')}</span>
              </span>
              <button
                onClick={() => setPreviewMarket(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
