import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { CalendarEvent } from '../pages/CalendarPage';

interface EventStatsProps {
  events: CalendarEvent[];
}

const EventStats = ({ events }: EventStatsProps) => {
  const totalEvents = events.length;
  const completedEvents = events.filter((e) => e.completed).length;
  const upcomingEvents = events.filter((e) => e.date >= new Date() && !e.completed).length;
  const todayEvents = events.filter((e) => {
    const today = new Date();
    return (
      e.date.toDateString() === today.toDateString() && !e.completed
    );
  }).length;

  const stats = [
    {
      id: 'total',
      label: 'Total Events',
      value: totalEvents,
      icon: CalendarDaysIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      gradient: 'from-blue-400 to-blue-600',
    },
    {
      id: 'completed',
      label: 'Completed',
      value: completedEvents,
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      gradient: 'from-green-400 to-green-600',
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      value: upcomingEvents,
      icon: ClockIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      gradient: 'from-purple-400 to-purple-600',
    },
    {
      id: 'today',
      label: 'Today',
      value: todayEvents,
      icon: SparklesIcon,
      color: 'text-gold',
      bgColor: 'bg-gold-50',
      gradient: 'from-gold to-gold-dark',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + idx * 0.05, type: 'spring' }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="relative overflow-hidden bg-white rounded-xl border border-grey-200 p-5 shadow-sm hover:shadow-md transition-all"
          >
            {/* Gradient Background */}
            <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
              <div
                className={clsx(
                  'w-full h-full rounded-full blur-2xl bg-gradient-to-br',
                  stat.gradient
                )}
              />
            </div>

            <div className="relative z-10">
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={clsx('inline-flex p-3 rounded-xl mb-3', stat.bgColor)}
              >
                <Icon className={clsx('w-6 h-6', stat.color)} />
              </motion.div>

              {/* Value */}
              <div className="mb-1">
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.05, type: 'spring' }}
                  className="text-3xl font-bold text-grey-900"
                >
                  <CountUp
                    end={stat.value}
                    duration={1.5}
                    delay={0.3 + idx * 0.05}
                  />
                </motion.div>
              </div>

              {/* Label */}
              <p className="text-sm font-medium text-grey-600">{stat.label}</p>
            </div>

            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
              animate={{
                x: ['-100%', '100%'],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default EventStats;

