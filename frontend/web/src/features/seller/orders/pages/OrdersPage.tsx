import { useState, useMemo, useCallback } from 'react';
import {
  useGetSellerOrdersQuery,
  useShipOrderMutation,
  useDeliverOrderMutation,
  Order,
} from '../api/ordersApi';
import OrderCard from '../components/OrderCard';
import OrderCardSkeleton from '../components/OrderCardSkeleton';
import OrderTableView from '../components/OrderTableView';
import OrderSearchBar from '../components/OrderSearchBar';
import OrderStats from '../components/OrderStats';
import OrderDetailsModal from '../components/OrderDetailsModal';
import ShipOrderModal from '../components/ShipOrderModal';
import Button from '@/shared/components/Button';
import {
  Squares2X2Icon,
  TableCellsIcon,
  TruckIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import clsx from 'clsx';

type ViewMode = 'card' | 'table';

const OrdersPage = () => {
  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [page, setPage] = useState(1);
  const limit = 20;

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ startDate?: string; endDate?: string }>({});
  const [sortBy, setSortBy] = useState('recent');

  // Modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [orderToShip, setOrderToShip] = useState<Order | null>(null);

  // API queries
  const { data, isLoading, isFetching } = useGetSellerOrdersQuery({
    page,
    limit,
    status: statusFilter.length === 1 ? statusFilter[0] : undefined,
  });

  const [shipOrder, { isLoading: isShipping }] = useShipOrderMutation();
  const [deliverOrder, { isLoading: isDelivering }] = useDeliverOrderMutation();

  const orders = data?.orders || [];
  const pagination = data?.pagination;

  // Filter and sort orders locally
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...orders];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.customer.name.toLowerCase().includes(query) ||
          order.customer.email.toLowerCase().includes(query) ||
          order.items.some((item) => item.title.toLowerCase().includes(query))
      );
    }

    // Apply multiple status filter
    if (statusFilter.length > 1) {
      filtered = filtered.filter((order) => statusFilter.includes(order.status));
    }

    // Apply date range filter
    if (dateRange.startDate || dateRange.endDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        if (dateRange.startDate && orderDate < new Date(dateRange.startDate)) {
          return false;
        }
        if (dateRange.endDate && orderDate > new Date(dateRange.endDate)) {
          return false;
        }
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest':
          return b.totalPrice - a.totalPrice;
        case 'lowest':
          return a.totalPrice - b.totalPrice;
        default:
          return 0;
      }
    });

    return filtered;
  }, [orders, searchQuery, statusFilter, dateRange, sortBy]);

  // Event handlers
  const handleViewDetails = useCallback((order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  }, []);

  const handleShipOrder = useCallback(async (shipData: any) => {
    if (!orderToShip) return;

    try {
      await shipOrder({ id: orderToShip._id, ...shipData }).unwrap();
      toast.success('Order marked as shipped successfully! 🚚');
      setIsShipModalOpen(false);
      setOrderToShip(null);
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to ship order');
    }
  }, [orderToShip, shipOrder]);

  const handleMarkDelivered = useCallback(async (order: Order) => {
    try {
      await deliverOrder(order._id).unwrap();
      toast.success('Order marked as delivered successfully! ✅');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to mark order as delivered');
    }
  }, [deliverOrder]);

  const handleContactCustomer = useCallback((order: Order) => {
    window.location.href = `mailto:${order.customer.email}`;
  }, []);

  const handleOpenShipModal = useCallback((order: Order) => {
    setOrderToShip(order);
    setIsShipModalOpen(true);
  }, []);

  // Loading skeleton for cards
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-grey-100 flex items-center justify-center">
        <ShoppingBagIcon className="w-16 h-16 text-grey-400" />
      </div>
      <h3 className="text-headline-medium text-grey-900 mb-2">No orders yet</h3>
      <p className="text-body-medium text-grey-600 mb-6">
        Orders will appear here once customers start purchasing your products
      </p>
      <div className="max-w-md mx-auto space-y-2">
        <p className="text-body-small text-grey-600">
          💡 <strong>Tip:</strong> Share your products on social media to get started
        </p>
      </div>
    </div>
  );

  // No results state
  const NoResultsState = () => (
    <div className="text-center py-16">
      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-grey-100 flex items-center justify-center">
        <svg className="w-16 h-16 text-grey-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="text-headline-medium text-grey-900 mb-2">No orders match your filters</h3>
      <p className="text-body-medium text-grey-600 mb-6">
        Try adjusting your search or filter criteria
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-large text-grey-900 mb-2">All Orders</h1>
          <p className="text-body-medium text-grey-600">
            Manage and fulfill your orders
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-grey-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('card')}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-md transition-all',
              viewMode === 'card'
                ? 'bg-white text-gold shadow-sm'
                : 'text-grey-600 hover:text-grey-900'
            )}
          >
            <Squares2X2Icon className="w-5 h-5" />
            <span className="text-body-medium font-medium">Card</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-md transition-all',
              viewMode === 'table'
                ? 'bg-white text-gold shadow-sm'
                : 'text-grey-600 hover:text-grey-900'
            )}
          >
            <TableCellsIcon className="w-5 h-5" />
            <span className="text-body-medium font-medium">Table</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <OrderStats orders={orders} isLoading={isLoading} />

      {/* Search and Filters */}
      <OrderSearchBar
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onDateRangeChange={setDateRange}
        onSortChange={setSortBy}
      />

      {/* Orders List */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : filteredAndSortedOrders.length === 0 ? (
        <NoResultsState />
      ) : (
        <>
          {viewMode === 'card' ? (
            <div className="space-y-4">
              {filteredAndSortedOrders.map((order, index) => (
                <div
                  key={order._id}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'backwards',
                  }}
                >
                  <OrderCard
                    order={order}
                    onViewDetails={handleViewDetails}
                    onShipOrder={handleOpenShipModal}
                    onMarkDelivered={handleMarkDelivered}
                    onContactCustomer={handleContactCustomer}
                  />
                </div>
              ))}
            </div>
          ) : (
            <OrderTableView
              orders={filteredAndSortedOrders}
              onViewDetails={handleViewDetails}
              onShipOrder={handleOpenShipModal}
              onMarkDelivered={handleMarkDelivered}
              onContactCustomer={handleContactCustomer}
            />
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6">
              <p className="text-body-small text-grey-600">
                Showing <span className="font-medium">{((page - 1) * limit) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(page * limit, pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> orders
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
                    // Show first, last, current, and adjacent pages
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
                            'w-10 h-10 rounded-lg transition-all',
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
            </div>
          )}
        </>
      )}

      {/* Loading overlay */}
      {isFetching && !isLoading && (
        <div className="fixed bottom-4 right-4 bg-white px-4 py-3 rounded-lg shadow-lg border border-grey-200 flex items-center gap-3">
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
          <span className="text-body-small text-grey-700">Updating orders...</span>
        </div>
      )}

      {/* Modals */}
      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        order={selectedOrder}
      />

      <ShipOrderModal
        isOpen={isShipModalOpen}
        onClose={() => {
          setIsShipModalOpen(false);
          setOrderToShip(null);
        }}
        onSubmit={handleShipOrder}
        isLoading={isShipping}
      />
    </div>
  );
};

export default OrdersPage;
