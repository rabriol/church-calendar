import React from 'react';
import EventCard from './EventCard';
import { isToday } from '../utils/dateUtils';
import { useLanguage } from '../contexts/LanguageContext';

const DayRow = ({ dayInfo, events, nextEventId }) => {
  const { t } = useLanguage();
  const isTodayDate = isToday(dayInfo.dateString);

  return (
    <div className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="py-3 flex gap-2 sm:gap-4">
        {/* Date Column - Google Calendar Style */}
        <div className="flex-shrink-0 w-16 sm:w-28 text-right pr-2 sm:pr-4 border-r border-gray-200">
          <div className={`inline-flex flex-col items-end ${isTodayDate ? '' : ''}`}>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              {t(`days.${dayInfo.dayName}`)}
            </div>
            <div className={`text-xl sm:text-2xl font-normal mt-0.5 ${
              isTodayDate
                ? 'bg-blue-600 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center'
                : 'text-gray-700'
            }`}>
              {dayInfo.day}
            </div>
          </div>
        </div>

        {/* Events Column */}
        <div className="flex-1 min-w-0 py-1">
          <div className="space-y-2">
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                isNextEvent={String(event.id) === nextEventId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayRow;
