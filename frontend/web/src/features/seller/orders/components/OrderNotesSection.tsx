import { useState } from 'react';
import { Order } from '../api/ordersApi';
import { motion } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface OrderNotesSectionProps {
  order: Order;
}

const OrderNotesSection = ({ order }: OrderNotesSectionProps) => {
  const [sellerNote, setSellerNote] = useState('');
  const [sellerNotes, setSellerNotes] = useState<Array<{ note: string; timestamp: string }>>([]);

  const handleAddNote = () => {
    if (!sellerNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    const newNote = {
      note: sellerNote,
      timestamp: new Date().toISOString(),
    };

    setSellerNotes([newNote, ...sellerNotes]);
    setSellerNote('');
    toast.success('Note added successfully! 📝');
  };

  const handleSendEmail = () => {
    window.location.href = `mailto:${order.customer.email}?subject=Regarding Order ${order.orderNumber}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="bg-white rounded-2xl border border-grey-200 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="px-8 py-6 border-b border-grey-200 bg-gradient-to-r from-pink-50/50 to-rose-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-grey-900">Notes & Communication</h2>
            <p className="text-sm text-grey-600">Customer notes and internal communication</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Customer Notes */}
        {order.notes && (
          <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span>💬</span>
              <span>Customer's Special Instructions</span>
            </h3>
            <p className="text-grey-700 leading-relaxed">{order.notes}</p>
          </div>
        )}

        {/* Communication Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleSendEmail}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            <EnvelopeIcon className="w-5 h-5" />
            Email Customer
          </button>
          
          {order.shippingAddress.phoneNumber && (
            <a
              href={`tel:${order.shippingAddress.phoneNumber}`}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              <PhoneIcon className="w-5 h-5" />
              Call Customer
            </a>
          )}
        </div>

        {/* Seller Notes (Internal) */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-grey-700">Internal Seller Notes</h3>
          
          {/* Add Note Form */}
          <div className="flex gap-3">
            <input
              type="text"
              value={sellerNote}
              onChange={(e) => setSellerNote(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
              placeholder="Add an internal note about this order..."
              className="flex-1 px-4 py-3 border-2 border-grey-300 rounded-xl focus:border-gold focus:outline-none transition-colors"
            />
            <button
              onClick={handleAddNote}
              className="px-6 py-3 bg-gold text-white rounded-xl font-semibold hover:bg-gold-dark transition-colors flex items-center gap-2"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
              Add Note
            </button>
          </div>

          {/* Notes History */}
          {sellerNotes.length > 0 ? (
            <div className="space-y-3">
              {sellerNotes.map((note, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-amber-50 rounded-lg border border-amber-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-grey-600 font-semibold">You</span>
                    <span className="text-xs text-grey-500">{formatDate(note.timestamp)}</span>
                  </div>
                  <p className="text-grey-700">{note.note}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-grey-500">
              <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-2 text-grey-400" />
              <p className="text-sm">No internal notes yet</p>
            </div>
          )}
        </div>

        {/* Message Templates */}
        <div className="p-6 bg-grey-50 rounded-xl border border-grey-200">
          <h3 className="text-sm font-semibold text-grey-700 mb-3">Quick Message Templates</h3>
          <div className="space-y-2">
            <button
              onClick={() => toast.success('Template selected')}
              className="w-full text-left px-4 py-2 text-sm text-grey-700 hover:bg-white hover:text-gold rounded-lg transition-colors"
            >
              📦 Order Shipped Notification
            </button>
            <button
              onClick={() => toast.success('Template selected')}
              className="w-full text-left px-4 py-2 text-sm text-grey-700 hover:bg-white hover:text-gold rounded-lg transition-colors"
            >
              ⏰ Delay Notification
            </button>
            <button
              onClick={() => toast.success('Template selected')}
              className="w-full text-left px-4 py-2 text-sm text-grey-700 hover:bg-white hover:text-gold rounded-lg transition-colors"
            >
              ✅ Delivery Confirmation
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderNotesSection;

