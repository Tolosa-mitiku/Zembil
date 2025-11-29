import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Button from '@/shared/components/Button';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onDiscard: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

const UnsavedChangesModal = ({
  isOpen,
  onCancel,
  onDiscard,
  onSave,
  isSaving = false,
}: UnsavedChangesModalProps) => {
  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-yellow-50 to-orange-50 p-6 border-b border-yellow-100">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-grey-900">Unsaved Changes</h3>
              <p className="mt-1 text-sm text-grey-600">
                You have unsaved changes that will be lost if you leave this page.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-base text-grey-700 mb-6">
            Would you like to save your changes before leaving?
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onDiscard}
              disabled={isSaving}
              className="flex-1 px-4 py-3 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Discard Changes
            </button>
            <button
              onClick={onCancel}
              disabled={isSaving}
              className="flex-1 px-4 py-3 text-sm font-semibold text-grey-700 bg-grey-100 rounded-xl hover:bg-grey-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-gold to-gold-dark rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                'Save & Continue'
              )}
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="px-6 py-3 bg-grey-50 border-t border-grey-100">
          <p className="text-xs text-grey-500 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-white rounded text-xs font-semibold border border-grey-200">ESC</kbd> to cancel
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default UnsavedChangesModal;

