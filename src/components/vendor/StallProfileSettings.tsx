import React, { useEffect, useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { MockMap } from '../common/MockMap';
import { FarmerAssignment } from '../../types/vendor';
import { DAY_CODES, dayCodeToName } from '../../services/mappers';
import { Store, Save, MapPin, Compass, Palette, Plus, CalendarDays } from 'lucide-react';
import { ThemeColorSelector } from '../common/ThemeColorSelector';

const DayPicker: React.FC<{ value: string[]; allowed?: string[]; onChange: (days: string[]) => void }> = ({ value, allowed, onChange }) => (
  <div className="flex flex-wrap gap-1">
    {DAY_CODES.map((d) => {
      const on = value.includes(d);
      const disabled = allowed ? !allowed.includes(d) : false;
      return (
        <button
          key={d}
          type="button"
          disabled={disabled}
          onClick={() => onChange(on ? value.filter((x) => x !== d) : [...value, d])}
          title={disabled ? 'The market is closed on this day' : dayCodeToName(d)}
          className={`px-2 py-1 rounded-lg text-[10px] font-bold border cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
            on ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          {d}
        </button>
      );
    })}
  </div>
);

/** one editable farmer-market assignment row */
const AssignmentRow: React.FC<{ a: FarmerAssignment; marketDays: string[]; disabled: boolean }> = ({ a, marketDays, disabled }) => {
  const { updateAssignment } = useMarketData();
  const [form, setForm] = useState({
    operatingDays: a.operatingDays,
    pickupStart: a.pickupStart,
    pickupEnd: a.pickupEnd,
    stallNumber: a.stallNumber,
  });
  useEffect(() => {
    setForm({ operatingDays: a.operatingDays, pickupStart: a.pickupStart, pickupEnd: a.pickupEnd, stallNumber: a.stallNumber });
  }, [a]);

  const dirty =
    form.pickupStart !== a.pickupStart ||
    form.pickupEnd !== a.pickupEnd ||
    form.stallNumber !== a.stallNumber ||
    form.operatingDays.join() !== a.operatingDays.join();

  return (
    <div className={`p-4 rounded-2xl border ${a.isActive ? 'border-slate-200 bg-slate-50/60' : 'border-dashed border-slate-300 bg-white opacity-70'} space-y-3`}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="font-bold text-slate-800 text-sm">{a.marketName}</div>
          <div className="text-[11px] text-slate-500">{a.marketAddress}</div>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => updateAssignment(a.id, { isActive: !a.isActive })}
          className={`px-3 py-1 rounded-xl text-[11px] font-bold border cursor-pointer disabled:opacity-40 ${
            a.isActive ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}
        >
          {a.isActive ? 'Stop selling here' : 'Sell here again'}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-3">
          <span className="block text-[11px] font-bold text-slate-600 mb-1">Days you are at this market</span>
          <DayPicker value={form.operatingDays} allowed={marketDays} onChange={(operatingDays) => setForm({ ...form, operatingDays })} />
        </div>
        <div>
          <span className="block text-[11px] font-bold text-slate-600 mb-1">Pickup window</span>
          <div className="flex items-center gap-1">
            <input type="time" value={form.pickupStart} onChange={(e) => setForm({ ...form, pickupStart: e.target.value })} className="px-2 py-1 bg-white border border-slate-200 rounded-lg" />
            <span>-</span>
            <input type="time" value={form.pickupEnd} onChange={(e) => setForm({ ...form, pickupEnd: e.target.value })} className="px-2 py-1 bg-white border border-slate-200 rounded-lg" />
          </div>
        </div>
        <div>
          <span className="block text-[11px] font-bold text-slate-600 mb-1">Stall number</span>
          <input
            type="text"
            value={form.stallNumber}
            onChange={(e) => setForm({ ...form, stallNumber: e.target.value })}
            placeholder="e.g. Stall #14"
            className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            disabled={!dirty || disabled || form.operatingDays.length === 0}
            onClick={() => updateAssignment(a.id, form)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] disabled:opacity-40 cursor-pointer"
          >
            Save schedule
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Farmer profile (SRS: stall name, contact person, contact number, address, map pin, lat/long)
 * and the markets they sell at with operating days and pickup windows.
 */
export const StallProfileSettings: React.FC = () => {
  const { stallSettings, updateStallSettings, assignments, markets, addAssignment } = useMarketData();
  const approved = stallSettings.approvalStatus === 'approved';

  const [formData, setFormData] = useState(stallSettings);
  const [photo, setPhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // refresh the form when the saved profile changes (after save / first load)
  useEffect(() => {
    setFormData(stallSettings);
  }, [stallSettings]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSaving(true);
    const ok = await updateStallSettings(formData, photo);
    setSaving(false);
    if (ok) setPhoto(null);
  };

  // ---- add a market ----
  const available = markets.filter((m) => !assignments.some((a) => a.marketId === m.id));
  const [newA, setNewA] = useState({ marketId: '', operatingDays: [] as string[], pickupStart: '09:00', pickupEnd: '12:00', cutoffHours: 12, stallNumber: '' });
  const newMarket = markets.find((m) => m.id === newA.marketId) || available[0];
  const newMarketDays = (newMarket?.operatingDays || []).map((d) => d.slice(0, 3).toUpperCase());

  const handleAddMarket = async () => {
    if (!newMarket) return;
    const ok = await addAssignment({ ...newA, marketId: newMarket.id, operatingDays: newA.operatingDays.length ? newA.operatingDays : newMarketDays });
    if (ok) setNewA({ marketId: '', operatingDays: [], pickupStart: '09:00', pickupEnd: '12:00', cutoffHours: 12, stallNumber: '' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Stall Profile &amp; Map Location</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">Shown to customers on the farmers directory and stall pages.</p>
          </div>

          <button
            onClick={() => handleSubmit()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer self-start sm:self-auto disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving…' : 'Save Stall Profile'}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Stall / Business Name *</label>
              <input
                type="text"
                required
                value={formData.stallName}
                onChange={(e) => setFormData({ ...formData, stallName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Person *</label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Number *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email (login)</label>
              <input type="email" disabled value={formData.email} className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">About your stall</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What you grow, how you farm..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Stall photo</label>
              {stallSettings.imageUrl && !photo && <img src={stallSettings.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover mb-1 border border-slate-200" />}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                className="w-full text-[11px] file:mr-2 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-bold"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Farm location map pin
                </h4>
                <p className="text-slate-500 text-[11px]">Click on the map to move the pin, or type the coordinates.</p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-xl text-[11px] font-mono font-bold self-start sm:self-auto">
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  Lat: {formData.lat.toFixed(4)}, Lng: {formData.lng.toFixed(4)}
                </span>
              </div>
            </div>

            <MockMap
              lat={formData.lat}
              lng={formData.lng}
              onCoordinatesChange={(lat, lng) => setFormData((prev) => ({ ...prev, lat, lng }))}
              isInteractivePicker={true}
              stallName={formData.stallName}
              stallNumber={formData.city || 'Farm'}
              marketName={formData.marketName || formData.stallName}
              address={formData.locationName}
              height="h-72"
            />

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Markets I sell at */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">My Markets &amp; Operating Days</h3>
            <p className="text-xs text-slate-500">Markets you sell at, which days, your pickup window and stall number. Pickup slots are managed in the Pre-Orders tab.</p>
          </div>
        </div>

        {!approved && <p className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">Markets can be added after an admin approves your stall.</p>}

        <div className="space-y-3">
          {assignments.length === 0 && <p className="text-slate-400">You are not selling at any market yet.</p>}
          {assignments.map((a) => (
            <AssignmentRow
              key={a.id}
              a={a}
              disabled={!approved}
              marketDays={(markets.find((m) => m.id === a.marketId)?.operatingDays || []).map((d) => d.slice(0, 3).toUpperCase())}
            />
          ))}
        </div>

        {approved && available.length > 0 && (
          <div className="p-4 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/40 space-y-3">
            <div className="font-bold text-slate-800">Add a market</div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <select
                value={newMarket?.id}
                onChange={(e) => setNewA({ ...newA, marketId: e.target.value, operatingDays: [] })}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl sm:col-span-2"
              >
                {available.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.operatingDays.map((d) => d.slice(0, 3)).join(', ')})
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newA.stallNumber}
                onChange={(e) => setNewA({ ...newA, stallNumber: e.target.value })}
                placeholder="Stall number"
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl"
              />
              <div className="flex items-center gap-1">
                <input type="number" min="0" value={newA.cutoffHours} onChange={(e) => setNewA({ ...newA, cutoffHours: parseInt(e.target.value) || 0 })} className="w-16 px-2 py-2 bg-white border border-slate-200 rounded-xl" />
                <span className="text-slate-500">h cutoff</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <DayPicker value={newA.operatingDays.length ? newA.operatingDays : newMarketDays} allowed={newMarketDays} onChange={(operatingDays) => setNewA({ ...newA, operatingDays })} />
              <div className="flex items-center gap-1">
                <input type="time" value={newA.pickupStart} onChange={(e) => setNewA({ ...newA, pickupStart: e.target.value })} className="px-2 py-1 bg-white border border-slate-200 rounded-lg" />
                <span>-</span>
                <input type="time" value={newA.pickupEnd} onChange={(e) => setNewA({ ...newA, pickupEnd: e.target.value })} className="px-2 py-1 bg-white border border-slate-200 rounded-lg" />
              </div>
              <button type="button" onClick={handleAddMarket} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Add market
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Dashboard Theme</h4>
            <p className="text-slate-500 text-[11px]">Saved in this browser.</p>
          </div>
        </div>
        <ThemeColorSelector />
      </div>
    </div>
  );
};
