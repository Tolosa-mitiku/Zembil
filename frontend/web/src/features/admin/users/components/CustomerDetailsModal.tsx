import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, useGetUserDetailsQuery, useUpdateUserRoleMutation, useUpdateUserStatusMutation } from '../api/usersApi';
import Modal from '@/shared/components/Modal';
import Button from '@/shared/components/Button';
import Shimmer from '@/shared/components/Shimmer';
import { formatDate, formatCurrency } from '@/core/utils/format';
import {
  XMarkIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ShieldCheckIcon,
  UserIcon,
  BriefcaseIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const CustomerDetailsModal = ({ isOpen, onClose, userId }: CustomerDetailsModalProps) => {
  const { data, isLoading } = useGetUserDetailsQuery(userId, { skip: !userId });
  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [updateUserStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();
  
  const [showRoleConfirm, setShowRoleConfirm] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [suspensionReason, setSuspensionReason] = useState('');

  if (!data) return null;

  const { user, orderStats, sellerProfile } = data;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'seller':
        return BriefcaseIcon;
      case 'admin':
        return ShieldCheckIcon;
      default:
        return UserIcon;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'seller':
        return 'text-purple-600 bg-purple-50';
      case 'admin':
        return 'text-gold bg-gold-pale';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'suspended':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'banned':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-grey-700 bg-grey-50 border-grey-200';
    }
  };

  const handleRoleChange = (role: string) => {
    if (role === user.role) {
      toast.error('User already has this role');
      return;
    }
    setSelectedRole(role);
    setShowRoleConfirm(true);
  };

  const confirmRoleChange = async () => {
    try {
      await updateUserRole({ id: userId, role: selectedRole as any }).unwrap();
      toast.success(`User role updated to ${selectedRole}`);
      setShowRoleConfirm(false);
      setSelectedRole('');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to update role');
    }
  };

  const handleStatusChange = (status: string) => {
    if (status === user.accountStatus) {
      toast.error('User already has this status');
      return;
    }
    setSelectedStatus(status);
    setShowStatusConfirm(true);
  };

  const confirmStatusChange = async () => {
    try {
      await updateUserStatus({
        id: userId,
        accountStatus: selectedStatus as any,
        reason: suspensionReason || undefined,
      }).unwrap();
      toast.success(`User account ${selectedStatus}`);
      setShowStatusConfirm(false);
      setSelectedStatus('');
      setSuspensionReason('');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to update status');
    }
  };

  const RoleIcon = getRoleIcon(user.role);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title=""
        size="large"
      >
        {isLoading ? (
          <div className="space-y-6 p-6">
            <Shimmer className="h-32 w-full rounded-xl" />
            <Shimmer className="h-20 w-full rounded-lg" />
            <Shimmer className="h-20 w-full rounded-lg" />
            <Shimmer className="h-40 w-full rounded-lg" />
          </div>
        ) : (
          <div className="relative">
            {/* Header with gradient */}
            <div className="relative h-32 bg-gradient-to-br from-gold via-gold-accent to-gold-light overflow-hidden">
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                style={{
                  backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
                  backgroundSize: '30px 30px',
                }}
              />
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all shadow-lg hover:scale-110"
              >
                <XMarkIcon className="w-5 h-5 text-grey-700" />
              </button>
            </div>

            {/* Profile Section */}
            <div className="px-8 pb-8">
              {/* Avatar */}
              <div className="relative -mt-16 mb-6">
                <div className="relative inline-block">
                  {user.image ? (
                    <motion.img
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      src={user.image}
                      alt={user.name}
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl"
                    />
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="w-32 h-32 rounded-2xl bg-gradient-to-br from-grey-300 to-grey-400 flex items-center justify-center border-4 border-white shadow-xl"
                    >
                      <UserCircleIcon className="w-20 h-20 text-white" />
                    </motion.div>
                  )}
                  
                  {/* Role badge */}
                  <div className={clsx('absolute -bottom-3 -right-3 px-3 py-1.5 rounded-xl flex items-center gap-2 border-2 border-white shadow-lg font-semibold text-label-small', getRoleColor(user.role))}>
                    <RoleIcon className="w-4 h-4" />
                    <span>{user.role.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Name and Status */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-headline-large font-bold text-grey-900 mb-2">
                    {user.name}
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className={clsx('px-4 py-2 rounded-lg font-semibold text-body-small border-2', getStatusColor(user.accountStatus))}>
                      {user.accountStatus.charAt(0).toUpperCase() + user.accountStatus.slice(1)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
              >
                <div className="flex items-center gap-3 p-4 bg-grey-50 rounded-xl border border-grey-200">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <EnvelopeIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-label-small text-grey-600 font-medium">Email</p>
                    <p className="text-body-small text-grey-900 font-semibold">{user.email}</p>
                  </div>
                </div>

                {user.phoneNumber && (
                  <div className="flex items-center gap-3 p-4 bg-grey-50 rounded-xl border border-grey-200">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <PhoneIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-label-small text-grey-600 font-medium">Phone</p>
                      <p className="text-body-small text-grey-900 font-semibold">{user.phoneNumber}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-4 bg-grey-50 rounded-xl border border-grey-200">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-label-small text-grey-600 font-medium">Member Since</p>
                    <p className="text-body-small text-grey-900 font-semibold">{formatDate(user.createdAt)}</p>
                  </div>
                </div>

                {user.lastLogin && (
                  <div className="flex items-center gap-3 p-4 bg-grey-50 rounded-xl border border-grey-200">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                      <CalendarIcon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-label-small text-grey-600 font-medium">Last Login</p>
                      <p className="text-body-small text-grey-900 font-semibold">{formatDate(user.lastLogin)}</p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Order Statistics */}
              {orderStats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6"
                >
                  <h3 className="text-headline-small font-bold text-grey-900 mb-4">
                    Order Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-200 flex items-center justify-center">
                          <ShoppingBagIcon className="w-5 h-5 text-blue-700" />
                        </div>
                        <p className="text-label-medium text-blue-700 font-semibold">Total Orders</p>
                      </div>
                      <p className="text-4xl font-bold text-blue-700">{orderStats.totalOrders}</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-green-200 flex items-center justify-center">
                          <CurrencyDollarIcon className="w-5 h-5 text-green-700" />
                        </div>
                        <p className="text-label-medium text-green-700 font-semibold">Total Spent</p>
                      </div>
                      <p className="text-4xl font-bold text-green-700">{formatCurrency(orderStats.totalSpent)}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-headline-small font-bold text-grey-900">
                  Admin Actions
                </h3>
                
                {/* Role Management */}
                <div className="p-5 bg-grey-50 rounded-xl border border-grey-200">
                  <p className="text-body-medium font-semibold text-grey-900 mb-3">Change User Role</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={user.role === 'buyer' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => handleRoleChange('buyer')}
                      disabled={isUpdatingRole || user.role === 'buyer'}
                      leftIcon={<UserIcon className="w-4 h-4" />}
                    >
                      Buyer
                    </Button>
                    <Button
                      variant={user.role === 'seller' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => handleRoleChange('seller')}
                      disabled={isUpdatingRole || user.role === 'seller'}
                      leftIcon={<BriefcaseIcon className="w-4 h-4" />}
                    >
                      Seller
                    </Button>
                    <Button
                      variant={user.role === 'admin' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => handleRoleChange('admin')}
                      disabled={isUpdatingRole || user.role === 'admin'}
                      leftIcon={<ShieldCheckIcon className="w-4 h-4" />}
                    >
                      Admin
                    </Button>
                  </div>
                </div>

                {/* Status Management */}
                <div className="p-5 bg-grey-50 rounded-xl border border-grey-200">
                  <p className="text-body-medium font-semibold text-grey-900 mb-3">Account Status</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={user.accountStatus === 'active' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => handleStatusChange('active')}
                      disabled={isUpdatingStatus || user.accountStatus === 'active'}
                      leftIcon={<CheckCircleIcon className="w-4 h-4" />}
                    >
                      Activate
                    </Button>
                    <Button
                      variant={user.accountStatus === 'suspended' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => handleStatusChange('suspended')}
                      disabled={isUpdatingStatus || user.accountStatus === 'suspended'}
                      leftIcon={<ExclamationTriangleIcon className="w-4 h-4" />}
                    >
                      Suspend
                    </Button>
                    <Button
                      variant={user.accountStatus === 'banned' ? 'danger' : 'secondary'}
                      size="sm"
                      onClick={() => handleStatusChange('banned')}
                      disabled={isUpdatingStatus || user.accountStatus === 'banned'}
                      leftIcon={<XMarkIcon className="w-4 h-4" />}
                    >
                      Ban
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </Modal>

      {/* Role Confirmation Modal */}
      <Modal
        isOpen={showRoleConfirm}
        onClose={() => setShowRoleConfirm(false)}
        title="Confirm Role Change"
        size="small"
      >
        <div className="space-y-4">
          <p className="text-body-medium text-grey-700">
            Are you sure you want to change this user's role to <strong>{selectedRole}</strong>?
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowRoleConfirm(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmRoleChange} disabled={isUpdatingRole}>
              {isUpdatingRole ? 'Updating...' : 'Confirm'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Status Confirmation Modal */}
      <Modal
        isOpen={showStatusConfirm}
        onClose={() => setShowStatusConfirm(false)}
        title="Confirm Status Change"
        size="small"
      >
        <div className="space-y-4">
          <p className="text-body-medium text-grey-700">
            Are you sure you want to change this user's status to <strong>{selectedStatus}</strong>?
          </p>
          
          {(selectedStatus === 'suspended' || selectedStatus === 'banned') && (
            <div>
              <label className="block text-label-medium font-medium text-grey-900 mb-2">
                Reason (optional)
              </label>
              <textarea
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="Enter reason for suspension/ban..."
                className="w-full px-4 py-3 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                rows={3}
              />
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowStatusConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant={selectedStatus === 'banned' ? 'danger' : 'primary'}
              onClick={confirmStatusChange}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus ? 'Updating...' : 'Confirm'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CustomerDetailsModal;

