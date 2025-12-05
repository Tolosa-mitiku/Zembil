import { useState, useCallback, useMemo } from 'react';
import { AdminProduct } from '../api/productsApi';
import { FilterState } from '../components/FilterPanel';

export const useProductFilters = (products: AdminProduct[] = []) => {
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    categories: [],
    stockLevel: [],
    priceRange: { min: 0, max: Infinity },
    isFeatured: null,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories from products
  const availableCategories = useMemo(() => {
    const categories = products.map(p => p.category).filter(Boolean);
    return Array.from(new Set(categories)).sort();
  }, [products]);

  // Apply all filters
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.seller?.userId?.name?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filters.status.length > 0) {
      result = result.filter(product => 
        filters.status.includes(product.status)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(product =>
        filters.categories.includes(product.category)
      );
    }

    // Stock level filter
    if (filters.stockLevel.length > 0) {
      result = result.filter(product => {
        const stock = product.stock;
        return filters.stockLevel.some(level => {
          if (level === 'in-stock') return stock > 10;
          if (level === 'low-stock') return stock > 0 && stock <= 10;
          if (level === 'out-of-stock') return stock === 0;
          return false;
        });
      });
    }

    // Price range filter
    if (filters.priceRange.min > 0 || filters.priceRange.max < Infinity) {
      result = result.filter(product => {
        const price = product.discountPrice || product.price;
        return price >= filters.priceRange.min && price <= filters.priceRange.max;
      });
    }

    // Featured filter
    if (filters.isFeatured !== null) {
      result = result.filter(product => 
        product.isFeatured === filters.isFeatured
      );
    }

    // Sorting
    result.sort((a, b) => {
      let aValue: any = a[filters.sortBy as keyof AdminProduct];
      let bValue: any = b[filters.sortBy as keyof AdminProduct];

      // Handle undefined/null values
      if (aValue === undefined || aValue === null) aValue = '';
      if (bValue === undefined || bValue === null) bValue = '';

      // Convert to strings for string comparison
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return result;
  }, [products, filters, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: products.length,
      active: products.filter(p => p.status === 'active').length,
      pending: products.filter(p => p.status === 'pending').length,
      lowStock: products.filter(p => p.stock > 0 && p.stock < 10).length,
      outOfStock: products.filter(p => p.stock === 0).length,
    };
  }, [products]);

  const resetFilters = useCallback(() => {
    setFilters({
      status: [],
      categories: [],
      stockLevel: [],
      priceRange: { min: 0, max: Infinity },
      isFeatured: null,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setSearchQuery('');
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.status.length > 0 ||
      filters.categories.length > 0 ||
      filters.stockLevel.length > 0 ||
      filters.isFeatured !== null ||
      searchQuery.length > 0
    );
  }, [filters, searchQuery]);

  return {
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    availableCategories,
    stats,
    resetFilters,
    hasActiveFilters,
  };
};

