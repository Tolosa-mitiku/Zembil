import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useAddSellerResponseMutation } from '../api/reviewsApi';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface ResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewId: string;
  reviewerName: string;
  reviewContent: string;
  rating: number;
}

const ResponseModal = ({
  isOpen,
  onClose,
  reviewId,
  reviewerName,
  reviewContent,
  rating,
}: ResponseModalProps) => {
  const [message, setMessage] = useState('');
  const [addResponse, { isLoading }] = useAddSellerResponseMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please enter a response message');
      return;
    }

    try {
      await addResponse({ reviewId, message: message.trim() }).unwrap();
      toast.success('Response added successfully!');
      setMessage('');
      onClose();
    } catch (error) {
      toast.error('Failed to add response. Please try again.');
    }
  };

  // Quick response templates
  const templates = [
    "Thank you for your positive feedback! We're glad you're satisfied with your purchase.",
    "We appreciate your review and will use your feedback to improve our products.",
    "Thank you for taking the time to share your experience with us!",
    "We're sorry to hear about your experience. Please contact us so we can make this right.",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-gold to-gold-dark p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold">Respond to Review</h2>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                  <p className="text-gold-pale/90">Reply to {reviewerName}'s review</p>
                </div>
                {/* Decorative elements */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                {/* Original Review */}
                <div className="bg-grey-50 rounded-2xl p-4 mb-6 border-l-4 border-gold">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-grey-900">{reviewerName}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={clsx('text-xl', i < rating ? 'text-gold' : 'text-grey-300')}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-grey-700 leading-relaxed">{reviewContent}</p>
                </div>

                {/* Quick Templates */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-grey-700 mb-3">
                    Quick Response Templates
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {templates.map((template, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setMessage(template)}
                        className="text-left p-3 bg-white border-2 border-grey-200 rounded-xl hover:border-gold hover:bg-gold-pale/20 transition-all text-sm text-grey-700"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {template}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Response Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-grey-900 mb-2">
                      Your Response
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your response here..."
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-grey-200 rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all resize-none"
                      disabled={isLoading}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-grey-500">
                        {message.length} characters
                      </span>
                      {message.length < 20 && message.length > 0 && (
                        <span className="text-xs text-warning">
                          Consider writing a more detailed response
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3 border-2 border-grey-300 text-grey-700 font-semibold rounded-xl hover:bg-grey-50 active:scale-95 transition-all"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !message.trim()}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-gold to-gold-dark text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <PaperAirplaneIcon className="w-5 h-5" />
                          <span>Send Response</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResponseModal;















