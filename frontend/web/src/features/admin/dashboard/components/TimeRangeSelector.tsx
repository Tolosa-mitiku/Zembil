import { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import {
  CalendarIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

interface TimeRangeSelectorProps {
  onRangeChange?: (range: string) => void;
  onComparisonToggle?: (enabled: boolean) => void;
  onExport?: () => void;
}

const TimeRangeSelector = ({
  onRangeChange,
  onComparisonToggle,
  onExport,
}: TimeRangeSelectorProps) => {
  const [selectedRange, setSelectedRange] = useState('30days');
  const [showComparison, setShowComparison] = useState(false);

  const ranges = [
    { id: 'today', label: 'Today' },
    { id: '7days', label: '7 Days' },
    { id: '30days', label: '30 Days' },
    { id: 'thismonth', label: 'This Month' },
    { id: 'lastmonth', label: 'Last Month' },
    { id: 'thisyear', label: 'This Year' },
    { id: 'custom', label: 'Custom' },
  ];

  const handleRangeChange = (rangeId: string) => {
    setSelectedRange(rangeId);
    onRangeChange?.(rangeId);
  };

  const handleComparisonToggle = () => {
    const newValue = !showComparison;
    setShowComparison(newValue);
    onComparisonToggle?.(newValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="sticky top-0 z-40 bg-white border-b border-grey-200 py-4 mb-8 -mx-8 px-8 shadow-sm"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Time Range Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 mr-2">
            <CalendarIcon className="w-5 h-5 text-grey-500" />
            <span className="text-sm font-semibold text-grey-700">Period:</span>
          </div>
          <div className="flex items-center bg-grey-100 rounded-lg p-1">
            {ranges.map((range) => (
              <button
                key={range.id}
                onClick={() => handleRangeChange(range.id)}
                className={clsx(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  selectedRange === range.id
                    ? 'bg-white text-grey-900 shadow-sm'
                    : 'text-grey-600 hover:text-grey-900'
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Comparison Toggle */}
          <button
            onClick={handleComparisonToggle}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200',
              showComparison
                ? 'bg-gold text-white shadow-md'
                : 'bg-grey-100 text-grey-700 hover:bg-grey-200'
            )}
          >
            <ArrowPathIcon className="w-4 h-4" />
            Compare
          </button>

          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-grey-900 hover:bg-grey-800 text-white rounded-lg font-medium text-sm transition-colors shadow-md"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TimeRangeSelector;

