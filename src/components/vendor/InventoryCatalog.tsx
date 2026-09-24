import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { VendorProduct } from '../../types/vendor';
import { ProduceArt } from '../ProduceArt';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const InventoryCatalog: React.FC = () => {
  const {
    vendorProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    stallSettings,
    updateStallSettings,
  } = useMarketData();

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<VendorProduct | null>(null);

  // Weekly recurring stock template toggle
  const [autoResetStock, setAutoResetStock] = useState(stallSettings.autoResetWeeklyStock);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    category: 'Fresh Vegetables',
    price: 3.50,
    unit: 'kg',
    stock: 50,
    weeklyRecurringStock: 50,
    imageType: 'cabbage' as 'cabbage' | 'kale' | 'broccoli' | 'celery' | 'carrot' | 'tomato' | 'pepper' | 'mushroom',
    status: 'in_stock' as 'in_stock' | 'sold_out' | 'temporarily_unavailable',
    description: '',
  });

  const categories = ['Fresh Vegetables', 'Root Tubers & Potatoes', 'Orchard & Berry Fruits', 'Herbs & Microgreens'];
  const units = ['kg', 'head', 'bunch', 'box', 'basket', 'punnet', 'jar'];
  const produceTypes = ['cabbage', 'kale', 'broccoli', 'celery', 'carrot', 'tomato', 'pepper', 'mushroom'] as const;

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      category: 'Fresh Vegetables',
      price: 3.50,
      unit: 'kg',
      stock: 50,
      weeklyRecurringStock: 50,
      imageType: 'cabbage',
      status: 'in_stock',
      description: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (p: VendorProduct) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      price: p.price,
      unit: p.unit,
      stock: p.stock,
      weeklyRecurringStock: p.weeklyRecurringStock || p.stock,
      imageType: (p.imageType as any) || 'cabbage',
      status: p.status,
      description: p.description || '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
      setEditingProduct(null);
    } else {
      addProduct(formData);
      setIsAddModalOpen(false);
    }
  };

  const handleToggleAutoReset = () => {
    const nextVal = !autoResetStock;
    setAutoResetStock(nextVal);
    updateStallSettings({ autoResetWeeklyStock: nextVal });
  };

  const filteredProducts = vendorProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === 'all' || p.category === filterCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Recurring Weekly Stock Template Banner */}
      <div className="bg-emerald-900 text-white rounded-3xl p-5 sm:p-6 border border-emerald-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
              Recurring Weekly Stock Template
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                Auto-Restock Active
              </span>
            </h4>
            <p className="text-xs text-emerald-200/80 mt-0.5 max-w-xl">
              When enabled, your default harvest allocations will automatically reload each Friday at 6:00 PM for weekend pre-orders.
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleAutoReset}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-xs ${
            autoResetStock
              ? 'bg-emerald-500 text-white hover:bg-emerald-400'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {autoResetStock ? '✓ Auto-Reset Enabled' : 'Enable Template'}
        </button>
      </div>

      {/* Main Catalog Table Panel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Inventory & Harvest Catalog</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Add new organic produce, modify pricing per unit, and toggle immediate stock availability.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search catalog items..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-48 sm:w-56"
              />
            </div>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Produce Item</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Price / Unit</th>
                <th className="pb-3 font-semibold text-center">In-Stock Qty</th>
                <th className="pb-3 font-semibold text-center">Status</th>
                <th className="pb-3 font-semibold text-center">Quick Toggle</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((prod) => {
                const isSoldOut = prod.status === 'sold_out' || prod.stock === 0;

                return (
                  <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200/80 bg-slate-50">
                          {prod.imageType ? (
                            <ProduceArt type={prod.imageType as any} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">
                              {prod.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{prod.name}</div>
                          <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                            {prod.description || 'Harvested locally'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-2">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium text-[11px]">
                        {prod.category}
                      </span>
                    </td>

                    <td className="py-4 px-2 font-bold text-slate-800">
                      ${prod.price.toFixed(2)}{' '}
                      <span className="text-slate-400 font-normal text-[11px]">/ {prod.unit}</span>
                    </td>

                    <td className="py-4 px-2 text-center">
                      <div className="font-bold text-slate-900">
                        {prod.stock} {prod.unit}s
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Recurring: {prod.weeklyRecurringStock || 50}
                      </span>
                    </td>

                    <td className="py-4 px-2 text-center">
                      {prod.status === 'in_stock' && <Badge variant="success">In Stock</Badge>}
                      {prod.status === 'sold_out' && <Badge variant="error">Sold Out</Badge>}
                      {prod.status === 'temporarily_unavailable' && (
                        <Badge variant="warning">Unavailable</Badge>
                      )}
                    </td>

                    <td className="py-4 px-2 text-center">
                      <button
                        onClick={() => toggleProductStatus(prod.id)}
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                          isSoldOut
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200'
                        }`}
                      >
                        {isSoldOut ? 'Mark In Stock' : 'Mark Sold Out'}
                      </button>
                    </td>

                    <td className="py-4 pl-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingProduct}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? `Edit ${editingProduct.name}` : 'Add New Produce to Catalog'}
        subtitle="Specify produce classification, unit pricing, and recurring stock templates"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Produce Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Heirloom Purple Carrots"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Unit Price ($) *</label>
              <input
                type="number"
                step="0.05"
                min="0.10"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Sold By Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Stock Qty</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Weekly Recurring Template Qty</label>
              <input
                type="number"
                min="0"
                value={formData.weeklyRecurringStock}
                onChange={(e) =>
                  setFormData({ ...formData, weeklyRecurringStock: parseInt(e.target.value) || 0 })
                }
                placeholder="Default allocation for weekends"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Illustration Icon Style</label>
              <select
                value={formData.imageType}
                onChange={(e) => setFormData({ ...formData, imageType: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {produceTypes.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)} Graphic
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Product Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Crisp sweet flavor, soil characteristics, harvesting notes..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingProduct(null);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-sm"
            >
              {editingProduct ? 'Update Product' : 'Add to Catalog'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
