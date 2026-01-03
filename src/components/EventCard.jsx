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

  // Google Calendar Event Color Palette (Official) with appropriate text colors
  const googleColors = [
    { bg: 'bg-[#F6BF26]', text: 'text-gray-900' },      // Banana - dark text on light yellow
    { bg: 'bg-[#039BE5]', text: 'text-white' },         // Peacock - white text on blue
    { bg: 'bg-[#0B8043]', text: 'text-white' },         // Basil - white text on dark green
    { bg: 'bg-[#D50000]', text: 'text-white' },         // Tomato - white text on dark red
    { bg: 'bg-[#F4511E]', text: 'text-white' },         // Tangerine - white text on orange
  ];

  // Generate consistent color based on event ID
  const getEventColor = (eventId) => {
    let hash = 0;
    const id = String(eventId);
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return googleColors[Math.abs(hash) % googleColors.length];
  };

  const eventColor = getEventColor(event.id);

  useEffect(() => {
    if (!isTodayEvent) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(timer);
  }, [isTodayEvent]);

  const eventStatus = isTodayEvent ? getEventStatus(event, currentTime) : null;

  // Determine card styling based on status - Google Calendar Style
  let cardClasses = `${eventColor.bg} p-3 rounded hover:shadow-sm transition-all cursor-pointer`;
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
      cardClasses = `${eventColor.bg} p-3 rounded hover:shadow-sm transition-all cursor-pointer opacity-60`;
      statusBadge = (
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-white">
          {lang.finished}
        </span>
      );
    } else if (eventStatus === 'ongoing') {
      cardClasses = `${eventColor.bg} p-3 rounded shadow-md hover:shadow-lg transition-all cursor-pointer border-2 border-gray-900`;
      statusBadge = (
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-900 text-white flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          {lang.ongoing}
        </span>
      );
    } else if (eventStatus === 'upcoming') {
      cardClasses = `${eventColor.bg} p-3 rounded hover:shadow-sm transition-all cursor-pointer`;
      // No badge for upcoming events - countdown badge shows instead
    }
  }

  const hasExpandableContent = event.location || event.description || hasDetails;

  return (
    <div
      className={cardClasses}
      onClick={() => hasExpandableContent && setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-3">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Title and Time/Location */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium ${eventColor.text} text-base mb-1 truncate`}>
                {translateEventContent(event.title, language)}
              </h4>
              <div className={`flex flex-wrap items-center gap-2 text-xs ${eventColor.text} opacity-90`}>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {event.time}
                </span>
                {statusBadge && (
                  <>
                    <span className="opacity-50">•</span>
                    {statusBadge}
                  </>
                )}
              </div>
            </div>

            {/* Countdown and Expand Indicator */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {isTodayEvent && eventStatus === 'upcoming' && (
                <EventCountdown event={event} />
              )}
              {hasExpandableContent && (
                <svg
                  className={`w-5 h-5 ${eventColor.text} opacity-60 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>
          </div>

            {/* YouTube Live Badge */}
            {event.youtubeUrl && (
              <a
                href={event.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded font-medium transition-colors"
                onClick={(e) => e.stopPropagation()}
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

            {/* Expanded Details Section - White Background like Google Calendar */}
            {isExpanded && hasExpandableContent && (
              <div className="mt-3 -mx-3 -mb-3 bg-white rounded-b p-4 space-y-4 animate-fadeIn border border-gray-200 shadow-sm">
                {/* Location */}
                {event.location && (
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm text-gray-700 flex-1">
                      {translateEventContent(event.location, language)}
                    </p>
                  </div>
                )}

                {/* Description */}
                {event.description && (
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <p className="text-sm text-gray-700 leading-relaxed flex-1">
                      {translateEventContent(event.description, language)}
                    </p>
                  </div>
                )}

                {event.presenter && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
