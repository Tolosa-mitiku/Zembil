import { motion } from 'framer-motion';
import {
  CalendarIcon,
  ClockIcon,
  BellIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
  onClick: () => void;
}

interface CalendarQuickActionsProps {
  onAddEvent: () => void;
}

const CalendarQuickActions = ({ onAddEvent }: CalendarQuickActionsProps) => {
  const quickActions: QuickAction[] = [
    {
      id: 'today',
      label: "Today's Events",
      icon: CalendarIcon,
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-blue-600',
      onClick: () => {
        // Filter to today's events
      },
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: ClockIcon,
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-purple-600',
      onClick: () => {
        // Show upcoming events
      },
    },
    {
      id: 'reminders',
      label: 'Set Reminder',
      icon: BellIcon,
      color: 'text-pink-600',
      gradient: 'from-pink-500 to-pink-600',
      onClick: onAddEvent,
    },
    {
      id: 'quick-add',
      label: 'Quick Add',
      icon: SparklesIcon,
      color: 'text-gold',
      gradient: 'from-gold to-gold-dark',
      onClick: onAddEvent,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-xl border border-grey-200 p-6 shadow-sm"
    >
      <h3 className="text-lg font-bold text-grey-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + idx * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.onClick}
              className="relative overflow-hidden group"
            >
              <div
                className={clsx(
                  'p-4 rounded-xl bg-gradient-to-br shadow-sm',
                  'hover:shadow-md transition-all',
                  action.gradient
                )}
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />

                <div className="relative z-10">
                  <Icon className="w-6 h-6 text-white mb-2" />
                  <p className="text-sm font-semibold text-white text-left">
                    {action.label}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CalendarQuickActions;

