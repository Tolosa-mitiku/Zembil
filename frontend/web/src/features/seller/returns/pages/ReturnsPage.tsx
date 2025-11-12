import { useState } from 'react';
import { 
  useGetReturnRequestsQuery, 
  useGetReturnStatsQuery,
  useApproveReturnMutation,
  useRejectReturnMutation,
  useCompleteRefundMutation,
  ReturnRequest,
  RefundStatus,
} from '../api/returnsApi';
import ReturnRequestCard from '../components/ReturnRequestCard';
import ReturnStatsCard from '../components/ReturnStatsCard';
import ReturnCardSkeleton from '../components/ReturnCardSkeleton';
import ReturnDetailModal from '../components/ReturnDetailModal';
import Button from '@/shared/components/Button';
import { formatCurrency } from '@/core/utils/format';
import {
  ArrowPathIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const statusTabs: Array<{ label: string; value: string | undefined; count?: number }> = [
  { label: 'All Returns', value: undefined },
  { label: 'Pending', value: 'requested' },
  { label: 'Processing', value: 'processing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Rejected', value: 'rejected' },
];

const ReturnsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Queries
  const { data, isLoading, refetch } = useGetReturnRequestsQuery({
    page: currentPage,
    limit: 12,
    status: selectedStatus,
  });

  const { data: stats, isLoading: statsLoading } = useGetReturnStatsQuery();

  // Mutations
  const [approveReturn] = useApproveReturnMutation();
  const [rejectReturn] = useRejectReturnMutation();
  const [completeRefund] = useCompleteRefundMutation();

  const handleViewDetails = (returnRequest: ReturnRequest) => {
    setSelectedReturn(returnRequest);
    setIsDetailModalOpen(true);
  };

  const handleApprove = async (returnRequest: ReturnRequest) => {
    try {
      await approveReturn({ id: returnRequest._id }).unwrap();
      toast.success('Return approved successfully!', {
        icon: '✅',
        style: {
          borderRadius: '12px',
          background: '#10B981',
          color: '#fff',
        },
      });
      refetch();
    } catch (error) {
      toast.error('Failed to approve return', {
        icon: '❌',
      });
    }
  };

  const handleReject = async (returnRequest: ReturnRequest) => {
    try {
      await rejectReturn({ 
        id: returnRequest._id, 
        reason: 'Return request does not meet our policy requirements.' 
      }).unwrap();
      toast.success('Return rejected', {
        icon: '❌',
        style: {
          borderRadius: '12px',
          background: '#EF4444',
          color: '#fff',
        },
      });
      refetch();
    } catch (error) {
      toast.error('Failed to reject return', {
        icon: '❌',
      });
    }
  };

  const handleCompleteRefund = async (returnRequest: ReturnRequest) => {
    try {
      await completeRefund({ 
        id: returnRequest._id, 
        amount: returnRequest.totalAmount 
      }).unwrap();
      toast.success(`Refund of ${formatCurrency(returnRequest.totalAmount)} completed!`, {
        icon: '💰',
        style: {
          borderRadius: '12px',
          background: '#10B981',
          color: '#fff',
        },
      });
      refetch();
    } catch (error) {
      toast.error('Failed to complete refund', {
        icon: '❌',
      });
    }
  };

  const filteredReturns = data?.returns.filter((returnRequest) =>
    returnRequest.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    returnRequest.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    returnRequest.buyer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-headline-large font-bold text-grey-900 mb-1">
              Return Requests
            </h1>
            <p className="text-body-small text-grey-600">
              Manage product returns and process refunds
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            leftIcon={<ArrowPathIcon className="w-4 h-4" />}
            className="hover:bg-gold-pale hover:text-gold transition-all duration-200"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
          <ReturnStatsCard
            title="Total Returns"
            value={stats.total}
            icon={ArchiveBoxIcon}
            iconColor="text-gold"
            iconBgColor="bg-gold-pale"
            delay={0}
          />
          <ReturnStatsCard
            title="Pending"
            value={stats.pending}
            subtitle="Awaiting review"
            icon={ClockIcon}
            iconColor="text-yellow-600"
            iconBgColor="bg-yellow-50"
            delay={50}
          />
          <ReturnStatsCard
            title="Processing"
            value={stats.processing}
            subtitle="In progress"
            icon={ArrowTrendingUpIcon}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-50"
            delay={100}
          />
          <ReturnStatsCard
            title="Completed"
            value={stats.completed}
            subtitle="Refunded"
            icon={CheckCircleIcon}
            iconColor="text-green-600"
            iconBgColor="bg-green-50"
            delay={150}
          />
          <ReturnStatsCard
            title="Rejected"
            value={stats.rejected}
            subtitle="Not approved"
            icon={XCircleIcon}
            iconColor="text-red-600"
            iconBgColor="bg-red-50"
            delay={200}
          />
          <ReturnStatsCard
            title="Total Refunded"
            value={formatCurrency(stats.totalRefundAmount)}
            subtitle={`Avg: ${stats.averageProcessingTime}h`}
            icon={CurrencyDollarIcon}
            iconColor="text-gold"
            iconBgColor="bg-gold-pale"
            delay={250}
          />
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-grey-200 p-5">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <FunnelIcon className="w-5 h-5 text-grey-600" />
          {statusTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => {
                setSelectedStatus(tab.value);
                setCurrentPage(1);
              }}
              className={clsx(
                'px-4 py-2 rounded-lg text-body-small font-semibold transition-all duration-200',
                selectedStatus === tab.value
                  ? 'bg-gradient-to-r from-gold to-gold-dark text-white shadow-lg scale-105'
                  : 'bg-grey-100 text-grey-700 hover:bg-grey-200 hover:scale-105'
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-grey-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order number, customer name, or email..."
            className="w-full pl-12 pr-4 py-3 border border-grey-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold transition-all"
          />
        </div>
      </div>

      {/* Returns List */}
      <div className="space-y-4">
        {isLoading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <ReturnCardSkeleton key={i} />
            ))}
          </>
        ) : filteredReturns && filteredReturns.length > 0 ? (
          <>
            {filteredReturns.map((returnRequest, index) => (
              <div
                key={returnRequest._id}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ReturnRequestCard
                  returnRequest={returnRequest}
                  onViewDetails={handleViewDetails}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </div>
            ))}
          </>
        ) : (
          <div className="bg-white rounded-xl border border-grey-200 p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-gold-pale flex items-center justify-center mx-auto mb-4">
              <ArchiveBoxIcon className="w-10 h-10 text-gold" />
            </div>
            <h3 className="text-headline-small font-bold text-grey-900 mb-2">
              No Return Requests Found
            </h3>
            <p className="text-body-small text-grey-600 mb-6">
              {searchQuery
                ? 'No returns match your search criteria. Try adjusting your filters.'
                : selectedStatus
                ? `No ${selectedStatus} returns at the moment.`
                : 'You don\'t have any return requests yet.'}
            </p>
            {(searchQuery || selectedStatus) && (
              <Button
                variant="primary"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus(undefined);
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            {[...Array(data.pagination.totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={clsx(
                  'w-10 h-10 rounded-lg text-body-small font-semibold transition-all duration-200',
                  currentPage === i + 1
                    ? 'bg-gradient-to-r from-gold to-gold-dark text-white shadow-lg scale-110'
                    : 'bg-grey-100 text-grey-700 hover:bg-grey-200 hover:scale-105'
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(data.pagination.totalPages, p + 1))}
            disabled={currentPage === data.pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Detail Modal */}
      <ReturnDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        returnRequest={selectedReturn}
        onApprove={handleApprove}
        onReject={handleReject}
        onCompleteRefund={handleCompleteRefund}
      />
    </div>
  );
};

export default ReturnsPage;
