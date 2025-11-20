import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/shared/components/Card';
import {
  LightBulbIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface Insight {
  id: string;
  type: 'trend' | 'opportunity' | 'alert' | 'tip';
  message: string;
  icon: any;
  color: string;
  bgColor: string;
}

const InsightsCard = () => {
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);

  const insights: Insight[] = [
    {
      id: '1',
      type: 'trend',
      message: 'User registrations increased by 45% this week',
      icon: ArrowTrendingUpIcon,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      id: '2',
      type: 'opportunity',
      message: 'Consider promoting high-performing sellers with incentives',
      icon: SparklesIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: '3',
      type: 'tip',
      message: 'Platform uptime improved by 20% - great job!',
      icon: LightBulbIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: '4',
      type: 'trend',
      message: 'Mobile traffic is up 30% - optimize mobile experience',
      icon: ArrowTrendingUpIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      id: '5',
      type: 'opportunity',
      message: 'Average order value increased by $15 this month',
      icon: SparklesIcon,
      color: 'text-gold-600',
      bgColor: 'bg-gold-50',
    },
    {
      id: '6',
      type: 'tip',
      message: 'Featured products convert 65% better - add more featured items',
      icon: LightBulbIcon,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      id: '7',
      type: 'alert',
      message: 'Server load increased - consider scaling resources',
      icon: BellAlertIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      id: '8',
      type: 'opportunity',
      message: 'Seller verification time reduced by 40% - keep it up',
      icon: SparklesIcon,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
  ];

  const currentInsight = insights[currentInsightIndex];
  const Icon = currentInsight.icon;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsightIndex((prev) => (prev + 1) % insights.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [insights.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="col-span-full"
    >
      <Card className={clsx('relative overflow-hidden', currentInsight.bgColor)}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className={clsx('p-2 bg-white rounded-xl shadow-sm', currentInsight.color)}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Icon className="w-6 h-6" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-grey-900">
                AI-Powered Insights
              </h3>
              <p className="text-sm text-grey-600">
                Personalized recommendations for platform management
              </p>
            </div>
          </div>

          <div className="relative h-24 mb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentInsight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center"
              >
                <div
                  className={clsx(
                    'w-full p-6 bg-white rounded-xl shadow-sm border-2',
                    `border-${currentInsight.color.replace('text-', '')}`
                  )}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="flex-shrink-0"
                    >
                      <Icon className={clsx('w-8 h-8', currentInsight.color)} />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-base font-semibold text-grey-900">
                        {currentInsight.message}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2">
            {insights.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentInsightIndex(index)}
                className={clsx(
                  'h-2 rounded-full transition-all duration-300',
                  index === currentInsightIndex
                    ? 'w-8 bg-grey-900'
                    : 'w-2 bg-grey-400 hover:bg-grey-600'
                )}
                aria-label={`Go to insight ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() =>
                setCurrentInsightIndex(
                  (prev) => (prev - 1 + insights.length) % insights.length
                )
              }
              className="p-2 bg-white hover:bg-grey-100 rounded-lg transition-colors shadow-sm"
            >
              <svg
                className="w-5 h-5 text-grey-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() =>
                setCurrentInsightIndex((prev) => (prev + 1) % insights.length)
              }
              className="p-2 bg-white hover:bg-grey-100 rounded-lg transition-colors shadow-sm"
            >
              <svg
                className="w-5 h-5 text-grey-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default InsightsCard;

