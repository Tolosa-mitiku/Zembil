import { OrderStatus, ORDER_STATUS } from '@/core/constants';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckIcon,
  XMarkIcon,
  TruckIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  EnvelopeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onUpdateStatus: (status: OrderStatus) => void;
  onExport: () => void;
  onPrintInvoices: () => void;
  onSendNotifications: () => void;
  onDelete?: () => void;
}

const BulkActionsToolbar = ({
  selectedCount,
  onClearSelection,
  onUpdateStatus,
  onExport,
  onPrintInvoices,
  onSendNotifications,
  onDelete,
}: BulkActionsToolbarProps) => {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-grey-900 text-white rounded-2xl shadow-2xl border-2 border-gold px-6 py-4 flex items-center gap-6">
            {/* Selection Count */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center">
                <CheckIcon className="w-5 h-5 text-grey-900 font-bold" />
              </div>
              <div>
                <p className="text-body-small font-semibold">
                  {selectedCount} order{selectedCount !== 1 ? 's' : ''} selected
                </p>
              </div>
            </div>

            <div className="w-px h-10 bg-grey-700" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Update Status Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-grey-800 hover:bg-grey-700 transition-all text-body-small font-medium">
                  <TruckIcon className="w-4 h-4" />
                  Update Status
                </button>
                
                <div className="absolute bottom-full mb-2 left-0 w-48 bg-white rounded-xl shadow-xl border border-grey-200 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button
                    onClick={() => onUpdateStatus(ORDER_STATUS.CONFIRMED)}
                    className="w-full px-4 py-3 text-left text-body-small text-grey-900 hover:bg-blue-50 transition-colors"
                  >
                    Mark as Confirmed
                  </button>
                  <button
                    onClick={() => onUpdateStatus(ORDER_STATUS.PROCESSING)}
                    className="w-full px-4 py-3 text-left text-body-small text-grey-900 hover:bg-purple-50 transition-colors"
                  >
                    Mark as Processing
                  </button>
                  <button
                    onClick={() => onUpdateStatus(ORDER_STATUS.SHIPPED)}
                    className="w-full px-4 py-3 text-left text-body-small text-grey-900 hover:bg-cyan-50 transition-colors"
                  >
                    Mark as Shipped
                  </button>
                  <button
                    onClick={() => onUpdateStatus(ORDER_STATUS.DELIVERED)}
                    className="w-full px-4 py-3 text-left text-body-small text-grey-900 hover:bg-green-50 transition-colors"
                  >
                    Mark as Delivered
                  </button>
                </div>
              </div>

              {/* Export */}
              <button
                onClick={onExport}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-grey-800 hover:bg-grey-700 transition-all text-body-small font-medium"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Export
              </button>

              {/* Print Invoices */}
              <button
                onClick={onPrintInvoices}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-grey-800 hover:bg-grey-700 transition-all text-body-small font-medium"
              >
                <PrinterIcon className="w-4 h-4" />
                Print
              </button>

              {/* Send Notifications */}
              <button
                onClick={onSendNotifications}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-grey-800 hover:bg-grey-700 transition-all text-body-small font-medium"
              >
                <EnvelopeIcon className="w-4 h-4" />
                Notify
              </button>

              {/* Delete (optional) */}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all text-body-small font-medium"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>

            <div className="w-px h-10 bg-grey-700" />

            {/* Clear Selection */}
            <button
              onClick={onClearSelection}
              className="w-10 h-10 rounded-lg bg-grey-800 hover:bg-grey-700 transition-all flex items-center justify-center"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkActionsToolbar;

















