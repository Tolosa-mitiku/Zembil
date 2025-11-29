import { motion } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import clsx from 'clsx';
import { CalendarEvent } from '../pages/CalendarPage';

interface MiniCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onDateClick: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  events: CalendarEvent[];
}

const MiniCalendar = ({
  currentDate,
  selectedDate,
  onDateClick,
  onMonthChange,
  events,
}: MiniCalendarProps) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const handlePrevMonth = () => {
    onMonthChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentDate, 1));
  };

  const hasEvents = (date: Date) => {
    return events.some((event) => isSameDay(event.date, date));
  };

  const renderDays = () => {
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const isCurrentMonth = isSameMonth(currentDay, monthStart);
        const isSelected = isSameDay(currentDay, selectedDate);
        const isCurrentDay = isToday(currentDay);
        const hasEvent = hasEvents(currentDay);

        days.push(
          <motion.button
            key={currentDay.toString()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDateClick(currentDay)}
            className={clsx(
              'relative aspect-square flex items-center justify-center text-xs font-semibold rounded-lg transition-all',
              !isCurrentMonth && 'text-grey-300',
              isCurrentMonth && !isSelected && !isCurrentDay && 'text-grey-700 hover:bg-grey-100',
              isCurrentDay && !isSelected && 'bg-blue-100 text-blue-700',
              isSelected && 'bg-gold text-white shadow-md'
            )}
          >
            {format(currentDay, 'd')}
            {hasEvent && (
              <span
                className={clsx(
                  'absolute bottom-1 w-1 h-1 rounded-full',
                  isSelected ? 'bg-white' : 'bg-gold'
                )}
              />
            )}
          </motion.button>
        );
        day = addDays(day, 1);
      }
    }

    return days;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border border-grey-200 p-4 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrevMonth}
          className="p-1 hover:bg-grey-100 rounded-lg transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4 text-grey-600" />
        </motion.button>

        <h3 className="text-sm font-bold text-grey-900">
          {format(currentDate, 'MMM yyyy')}
        </h3>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNextMonth}
          className="p-1 hover:bg-grey-100 rounded-lg transition-colors"
        >
          <ChevronRightIcon className="w-4 h-4 text-grey-600" />
        </motion.button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
          <div
            key={idx}
            className="text-center text-xs font-bold text-grey-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">{renderDays()}</div>

      {/* Event Count */}
      <div className="mt-4 pt-4 border-t border-grey-200">
        <div className="flex items-center justify-between text-xs">
          <span className="text-grey-600">Total Events</span>
          <span className="font-bold text-gold">{events.length}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MiniCalendar;

