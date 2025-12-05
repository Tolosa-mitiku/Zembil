import { motion } from 'framer-motion';
import {
  ClockIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { format } from 'date-fns';
import { CalendarEvent } from '../pages/CalendarPage';

interface EventCardProps {
  event: CalendarEvent;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
  delay?: number;
}

const EventCard = ({
  event,
  onEdit,
  onDelete,
  onToggleComplete,
  delay = 0,
}: EventCardProps) => {
  const categoryStyles = {
    order: {
      bg: 'from-gold-400 to-gold-600',
      icon: '📦',
      label: 'Order',
    },
    meeting: {
      bg: 'from-blue-400 to-blue-600',
      icon: '🤝',
      label: 'Meeting',
    },
    promotion: {
      bg: 'from-pink-400 to-pink-600',
      icon: '🎉',
      label: 'Promotion',
    },
    reminder: {
      bg: 'from-purple-400 to-purple-600',
      icon: '⏰',
      label: 'Reminder',
    },
    personal: {
      bg: 'from-green-400 to-green-600',
      icon: '👤',
      label: 'Personal',
    },
  };

  const style = categoryStyles[event.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={clsx(
        'bg-white rounded-xl border-2 shadow-md hover:shadow-xl transition-all overflow-hidden',
        event.completed ? 'border-green-200 opacity-75' : 'border-grey-200'
      )}
    >
      {/* Color Bar */}
      <div className={clsx('h-2 bg-gradient-to-r', style.bg)} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{style.icon}</span>
              <span className="text-xs font-bold text-grey-500 uppercase tracking-wider">
                {style.label}
              </span>
              {event.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold"
                >
                  <CheckCircleSolidIcon className="w-3 h-3" />
                  Completed
                </motion.div>
              )}
            </div>

            <h3
              className={clsx(
                'text-xl font-bold text-grey-900 mb-2',
                event.completed && 'line-through opacity-60'
              )}
            >
              {event.title}
            </h3>

            {event.description && (
              <p className="text-sm text-grey-600 mb-3 line-clamp-2">
                {event.description}
              </p>
            )}

            {/* Event Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-grey-600">
                <ClockIcon className="w-4 h-4" />
                <span className="font-medium">
                  {format(event.date, 'MMM d, yyyy')} • {event.startTime} - {event.endTime}
                </span>
              </div>

              {event.location && (
                <div className="flex items-center gap-2 text-sm text-grey-600">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-grey-100">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleComplete}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all',
              event.completed
                ? 'bg-grey-100 text-grey-600 hover:bg-grey-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            )}
          >
            {event.completed ? (
              <>
                <CheckCircleIcon className="w-4 h-4" />
                Mark Incomplete
              </>
            ) : (
              <>
                <CheckCircleSolidIcon className="w-4 h-4" />
                Mark Complete
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-all"
          >
            <PencilIcon className="w-4 h-4" />
            Edit
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-all ml-auto"
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;





