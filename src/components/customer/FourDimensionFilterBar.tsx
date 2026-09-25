import React from 'react';
import { Search, UserCheck, DollarSign, MapPin, Tag, X, RotateCcw, Filter } from 'lucide-react';

export interface FourDimensionFilters {
  searchQuery: string;
  farmer: string; // 'all' or farmer name / id
  category: string; // 'all' or category id
  area: string; // 'all' or area name
  minPrice: number;
  maxPrice: number;
}

interface FourDimensionFilterBarProps {
  filters: FourDimensionFilters;
  onChange: (filters: FourDimensionFilters) => void;
  onReset: () => void;
  totalResultsCount: number;
  availableFarmers?: string[];
  availableAreas?: string[];
  availableCategories?: { id: string; name: string }[];
}

export const FourDimensionFilterBar: React.FC<FourDimensionFilterBarProps> = ({
  filters,
  onChange,
  onReset,
  totalResultsCount,
  availableFarmers = [
    'Marcus Vance',
    'Silvia Morales',
    'David Chen',
    'Thomas Keller',
    'Elena Rostov',
  ],
  availableAreas = [
    'Downtown Metro',
    'Sunset District',
    'Bayview Coast',
    'North Valley',
    'Oakwood Hills',
  ],
  availableCategories = [
    { id: 'all', name: 'All Categories' },
    { id: 'veggies', name: 'Vegetables' },
    { id: 'tubers', name: 'Tubers & Roots' },
    { id: 'fruits', name: 'Fruits & Apiary' },
    { id: 'dairy', name: 'Dairy & Artisan' },
    { id: 'fish', name: 'Fish & Seafood' },
    { id: 'meat', name: 'Poultry & Meat' },
  ],
}) => {
  const isFiltered =
    Boolean(filters.searchQuery) ||
    filters.farmer !== 'all' ||
    filters.category !== 'all' ||
    filters.area !== 'all' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 25;

  const handleUpdate = (updates: Partial<FourDimensionFilters>) => {
    onChange({ ...filters, ...updates });
  };

  return (
    <div className="bg-[#0e241b] rounded-[28px] p-5 sm:p-6 border border-emerald-900/70 shadow-xl space-y-4 text-white">
      {/* Header and Live Search Keyword */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-emerald-400/80 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => handleUpdate({ searchQuery: e.target.value })}
            placeholder="Search produce by name, keyword, or farm..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#132c20] border border-emerald-800/80 rounded-2xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#def54d]/30 focus:border-[#def54d] transition shadow-inner"
          />
        </div>

        {/* Counter Badge & Reset */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3.5 py-1.5 rounded-2xl bg-[#132c20] text-[#def54d] border border-emerald-800/80 text-xs font-black font-['Outfit',sans-serif] shadow-xs">
            {totalResultsCount} {totalResultsCount === 1 ? 'Produce Item' : 'Produce Items'} Found
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold rounded-2xl transition cursor-pointer active:scale-95"
              title="Reset all 4 dimensions"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Dimension Control Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-3.5 border-t border-emerald-900/60 text-xs">
        {/* Dimension 1: Farmer-wise Filter */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 font-['Outfit',sans-serif]">
            <UserCheck className="w-3.5 h-3.5 text-[#def54d]" />
            <span>1. Farmer-Wise</span>
          </label>
          <select
            value={filters.farmer}
            onChange={(e) => handleUpdate({ farmer: e.target.value })}
            className="w-full px-3 py-2 bg-[#132c20] border border-emerald-800/80 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#def54d]/30 focus:border-[#def54d] cursor-pointer"
          >
            <option value="all" className="bg-[#0b1a13] text-white">All Stall Farmers</option>
            {availableFarmers.map((farmer) => (
              <option key={farmer} value={farmer} className="bg-[#0b1a13] text-white">
                👨‍🌾 {farmer}
              </option>
            ))}
          </select>
        </div>

        {/* Dimension 2: Price-Wise Filter (Min - Max Range) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 font-['Outfit',sans-serif]">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#def54d]" />
              <span>2. Price Range</span>
            </span>
            <span className="text-[#def54d] font-black font-['Outfit',sans-serif]">
              ${filters.minPrice.toFixed(0)} – ${filters.maxPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={filters.maxPrice}
              onChange={(e) => handleUpdate({ maxPrice: parseFloat(e.target.value) })}
              className="w-full accent-[#def54d] cursor-pointer"
            />
          </div>
        </div>

        {/* Dimension 3: Category-Wise Filter */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 font-['Outfit',sans-serif]">
            <Tag className="w-3.5 h-3.5 text-[#def54d]" />
            <span>3. Category-Wise</span>
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleUpdate({ category: e.target.value })}
            className="w-full px-3 py-2 bg-[#132c20] border border-emerald-800/80 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#def54d]/30 focus:border-[#def54d] cursor-pointer capitalize"
          >
            {availableCategories.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#0b1a13] text-white">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dimension 4: Area-Wise Filter */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 font-['Outfit',sans-serif]">
            <MapPin className="w-3.5 h-3.5 text-[#def54d]" />
            <span>4. Area / Region-Wise</span>
          </label>
          <select
            value={filters.area}
            onChange={(e) => handleUpdate({ area: e.target.value })}
            className="w-full px-3 py-2 bg-[#132c20] border border-emerald-800/80 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#def54d]/30 focus:border-[#def54d] cursor-pointer"
          >
            <option value="all" className="bg-[#0b1a13] text-white">All Regional Areas</option>
            {availableAreas.map((area) => (
              <option key={area} value={area} className="bg-[#0b1a13] text-white">
                📍 {area}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filter Chips with Individual Dismissal */}
      {isFiltered && (
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
          <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1 font-['Outfit',sans-serif]">
            <Filter className="w-3 h-3 text-[#def54d]" /> Active Dimensions:
          </span>

          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#132c20] text-slate-200 text-[11px] font-medium border border-emerald-800/70">
              Keyword: &quot;{filters.searchQuery}&quot;
              <button
                type="button"
                onClick={() => handleUpdate({ searchQuery: '' })}
                className="hover:text-[#def54d] cursor-pointer ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.farmer !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#132c20] text-[#def54d] text-[11px] font-bold border border-emerald-800/70">
              Farmer: {filters.farmer}
              <button
                type="button"
                onClick={() => handleUpdate({ farmer: 'all' })}
                className="hover:text-white cursor-pointer ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#132c20] text-slate-200 text-[11px] font-medium border border-emerald-800/70 capitalize">
              Category: {filters.category}
              <button
                type="button"
                onClick={() => handleUpdate({ category: 'all' })}
                className="hover:text-[#def54d] cursor-pointer ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.area !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#132c20] text-slate-200 text-[11px] font-medium border border-emerald-800/70">
              Area: {filters.area}
              <button
                type="button"
                onClick={() => handleUpdate({ area: 'all' })}
                className="hover:text-[#def54d] cursor-pointer ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.maxPrice < 25 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#132c20] text-[#def54d] text-[11px] font-bold border border-emerald-800/70">
              Max Price: ${filters.maxPrice.toFixed(2)}
              <button
                type="button"
                onClick={() => handleUpdate({ maxPrice: 25 })}
                className="hover:text-white cursor-pointer ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
