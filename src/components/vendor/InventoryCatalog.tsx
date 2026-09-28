import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { VendorProduct } from '../../types/vendor';
import { ProduceArt } from '../ProduceArt';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { formatDate, formatPrice } from '../../services/mappers';
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
    applyWeeklyStock,
    stallSettings,
    updateStallSettings,
    categories,
  } = useMarketData();

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<VendorProduct | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const approved = stallSettings.approvalStatus === 'approved';
  const autoResetStock = stallSettings.autoResetWeeklyStock;

  const emptyForm = () => ({
    name: '',
    category: categories[0]?.name || '',
    categoryId: categories[0]?.id || '',
    price: 100,
    unit: 'kg',
    stock: 20,
    weeklyRecurringStock: 20,
    imageType: 'cabbage' as 'cabbage' | 'kale' | 'broccoli' | 'celery' | 'carrot' | 'tomato' | 'pepper' | 'mushroom',
    status: 'in_stock' as 'in_stock' | 'sold_out' | 'temporarily_unavailable',
    description: '',
  });

  // Form State for Add / Edit
  const [formData, setFormData] = useState(emptyForm);

  // units accepted by the backend product model
  const units = ['kg', 'g', 'piece', 'dozen', 'bunch', 'litre', 'pack'];
  const produceTypes = ['cabbage', 'kale', 'broccoli', 'celery', 'carrot', 'tomato', 'pepper', 'mushroom'] as const;

  const handleOpenAddModal = () => {
    setFormData(emptyForm());
    setImageFile(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (p: VendorProduct) => {
    setEditingProduct(p);
    setImageFile(null);
    setFormData({
      name: p.name,
      category: p.category,
      categoryId: p.categoryId,
      price: p.price,
      unit: p.unit,
      stock: p.stock,
      weeklyRecurringStock: p.weeklyRecurringStock,
      imageType: (p.imageType as any) || 'cabbage',
      status: p.status,
      description: p.description || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.categoryId) return;

    setSaving(true);
    const ok = editingProduct
      ? await updateProduct(editingProduct.id, formData, imageFile)
      : await addProduct(formData, imageFile);
    setSaving(false);
    if (ok) {
      setEditingProduct(null);
      setIsAddModalOpen(false);
      setImageFile(null);
    }
  };

  const handleDelete = (p: VendorProduct) => {
    if (window.confirm(`Remove "${p.name}" from your catalog? Past orders keep their history.`)) deleteProduct(p.id);
  };

  const handleToggleAutoReset = () => {
    updateStallSettings({ autoResetWeeklyStock: !autoResetStock });
  };

  const filteredProducts = vendorProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === 'all' || p.categoryId === filterCat;
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
              {autoResetStock && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                  Auto-Reset On
                </span>
              )}
            </h4>
            <p className="text-xs text-emerald-200/80 mt-0.5 max-w-xl">
              Each product's "weekly template qty" is your normal weekly stock. Apply it now, or switch on auto-reset to refill stock
              every 7 days.{stallSettings.lastStockResetAt ? ` Last reset: ${formatDate(stallSettings.lastStockResetAt)}.` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => applyWeeklyStock()}
            disabled={!approved}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs bg-white text-emerald-900 hover:bg-emerald-50 disabled:opacity-40"
          >
            Apply template now
          </button>
          <button
            onClick={handleToggleAutoReset}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
              autoResetStock ? 'bg-emerald-500 text-white hover:bg-emerald-400' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {autoResetStock ? '✓ Auto-Reset Enabled' : 'Enable Auto-Reset'}
          </button>
        </div>
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

            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleOpenAddModal}
              disabled={!approved}
              title={approved ? 'Add a product' : 'Your stall must be approved before you can list products'}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    {vendorProducts.length === 0 ? 'No products yet. Click "Add Product" to list your first item.' : 'No products match your search.'}
                  </td>
                </tr>
              )}
              {filteredProducts.map((prod) => {
                const isSoldOut = prod.status === 'sold_out' || prod.stock === 0;

                return (
                  <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200/80 bg-slate-50">
                          {prod.imageType ? (
                            <ProduceArt type={prod.imageType as any} src={prod.imageUrl} className="w-full h-full object-cover" />
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
                          {prod.isBlocked && (
                            <span className="text-[10px] font-bold text-rose-600 block">Removed by admin - hidden from customers</span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-2">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium text-[11px]">
                        {prod.category}
                      </span>
                    </td>

                    <td className="py-4 px-2 font-bold text-slate-800">
                      {formatPrice(prod.price)}{' '}
                      <span className="text-slate-400 font-normal text-[11px]">/ {prod.unit}</span>
                    </td>

                    <td className="py-4 px-2 text-center">
                      <div className="font-bold text-slate-900">
                        {prod.stock} {prod.unit}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Weekly template: {prod.weeklyRecurringStock || '—'}
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
                        disabled={!approved}
                        className={`disabled:opacity-40 px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
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
                          disabled={!approved}
                          className="disabled:opacity-40 p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod)}
                          disabled={!approved}
                          className="disabled:opacity-40 p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
                required
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value, category: categories.find((c) => c.id === e.target.value)?.name || '' })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Unit Price (Rs) *</label>
              <input
                type="number"
                step="1"
                min="1"
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
                onChange={(e) => setFormData({ ...formData, stock: Math.max(0, parseFloat(e.target.value) || 0) })}
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
                  setFormData({ ...formData, weeklyRecurringStock: Math.max(0, parseFloat(e.target.value) || 0) })
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Availability</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              >
                <option value="in_stock">Available</option>
                <option value="sold_out">Sold out</option>
                <option value="temporarily_unavailable">Temporarily unavailable</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Product Photo (jpg / png / webp, max 2MB)</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full text-[11px] file:mr-2 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-bold"
              />
              {editingProduct?.imageUrl && !imageFile && <span className="text-[10px] text-slate-400">Current photo kept unless you choose a new one.</span>}
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
              disabled={saving}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-sm disabled:opacity-50"
            >
              {saving ? 'Saving…' : editingProduct ? 'Update Product' : 'Add to Catalog'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
