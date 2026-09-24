import React from 'react';
import { ProductItem } from '../../types/market';
import { ProductCard } from '../ProductCard';

interface VendorPopularProductsProps {
  products: ProductItem[];
  onAddToCart: (product: ProductItem) => void;
  onToggleFavorite: (productId: string) => void;
  onSeeAll: () => void;
}

export const VendorPopularProducts: React.FC<VendorPopularProductsProps> = ({
  products,
  onAddToCart,
  onToggleFavorite,
  onSeeAll,
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};
