import React, { useState } from 'react';
import { ProductItem } from '../types/market';
import { ProductCard } from './ProductCard';

interface ProductSectionsProps {
  popularProducts: ProductItem[];
  topItems: ProductItem[];
  onAddToCart: (product: ProductItem) => void;
  onToggleFavorite?: (productId: string) => void;
}

export const ProductSections: React.FC<ProductSectionsProps> = ({
  popularProducts,
  topItems,
  onAddToCart,
  onToggleFavorite,
}) => {
  const [showAllPopular, setShowAllPopular] = useState(false);
  const [showAllTop, setShowAllTop] = useState(false);

  return (
    <div className="space-y-6">
      {/* Popular Product Section */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            Popular Product
          </h3>
          <button
            onClick={() => setShowAllPopular(!showAllPopular)}
            className="text-xs font-semibold text-[#22c55e] hover:text-emerald-700 transition"
          >
            {showAllPopular ? 'Show Less' : 'See All'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {popularProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </div>

      {/* Top Items Section */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            Top Items
          </h3>
          <button
            onClick={() => setShowAllTop(!showAllTop)}
            className="text-xs font-semibold text-[#22c55e] hover:text-emerald-700 transition"
          >
            {showAllTop ? 'Show Less' : 'See All'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {topItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleFavorite={onToggleFavorite}
              showFavoriteIcon={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
