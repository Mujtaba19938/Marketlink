import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { MockMap } from '../common/MockMap';
import {
  Store,
  Save,
  MapPin,
  Calendar,
  Clock,
  Phone,
  User,
  Mail,
  CheckCircle2,
  Compass,
} from 'lucide-react';

export const StallProfileSettings: React.FC = () => {
  const { stallSettings, updateStallSettings } = useMarketData();

  const [formData, setFormData] = useState({
    stallName: stallSettings.stallName,
    contactPerson: stallSettings.contactPerson,
    phone: stallSettings.phone,
    email: stallSettings.email,
    locationName: stallSettings.locationName,
    marketName: stallSettings.marketName,
    lat: stallSettings.lat,
    lng: stallSettings.lng,
    operationalDays: [...stallSettings.operationalDays],
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleToggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      operationalDays: prev.operationalDays.includes(day)
        ? prev.operationalDays.filter((d) => d !== day)
        : [...prev.operationalDays, day],
    }));
  };

  const handleCoordinatesChange = (newLat: number, newLng: number) => {
    setFormData((prev) => ({ ...prev, lat: newLat, lng: newLng }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStallSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Stall Profile & GPS Map Location</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Update your public stall booth details and calibrate the GPS marker for customer order pickup guidance.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{savedSuccess ? 'Profile Saved!' : 'Save Stall Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Form Fields: Contact & Stall Identity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Stall Name & Number *</label>
            <input
              type="text"
              required
              value={formData.stallName}
              onChange={(e) => setFormData({ ...formData, stallName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Contact Person *</label>
            <input
              type="text"
              required
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Contact Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Operational Days Selector */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
          <label className="block font-bold text-slate-800">Operational Days at Pavilion</label>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => {
              const isSelected = formData.operationalDays.includes(day);
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => handleToggleDay(day)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Embedded Map Picker & Coordinates Section */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Embedded Stall Map Picker (Google Maps & OpenStreetMap Mock)
              </h4>
              <p className="text-slate-500 text-[11px]">
                Click anywhere directly on the map surface below to set the precise GPS pin location of your booth.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-xl text-[11px] font-mono font-bold self-start sm:self-auto">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>Lat: {formData.lat.toFixed(4)}, Lng: {formData.lng.toFixed(4)}</span>
            </div>
          </div>

          {/* Interactive Map Component */}
          <MockMap
            lat={formData.lat}
            lng={formData.lng}
            onCoordinatesChange={handleCoordinatesChange}
            isInteractivePicker={true}
            stallName={formData.stallName}
            stallNumber="Stall #14"
            marketName={formData.marketName}
            address={formData.locationName}
            height="h-80"
          />

          {/* Coordinate Inputs Manual Override */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Stall Pavilion Aisle / Area</label>
              <input
                type="text"
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">GPS Latitude Coordinate</label>
              <input
                type="number"
                step="any"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">GPS Longitude Coordinate</label>
              <input
                type="number"
                step="any"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
