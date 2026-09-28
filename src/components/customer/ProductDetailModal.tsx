import React, { useEffect, useState } from 'react';
import { ProductItem } from '../../types/market';
import { ProduceArt } from '../ProduceArt';
import { useMarketData } from '../../context/MarketDataContext';
import { dayCodeToName, formatPrice } from '../../services/mappers';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Store,
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  UserCheck,
  Heart,
  MessageSquare,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: ProductItem, quantity: number) => void;
  onInstantBuy?: (product: ProductItem, quantity: number) => void;
  onToggleFavorite?: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onInstantBuy,
  onToggleFavorite,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { getProductReviews } = useMarketData();
  const [reviews, setReviews] = useState<Awaited<ReturnType<typeof getProductReviews>>>([]);

  // SRS: customers can read other customers' reviews before ordering
  useEffect(() => {
    setQuantity(1);
    setReviews([]);
    if (isOpen && product) getProductReviews(product.id).then(setReviews);
  }, [isOpen, product?.id, getProductReviews]);

  if (!isOpen || !product) return null;

  const available = product.availability === undefined || (product.availability === 'AVAILABLE' && product.stock > 0);
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
    setQuantity(1);
  };

  const handleBuyNow = () => {
    if (onInstantBuy) {
      onInstantBuy(product, quantity);
      onClose();
      setQuantity(1);
    } else {
      handleAdd();
    }
  };

  const mapProduceType = (
    cat: string
  ): 'cabbage' | 'kale' | 'broccoli' | 'celery' | 'carrot' | 'tomato' | 'pepper' | 'mushroom' => {
    const c = cat.toLowerCase();
    if (['cabbage', 'kale', 'broccoli', 'celery', 'carrot', 'tomato', 'pepper', 'mushroom'].includes(c)) {
      return c as any;
    }
    if (c === 'tubers') return 'carrot';
    if (c === 'fruits') return 'tomato';
    return 'broccoli';
  };

  const farmerName = product.farmerName || 'Farmer';
  const farmName = product.farmName || 'Farmer stall';
  const areaName = product.area || '—';
  const marketName = product.marketName || 'No market scheduled';
  const farmerRating = product.farmerRating || 0;
  const description = product.description || 'Fresh local produce.';
  const origin = product.origin || areaName;
  const days = (product.operatingDays || []).map((d) => dayCodeToName(d).slice(0, 3)).join(', ') || '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#0b1a13] text-white w-full max-w-lg rounded-[32px] border border-emerald-900/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/60 bg-[#0e241b]/60">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black bg-[#132c20] text-[#def54d] border border-emerald-800/80 capitalize font-['Outfit',sans-serif]">
              {product.category}
            </span>
            <span className="text-xs font-semibold text-slate-300">
              Product Specification &amp; Farmer Traceability
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Visual Showcase */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#122c20] to-[#0e241b] border border-emerald-900/60 h-48 flex items-center justify-center overflow-hidden shadow-inner">
            <div className="w-32 h-32 flex items-center justify-center drop-shadow-2xl">
              <ProduceArt type={product.imageType || mapProduceType(product.category)} src={product.imageUrl} className="w-full h-full rounded-2xl" />
            </div>

            <div className="absolute top-3 right-3 bg-[#0b1a13]/90 backdrop-blur-sm px-2.5 py-1 rounded-xl text-xs font-bold border border-emerald-800/60 flex items-center gap-1 shadow-xs text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{farmerRating ? `${farmerRating.toFixed(1)} farmer rating` : 'New farmer'}</span>
            </div>

            <div className={`absolute bottom-3 left-3 backdrop-blur-sm px-2.5 py-1 rounded-xl text-[10px] font-black flex items-center gap-1 shadow-md font-['Outfit',sans-serif] ${available ? 'bg-[#def54d] text-[#0c1b14]' : 'bg-rose-600 text-white'}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{available ? 'In stock' : product.availability === 'UNAVAILABLE' ? 'Temporarily unavailable' : 'Sold out'}</span>
            </div>

            {onToggleFavorite && (
              <button
                type="button"
                onClick={() => onToggleFavorite(product.id)}
                className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#0b1a13]/90 border border-emerald-800/60 flex items-center justify-center cursor-pointer"
                title={product.isFavorite ? 'Remove from favorites' : 'Save to favorites (restock alerts)'}
              >
                <Heart className={`w-4 h-4 ${product.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-300'}`} />
              </button>
            )}
          </div>

          {/* Product Title & Pricing */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {description}
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-black text-[#def54d] tabular-nums font-['Outfit',sans-serif]">
                  {formatPrice(product.price)}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">per {product.unit}</div>
              </div>
            </div>
          </div>

          {/* Farmer & Location Information (Dimension 1 & 4) */}
          <div className="bg-[#0e241b] p-4 rounded-2xl border border-emerald-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#def54d] text-[#0c1b14] flex items-center justify-center text-sm font-bold shadow-xs">
                  👨‍🌾
                </div>
                <div>
                  <span className="text-xs font-extrabold text-white block font-['Outfit',sans-serif]">
                    {farmerName}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {farmName}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black text-[#def54d] bg-[#132c20] px-2.5 py-1 rounded-full border border-emerald-800/80 flex items-center gap-1 font-['Outfit',sans-serif]">
                <CheckCircle className="w-3 h-3 text-[#def54d]" />
                <span>Approved Stall</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-2 border-t border-emerald-900/60">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#def54d] shrink-0" />
                <span className="truncate font-medium text-white">
                  {areaName} • {marketName}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-emerald-400/80 shrink-0" />
                <span className="truncate">{origin}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400/80 shrink-0" />
                <span>Market days: {days}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#def54d] shrink-0" />
                <span>Pay at pickup</span>
              </div>
            </div>
          </div>

          {/* Stock Availability */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">Harvest Stock Remaining:</span>
              <span className="font-bold text-[#def54d]">{available ? `${product.stock} ${product.unit} available` : 'Out of stock'}</span>
            </div>
            <div className="w-full h-2 bg-[#132c20] rounded-full overflow-hidden border border-emerald-900/50">
              <div
                className="h-full bg-[#def54d] rounded-full transition-all shadow-xs"
                style={{ width: `${available ? Math.min(100, Math.max(8, (product.stock / 100) * 100)) : 0}%` }}
              />
            </div>
          </div>

          {/* Customer reviews */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#def54d]" /> Customer reviews ({reviews.length})
              </span>
              {reviews.length > 0 && (
                <span className="text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {avgRating.toFixed(1)}
                </span>
              )}
            </div>
            {reviews.length === 0 ? (
              <p className="text-[11px] text-slate-400">No reviews yet. Reviews can be left after a completed pickup.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {reviews.map((r) => (
                  <div key={r.id} className="bg-[#0e241b] border border-emerald-900/60 rounded-xl p-2.5 text-[11px] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{r.customerName}</span>
                      <span className="text-amber-400">{'★'.repeat(r.rating)}<span className="text-slate-600">{'★'.repeat(5 - r.rating)}</span></span>
                    </div>
                    {r.comment && <p className="text-slate-300">{r.comment}</p>}
                    {r.reply && <p className="text-emerald-300 border-l-2 border-emerald-600 pl-2">Farmer: {r.reply}</p>}
                    <span className="text-slate-500">{r.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-slate-200 font-['Outfit',sans-serif]">
              Select Quantity:
            </span>
            <div className="flex items-center gap-3 bg-[#132c20] p-1.5 rounded-2xl border border-emerald-800/80">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-xl bg-[#0e241b] border border-emerald-800/60 flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer transition active:scale-95"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-black text-white tabular-nums font-['Outfit',sans-serif]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
                className="w-8 h-8 rounded-xl bg-[#0e241b] border border-emerald-800/60 flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-emerald-900/60 bg-[#0e241b]/70 flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Subtotal</div>
            <div className="text-xl font-black text-[#def54d] tabular-nums font-['Outfit',sans-serif]">
              {formatPrice(product.price * quantity)}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-emerald-800/80 bg-[#132c20] hover:bg-[#1a382a] text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer active:scale-95"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!available}
              className="disabled:opacity-40 disabled:cursor-not-allowed px-6 py-2.5 bg-[#def54d] hover:bg-[#e8fa79] text-[#0c1b14] text-xs font-black rounded-full shadow-lg flex items-center gap-2 cursor-pointer transition active:scale-95 font-['Outfit',sans-serif]"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
