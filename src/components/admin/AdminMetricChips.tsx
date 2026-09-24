import React from 'react';
import {
  Tractor,
  Users,
  Store,
  ShoppingBag,
  DollarSign,
} from 'lucide-react';

export interface AdminMetricChipItem {
  id: string;
  name: string;
  stock: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface AdminMetricChipsProps {
  farmersCount: number;
  customersCount: number;
  marketsCount: number;
  selectedMetricTab: string;
  onSelectMetric: (chipId: string) => void;
}

export const AdminMetricChips: React.FC<AdminMetricChipsProps> = ({
  farmersCount,
  customersCount,
  marketsCount,
  selectedMetricTab,
  onSelectMetric,
}) => {
  const adminMetricChips: AdminMetricChipItem[] = [
    {
      id: 'farmers',
      name: 'Farmers',
      stock: `${farmersCount} active`,
      count: farmersCount,
      icon: Tractor,
    },
    {
      id: 'customers',
      name: 'Customers',
      stock: `${customersCount} users`,
      count: customersCount,
      icon: Users,
    },
    {
      id: 'markets',
      name: 'Markets',
      stock: `${marketsCount} active`,
      count: marketsCount,
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
              onClick={() => onSelectMetric(chip.id)}
              className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl transition-all duration-150 text-center cursor-pointer ${
                isSelected
                  ? 'bg-[#22c55e] text-white shadow-md shadow-emerald-500/20 scale-[1.02]'
                  : 'bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-xs shadow-2xs text-slate-700'
              }`}
            >
              <div className="mb-2.5 flex items-center justify-center h-8">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-[#22c55e]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div
                className={`text-[12px] font-bold leading-tight ${
                  isSelected ? 'text-white' : 'text-slate-800'
                }`}
              >
                {chip.stock}
              </div>

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
  );
};
