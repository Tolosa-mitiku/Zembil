import { motion, AnimatePresence } from 'framer-motion';
import {
  TrashIcon,
  PencilSquareIcon,
  ArrowDownTrayIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Button from '@/shared/components/Button';
import clsx from 'clsx';

interface BulkActionsToolbarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkDelete: () => void;
  onBulkEdit?: () => void;
  onBulkExport?: () => void;
}

const BulkActionsToolbar = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBulkDelete,
  onBulkEdit,
  onBulkExport
}: BulkActionsToolbarProps) => {
  const allSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="sticky top-0 z-30 bg-gradient-to-r from-gold to-gold-light rounded-lg 
                   shadow-heavy p-4 mb-6"
        >
          <div className="flex items-center justify-between">
            {/* Selection Info */}
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-3"
              >
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-title-medium text-white font-semibold">
                    {selectedCount} {selectedCount === 1 ? 'product' : 'products'} selected
                  </p>
                  <p className="text-label-small text-white/80">
                    {allSelected ? 'All products selected' : `${totalCount - selectedCount} remaining`}
                  </p>
                </div>
              </motion.div>

              {/* Select/Deselect All */}
              <button
                onClick={allSelected ? onDeselectAll : onSelectAll}
                className="px-3 py-1.5 text-label-medium text-white bg-white/20 hover:bg-white/30 
                         rounded-lg transition-colors backdrop-blur-sm font-medium"
              >
                {allSelected ? 'Deselect All' : `Select All (${totalCount})`}
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {onBulkEdit && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button
                    onClick={onBulkEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-grey-900 
                             hover:bg-grey-50 rounded-lg transition-colors font-medium shadow-sm"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                </motion.div>
              )}

              {onBulkExport && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button
                    onClick={onBulkExport}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-grey-900 
                             hover:bg-grey-50 rounded-lg transition-colors font-medium shadow-sm"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                </motion.div>
              )}

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button
                  onClick={onBulkDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-error text-white 
                           hover:bg-error/90 rounded-lg transition-colors font-medium shadow-sm"
                >
                  <TrashIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </motion.div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDeselectAll}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors ml-2"
                title="Clear selection"
              >
                <XMarkIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkActionsToolbar;

