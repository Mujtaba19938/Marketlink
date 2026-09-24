import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { Badge } from '../common/Badge';
import { Users, Search, Power, ShoppingBag, DollarSign, Mail, Phone, MapPin } from 'lucide-react';

export const CustomerManagement: React.FC = () => {
  const { customers, toggleCustomerStatus } = useMarketData();
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = customers.filter((c) => c.status === 'active').length;
  const deactivatedCount = customers.length - activeCount;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Customer Management</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track customer order history, spend profiles, and toggle account activation status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer name, email, phone..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 w-56 sm:w-64"
            />
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200">
              {activeCount} Active
            </span>
            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200">
              {deactivatedCount} Deactivated
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 text-[11px] uppercase tracking-wider">
              <th className="pb-3 font-semibold">Customer</th>
              <th className="pb-3 font-semibold">Contact & Address</th>
              <th className="pb-3 font-semibold text-center">Orders Placed</th>
              <th className="pb-3 font-semibold text-center">Total Spend</th>
              <th className="pb-3 font-semibold text-center">Last Active</th>
              <th className="pb-3 font-semibold text-center">Status</th>
              <th className="pb-3 font-semibold text-right">Account Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCustomers.map((cust) => (
              <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-4 pr-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                      {cust.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{cust.name}</div>
                      <div className="text-[10px] text-slate-400">Joined {cust.joinDate}</div>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-2 text-slate-600">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{cust.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[180px]">{cust.address}</span>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-2 text-center font-bold text-slate-800">
                  {cust.totalOrders}
                </td>

                <td className="py-4 px-2 text-center font-bold text-emerald-600">
                  ${cust.totalSpent.toFixed(2)}
                </td>

                <td className="py-4 px-2 text-center text-slate-500 text-[11px]">
                  {cust.lastOrderDate}
                </td>

                <td className="py-4 px-2 text-center">
                  {cust.status === 'active' ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="error">Deactivated</Badge>
                  )}
                </td>

                <td className="py-4 pl-3 text-right">
                  <button
                    onClick={() => toggleCustomerStatus(cust.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all cursor-pointer shadow-2xs ${
                      cust.status === 'active'
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{cust.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
