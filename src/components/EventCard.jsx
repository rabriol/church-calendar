import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translateEventContent } from '../utils/translateEvent';
import { isToday } from '../utils/dateUtils';
import { getEventStatus, parseEventTime } from '../utils/eventTiming';
import EventCountdown from './EventCountdown';

const EventCard = ({ event }) => {
  const { t, language } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);
  const isTodayEvent = isToday(event.date);

  const hasDetails = event.presenter || event.program;

  useEffect(() => {
    if (!isTodayEvent) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(timer);
  }, [isTodayEvent]);

  const eventStatus = isTodayEvent ? getEventStatus(event, currentTime) : null;

  // Determine card styling based on status - Google Calendar Style
  let cardClasses = "bg-white border-l-4 border-gray-300 p-3 rounded hover:shadow-sm transition-all cursor-pointer";
  let statusBadge = null;

  const statusLabels = {
    en: {
      finished: 'Finished',
      ongoing: 'Happening Now',
      upcoming: 'Upcoming',
      watchLive: 'Watch Live',
      liveStream: 'Live Stream',
      presenter: 'Presenter',
      program: 'Program',
      showDetails: 'Show Details',
      hideDetails: 'Hide Details'
    },
    pt: {
      finished: 'Finalizado',
      ongoing: 'Acontecendo Agora',
      upcoming: 'Próximo',
      watchLive: 'Assistir Ao Vivo',
      liveStream: 'Transmissão Ao Vivo',
      presenter: 'Apresentador',
      program: 'Programa',
      showDetails: 'Mostrar Detalhes',
      hideDetails: 'Ocultar Detalhes'
    }
  };

  const lang = statusLabels[language] || statusLabels.en;

  if (isTodayEvent && eventStatus) {
    if (eventStatus === 'finished') {
      cardClasses = "bg-gray-50 border-l-4 border-gray-400 p-3 rounded hover:shadow-sm transition-all cursor-pointer opacity-60";
      statusBadge = (
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">
          {lang.finished}
        </span>
      );
    } else if (eventStatus === 'ongoing') {
      cardClasses = "bg-blue-50 border-l-4 border-blue-600 p-3 rounded shadow-sm hover:shadow transition-all cursor-pointer";
      statusBadge = (
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-600 text-white flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          {lang.ongoing}
        </span>
      );
    } else if (eventStatus === 'upcoming') {
      cardClasses = "bg-white border-l-4 border-blue-500 p-3 rounded hover:shadow-sm transition-all cursor-pointer";
      // No badge for upcoming events - countdown badge shows instead
    }
  }

  return (
    <div className={cardClasses}>
      <div className="flex items-start gap-3">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Title and Time/Location */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-base mb-1 truncate">
                {translateEventContent(event.title, language)}
              </h4>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {event.time}
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1 truncate">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {translateEventContent(event.location, language)}
                </span>
                {statusBadge && (
                  <>
                    <span className="text-gray-300">•</span>
                    {statusBadge}
                  </>
                )}
              </div>
            </div>

            {/* Countdown on the right */}
            {isTodayEvent && eventStatus === 'upcoming' && (
              <div className="flex-shrink-0">
                <EventCountdown event={event} />
              </div>
            )}
          </div>
            {event.description && (
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {translateEventContent(event.description, language)}
              </p>
            )}

            {/* YouTube Live Badge */}
            {event.youtubeUrl && (
              <a
                href={event.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>{isTodayEvent && eventStatus === 'ongoing' ? lang.watchLive : lang.liveStream}</span>
                {isTodayEvent && eventStatus === 'ongoing' && (
                  <span className="inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                )}
              </a>
            )}

            {/* Expandable Details Button */}
            {hasDetails && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                <svg
                  className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span>{isExpanded ? lang.hideDetails : lang.showDetails}</span>
              </button>
            )}

            {/* Expanded Details Section */}
            {hasDetails && isExpanded && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 animate-fadeIn">
                {event.presenter && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {lang.presenter}
                    </h5>
                    <p className="text-gray-700 ml-7">{event.presenter}</p>
                  </div>
                )}

                {event.program && event.program.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      {lang.program}
                    </h5>
                    <div className="ml-7 space-y-1">
                      {event.program.map((item, index) => {
                        // Check if this program item is current
                        let itemStatus = 'upcoming';
                        if (isTodayEvent && eventStatus === 'ongoing') {
                          const itemTime = parseEventTime(item.time);
                          if (itemTime) {
                            const [year, month, day] = event.date.split('-').map(Number);
                            const itemDateTime = new Date(year, month - 1, day, itemTime.hours, itemTime.minutes, 0, 0);

                            const nextItemTime = index < event.program.length - 1
                              ? parseEventTime(event.program[index + 1].time)
                              : null;

                            const nextItemDateTime = nextItemTime
                              ? new Date(year, month - 1, day, nextItemTime.hours, nextItemTime.minutes, 0, 0)
                              : null;

                            if (currentTime >= itemDateTime) {
                              if (nextItemDateTime && currentTime < nextItemDateTime) {
                                itemStatus = 'current';
                              } else if (!nextItemDateTime) {
                                itemStatus = 'current';
                              } else {
                                itemStatus = 'completed';
                              }
                            }
                          }
                        }

                        return (
                          <div key={index} className="relative">
                            {/* Timeline connector */}
                            {index < event.program.length - 1 && (
                              <div
                                className={`absolute left-[40px] top-6 w-0.5 h-6 ${
                                  itemStatus === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                              />
                            )}

                            <div className={`flex items-start gap-3 text-sm py-2 px-3 rounded-lg transition-all ${
                              itemStatus === 'current'
                                ? 'bg-green-50 border-2 border-green-500 shadow-md'
                                : itemStatus === 'completed'
                                ? 'bg-gray-50 opacity-60'
                                : 'bg-white'
                            }`}>
                              {/* Timeline dot */}
                              <div className="flex items-center min-w-[80px] gap-2">
                                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                  itemStatus === 'current'
                                    ? 'bg-green-500 ring-4 ring-green-200'
                                    : itemStatus === 'completed'
                                    ? 'bg-green-500'
                                    : 'bg-gray-300'
                                }`}>
                                </div>
                                <span className={`font-semibold ${
                                  itemStatus === 'current' ? 'text-green-700' : 'text-gray-600'
                                }`}>
                                  {item.time}
                                </span>
                              </div>
                              <div className="flex-1 flex items-center justify-between gap-2">
                                <span className={`${
                                  itemStatus === 'current'
                                    ? 'text-gray-900 font-semibold'
                                    : itemStatus === 'completed'
                                    ? 'text-gray-500 line-through'
                                    : 'text-gray-700'
                                }`}>
                                  {item.item}
                                </span>
                                {itemStatus === 'current' && (
                                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-500 text-white flex items-center gap-1 flex-shrink-0">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                    {language === 'pt' ? 'AGORA' : 'NOW'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
