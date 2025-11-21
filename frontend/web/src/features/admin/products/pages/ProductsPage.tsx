import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';
import {
  useGetAdminProductsQuery,
  useFeatureProductMutation,
  useApproveProductMutation,
  useRejectProductMutation,
  useDeleteProductMutation,
  AdminProduct,
} from '../api/productsApi';
import {
  StatsBanner,
  SearchBar,
  FilterPanel,
  ProductGridView,
  BulkActionsToolbar,
  Pagination,
  FilterState,
} from '../components';
import { useProductFilters } from '../hooks/useProductFilters';
import { useBulkSelection } from '../hooks/useBulkSelection';
import Button from '@/shared/components/Button';
import Modal from '@/shared/components/Modal';
import Badge from '@/shared/components/Badge';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const ProductsPage = () => {
  // State Management
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // API Queries & Mutations
  const { data, isLoading } = useGetAdminProductsQuery({});
  const [featureProduct, { isLoading: isFeaturing }] = useFeatureProductMutation();
  const [approveProduct, { isLoading: isApproving }] = useApproveProductMutation();
  const [rejectProduct, { isLoading: isRejecting }] = useRejectProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products = data?.products || [];

  // Custom Hooks
  const {
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    availableCategories,
    stats,
    resetFilters,
    hasActiveFilters,
  } = useProductFilters(products);

  const {
    selectedIds,
    selectedCount,
    allSelected,
    isSelected,
    toggleSelection,
    selectAll,
    deselectAll,
  } = useBulkSelection(filteredProducts);

  // Pagination Logic
  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, page, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Handlers
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setPage(1); // Reset to first page
  };

  const handleStatsClick = (filter: 'all' | 'active' | 'pending' | 'lowStock' | 'outOfStock') => {
    if (filter === 'all') {
      resetFilters();
    } else if (filter === 'active') {
      setFilters({ ...filters, status: ['active'] });
    } else if (filter === 'pending') {
      setFilters({ ...filters, status: ['pending'] });
    } else if (filter === 'lowStock') {
      setFilters({ ...filters, stockLevel: ['low-stock'] });
    } else if (filter === 'outOfStock') {
      setFilters({ ...filters, stockLevel: ['out-of-stock'] });
    }
    setPage(1);
  };

  const handleFeature = async (product: AdminProduct) => {
    try {
      await featureProduct({ id: product._id, isFeatured: !product.isFeatured }).unwrap();
      toast.success(product.isFeatured ? 'Product unfeatured' : 'Product featured');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to update product');
    }
  };

  const handleApprove = async (product: AdminProduct) => {
    try {
      await approveProduct(product._id).unwrap();
      toast.success('Product approved successfully');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to approve product');
    }
  };

  const handleReject = async (product: AdminProduct) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await rejectProduct({ id: product._id, reason }).unwrap();
      toast.success('Product rejected');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to reject product');
    }
  };

  const handleDelete = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete).unwrap();
      toast.success('Product deleted successfully');
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to delete product');
    }
  };

  const handleBulkDelete = () => {
    if (selectedCount === 0) return;
    setIsBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const deletePromises = Array.from(selectedIds).map((id) =>
        deleteProduct(id).unwrap()
      );
      await Promise.all(deletePromises);
      toast.success(`${selectedCount} products deleted successfully`);
      setIsBulkDeleteModalOpen(false);
      deselectAll();
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to delete products');
    }
  };

  const handleView = (product: AdminProduct) => {
    // TODO: Navigate to product detail view
    toast.info('Product detail view coming soon!');
  };

  // Active Filter Badges
  const activeFilterBadges = useMemo(() => {
    const badges: Array<{ label: string; onRemove: () => void }> = [];

    filters.status.forEach((status) => {
      badges.push({
        label: `Status: ${status}`,
        onRemove: () => setFilters({
          ...filters,
          status: filters.status.filter(s => s !== status)
        }),
      });
    });

    filters.categories.forEach((category) => {
      badges.push({
        label: `Category: ${category}`,
        onRemove: () => setFilters({
          ...filters,
          categories: filters.categories.filter(c => c !== category)
        }),
      });
    });

    filters.stockLevel.forEach((level) => {
      const labelMap: Record<string, string> = {
        'in-stock': 'In Stock',
        'low-stock': 'Low Stock',
        'out-of-stock': 'Out of Stock',
      };
      badges.push({
        label: labelMap[level] || level,
        onRemove: () => setFilters({
          ...filters,
          stockLevel: filters.stockLevel.filter(l => l !== level)
        }),
      });
    });

    if (filters.isFeatured !== null) {
      badges.push({
        label: filters.isFeatured ? 'Featured' : 'Non-Featured',
        onRemove: () => setFilters({ ...filters, isFeatured: null }),
      });
    }

    return badges;
  }, [filters, setFilters]);

  return (
    <div className="min-h-screen bg-grey-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-[1920px] mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-headline-large text-grey-900 mb-2">
              Products Management
            </h1>
            <p className="text-body-medium text-grey-600">
              Manage all products, approve listings, and moderate content
            </p>
          </div>
        </motion.div>

        {/* Statistics Banner */}
        <StatsBanner
          stats={stats}
          onFilterClick={handleStatsClick}
          isLoading={isLoading}
        />

        {/* Search & View Toggle */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onFilterClick={() => setIsFilterOpen(true)}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-white rounded-lg border-2 border-grey-200 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                viewMode === 'grid'
                  ? 'bg-gold text-white'
                  : 'text-grey-600 hover:bg-grey-50'
              )}
            >
              <Squares2X2Icon className="w-5 h-5" />
              <span className="text-label-large font-medium hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                viewMode === 'list'
                  ? 'bg-gold text-white'
                  : 'text-grey-600 hover:bg-grey-50'
              )}
            >
              <ListBulletIcon className="w-5 h-5" />
              <span className="text-label-large font-medium hidden sm:inline">List</span>
            </button>
          </div>
        </div>

        {/* Active Filters Badges */}
        <AnimatePresence>
          {activeFilterBadges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-center gap-2"
            >
              <span className="text-label-large text-grey-600">Active Filters:</span>
              {activeFilterBadges.map((badge, index) => (
                <motion.div
                  key={`${badge.label}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Badge variant="gold" className="cursor-pointer" size="md">
                    <span className="flex items-center gap-1.5">
                      {badge.label}
                      <button
                        onClick={badge.onRemove}
                        className="hover:bg-gold-dark rounded-full p-0.5 transition-colors"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  </Badge>
                </motion.div>
              ))}
              <button
                onClick={resetFilters}
                className="text-label-medium text-gold hover:text-gold-dark font-medium 
                         underline transition-colors"
              >
                Clear All
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Actions Toolbar */}
        <BulkActionsToolbar
          selectedCount={selectedCount}
          totalCount={filteredProducts.length}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          onBulkDelete={handleBulkDelete}
        />

        {/* Products Grid */}
        <ProductGridView
          products={paginatedProducts}
          isLoading={isLoading}
          onEdit={handleView}
          onDelete={handleDelete}
          onView={handleView}
          onFeature={handleFeature}
          onApprove={handleApprove}
          onReject={handleReject}
          onSelect={toggleSelection}
          selectedIds={selectedIds}
        />

        {/* Pagination */}
        {!isLoading && filteredProducts.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={filteredProducts.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}

        {/* Filter Panel */}
        <FilterPanel
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
          categories={availableCategories}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Product"
          size="sm"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </>
          }
        >
          <p className="text-body-medium text-grey-700">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
        </Modal>

        {/* Bulk Delete Confirmation Modal */}
        <Modal
          isOpen={isBulkDeleteModalOpen}
          onClose={() => setIsBulkDeleteModalOpen(false)}
          title="Delete Multiple Products"
          size="sm"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setIsBulkDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmBulkDelete}
                isLoading={isDeleting}
              >
                Delete {selectedCount} Products
              </Button>
            </>
          }
        >
          <p className="text-body-medium text-grey-700">
            Are you sure you want to delete <strong>{selectedCount}</strong> products? 
            This action cannot be undone.
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default ProductsPage;
