import { useState, useEffect } from 'react';
import { Order } from '../api/ordersApi';
import OrderStatusBadge from './OrderStatusBadge';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  TruckIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  PrinterIcon,
  EnvelopeIcon,
  XCircleIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import clsx from 'clsx';
import { useShipOrderMutation, useDeliverOrderMutation } from '../api/ordersApi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface OrderDetailHeaderProps {
  order: Order;
  onBack: () => void;
}

const OrderDetailHeader = ({ order, onBack }: OrderDetailHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [shipOrder, { isLoading: isShipping }] = useShipOrderMutation();
  const [deliverOrder, { isLoading: isDelivering }] = useDeliverOrderMutation();

  // Handle scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get primary action based on status
  const getPrimaryAction = () => {
    switch (order.status) {
      case 'confirmed':
      case 'processing':
        return {
          label: 'Mark as Shipped',
          icon: TruckIcon,
          onClick: () => {
            // Open ship order modal (you can implement this)
            toast.success('Ship order modal would open here');
          },
        };
      case 'shipped':
      case 'out_for_delivery':
        return {
          label: 'Mark as Delivered',
          icon: CheckCircleIcon,
          onClick: async () => {
            try {
              await deliverOrder(order._id).unwrap();
              toast.success('Order marked as delivered! ✅');
            } catch (error: any) {
              toast.error(error?.data?.message || 'Failed to mark as delivered');
            }
          },
        };
      case 'delivered':
        return {
          label: 'View Receipt',
          icon: DocumentTextIcon,
          onClick: () => toast.success('Receipt view coming soon'),
        };
      default:
        return null;
    }
  };

  const primaryAction = getPrimaryAction();

  // Format date
  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-grey-200'
          : 'bg-white shadow-sm border-b border-grey-100'
      )}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Side */}
          <div className="flex items-center space-x-6">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-grey-600 hover:text-gold hover:bg-gold/5 transition-all group"
            >
              <ChevronLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Back</span>
            </button>

            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm">
              <a href="/seller" className="text-grey-600 hover:text-gold transition-colors">
                Seller
              </a>
              <ChevronRightIcon className="w-4 h-4 text-grey-400" />
              <a href="/seller/orders" className="text-grey-600 hover:text-gold transition-colors">
                Orders
              </a>
              <ChevronRightIcon className="w-4 h-4 text-grey-400" />
              <span className="text-grey-900 font-medium">{order.orderNumber}</span>
            </nav>
          </div>

          {/* Center - Order Info */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-gold">{order.orderNumber}</div>
              <div className="text-xs text-grey-500" title={new Date(order.createdAt).toLocaleString()}>
                {formatDate(order.createdAt)}
              </div>
            </div>
            <OrderStatusBadge status={order.status} size="lg" />
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center space-x-3">
            {/* Primary Action */}
            {primaryAction && (
              <button
                onClick={primaryAction.onClick}
                disabled={isShipping || isDelivering}
                className={clsx(
                  'hidden md:flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold',
                  'bg-gold text-white hover:bg-gold-dark shadow-lg shadow-gold/20',
                  'transform hover:scale-105 transition-all duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {isShipping || isDelivering ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <primaryAction.icon className="w-5 h-5" />
                    <span>{primaryAction.label}</span>
                  </>
                )}
              </button>
            )}

            {/* Secondary Actions Dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button
                className={clsx(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium',
                  'border-2 border-grey-300 text-grey-700 hover:border-gold hover:text-gold',
                  'transition-all duration-200'
                )}
              >
                <EllipsisVerticalIcon className="w-5 h-5" />
                <span className="hidden sm:inline">More</span>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-grey-100 z-50">
                  {/* Print Actions */}
                  <div className="p-2">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => window.print()}
                          className={clsx(
                            'group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors',
                            active ? 'bg-gold/10 text-gold' : 'text-grey-700'
                          )}
                        >
                          <PrinterIcon className="w-5 h-5" />
                          Print Invoice
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => toast.success('Printing label...')}
                          className={clsx(
                            'group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors',
                            active ? 'bg-gold/10 text-gold' : 'text-grey-700'
                          )}
                        >
                          <PrinterIcon className="w-5 h-5" />
                          Print Shipping Label
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => toast.success('Downloading PDF...')}
                          className={clsx(
                            'group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors',
                            active ? 'bg-gold/10 text-gold' : 'text-grey-700'
                          )}
                        >
                          <DocumentTextIcon className="w-5 h-5" />
                          Download PDF
                        </button>
                      )}
                    </Menu.Item>
                  </div>

                  {/* Communication Actions */}
                  <div className="p-2">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => window.location.href = `mailto:${order.customer.email}`}
                          className={clsx(
                            'group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors',
                            active ? 'bg-gold/10 text-gold' : 'text-grey-700'
                          )}
                        >
                          <EnvelopeIcon className="w-5 h-5" />
                          Contact Customer
                        </button>
                      )}
                    </Menu.Item>
                  </div>

                  {/* Other Actions */}
                  <div className="p-2">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => toast.success('Duplicate order feature coming soon')}
                          className={clsx(
                            'group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors',
                            active ? 'bg-gold/10 text-gold' : 'text-grey-700'
                          )}
                        >
                          <DocumentDuplicateIcon className="w-5 h-5" />
                          Duplicate Order
                        </button>
                      )}
                    </Menu.Item>
                  </div>

                  {/* Danger Zone */}
                  {order.status !== 'delivered' && order.status !== 'canceled' && (
                    <div className="p-2">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => toast.error('Cancel order feature coming soon')}
                            className={clsx(
                              'group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors',
                              active ? 'bg-red-50 text-red-600' : 'text-red-600'
                            )}
                          >
                            <XCircleIcon className="w-5 h-5" />
                            Cancel Order
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  )}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default OrderDetailHeader;

