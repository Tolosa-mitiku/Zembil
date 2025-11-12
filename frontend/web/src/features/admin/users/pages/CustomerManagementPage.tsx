import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useGetAdminUsersQuery,
  useGetUserStatsQuery,
  User,
} from '../api/usersApi';
import CustomerStatsCard from '../components/CustomerStatsCard';
import CustomerCard from '../components/CustomerCard';
import CustomerSearchBar from '../components/CustomerSearchBar';
import CustomerDetailsModal from '../components/CustomerDetailsModal';
import CustomerManagementSkeleton from '../components/CustomerManagementSkeleton';
import EmptyState from '@/shared/components/EmptyState';
import {
  UsersIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ShoppingBagIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

const CustomerManagementPage = () => {
  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 12;

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal state
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // API queries
  const { data: statsData, isLoading: isStatsLoading } = useGetUserStatsQuery();
  const { data: usersData, isLoading: isUsersLoading } = useGetAdminUsersQuery({
    page,
    limit,
    role: roleFilter || undefined,
    accountStatus: statusFilter || undefined,
    search: searchQuery || undefined,
  });

  const users = usersData?.users || [];
  const pagination = usersData?.pagination;
  const stats = statsData;

  // Filter users locally for instant search feedback
  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [users, searchQuery]);

  // Handlers
  const handleViewDetails = (user: User) => {
    setSelectedUserId(user._id);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedUserId(null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatsCardClick = (filter: { role?: string; status?: string }) => {
    if (filter.role) {
      setRoleFilter(filter.role === roleFilter ? '' : filter.role);
    }
    if (filter.status) {
      setStatusFilter(filter.status === statusFilter ? '' : filter.status);
    }
    setPage(1);
  };

  // Show skeleton while loading stats or users
  if (isStatsLoading || isUsersLoading) {
    return <CustomerManagementSkeleton />;
  }

  return (
    <div className="min-h-screen bg-grey-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-grey-900 mb-3">
            Customer Management
          </h1>
          <p className="text-body-large text-grey-600">
            Manage and monitor all platform users in one place
          </p>
        </motion.div>

        {/* Stats Cards */}
        {stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users */}
            <CustomerStatsCard
              title="Total Customers"
              value={stats.overview.totalUsers}
              subtitle="All registered users"
              icon={UsersIcon}
              color="blue"
              trend={{ value: 12, isPositive: true }}
              delay={0}
            />

            {/* Active Users */}
            <CustomerStatsCard
              title="Active Users"
              value={stats.overview.activeUsers}
              subtitle="Currently active"
              icon={CheckCircleIcon}
              color="green"
              onClick={() => handleStatsCardClick({ status: 'active' })}
              delay={0.1}
            />

            {/* Suspended Users */}
            <CustomerStatsCard
              title="Suspended"
              value={stats.overview.suspendedUsers}
              subtitle="Temporarily suspended"
              icon={ExclamationTriangleIcon}
              color="orange"
              onClick={() => handleStatsCardClick({ status: 'suspended' })}
              delay={0.2}
            />

            {/* Banned Users */}
            <CustomerStatsCard
              title="Banned"
              value={stats.overview.bannedUsers}
              subtitle="Permanently banned"
              icon={XCircleIcon}
              color="red"
              onClick={() => handleStatsCardClick({ status: 'banned' })}
              delay={0.3}
            />

            {/* Buyers */}
            <CustomerStatsCard
              title="Buyers"
              value={stats.byRole.buyers}
              subtitle="Customer accounts"
              icon={ShoppingBagIcon}
              color="purple"
              onClick={() => handleStatsCardClick({ role: 'buyer' })}
              delay={0.4}
            />

            {/* Sellers */}
            <CustomerStatsCard
              title="Sellers"
              value={stats.byRole.sellers}
              subtitle="Merchant accounts"
              icon={BriefcaseIcon}
              color="gold"
              onClick={() => handleStatsCardClick({ role: 'seller' })}
              delay={0.5}
            />

            {/* Admins */}
            <CustomerStatsCard
              title="Admins"
              value={stats.byRole.admins}
              subtitle="Administrator accounts"
              icon={ShieldCheckIcon}
              color="blue"
              onClick={() => handleStatsCardClick({ role: 'admin' })}
              delay={0.6}
            />

            {/* New Users (Last 30 Days) */}
            <CustomerStatsCard
              title="New This Month"
              value={stats.growth.last30Days}
              subtitle="Last 30 days"
              icon={ArrowTrendingUpIcon}
              color="green"
              trend={{ value: 24, isPositive: true }}
              delay={0.7}
            />
          </div>
        ) : null}

        {/* Search and Filters */}
        <div className="mb-6">
          <CustomerSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            totalResults={pagination?.total || 0}
          />
        </div>

        {/* Customer Cards Grid */}
        {filteredUsers.length > 0 ? (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredUsers.map((user, index) => (
                  <CustomerCard
                    key={user._id}
                    user={user}
                    onViewDetails={handleViewDetails}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={clsx(
                    'flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-body-small transition-all border-2',
                    page === 1
                      ? 'bg-grey-100 text-grey-400 border-grey-200 cursor-not-allowed'
                      : 'bg-white text-grey-700 border-grey-300 hover:border-gold hover:text-gold hover:shadow-lg'
                  )}
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                  <span>Previous</span>
                </motion.button>

                <div className="flex items-center gap-2">
                  {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
                    let pageNumber;
                    if (pagination.totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (page <= 3) {
                      pageNumber = index + 1;
                    } else if (page >= pagination.totalPages - 2) {
                      pageNumber = pagination.totalPages - 4 + index;
                    } else {
                      pageNumber = page - 2 + index;
                    }

                    return (
                      <motion.button
                        key={pageNumber}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(pageNumber)}
                        className={clsx(
                          'w-12 h-12 rounded-lg font-semibold text-body-small transition-all border-2',
                          page === pageNumber
                            ? 'bg-gold text-white border-gold shadow-lg'
                            : 'bg-white text-grey-700 border-grey-300 hover:border-gold hover:text-gold'
                        )}
                      >
                        {pageNumber}
                      </motion.button>
                    );
                  })}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.totalPages}
                  className={clsx(
                    'flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-body-small transition-all border-2',
                    page === pagination.totalPages
                      ? 'bg-grey-100 text-grey-400 border-grey-200 cursor-not-allowed'
                      : 'bg-white text-grey-700 border-grey-300 hover:border-gold hover:text-gold hover:shadow-lg'
                  )}
                >
                  <span>Next</span>
                  <ChevronRightIcon className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </>
        ) : (
          <EmptyState
            icon={UsersIcon}
            title="No customers found"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        )}
      </div>

      {/* Customer Details Modal */}
      {selectedUserId && (
        <CustomerDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseModal}
          userId={selectedUserId}
        />
      )}
    </div>
  );
};

export default CustomerManagementPage;

