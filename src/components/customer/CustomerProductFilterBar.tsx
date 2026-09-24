import React from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { Search, Filter, DollarSign, Store, Calendar, ArrowUpDown, X } from 'lucide-react';

interface CustomerProductFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedMarket: string;
  onMarketChange: (marketId: string) => void;
  selectedDay: string;
  onDayChange: (day: string) => void;
  maxPrice: number;
  onPriceChange: (price: number) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onReset: () => void;
}

export const CustomerProductFilterBar: React.FC<CustomerProductFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedMarket,
  onMarketChange,
  selectedDay,
  onDayChange,
  maxPrice,
  onPriceChange,
  sortBy,
  onSortChange,
  onReset,
}) => {
  const { markets } = useMarketData();

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'veggies', name: 'Vegetables' },
    { id: 'fruits', name: 'Fruits' },
    { id: 'tubers', name: 'Tubers & Roots' },
    { id: 'dairy', name: 'Dairy & Eggs' },
    { id: 'baked', name: 'Baked Goods' },
    { id: 'meat', name: 'Poultry & Meat' },
  ];

  const days = ['all', 'Wednesday', 'Friday', 'Saturday', 'Sunday'];

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'all' ||
    selectedMarket !== 'all' ||
    selectedDay !== 'all' ||
    maxPrice < 25;

  return (
    <div className="bg-[var(--color-surface-card)] rounded-3xl p-5 border border-[var(--color-border)] shadow-xs space-y-4">
      {/* Top Filter Row: Search & Category Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search produce items by name or organic keyword..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-main)] focus:outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Clear Filters Button if any active */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 text-rose-600 hover:bg-rose-500/15 border border-rose-500/20 text-xs font-bold rounded-xl transition cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Category Horizontal Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onCategoryChange(c.id)}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer shrink-0 ${
              selectedCategory === c.id
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-[var(--color-surface-muted)] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Advanced SRS Dropdown Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-[var(--color-border)] text-xs">
        {/* Market Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
            <Store className="w-3.5 h-3.5 text-slate-400" />
            <span>Market Location</span>
          </label>
          <select
            value={selectedMarket}
            onChange={(e) => onMarketChange(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs font-medium text-[var(--color-text-main)] focus:outline-none"
          >
            <option value="all">All Regional Markets</option>
            {markets.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Market Day Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Operating Day</span>
          </label>
          <select
            value={selectedDay}
            onChange={(e) => onDayChange(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs font-medium text-[var(--color-text-main)] focus:outline-none"
          >
            <option value="all">Any Market Day</option>
            {days.filter(d => d !== 'all').map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Max Price Range Filter */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              <span>Max Price:</span>
            </span>
            <span className="text-[var(--color-primary)] font-bold">${maxPrice.toFixed(2)} / kg</span>
          </div>
          <input
            type="range"
            min="2"
            max="25"
            step="0.5"
            value={maxPrice}
            onChange={(e) => onPriceChange(parseFloat(e.target.value))}
            className="w-full accent-[var(--color-primary)] cursor-pointer"
          />
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort Order</span>
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs font-medium text-[var(--color-text-main)] focus:outline-none"
          >
            <option value="popular">Most Popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="stock">Highest Stock</option>
          </select>
        </div>
      </div>
    </div>
  );
};
