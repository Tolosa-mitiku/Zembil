import { useState, useMemo, useCallback } from 'react';
import {
  useGetAdminOrdersQuery,
  useUpdateAdminOrderStatusMutation,
  AdminOrder,
} from '../api/ordersApi';
import { OrderStatus, ORDER_STATUS } from '@/core/constants';
import OrderCardEnhanced from '../components/OrderCardEnhanced';
import OrderTableView from '../components/OrderTableView';
import OrderStatsEnhanced from '../components/OrderStatsEnhanced';
import OrderFiltersAdvanced from '../components/OrderFiltersAdvanced';
import OrdersKanbanView from '../components/OrdersKanbanView';
import BulkActionsToolbar from '../components/BulkActionsToolbar';
import OrderDetailsModal from '../components/OrderDetailsModal';
import Button from '@/shared/components/Button';
import {
  Squares2X2Icon,
  TableCellsIcon,
  ViewColumnsIcon,
  ArrowDownTrayIcon,
  Cog6ToothIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import {
  exportToCSV,
  exportToExcel,
  printMultipleInvoices,
} from '../utils/exportUtils';

type ViewMode = 'card' | 'table' | 'kanban';

interface FilterOptions {
  searchQuery: string;
  statusFilters: OrderStatus[];
  dateRange: 'today' | 'week' | 'month' | '3months' | 'custom' | null;
  customDateRange?: { startDate: string; endDate: string };
  sortBy: 'recent' | 'oldest' | 'highest' | 'lowest' | 'status' | 'customer';
}

const OrdersPageEnhanced = () => {
  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [page, setPage] = useState(1);
  const limit = 20;

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    statusFilters: [],
    dateRange: null,
    sortBy: 'recent',
  });

  // Selection state
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  // Modal state
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // API queries
  const { data, isLoading, isFetching } = useGetAdminOrdersQuery({
    page,
    limit,
    status: filters.statusFilters.length === 1 ? filters.statusFilters[0] : undefined,
  });

  const [updateOrderStatus] = useUpdateAdminOrderStatusMutation();

  const orders = data?.orders || [];
  const pagination = data?.pagination;

  // Filter and sort orders locally
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...orders];

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.customer.name.toLowerCase().includes(query) ||
          order.customer.email.toLowerCase().includes(query) ||
          order.seller.name.toLowerCase().includes(query) ||
          order.items.some((item) => item.title.toLowerCase().includes(query))
      );
    }

    // Apply multiple status filter
    if (filters.statusFilters.length > 0) {
      filtered = filtered.filter((order) => filters.statusFilters.includes(order.status));
    }

    // Apply date range filter
    if (filters.dateRange) {
      const now = new Date();
      let startDate: Date;

      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case '3months':
          startDate = new Date(now.setDate(now.getDate() - 90));
          break;
        case 'custom':
          if (filters.customDateRange?.startDate) {
            startDate = new Date(filters.customDateRange.startDate);
          } else {
            break;
          }
          break;
        default:
          startDate = new Date(0);
      }

      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        if (filters.dateRange === 'custom' && filters.customDateRange) {
          const start = filters.customDateRange.startDate
            ? new Date(filters.customDateRange.startDate)
            : new Date(0);
          const end = filters.customDateRange.endDate
            ? new Date(filters.customDateRange.endDate)
            : new Date();
          return orderDate >= start && orderDate <= end;
        }
        return orderDate >= startDate;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest':
          return b.totalPrice - a.totalPrice;
        case 'lowest':
          return a.totalPrice - b.totalPrice;
        case 'status':
          return a.status.localeCompare(b.status);
        case 'customer':
          return a.customer.name.localeCompare(b.customer.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [orders, filters]);

  // Event handlers
  const handleViewDetails = useCallback((order: AdminOrder) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  }, []);

  const handleContactCustomer = useCallback((order: AdminOrder) => {
    window.location.href = `mailto:${order.customer.email}`;
  }, []);

  const handleContactSeller = useCallback((order: AdminOrder) => {
    if (order.seller.email) {
      window.location.href = `mailto:${order.seller.email}`;
    }
  }, []);

  const handleStatClick = useCallback((filterType: string) => {
    switch (filterType) {
      case 'all':
        setFilters(prev => ({ ...prev, statusFilters: [] }));
        break;
      case 'pending':
        setFilters(prev => ({
          ...prev,
          statusFilters: [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED],
        }));
        break;
      case 'transit':
        setFilters(prev => ({
          ...prev,
          statusFilters: [
            ORDER_STATUS.PROCESSING,
            ORDER_STATUS.SHIPPED,
            ORDER_STATUS.OUT_FOR_DELIVERY,
          ],
        }));
        break;
      case 'delivered':
        setFilters(prev => ({
          ...prev,
          statusFilters: [ORDER_STATUS.DELIVERED],
          dateRange: 'week',
        }));
        break;
    }
  }, []);

  // Selection handlers
  const handleSelectOrder = useCallback((orderId: string) => {
    setSelectedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedOrders(new Set());
  }, []);

  // Bulk actions
  const handleBulkUpdateStatus = useCallback(
    async (status: OrderStatus) => {
      const selectedOrdersList = filteredAndSortedOrders.filter(order =>
        selectedOrders.has(order._id)
      );

      if (selectedOrdersList.length === 0) return;

      // Note: Admin viewing status, not actually changing seller's order status
      toast.success(`Viewing ${selectedOrdersList.length} order(s) with status: ${status}`);
      handleClearSelection();
    },
    [selectedOrders, filteredAndSortedOrders, handleClearSelection]
  );

  const handleBulkExport = useCallback(() => {
    const selectedOrdersList = filteredAndSortedOrders.filter(order =>
      selectedOrders.has(order._id)
    );
    exportToCSV(selectedOrdersList.length > 0 ? selectedOrdersList : filteredAndSortedOrders);
    toast.success('Orders exported successfully!');
  }, [selectedOrders, filteredAndSortedOrders]);

  const handleBulkPrintInvoices = useCallback(() => {
    const selectedOrdersList = filteredAndSortedOrders.filter(order =>
      selectedOrders.has(order._id)
    );
    printMultipleInvoices(selectedOrdersList.length > 0 ? selectedOrdersList : filteredAndSortedOrders);
  }, [selectedOrders, filteredAndSortedOrders]);

  const handleKanbanStatusChange = useCallback(
    async (orderId: string, newStatus: OrderStatus) => {
      try {
        await updateOrderStatus({ id: orderId, status: newStatus, note: 'Admin status update via Kanban' }).unwrap();
        toast.success('Order status updated!');
      } catch (error: any) {
        toast.error(error.data?.message || 'Failed to update order status');
      }
    },
    [updateOrderStatus]
  );

  // Loading skeleton for cards
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 gap-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-grey-200 overflow-hidden animate-pulse"
        >
          <div className="h-32 bg-grey-100" />
          <div className="p-6 space-y-4">
            <div className="h-24 bg-grey-100 rounded" />
            <div className="h-20 bg-grey-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold-pale to-grey-100 flex items-center justify-center">
        <ShoppingBagIcon className="w-20 h-20 text-gold" />
      </div>
      <h3 className="text-headline-large text-grey-900 mb-3 font-bold">No orders yet</h3>
      <p className="text-body-large text-grey-600 mb-8 max-w-md mx-auto">
        Orders will appear here once customers start making purchases
      </p>
    </motion.div>
  );

  // No results state
  const NoResultsState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-grey-100 flex items-center justify-center">
        <svg
          className="w-16 h-16 text-grey-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="text-headline-large text-grey-900 mb-3 font-bold">No orders match your filters</h3>
      <p className="text-body-large text-grey-600 mb-6">
        Try adjusting your search or filter criteria
      </p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-grey-50 via-gold-pale/20 to-grey-50 p-6 space-y-6 pb-20">
      {/* HEADER SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-display-small text-grey-900 mb-2 font-bold">
            All Orders
          </h1>
          <p className="text-body-large text-grey-600">
            Monitor and manage all platform orders
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Export Dropdown */}
          <div className="relative group">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<ArrowDownTrayIcon className="w-5 h-5" />}
            >
              Export
            </Button>
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-grey-200 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => exportToCSV(filteredAndSortedOrders)}
                className="w-full px-4 py-3 text-left text-body-small text-grey-900 hover:bg-grey-50 transition-colors"
              >
                Export as CSV
              </button>
              <button
                onClick={() => exportToExcel(filteredAndSortedOrders)}
                className="w-full px-4 py-3 text-left text-body-small text-grey-900 hover:bg-grey-50 transition-colors"
              >
                Export as Excel
              </button>
            </div>
          </div>

          {/* Settings */}
          <Button
            variant="ghost"
            size="md"
            leftIcon={<Cog6ToothIcon className="w-5 h-5" />}
          />

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-grey-100 p-1.5 rounded-xl">
            <button
              onClick={() => setViewMode('card')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium text-body-small',
                viewMode === 'card'
                  ? 'bg-white text-gold shadow-md'
                  : 'text-grey-600 hover:text-grey-900'
              )}
            >
              <Squares2X2Icon className="w-5 h-5" />
              <span className="hidden sm:inline">Card</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium text-body-small',
                viewMode === 'table'
                  ? 'bg-white text-gold shadow-md'
                  : 'text-grey-600 hover:text-grey-900'
              )}
            >
              <TableCellsIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium text-body-small',
                viewMode === 'kanban'
                  ? 'bg-white text-gold shadow-md'
                  : 'text-grey-600 hover:text-grey-900'
              )}
            >
              <ViewColumnsIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* STATS DASHBOARD */}
      <OrderStatsEnhanced orders={orders} isLoading={isLoading} onStatClick={handleStatClick} />

      {/* FILTERS */}
      <OrderFiltersAdvanced
        filters={filters}
        onFiltersChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
        resultsCount={filteredAndSortedOrders.length}
      />

      {/* MAIN CONTENT */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : filteredAndSortedOrders.length === 0 ? (
        <NoResultsState />
      ) : (
        <>
          <AnimatePresence mode="wait">
            {viewMode === 'card' && (
              <motion.div
                key="card-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 gap-6"
              >
                {filteredAndSortedOrders.map((order, index) => (
                  <OrderCardEnhanced
                    key={order._id}
                    order={order}
                    onViewDetails={handleViewDetails}
                    onContactCustomer={handleContactCustomer}
                    onContactSeller={handleContactSeller}
                    isSelected={selectedOrders.has(order._id)}
                    onSelect={handleSelectOrder}
                    index={index}
                  />
                ))}
              </motion.div>
            )}

            {viewMode === 'table' && (
              <motion.div
                key="table-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <OrderTableView
                  orders={filteredAndSortedOrders}
                  onViewDetails={handleViewDetails}
                />
              </motion.div>
            )}

            {viewMode === 'kanban' && (
              <motion.div
                key="kanban-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <OrdersKanbanView
                  orders={filteredAndSortedOrders}
                  onViewDetails={handleViewDetails}
                  onStatusChange={handleKanbanStatusChange}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && viewMode !== 'kanban' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between pt-6"
            >
              <p className="text-body-small text-grey-600">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">{Math.min(page * limit, pagination.total)}</span> of{' '}
                <span className="font-medium">{pagination.total}</span> orders
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === pagination.totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={clsx(
                            'w-10 h-10 rounded-lg transition-all font-medium',
                            page === pageNum
                              ? 'bg-gold text-white shadow-lg'
                              : 'bg-white border border-grey-200 text-grey-700 hover:bg-grey-50'
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === page - 2 || pageNum === page + 2) {
                      return (
                        <span key={pageNum} className="px-2 text-grey-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Loading overlay */}
      <AnimatePresence>
        {isFetching && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-white px-5 py-3 rounded-xl shadow-2xl border border-grey-200 flex items-center gap-3"
          >
            <svg
              className="animate-spin h-5 w-5 text-gold"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-body-small text-grey-700 font-medium">Updating orders...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedCount={selectedOrders.size}
        onClearSelection={handleClearSelection}
        onUpdateStatus={handleBulkUpdateStatus}
        onExport={handleBulkExport}
        onPrintInvoices={handleBulkPrintInvoices}
      />

      {/* Modals */}
      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrdersPageEnhanced;

