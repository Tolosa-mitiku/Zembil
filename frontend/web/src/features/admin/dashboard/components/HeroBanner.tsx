import { motion } from 'framer-motion';
import clsx from 'clsx';

interface HeroBannerProps {
  adminName: string;
  systemStatus: 'operational' | 'maintenance' | 'alert';
  notificationCount?: number;
}

const HeroBanner = ({
  adminName = 'Admin',
  systemStatus = 'operational',
  notificationCount = 0,
}: HeroBannerProps) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'operational':
        return {
          label: 'Operational',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          dotColor: 'bg-emerald-500',
        };
      case 'maintenance':
        return {
          label: 'Maintenance',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          dotColor: 'bg-orange-500',
        };
      case 'alert':
        return {
          label: 'Alert',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          dotColor: 'bg-red-500',
        };
      default:
        return {
          label: 'Unknown',
          color: 'text-grey-600',
          bgColor: 'bg-grey-50',
          dotColor: 'bg-grey-500',
        };
    }
  };

  const statusConfig = getStatusConfig(systemStatus);
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });

  const tips = [
    'Monitor user activity to identify trends',
    'Regular backups ensure data safety',
    'Keep the platform updated for optimal performance',
    'Review analytics weekly for better insights',
    'Respond to user reports within 24 hours',
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-pink-500 p-8 mb-8 shadow-2xl"
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-4 -left-4 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-4 -right-4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-gold/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold text-white mb-2">
                {getGreeting()}, {adminName}! 👋
              </h1>
              <p className="text-white/90 text-lg mb-4">
                {currentDate} • {currentTime}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30"
            >
              <span className="text-2xl">💡</span>
              <span className="text-white text-sm font-medium">
                Tip: {randomTip}
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4"
          >
            {/* System Status */}
            <div
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/30',
                'bg-white/20'
              )}
            >
              <motion.div
                className={clsx('w-2 h-2 rounded-full', statusConfig.dotColor)}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <span className="text-white font-semibold text-sm">
                System: {statusConfig.label}
              </span>
            </div>

            {/* Notifications */}
            {notificationCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/30 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <motion.span
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {notificationCount > 9 ? '9+' : notificationCount}
                </motion.span>
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </motion.div>
  );
};

export default HeroBanner;

