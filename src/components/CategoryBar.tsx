import React, { useState } from 'react';
import { Filter, Check } from 'lucide-react';
import { CategoryItem } from '../types/market';
import { CategoryIcon } from './ProduceArt';

interface CategoryBarProps {
  categories: CategoryItem[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  onSortByStock?: (asc: boolean) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onSortByStock,
}) => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [sortOrder, setSortOrder] = useState<'default' | 'high-to-low' | 'low-to-high'>('default');

  const handleSort = (order: 'default' | 'high-to-low' | 'low-to-high') => {
    setSortOrder(order);
    setShowFilterMenu(false);
    if (onSortByStock) {
      if (order === 'high-to-low') onSortByStock(false);
      else if (order === 'low-to-high') onSortByStock(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-slate-800">
          Categories and Stock
        </h3>

        <div className="relative">
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-500/40 hover:border-emerald-600 text-[#22c55e] text-xs font-semibold rounded-lg shadow-2xs transition-all hover:bg-emerald-50/50"
          >
            <Filter className="w-3.5 h-3.5 text-[#22c55e]" />
            <span>Filter</span>
          </button>

          {showFilterMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-40 animate-in fade-in duration-100">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Filter Stock
              </div>
              <button
                onClick={() => handleSort('default')}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left"
              >
                <span>Default order</span>
                {sortOrder === 'default' && <Check className="w-3.5 h-3.5 text-[#22c55e]" />}
              </button>
              <button
                onClick={() => handleSort('high-to-low')}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left"
              >
                <span>Highest Stock</span>
                {sortOrder === 'high-to-low' && <Check className="w-3.5 h-3.5 text-[#22c55e]" />}
              </button>
              <button
                onClick={() => handleSort('low-to-high')}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left"
              >
                <span>Lowest Stock</span>
                {sortOrder === 'low-to-high' && <Check className="w-3.5 h-3.5 text-[#22c55e]" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Cards Horizontal Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl transition-all duration-150 text-center ${
                isSelected
                  ? 'bg-[#22c55e] text-white shadow-md shadow-emerald-500/20 scale-[1.02]'
                  : 'bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-xs shadow-2xs text-slate-700'
              }`}
            >
              {/* Category Icon */}
              <div className="mb-2.5 flex items-center justify-center h-8">
                <CategoryIcon type={cat.icon} active={isSelected} />
              </div>

              {/* Stock count */}
              <div
                className={`text-[12px] font-medium leading-tight ${
                  isSelected ? 'text-white/90' : 'text-slate-800'
                }`}
              >
                {cat.stock}
              </div>

              {/* Category Name */}
              <div
                className={`text-[11px] font-semibold mt-0.5 leading-tight ${
                  isSelected ? 'text-white' : 'text-slate-400'
                }`}
              >
                {cat.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
