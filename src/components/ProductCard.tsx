import React, { useState } from 'react';
import { Plus, Heart, Check } from 'lucide-react';
import { ProductItem } from '../types/market';
import { ProduceArt } from './ProduceArt';

interface ProductCardProps {
  product: ProductItem;
  onAddToCart: (product: ProductItem) => void;
  onToggleFavorite?: (productId: string) => void;
  showFavoriteIcon?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  showFavoriteIcon = false,
}) => {
  const [justAdded, setJustAdded] = useState(false);
  const [isFav, setIsFav] = useState(product.isFavorite || false);

  const handleAdd = () => {
    setJustAdded(true);
    onAddToCart(product);
    setTimeout(() => setJustAdded(false), 700);
  };

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFav(!isFav);
    if (onToggleFavorite) onToggleFavorite(product.id);
  };

  return (
    <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs hover:shadow-sm hover:border-emerald-100 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Product Image Box */}
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 mb-3 select-none">
          <ProduceArt type={product.imageType} className="transition-transform duration-300 group-hover:scale-105" />

          {/* Red dot badge (matching Cabbage card in screenshot) */}
          {product.hasRedDot && (
            <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 shadow-xs" />
          )}

          {/* Favorite Heart (shown in Top Items row in screenshot) */}
          {showFavoriteIcon && (
            <button
              onClick={handleFav}
              className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-slate-400 hover:text-red-500 transition shadow-2xs"
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  isFav ? 'fill-red-500 text-red-500' : 'text-slate-400'
                }`}
              />
            </button>
          )}
        </div>

        {/* Product Title */}
        <h4 className="font-bold text-slate-800 text-sm leading-snug truncate" title={product.name}>
          {product.name}
        </h4>

        {/* Stock info */}
        <p className="text-slate-400 text-xs mt-0.5 font-medium">
          {product.stock} in stock
        </p>
      </div>

      {/* Price & Action Row */}
      <div className="flex items-center justify-between mt-3 pt-1">
        <div className="flex items-baseline gap-1">
          <span className="text-[#22c55e] font-bold text-sm tabular-nums">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-slate-400 text-[11px] font-normal">
            /{product.unit}
          </span>
        </div>

        {/* Plus Button */}
        <button
          onClick={handleAdd}
          title="Add to cart"
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-xs ${
            justAdded
              ? 'bg-emerald-600 text-white scale-110'
              : 'bg-[#22c55e] hover:bg-emerald-600 text-white active:scale-90'
          }`}
        >
          {justAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
        </button>
      </div>
    </div>
  );
};
