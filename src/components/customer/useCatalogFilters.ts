import { useEffect, useMemo, useRef, useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { ProductItem } from '../../types/market';
import { FourDimensionFilters } from './FourDimensionFilterBar';

export type CatalogSort = 'popular' | 'price_asc' | 'price_desc' | 'stock';

/**
 * 4-dimension product search (farmer, price, category, area + keyword) over the live catalog.
 * Shared by the public shop page and the customer dashboard.
 */
export const useCatalogFilters = (initial?: Partial<FourDimensionFilters>) => {
  const { marketProducts, categories, directory } = useMarketData();

  const priceCeiling = useMemo(() => {
    const max = Math.max(0, ...marketProducts.map((p) => p.price));
    return Math.max(10, Math.ceil(max / 10) * 10);
  }, [marketProducts]);

  const makeDefaults = (): FourDimensionFilters => ({
    searchQuery: '',
    farmer: 'all',
    category: 'all',
    area: 'all',
    minPrice: 0,
    maxPrice: priceCeiling,
    ...initial,
  });

  const [filters, setFilters] = useState<FourDimensionFilters>(makeDefaults);
  const [sortBy, setSortBy] = useState<CatalogSort>('popular');

  // catalog loads after first render: if the slider was still at the old maximum, follow the new maximum
  const prevCeiling = useRef(priceCeiling);
  useEffect(() => {
    const prev = prevCeiling.current;
    prevCeiling.current = priceCeiling;
    setFilters((f) => (f.maxPrice >= prev ? { ...f, maxPrice: priceCeiling } : f));
  }, [priceCeiling]);

  const options = useMemo(
    () => ({
      availableFarmers: directory.map((f) => ({ id: f._id, name: `${f.stallName} (${f.contactPerson})` })),
      availableAreas: [...new Set(marketProducts.map((p) => p.area).filter(Boolean) as string[])].sort(),
      availableCategories: [{ id: 'all', name: 'All Categories' }, ...categories.map((c) => ({ id: c.id, name: c.name }))],
      priceCeiling,
    }),
    [directory, marketProducts, categories, priceCeiling]
  );

  const filteredProducts: ProductItem[] = useMemo(() => {
    const q = filters.searchQuery.toLowerCase().trim();
    return marketProducts
      .filter((p) => {
        const matchSearch =
          !q ||
          p.name.toLowerCase().includes(q) ||
          (p.farmerName || '').toLowerCase().includes(q) ||
          (p.farmName || '').toLowerCase().includes(q) ||
          (p.area || '').toLowerCase().includes(q) ||
          (p.marketName || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q);
        const matchFarmer = filters.farmer === 'all' || p.farmerId === filters.farmer;
        const matchPrice = p.price >= filters.minPrice && p.price <= filters.maxPrice;
        const matchCategory = filters.category === 'all' || p.categoryId === filters.category;
        const matchArea = filters.area === 'all' || p.area === filters.area;
        return matchSearch && matchFarmer && matchPrice && matchCategory && matchArea;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'stock') return b.stock - a.stock;
        // popular: in-stock first, then best-rated farmer
        const aIn = a.availability === 'AVAILABLE' && a.stock > 0 ? 1 : 0;
        const bIn = b.availability === 'AVAILABLE' && b.stock > 0 ? 1 : 0;
        return bIn - aIn || (b.farmerRating || 0) - (a.farmerRating || 0);
      });
  }, [marketProducts, filters, sortBy]);

  const reset = () => {
    setFilters({ searchQuery: '', farmer: 'all', category: 'all', area: 'all', minPrice: 0, maxPrice: priceCeiling });
    setSortBy('popular');
  };

  return { filters, setFilters, sortBy, setSortBy, filteredProducts, options, reset };
};
