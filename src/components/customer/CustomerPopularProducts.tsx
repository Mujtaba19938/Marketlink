import React from 'react';
import { ProductItem } from '../../types/market';
import { ProductCard } from '../ProductCard';

interface CustomerPopularProductsProps {
  products: ProductItem[];
  onAddToCart: (product: ProductItem) => void;
  onToggleFavorite: (productId: string) => void;
  onSeeAll: () => void;
  onOpenDetails?: (product: ProductItem) => void;
}

export const CustomerPopularProducts: React.FC<CustomerPopularProductsProps> = ({
  products,
  onAddToCart,
  onToggleFavorite,
  onSeeAll,
  onOpenDetails,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-slate-800">
          Popular Product
        </h3>
        <button
          onClick={onSeeAll}
          className="text-xs font-semibold text-[#22c55e] hover:underline cursor-pointer"
        >
          See All &rarr;
        </button>
      </div>

      {products.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
          No produce matches these filters.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onToggleFavorite={onToggleFavorite}
            showFavoriteIcon
            onClick={() => onOpenDetails?.(product)}
          />
        ))}
      </div>
    </div>
  );
};
