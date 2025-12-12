import { useState } from 'react';
import { useGetEventsQuery, useAddEventMutation } from '../api/calendarApi';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import { formatDate } from '@/core/utils/format';
import { 
  CalendarIcon,
  PlusIcon,
  TagIcon,
  WrenchScrewdriverIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const CalendarPage = () => {
  const { data: events, isLoading } = useGetEventsQuery();

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-headline-large font-bold text-grey-900 mb-1">Platform Calendar</h1>
          <p className="text-body-small text-grey-600">Manage events, holidays, and maintenance schedules</p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-5 h-5 mr-2" /> Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-title-medium font-semibold text-grey-900">Upcoming Events</h2>
          {events?.map((event) => (
            <Card key={event.id} className="border-l-4 border-l-gold-500">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  event.type === 'promotion' ? 'bg-green-100 text-green-600' :
                  event.type === 'maintenance' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {event.type === 'promotion' ? <TagIcon className="w-5 h-5" /> :
                   event.type === 'maintenance' ? <WrenchScrewdriverIcon className="w-5 h-5" /> :
                   <GlobeAltIcon className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-grey-900 text-sm">{event.title}</h3>
                  <p className="text-xs text-grey-500 mt-1">{formatDate(event.start)}</p>
                  <p className="text-xs text-grey-600 mt-2">{event.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Calendar View Placeholder */}
        <Card className="lg:col-span-2 min-h-[500px] flex items-center justify-center bg-white">
          <div className="text-center text-grey-400">
            <CalendarIcon className="w-20 h-20 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">Full Calendar View</p>
            <p className="text-sm">Interactive calendar component will be implemented here</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;














