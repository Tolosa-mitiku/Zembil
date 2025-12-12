import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  DocumentTextIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { format } from 'date-fns';
import { CalendarEvent } from '../pages/CalendarPage';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  event: CalendarEvent | null;
}

const EventModal = ({ isOpen, onClose, onSave, event }: EventModalProps) => {
  const [formData, setFormData] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    category: 'personal',
    color: '#10B981',
  });

  useEffect(() => {
    if (event) {
      setFormData(event);
    } else {
      setFormData({
        title: '',
        description: '',
        date: new Date(),
        startTime: '09:00',
        endTime: '10:00',
        location: '',
        category: 'personal',
        color: '#10B981',
      });
    }
  }, [event]);

  const categories = [
    { value: 'order', label: 'Order', color: '#D4AF37', icon: '📦' },
    { value: 'meeting', label: 'Meeting', color: '#3B82F6', icon: '🤝' },
    { value: 'promotion', label: 'Promotion', color: '#EC4899', icon: '🎉' },
    { value: 'reminder', label: 'Reminder', color: '#8B5CF6', icon: '⏰' },
    { value: 'personal', label: 'Personal', color: '#10B981', icon: '👤' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.date && formData.startTime && formData.endTime) {
      onSave(formData as CalendarEvent);
      onClose();
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-pink-500 p-6">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
                    >
                      <CalendarIcon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {event ? 'Edit Event' : 'New Event'}
                      </h2>
                      <p className="text-white/80 text-sm">
                        {event ? 'Update event details' : 'Create a new calendar event'}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6 text-white" />
                  </motion.button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-semibold text-grey-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Enter event title"
                    className="w-full px-4 py-3 border border-grey-200 rounded-xl focus:border-gold focus:ring-2 focus:ring-gold focus:ring-offset-0 transition-all"
                    required
                  />
                </motion.div>

                {/* Category */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-semibold text-grey-700 mb-3">
                    Category *
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {categories.map((cat) => (
                      <motion.button
                        key={cat.value}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          handleChange('category', cat.value);
                          handleChange('color', cat.color);
                        }}
                        className={clsx(
                          'p-4 rounded-xl border-2 transition-all text-center',
                          formData.category === cat.value
                            ? 'border-gold bg-gold-50 shadow-md'
                            : 'border-grey-200 hover:border-grey-300 hover:shadow-sm'
                        )}
                      >
                        <div className="text-2xl mb-1">{cat.icon}</div>
                        <div className="text-xs font-semibold text-grey-700">
                          {cat.label}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-semibold text-grey-700 mb-2">
                      Date *
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400" />
                      <input
                        type="date"
                        value={formData.date ? format(formData.date, 'yyyy-MM-dd') : ''}
                        onChange={(e) => handleChange('date', new Date(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 border border-grey-200 rounded-xl focus:border-gold focus:ring-2 focus:ring-gold focus:ring-offset-0 transition-all"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <label className="block text-sm font-semibold text-grey-700 mb-2">
                      Start Time *
                    </label>
                    <div className="relative">
                      <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400" />
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => handleChange('startTime', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-grey-200 rounded-xl focus:border-gold focus:ring-2 focus:ring-gold focus:ring-offset-0 transition-all"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-semibold text-grey-700 mb-2">
                      End Time *
                    </label>
                    <div className="relative">
                      <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400" />
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => handleChange('endTime', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-grey-200 rounded-xl focus:border-gold focus:ring-2 focus:ring-gold focus:ring-offset-0 transition-all"
                        required
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Location */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <label className="block text-sm font-semibold text-grey-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      placeholder="Add location"
                      className="w-full pl-10 pr-4 py-3 border border-grey-200 rounded-xl focus:border-gold focus:ring-2 focus:ring-gold focus:ring-offset-0 transition-all"
                    />
                  </div>
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-semibold text-grey-700 mb-2">
                    Description
                  </label>
                  <div className="relative">
                    <DocumentTextIcon className="absolute left-3 top-3 w-5 h-5 text-grey-400" />
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Add event details..."
                      rows={4}
                      className="w-full pl-10 pr-4 py-3 border border-grey-200 rounded-xl focus:border-gold focus:ring-2 focus:ring-gold focus:ring-offset-0 transition-all resize-none"
                    />
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="flex items-center gap-3 pt-4 border-t border-grey-200"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {event ? 'Update Event' : 'Create Event'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 border-2 border-grey-200 text-grey-700 rounded-xl font-semibold hover:bg-grey-50 transition-all"
                  >
                    Cancel
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EventModal;















