import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translateEventContent } from '../utils/translateEvent';
import { isToday } from '../utils/dateUtils';
import { getEventStatus, parseEventTime } from '../utils/eventTiming';

const EventCard = ({ event, isNextEvent }) => {
  const { t, language } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const isTodayEvent = isToday(event.date);

  const hasDetails = event.presenter || event.program;

  // Google Calendar Event Color Palette (Official) with appropriate text colors (fallback)
  const googleColors = [
    { bg: 'bg-[#F6BF26]', text: 'text-gray-900' },      // Banana - dark text on light yellow
    { bg: 'bg-[#039BE5]', text: 'text-white' },         // Peacock - white text on blue
    { bg: 'bg-[#0B8043]', text: 'text-white' },         // Basil - white text on dark green
    { bg: 'bg-[#D50000]', text: 'text-white' },         // Tomato - white text on dark red
    { bg: 'bg-[#F4511E]', text: 'text-white' },         // Tangerine - white text on orange
  ];

  // Generate consistent color based on event ID (fallback)
  const getEventColor = (eventId) => {
    let hash = 0;
    const id = String(eventId);
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return googleColors[Math.abs(hash) % googleColors.length];
  };

  // Use color from Google Sheet if available, otherwise use hash-based color
  const eventColor = event.color
    ? {
        bg: '', // We'll use inline styles for custom colors
        text: '', // We'll use inline styles for custom colors
        hex: event.color.hex,
        textHex: event.color.textColor,
        isCustomColor: true
      }
    : getEventColor(event.id);

  // Inline styles for custom colors from Google Sheet
  const customColorStyle = eventColor.isCustomColor ? {
    backgroundColor: eventColor.hex,
    color: eventColor.textHex
  } : {};

  useEffect(() => {
    if (!isTodayEvent) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(timer);
  }, [isTodayEvent]);

  // Countdown timer for next event
  useEffect(() => {
    if (!isNextEvent) return;

    const updateCountdown = () => {
      const now = new Date();
      const [year, month, day] = event.date.split('-').map(Number);
      const eventDate = new Date(year, month - 1, day);

      if (event.time) {
        const timeMatch = event.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const period = timeMatch[3].toUpperCase();

          if (period === 'PM' && hours !== 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;

          eventDate.setHours(hours, minutes, 0, 0);
        }
      }

      const diff = eventDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [isNextEvent, event.date, event.time]);

  const eventStatus = isTodayEvent ? getEventStatus(event, currentTime) : null;

  // Check if event is in the past
  const isPastEvent = (() => {
    const now = new Date();
    const [year, month, day] = event.date.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day);

    if (event.time) {
      const timeMatch = event.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        const period = timeMatch[3].toUpperCase();

        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        eventDate.setHours(hours, minutes, 0, 0);
      } else {
        // No time, just check if it's a past date
        eventDate.setHours(23, 59, 59, 999);
      }
    } else {
      // All-day event, consider past if date has passed
      eventDate.setHours(23, 59, 59, 999);
    }

    return eventDate < now;
  })();

  // Determine card styling based on status - Google Calendar Style
  let cardClasses = eventColor.isCustomColor
    ? `p-3 rounded hover:shadow-sm transition-all cursor-pointer ${isPastEvent ? 'grayscale opacity-60' : ''}`
    : `${eventColor.bg} p-3 rounded hover:shadow-sm transition-all cursor-pointer ${isPastEvent ? 'grayscale opacity-60' : ''}`;
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
      cardClasses = eventColor.isCustomColor
        ? `p-3 rounded hover:shadow-sm transition-all cursor-pointer grayscale opacity-60`
        : `${eventColor.bg} p-3 rounded hover:shadow-sm transition-all cursor-pointer grayscale opacity-60`;
      statusBadge = (
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-white">
          {lang.finished}
        </span>
      );
    } else if (eventStatus === 'ongoing') {
      cardClasses = eventColor.isCustomColor
        ? `p-3 rounded shadow-md hover:shadow-lg transition-all cursor-pointer border-2 border-gray-900`
        : `${eventColor.bg} p-3 rounded shadow-md hover:shadow-lg transition-all cursor-pointer border-2 border-gray-900`;
      statusBadge = (
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-900 text-white flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          {lang.ongoing}
        </span>
      );
    } else if (eventStatus === 'upcoming') {
      cardClasses = eventColor.isCustomColor
        ? `p-3 rounded hover:shadow-sm transition-all cursor-pointer`
        : `${eventColor.bg} p-3 rounded hover:shadow-sm transition-all cursor-pointer`;
      // No badge for upcoming events - countdown badge shows instead
    }
  }

  const hasExpandableContent = event.location || event.description || hasDetails || event.youtubeUrl || event.zoomUrl;

  return (
    <div
      className={cardClasses}
      style={customColorStyle}
      onClick={() => hasExpandableContent && setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-3">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Title and Time/Location */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium ${eventColor.isCustomColor ? '' : eventColor.text} text-base mb-1 truncate`}>
                {translateEventContent(event.title, language)}
              </h4>
              <div className={`flex flex-wrap items-center gap-2 text-xs ${eventColor.isCustomColor ? '' : eventColor.text} opacity-90`}>
                {event.time && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {event.time}
                  </span>
                )}
                {statusBadge && (
                  <>
                    {event.time && <span className="opacity-50">•</span>}
                    {statusBadge}
                  </>
                )}
              </div>

              {/* Next Event Countdown */}
              {isNextEvent && (
                <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded ${
                  eventColor.isCustomColor
                    ? (eventColor.textHex === '#FFFFFF' ? 'bg-white bg-opacity-20' : 'bg-gray-900 bg-opacity-10')
                    : (eventColor.text === 'text-white' ? 'bg-white bg-opacity-20' : 'bg-gray-900 bg-opacity-10')
                }`}>
                  <svg className={`w-4 h-4 ${eventColor.isCustomColor ? '' : eventColor.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={`text-sm font-medium ${eventColor.isCustomColor ? '' : eventColor.text}`}>
                    {t('startsIn')}: {countdown.days > 0 ? `${countdown.days}d ` : ''}{String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>

            {/* Expand Indicator */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {hasExpandableContent && (
                <svg
                  className={`w-5 h-5 ${eventColor.isCustomColor ? '' : eventColor.text} opacity-60 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
            {event.youtubeUrl && event.isLive && (
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
                {/* Date and Time Details */}
                {(event._original?.start_date || event.time) && (
                  <div className="flex items-start gap-2">
                    {event.time && (
                      <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {!event.time && (
                      <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    <div className="text-sm text-gray-700 flex-1">
                      {(() => {
                        const [year, month, day] = event.date.split('-').map(Number);
                        const startDate = new Date(year, month - 1, day);
                        const days = language === 'en'
                          ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                          : ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
                        const months = language === 'en'
                          ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                          : ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

                        const dayName = days[startDate.getDay()];
                        const monthName = months[startDate.getMonth()];
                        const dateStr = `${dayName}, ${monthName} ${day}, ${year}`;

                        // Check if there's an end date
                        const hasEndDate = event._original?.end_date && event._original.end_date !== event._original.start_date;
                        const endTimeStr = event.endTime;

                        if (hasEndDate && event._original?.end_date) {
                          // Multi-day event
                          const [endMonth, endDay, endYear] = event._original.end_date.split('/').map(Number);
                          const endDate = new Date(endYear, endMonth - 1, endDay);
                          const endDayName = days[endDate.getDay()];
                          const endMonthName = months[endDate.getMonth()];
                          const endDateStr = `${endDayName}, ${endMonthName} ${endDay}, ${endYear}`;

                          return (
                            <>
                              <div className="font-medium">{dateStr}</div>
                              {event.time && <div className="text-gray-600 mt-0.5">{event.time}</div>}
                              <div className="text-gray-500 my-1">–</div>
                              <div className="font-medium">{endDateStr}</div>
                              {endTimeStr && <div className="text-gray-600 mt-0.5">{endTimeStr}</div>}
                            </>
                          );
                        } else {
                          // Same day event
                          return (
                            <>
                              <div className="font-medium">{dateStr}</div>
                              {event.time && endTimeStr ? (
                                <div className="text-gray-600 mt-0.5">{event.time} – {endTimeStr}</div>
                              ) : event.time ? (
                                <div className="text-gray-600 mt-0.5">{event.time}</div>
                              ) : null}
                            </>
                          );
                        }
                      })()}
                    </div>
                  </div>
                )}

                {/* YouTube Link */}
                {event.youtubeUrl && (
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <a
                      href={event.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex-1"
                    >
                      {event.youtubeUrl}
                    </a>
                  </div>
                )}

                {/* Zoom Link */}
                {event.zoomUrl && (
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 32 32" fill="none">
                      <rect width="32" height="32" rx="6" fill="#2D8CFF"/>
                      <path d="M9 11C9 10.4477 9.44772 10 10 10H17C17.5523 10 18 10.4477 18 11V21C18 21.5523 17.5523 22 17 22H10C9.44772 22 9 21.5523 9 21V11Z" fill="white"/>
                      <path d="M18 13.5L23 10V22L18 18.5V13.5Z" fill="white"/>
                    </svg>
                    <a
                      href={event.zoomUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex-1"
                    >
                      {event.zoomUrl}
                    </a>
                  </div>
                )}

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
                    <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      {lang.program}
                    </h5>
                    <div className="space-y-0">
                      {event.program.map((item, index) => {
                        // Check if this program item is current
                        let itemStatus = 'upcoming';
                        if (isTodayEvent && eventStatus === 'ongoing' && item.startTime) {
                          const timeMatch = item.startTime.match(/(\d+):(\d+):(\d+)\s*(AM|PM)/i);
                          if (timeMatch) {
                            let hours = parseInt(timeMatch[1]);
                            const minutes = parseInt(timeMatch[2]);
                            const period = timeMatch[4].toUpperCase();

                            if (period === 'PM' && hours !== 12) hours += 12;
                            if (period === 'AM' && hours === 12) hours = 0;

                            const [year, month, day] = event.date.split('-').map(Number);
                            const itemDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);

                            // Check end time for next item
                            let nextItemDateTime = null;
                            if (index < event.program.length - 1 && event.program[index + 1].startTime) {
                              const nextTimeMatch = event.program[index + 1].startTime.match(/(\d+):(\d+):(\d+)\s*(AM|PM)/i);
                              if (nextTimeMatch) {
                                let nextHours = parseInt(nextTimeMatch[1]);
                                const nextMinutes = parseInt(nextTimeMatch[2]);
                                const nextPeriod = nextTimeMatch[4].toUpperCase();

                                if (nextPeriod === 'PM' && nextHours !== 12) nextHours += 12;
                                if (nextPeriod === 'AM' && nextHours === 12) nextHours = 0;

                                nextItemDateTime = new Date(year, month - 1, day, nextHours, nextMinutes, 0, 0);
                              }
                            }

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
                                className={`absolute left-[7px] top-8 w-0.5 h-full ${
                                  itemStatus === 'completed' ? 'bg-blue-500' : 'bg-gray-300'
                                }`}
                              />
                            )}

                            <div className={`flex items-start gap-3 py-2 transition-all ${
                              itemStatus === 'current' ? 'pl-1' : ''
                            }`}>
                              {/* Timeline dot */}
                              <div className={`w-4 h-4 rounded-full flex-shrink-0 mt-1 z-10 ${
                                itemStatus === 'current'
                                  ? 'bg-blue-600 ring-4 ring-blue-200'
                                  : itemStatus === 'completed'
                                  ? 'bg-blue-500'
                                  : 'bg-gray-300'
                              }`}>
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2 mb-1">
                                  <span className={`text-sm font-semibold ${
                                    itemStatus === 'current' ? 'text-blue-700' : 'text-gray-600'
                                  }`}>
                                    {item.startTime}
                                  </span>
                                  {item.endTime && (
                                    <>
                                      <span className="text-gray-400">→</span>
                                      <span className="text-sm text-gray-500">{item.endTime}</span>
                                    </>
                                  )}
                                  {item.unit && (
                                    <span className="text-xs text-gray-400 ml-auto">
                                      {item.unit}
                                    </span>
                                  )}
                                </div>

                                <div className={`${
                                  itemStatus === 'current'
                                    ? 'bg-blue-50 border-l-4 border-blue-600 pl-3 py-2 -ml-1 rounded-r'
                                    : itemStatus === 'completed'
                                    ? 'opacity-60'
                                    : ''
                                }`}>
                                  {item.act && (
                                    <div className="text-xs font-medium text-gray-500 mb-1">
                                      {item.act}
                                    </div>
                                  )}
                                  <div className={`text-sm font-medium ${
                                    itemStatus === 'current'
                                      ? 'text-gray-900'
                                      : itemStatus === 'completed'
                                      ? 'text-gray-500 line-through'
                                      : 'text-gray-700'
                                  }`}>
                                    {item.title}
                                  </div>
                                  {item.presenter && (
                                    <div className="text-sm text-gray-600 mt-1">
                                      {item.presenter}
                                    </div>
                                  )}
                                  {itemStatus === 'current' && (
                                    <span className="inline-flex mt-2 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white items-center gap-1">
                                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                      {language === 'pt' ? 'AGORA' : 'NOW'}
                                    </span>
                                  )}
                                </div>
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
