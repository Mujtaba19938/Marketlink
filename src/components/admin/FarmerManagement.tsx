import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { FarmerRecord } from '../../types/admin';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Tractor,
  Search,
  CheckCircle,
  Ban,
  Eye,
  Phone,
  Mail,
  MapPin,
  Star,
  Award,
  Layers,
  ShoppingBag,
  DollarSign,
} from 'lucide-react';

export const FarmerManagement: React.FC = () => {
  const { farmers, approveFarmer, suspendFarmer } = useMarketData();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending' | 'suspended'>('all');
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerRecord | null>(null);

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.name.toLowerCase().includes(search.toLowerCase()) ||
      farmer.farmName.toLowerCase().includes(search.toLowerCase()) ||
      farmer.location.toLowerCase().includes(search.toLowerCase()) ||
      farmer.categories.some((c) => c.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || farmer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Tractor className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Farmer & Vendor Management</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review registration applications, inspect credentials, and manage stall vendor account privileges.
          </p>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search farm, name, category..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-48 sm:w-60"
            />
          </div>

          <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
            {(['all', 'approved', 'pending', 'suspended'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                  filterStatus === status ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Farmers List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 text-[11px] uppercase tracking-wider">
              <th className="pb-3 font-semibold">Farm & Producer</th>
              <th className="pb-3 font-semibold">Stall Location</th>
              <th className="pb-3 font-semibold">Categories</th>
              <th className="pb-3 font-semibold text-center">Orders & GMV</th>
              <th className="pb-3 font-semibold text-center">Status</th>
              <th className="pb-3 font-semibold text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredFarmers.map((farmer) => (
              <tr key={farmer.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-4 pr-3">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{farmer.farmName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span>{farmer.name}</span>
                      <span>•</span>
                      <span>{farmer.phone}</span>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-2 text-slate-600 max-w-[200px]">
                  <div className="flex items-center gap-1 truncate text-xs">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{farmer.location}</span>
                  </div>
                </td>

                <td className="py-4 px-2">
                  <div className="flex flex-wrap gap-1 max-w-[160px]">
                    {farmer.categories.map((cat, i) => (
                      <span key={i} className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded font-medium">
                        {cat}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="py-4 px-2 text-center">
                  <div className="font-bold text-slate-800">{farmer.totalOrders} orders</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">${farmer.revenue.toLocaleString()}</div>
                </td>

                <td className="py-4 px-2 text-center">
                  {farmer.status === 'approved' && <Badge variant="success">Approved</Badge>}
                  {farmer.status === 'pending' && <Badge variant="warning">Pending Review</Badge>}
                  {farmer.status === 'suspended' && <Badge variant="error">Suspended</Badge>}
                </td>

                <td className="py-4 pl-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View Details */}
                    <button
                      onClick={() => setSelectedFarmer(farmer)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="View Farm Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Approve Registration */}
                    {farmer.status === 'pending' && (
                      <button
                        onClick={() => approveFarmer(farmer.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[11px] shadow-xs transition-colors cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {/* Suspend / Reactivate */}
                    {farmer.status !== 'pending' && (
                      <button
                        onClick={() => suspendFarmer(farmer.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                          farmer.status === 'suspended'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        }`}
                      >
                        {farmer.status === 'suspended' ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Reactivate</span>
                          </>
                        ) : (
                          <>
                            <Ban className="w-3.5 h-3.5" />
                            <span>Suspend</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Farmer Details Modal */}
      {selectedFarmer && (
        <Modal
          isOpen={!!selectedFarmer}
          onClose={() => setSelectedFarmer(null)}
          title={selectedFarmer.farmName}
          subtitle={`Registered by ${selectedFarmer.name} • Joined ${selectedFarmer.joinDate}`}
          maxWidth="lg"
        >
          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 block text-[10px]">Stall Rating</span>
                <span className="font-bold text-slate-800 text-sm flex items-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  {selectedFarmer.rating ? selectedFarmer.rating.toFixed(1) : 'New'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Total Orders</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedFarmer.totalOrders}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Platform GMV</span>
                <span className="font-bold text-emerald-600 text-sm mt-0.5 block">${selectedFarmer.revenue.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Catalog Size</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedFarmer.productCount} SKUs</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">Contact & Credentials</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span className="truncate">{selectedFarmer.email}</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>{selectedFarmer.phone}</span>
                </div>
                <div className="sm:col-span-2 flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{selectedFarmer.location}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-2">Produce Categories</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedFarmer.categories.map((c, i) => (
                  <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-semibold border border-emerald-200/80">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">
                Status: <span className="font-bold text-slate-700 capitalize">{selectedFarmer.status}</span>
              </span>
              <div className="flex items-center gap-2">
                {selectedFarmer.status === 'pending' ? (
                  <button
                    onClick={() => {
                      approveFarmer(selectedFarmer.id);
                      setSelectedFarmer(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    Approve Application
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      suspendFarmer(selectedFarmer.id);
                      setSelectedFarmer(null);
                    }}
                    className={`px-4 py-2 rounded-xl font-bold cursor-pointer transition-colors shadow-xs ${
                      selectedFarmer.status === 'suspended'
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-rose-600 hover:bg-rose-700 text-white'
                    }`}
                  >
                    {selectedFarmer.status === 'suspended' ? 'Re-activate Account' : 'Suspend Account'}
                  </button>
                )}
                <button
                  onClick={() => setSelectedFarmer(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
