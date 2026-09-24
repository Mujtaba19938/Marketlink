import React, { useState } from 'react';
import { ProductItem } from '../../types/market';
import { ProduceArt } from '../ProduceArt';
import { X, Plus, Minus, ShoppingBag, Store, ShieldCheck, MapPin, Calendar, Clock, Star } from 'lucide-react';

interface ProductDetailModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: ProductItem, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
    setQuantity(1);
  };

  const mapProduceType = (cat: string): 'cabbage' | 'kale' | 'broccoli' | 'celery' | 'carrot' | 'tomato' | 'pepper' | 'mushroom' => {
    const c = cat.toLowerCase();
    if (['cabbage', 'kale', 'broccoli', 'celery', 'carrot', 'tomato', 'pepper', 'mushroom'].includes(c)) {
      return c as any;
    }
    if (c === 'tubers') return 'carrot';
    if (c === 'fruits') return 'tomato';
    return 'broccoli';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--color-surface-card)] text-[var(--color-text-main)] w-full max-w-lg rounded-3xl border border-[var(--color-border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary-border)] capitalize">
              {product.category}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              SRS Product Specification
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Visual Showcase */}
          <div className="relative rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-white/5 dark:to-white/10 border border-[var(--color-border)] h-52 flex items-center justify-center overflow-hidden">
            <div className="w-36 h-36 flex items-center justify-center drop-shadow-lg">
              <ProduceArt type={mapProduceType(product.category)} className="w-full h-full" />
            </div>

            <div className="absolute top-3 right-3 bg-[var(--color-surface)]/90 backdrop-blur-sm px-2.5 py-1 rounded-xl text-xs font-bold border border-[var(--color-border)] flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>4.9 (42 reviews)</span>
            </div>
          </div>

          {/* Product Title & Pricing */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-[var(--color-text-main)]">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  100% Certified Organic • Grown locally within 45 miles of Downtown Pavilion
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-black text-[var(--color-primary)] tabular-nums">
                  ${product.price.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">per {product.unit}</div>
              </div>
            </div>
          </div>

          {/* Farmer & Stall Information */}
          <div className="bg-[var(--color-surface-muted)] p-4 rounded-2xl border border-[var(--color-border)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-xs font-bold text-[var(--color-text-main)]">
                  Produced by Green Valley Organic Stall
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300/40">
                Verified Farmer
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">Downtown Fresh Pavilion (Stall #14)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Wed, Sat, Sun</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Pickup: 8:00 AM – 2:00 PM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Daily Fresh Harvest</span>
              </div>
            </div>
          </div>

          {/* Stock Meter */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-600 dark:text-slate-400">Available Stock:</span>
              <span className="font-bold text-[var(--color-text-main)]">{product.stock} {product.unit} remaining</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] rounded-full transition-all"
                style={{ width: `${Math.min(100, (product.stock / 60) * 100)}%` }}
              />
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Select Pre-Order Quantity:
            </span>
            <div className="flex items-center gap-3 bg-[var(--color-surface-muted)] p-1 rounded-xl border border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-[var(--color-text-main)] tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
                className="w-8 h-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Pre-Order Total</div>
            <div className="text-lg font-black text-[var(--color-text-main)] tabular-nums">
              ${(product.price * quantity).toFixed(2)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Pre-Order Basket</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
