import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon,
  CheckCircleIcon,
  XMarkIcon,
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
  parseISO,
} from 'date-fns';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import EventModal from '../components/EventModal';
import EventCard from '../components/EventCard';
import MiniCalendar from '../components/MiniCalendar';
import CalendarQuickActions from '../components/CalendarQuickActions';
import EventStats from '../components/EventStats';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  location?: string;
  category: 'order' | 'meeting' | 'promotion' | 'reminder' | 'personal';
  color: string;
  completed?: boolean;
}

type ViewMode = 'month' | 'week' | 'list';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Process Bulk Orders',
      description: 'Review and process pending bulk orders from premium customers',
      date: new Date(),
      startTime: '09:00',
      endTime: '11:00',
      category: 'order',
      color: '#D4AF37',
    },
    {
      id: '2',
      title: 'Flash Sale Launch',
      description: 'Launch winter collection flash sale',
      date: addDays(new Date(), 2),
      startTime: '14:00',
      endTime: '15:00',
      category: 'promotion',
      color: '#EC4899',
      location: 'Online',
    },
    {
      id: '3',
      title: 'Inventory Check',
      description: 'Monthly inventory audit and restock planning',
      date: addDays(new Date(), 5),
      startTime: '10:00',
      endTime: '12:00',
      category: 'reminder',
      color: '#8B5CF6',
    },
    {
      id: '4',
      title: 'Customer Feedback Review',
      description: 'Review and respond to customer reviews and feedback',
      date: addDays(new Date(), 7),
      startTime: '15:00',
      endTime: '16:30',
      category: 'meeting',
      color: '#3B82F6',
    },
  ]);

  const categoryColors = {
    order: { bg: 'bg-gold-50', text: 'text-gold-700', border: 'border-gold-200' },
    meeting: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    promotion: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    reminder: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    personal: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((e) => e.id !== eventId));
    toast.success('Event deleted successfully', { icon: '🗑️' });
  };

  const handleToggleComplete = (eventId: string) => {
    setEvents(
      events.map((e) =>
        e.id === eventId ? { ...e, completed: !e.completed } : e
      )
    );
  };

  const handleSaveEvent = (event: CalendarEvent) => {
    if (selectedEvent) {
      setEvents(events.map((e) => (e.id === event.id ? event : e)));
      toast.success('Event updated successfully', { icon: '✅' });
    } else {
      setEvents([...events, { ...event, id: Date.now().toString() }]);
      toast.success('Event created successfully', { icon: '🎉' });
    }
    setIsEventModalOpen(false);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date));
  };

  const renderMonthView = () => {
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const dayEvents = getEventsForDate(currentDay);
        const isCurrentMonth = isSameMonth(currentDay, monthStart);
        const isSelected = isSameDay(currentDay, selectedDate);
        const isCurrentDay = isToday(currentDay);

        days.push(
          <motion.div
            key={currentDay.toString()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: i * 0.02 }}
            onClick={() => handleDateClick(currentDay)}
            className={clsx(
              'min-h-[120px] p-2 border border-grey-100 cursor-pointer transition-all duration-200',
              'hover:bg-grey-50 hover:shadow-md hover:scale-[1.02] hover:z-10',
              !isCurrentMonth && 'bg-grey-50/50 text-grey-400',
              isSelected && 'ring-2 ring-gold shadow-lg bg-gold-50',
              isCurrentDay && !isSelected && 'bg-blue-50 border-blue-200'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={clsx(
                  'text-sm font-semibold',
                  isCurrentDay && 'bg-gold text-white rounded-full w-7 h-7 flex items-center justify-center',
                  !isCurrentDay && isCurrentMonth && 'text-grey-900',
                  !isCurrentMonth && 'text-grey-400'
                )}
              >
                {format(currentDay, 'd')}
              </span>
              {dayEvents.length > 0 && (
                <span className="text-xs bg-gold text-white rounded-full px-2 py-0.5 font-semibold">
                  {dayEvents.length}
                </span>
              )}
            </div>

            <div className="space-y-1">
              {dayEvents.slice(0, 3).map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditEvent(event);
                  }}
                  className={clsx(
                    'text-xs p-1.5 rounded-lg cursor-pointer transition-all',
                    'hover:scale-105 hover:shadow-md',
                    categoryColors[event.category].bg,
                    categoryColors[event.category].border,
                    'border-l-2'
                  )}
                >
                  <div className="flex items-center gap-1">
                    {event.completed && (
                      <CheckCircleIcon className="w-3 h-3 text-green-600" />
                    )}
                    <span
                      className={clsx(
                        'font-medium truncate',
                        categoryColors[event.category].text,
                        event.completed && 'line-through opacity-60'
                      )}
                    >
                      {event.title}
                    </span>
                  </div>
                  <div className="text-[10px] text-grey-600 mt-0.5">
                    {event.startTime}
                  </div>
                </motion.div>
              ))}
              {dayEvents.length > 3 && (
                <div className="text-xs text-grey-500 text-center py-1">
                  +{dayEvents.length - 3} more
                </div>
              )}
            </div>
          </motion.div>
        );
        day = addDays(day, 1);
      }
    }

    return days;
  };

  const renderListView = () => {
    const sortedEvents = [...events].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    return (
      <div className="space-y-3">
        {sortedEvents.map((event, idx) => (
          <EventCard
            key={event.id}
            event={event}
            onEdit={() => handleEditEvent(event)}
            onDelete={() => handleDeleteEvent(event.id)}
            onToggleComplete={() => handleToggleComplete(event.id)}
            delay={idx * 0.05}
          />
        ))}
        {sortedEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <CalendarIcon className="w-16 h-16 text-grey-300 mx-auto mb-4" />
            <p className="text-grey-500 text-lg">No events scheduled</p>
            <button
              onClick={handleAddEvent}
              className="mt-4 px-6 py-2 bg-gold text-white rounded-xl hover:bg-gold-dark transition-all"
            >
              Create Your First Event
            </button>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-pink-500 p-8 shadow-2xl"
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
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <CalendarIcon className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  Event Calendar
                </h1>
                <p className="text-white/90 text-sm">
                  Organize your schedule and never miss important dates
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddEvent}
              className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              New Event
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Controls Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl border border-grey-200 p-4 shadow-sm"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Navigation */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevMonth}
              className="p-2 hover:bg-grey-100 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5 text-grey-600" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 text-sm font-semibold text-grey-700 hover:bg-grey-100 rounded-lg transition-colors"
            >
              Today
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNextMonth}
              className="p-2 hover:bg-grey-100 rounded-lg transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5 text-grey-600" />
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-grey-900 ml-2"
            >
              {format(currentDate, 'MMMM yyyy')}
            </motion.div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-grey-100 rounded-lg p-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('month')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                viewMode === 'month'
                  ? 'bg-white text-gold shadow-md'
                  : 'text-grey-600 hover:text-grey-900'
              )}
            >
              <Squares2X2Icon className="w-4 h-4" />
              Month
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                viewMode === 'list'
                  ? 'bg-white text-gold shadow-md'
                  : 'text-grey-600 hover:text-grey-900'
              )}
            >
              <ListBulletIcon className="w-4 h-4" />
              List
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Event Statistics */}
      <EventStats events={events} />

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {viewMode === 'month' ? (
              <motion.div
                key="month"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl border border-grey-200 overflow-hidden shadow-sm"
              >
                {/* Day Headers */}
                <div className="grid grid-cols-7 bg-gradient-to-r from-grey-100 to-grey-50">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div
                      key={day}
                      className="p-3 text-center text-sm font-bold text-grey-700 border-b border-grey-200"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">{renderMonthView()}</div>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl border border-grey-200 p-6 shadow-sm"
              >
                {renderListView()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <CalendarQuickActions onAddEvent={handleAddEvent} />

          {/* Mini Calendar */}
          <MiniCalendar
            currentDate={currentDate}
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
            onMonthChange={setCurrentDate}
            events={events}
          />

          {/* Event Categories */}
          <div className="bg-white rounded-xl border border-grey-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-grey-900 mb-4">Categories</h3>
            <div className="space-y-3">
              {Object.entries(categoryColors).map(([category, colors]) => {
                const count = events.filter((e) => e.category === category).length;
                return (
                  <motion.div
                    key={category}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-grey-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={clsx(
                          'w-4 h-4 rounded-full',
                          colors.bg,
                          colors.border,
                          'border-2'
                        )}
                      />
                      <span className="text-sm font-medium text-grey-700 capitalize">
                        {category}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-grey-500">{count}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Events */}
          {getEventsForDate(selectedDate).length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-xl border border-gold-200 p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-grey-900 mb-4">
                {format(selectedDate, 'MMM d, yyyy')}
              </h3>
              <div className="space-y-2">
                {getEventsForDate(selectedDate).map((event) => (
                  <motion.div
                    key={event.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleEditEvent(event)}
                    className="p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <ClockIcon className="w-4 h-4 text-grey-500" />
                      <span className="text-xs font-semibold text-grey-600">
                        {event.startTime} - {event.endTime}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-grey-900">
                      {event.title}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        event={selectedEvent}
      />
    </div>
  );
};

export default CalendarPage;
