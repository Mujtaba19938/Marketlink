import { useEffect, useMemo, useRef, useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { ProductItem } from '../../types/market';
import { FourDimensionFilters } from './FourDimensionFilterBar';

export type CatalogSort = 'popular' | 'price_asc' | 'price_desc' | 'stock';

/**
 * Product search over the live catalog: keyword, farmer, price, category, area, market and market day
 * (SRS: filters for price, category, market, and day).
 * Shared by the public shop page and the customer dashboard.
 */
export const useCatalogFilters = (initial?: Partial<FourDimensionFilters>) => {
  const { marketProducts, categories, directory, markets } = useMarketData();

  const priceCeiling = useMemo(() => {
    const max = Math.max(0, ...marketProducts.map((p) => p.price));
    return Math.max(10, Math.ceil(max / 10) * 10);
  }, [marketProducts]);

  const makeDefaults = (): FourDimensionFilters => ({
    searchQuery: '',
    farmer: 'all',
    category: 'all',
    area: 'all',
    market: 'all',
    day: 'all',
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
      availableMarkets: markets.map((m) => ({ id: m.id, name: m.name })),
      priceCeiling,
    }),
    [directory, marketProducts, categories, markets, priceCeiling]
  );

  // each farmer's market schedules: which market, which days
  const schedules = useMemo(() => {
    const map: Record<string, { marketId: string; days: string[] }[]> = {};
    directory.forEach((f) => {
      map[f._id] = f.markets.filter((a) => a.market).map((a) => ({ marketId: a.market._id, days: a.operatingDays }));
    });
    return map;
  }, [directory]);

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
        // market + day are checked together: the farmer must be at THAT market on THAT day
        const matchSchedule =
          (filters.market === 'all' && filters.day === 'all') ||
          (schedules[p.farmerId || ''] || []).some(
            (s) => (filters.market === 'all' || s.marketId === filters.market) && (filters.day === 'all' || s.days.includes(filters.day))
          );
        return matchSearch && matchFarmer && matchPrice && matchCategory && matchArea && matchSchedule;
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
  }, [marketProducts, filters, sortBy, schedules]);

  const reset = () => {
    setFilters({ searchQuery: '', farmer: 'all', category: 'all', area: 'all', market: 'all', day: 'all', minPrice: 0, maxPrice: priceCeiling });
    setSortBy('popular');
  };

  return { filters, setFilters, sortBy, setSortBy, filteredProducts, options, reset };
};
