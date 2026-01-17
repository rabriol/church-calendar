import React, { useState, useEffect, useMemo } from 'react';
import DayRow from './DayRow';
import { getAllDaysInMonth, getMonthName, getEventsForDay } from '../utils/dateUtils';
import { sampleEvents } from '../data/sampleEvents';
import { fetchGoogleSheetsEvents, fetchProgramsForMonth } from '../services/googleSheetsService';
import { useLanguage } from '../contexts/LanguageContext';

const Calendar = () => {
  const { t, language, switchLanguage } = useLanguage();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [events, setEvents] = useState(sampleEvents);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'

  const daysInMonth = getAllDaysInMonth(currentYear, currentMonth);

  // Fetch Google Sheets data on mount (without programs)
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const sheetsData = await fetchGoogleSheetsEvents();
        setEvents(sheetsData);

        // Fetch programs for the current month
        await fetchProgramsForMonth(sheetsData, currentYear, currentMonth);
        setEvents([...sheetsData]); // Trigger re-render after programs loaded
        setInitialLoadComplete(true);
      } catch (err) {
        console.error('Failed to load Google Sheets data:', err);
        setError(err.message);
        // Fallback to sample events
        setEvents(sampleEvents);
        setInitialLoadComplete(true);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Fetch programs when month/year changes (after initial load)
  useEffect(() => {
    if (!initialLoadComplete) return; // Skip on initial mount

    const loadProgramsForCurrentMonth = async () => {
      try {
        // Clear existing programs from sheets
        events.forEach(event => {
          if (event.program_sheet_id) {
            event.program = null;
          }
        });

        await fetchProgramsForMonth(events, currentYear, currentMonth);
        setEvents([...events]); // Trigger re-render after programs loaded
      } catch (err) {
        console.error('Failed to load programs for month:', err);
      }
    };

    loadProgramsForCurrentMonth();
  }, [currentMonth, currentYear, initialLoadComplete]);

  // Reset showPastEvents when changing months
  useEffect(() => {
    setShowPastEvents(false);
  }, [currentMonth, currentYear]);

  // Use all events (church filter removed)
  let filteredEvents = events;

  // Filter for week view - show events from today through end of current week (Sunday)
  if (viewMode === 'week') {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    // Calculate end of week (Sunday)
    const currentDayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
    const daysUntilSunday = currentDayOfWeek === 0 ? 0 : 7 - currentDayOfWeek;
    const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday, 23, 59, 59, 999);

    filteredEvents = events.filter(event => {
      const [year, month, day] = event.date.split('-').map(Number);
      const eventDate = new Date(year, month - 1, day);

      // For events with time, check if they've ended
      if (event.time) {
        let eventEndDate = new Date(year, month - 1, day);

        if (event.endTime) {
          const endTimeMatch = event.endTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (endTimeMatch) {
            let hours = parseInt(endTimeMatch[1]);
            const minutes = parseInt(endTimeMatch[2]);
            const period = endTimeMatch[3].toUpperCase();

            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            eventEndDate.setHours(hours, minutes, 0, 0);
          }
        } else {
          // No end time - use start time + 2 hours
          const timeMatch = event.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (timeMatch) {
            let hours = parseInt(timeMatch[1]);
            const minutes = parseInt(timeMatch[2]);
            const period = timeMatch[3].toUpperCase();

            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            eventEndDate.setHours(hours, minutes, 0, 0);
            eventEndDate.setTime(eventEndDate.getTime() + 2 * 60 * 60 * 1000);
          }
        }

        // Include if event hasn't ended yet and starts before end of week
        return eventEndDate >= todayStart && eventDate <= endOfWeek;
      }

      // For all-day events, include if within the week range
      eventDate.setHours(23, 59, 59, 999);
      return eventDate >= todayStart && eventDate <= endOfWeek;
    });
  }

  // Find the next upcoming event - memoized to prevent recalculation
  const nextEventId = useMemo(() => {
    const now = new Date();
    let nextEvent = null;
    let minTimeDiff = Infinity;

    filteredEvents.forEach(event => {
      // Skip events without time
      if (!event.time) return;

      const [year, month, day] = event.date.split('-').map(Number);
      const eventDate = new Date(year, month - 1, day);

      const timeMatch = event.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        const period = timeMatch[3].toUpperCase();

        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        eventDate.setHours(hours, minutes, 0, 0);
      }

      const timeDiff = eventDate - now;
      if (timeDiff > 0 && timeDiff < minTimeDiff) {
        minTimeDiff = timeDiff;
        nextEvent = String(event.id); // Ensure it's a string
      }
    });

    return nextEvent;
  }, [filteredEvents]);

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  // Check if we're viewing the current month
  const isCurrentMonth = currentYear === today.getFullYear() && currentMonth === today.getMonth();

  // Helper function to check if a day's events are all in the past
  const isDayInPast = (dayInfo) => {
    const now = new Date();
    const eventsForDay = getEventsForDay(filteredEvents, currentYear, currentMonth, dayInfo.day);

    if (eventsForDay.length === 0) return false;

    // Check if all events for this day are in the past (completed)
    return eventsForDay.every(event => {
      const [year, month, day] = event.date.split('-').map(Number);

      // Determine event end time
      let eventEndDate;

      if (event.endTime) {
        // Use actual end time if available
        eventEndDate = new Date(year, month - 1, day);
        const endTimeMatch = event.endTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (endTimeMatch) {
          let hours = parseInt(endTimeMatch[1]);
          const minutes = parseInt(endTimeMatch[2]);
          const period = endTimeMatch[3].toUpperCase();

          if (period === 'PM' && hours !== 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;

          eventEndDate.setHours(hours, minutes, 0, 0);
        } else {
          eventEndDate.setHours(23, 59, 59, 999);
        }
      } else if (event.time) {
        // No end time - assume 2 hour duration from start time
        eventEndDate = new Date(year, month - 1, day);
        const timeMatch = event.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const period = timeMatch[3].toUpperCase();

          if (period === 'PM' && hours !== 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;

          eventEndDate.setHours(hours, minutes, 0, 0);
          // Add 2 hours as assumed duration
          eventEndDate.setTime(eventEndDate.getTime() + 2 * 60 * 60 * 1000);
        } else {
          eventEndDate.setHours(23, 59, 59, 999);
        }
      } else {
        // All-day event - end at end of day
        eventEndDate = new Date(year, month - 1, day);
        eventEndDate.setHours(23, 59, 59, 999);
      }

      return eventEndDate < now;
    });
  };

  // Count past event days
  const pastEventDays = isCurrentMonth
    ? daysInMonth.filter(dayInfo => {
        const eventsForDay = getEventsForDay(filteredEvents, currentYear, currentMonth, dayInfo.day);
        return eventsForDay.length > 0 && isDayInPast(dayInfo);
      })
    : [];

  const pastEventCount = pastEventDays.reduce((count, dayInfo) => {
    return count + getEventsForDay(filteredEvents, currentYear, currentMonth, dayInfo.day).length;
  }, 0);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Top Header Bar - Google Calendar Style */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-3 sm:px-6 py-3 sm:py-4">
            {/* Mobile Layout */}
            <div className="flex flex-col gap-2.5 sm:hidden">
              {/* Row 1: Title and View Toggle */}
              <div className="flex items-center justify-between">
                <h1 className="text-base font-normal text-gray-700 flex-1 truncate pr-2">
                  {t('title')}
                </h1>
                <div className="flex gap-1.5 items-center flex-shrink-0">
                  {/* View Mode Toggle */}
                  <div className="flex gap-0.5 bg-gray-100 rounded p-0.5">
                    <button
                      onClick={() => setViewMode('month')}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        viewMode === 'month'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {language === 'pt' ? 'Mês' : 'Month'}
                    </button>
                    <button
                      onClick={() => setViewMode('week')}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        viewMode === 'week'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {language === 'pt' ? 'Semana' : 'Week'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2: Month Navigation and Language */}
              <div className="flex items-center justify-between gap-2">
                {viewMode === 'month' && (
                  <div className="flex items-center gap-1.5 flex-1">
                    <button
                      onClick={goToPreviousMonth}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                      aria-label="Previous month"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <h2 className="text-sm font-medium text-gray-700 flex-1 text-center">
                      {t(`months.${getMonthName(currentMonth)}`)} {currentYear}
                    </h2>

                    <button
                      onClick={goToNextMonth}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                      aria-label="Next month"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}

                {viewMode === 'week' && (
                  <div className="flex-1 text-center">
                    <h2 className="text-sm font-medium text-gray-700">
                      {language === 'pt' ? 'Esta Semana' : 'This Week'}
                    </h2>
                  </div>
                )}

                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => switchLanguage('pt')}
                    className={`px-2 py-1 rounded transition-colors ${
                      language === 'pt'
                        ? 'bg-blue-100'
                        : 'hover:bg-gray-100 opacity-60'
                    }`}
                    aria-label="Português"
                  >
                    <svg className="w-5 h-4" viewBox="0 0 20 14" fill="none">
                      <rect width="20" height="14" fill="#009B3A"/>
                      <path d="M10 2L17 7L10 12L3 7L10 2Z" fill="#FEDF00"/>
                      <circle cx="10" cy="7" r="2.5" fill="#002776"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => switchLanguage('en')}
                    className={`px-2 py-1 rounded transition-colors ${
                      language === 'en'
                        ? 'bg-blue-100'
                        : 'hover:bg-gray-100 opacity-60'
                    }`}
                    aria-label="English"
                  >
                    <svg className="w-5 h-4" viewBox="0 0 20 14" fill="none">
                      <rect width="20" height="14" fill="#B22234"/>
                      <rect width="20" height="1" y="2" fill="white"/>
                      <rect width="20" height="1" y="4" fill="white"/>
                      <rect width="20" height="1" y="6" fill="white"/>
                      <rect width="20" height="1" y="8" fill="white"/>
                      <rect width="20" height="1" y="10" fill="white"/>
                      <rect width="20" height="1" y="12" fill="white"/>
                      <rect width="8" height="7" fill="#3C3B6E"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              {/* Left: Logo/Title and Month Navigation */}
              <div className="flex items-center gap-6">
                <h1 className="text-xl font-normal text-gray-700">
                  {t('title')}
                </h1>

                <div className="flex items-center gap-4">
                  {/* View Mode Toggle */}
                  <div className="flex gap-0.5 bg-gray-100 rounded p-0.5">
                    <button
                      onClick={() => setViewMode('month')}
                      className={`px-3 py-1.5 text-sm rounded transition-colors ${
                        viewMode === 'month'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {language === 'pt' ? 'Mês' : 'Month'}
                    </button>
                    <button
                      onClick={() => setViewMode('week')}
                      className={`px-3 py-1.5 text-sm rounded transition-colors ${
                        viewMode === 'week'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {language === 'pt' ? 'Semana' : 'Week'}
                    </button>
                  </div>

                  {viewMode === 'month' && (
                    <>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={goToPreviousMonth}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                          aria-label="Previous month"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={goToNextMonth}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                          aria-label="Next month"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      <h2 className="text-xl font-normal text-gray-700">
                        {t(`months.${getMonthName(currentMonth)}`)} {currentYear}
                      </h2>
                    </>
                  )}

                  {viewMode === 'week' && (
                    <h2 className="text-xl font-normal text-gray-700">
                      {language === 'pt' ? 'Esta Semana' : 'This Week'}
                    </h2>
                  )}
                </div>
              </div>

              {/* Right: Language Selector */}
              <div className="flex items-center gap-4">
                {/* Language Selector */}
                <div className="flex gap-1">
                  <button
                    onClick={() => switchLanguage('pt')}
                    className={`px-3 py-2 rounded transition-colors ${
                      language === 'pt'
                        ? 'bg-blue-100'
                        : 'hover:bg-gray-100 opacity-60'
                    }`}
                    aria-label="Português"
                  >
                    <svg className="w-6 h-5" viewBox="0 0 20 14" fill="none">
                      <rect width="20" height="14" fill="#009B3A"/>
                      <path d="M10 2L17 7L10 12L3 7L10 2Z" fill="#FEDF00"/>
                      <circle cx="10" cy="7" r="2.5" fill="#002776"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => switchLanguage('en')}
                    className={`px-3 py-2 rounded transition-colors ${
                      language === 'en'
                        ? 'bg-blue-100'
                        : 'hover:bg-gray-100 opacity-60'
                    }`}
                    aria-label="English"
                  >
                    <svg className="w-6 h-5" viewBox="0 0 20 14" fill="none">
                      <rect width="20" height="14" fill="#B22234"/>
                      <rect width="20" height="1" y="2" fill="white"/>
                      <rect width="20" height="1" y="4" fill="white"/>
                      <rect width="20" height="1" y="6" fill="white"/>
                      <rect width="20" height="1" y="8" fill="white"/>
                      <rect width="20" height="1" y="10" fill="white"/>
                      <rect width="20" height="1" y="12" fill="white"/>
                      <rect width="8" height="7" fill="#3C3B6E"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="px-6 py-16 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="mt-4 text-sm text-gray-600">Loading events...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mx-6 my-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              ⚠️ Could not load Google Sheets data. Using sample events. Error: {error}
            </p>
          </div>
        )}

        {/* Show Past Events Toggle - Only in month view */}
        {!loading && viewMode === 'month' && isCurrentMonth && pastEventCount > 0 && (
          <div className="px-6 pt-4 pb-2">
            <button
              onClick={() => setShowPastEvents(!showPastEvents)}
              className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded transition-colors flex items-center justify-center gap-2"
            >
              <svg className={`w-4 h-4 transition-transform ${showPastEvents ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span>
                {showPastEvents
                  ? (language === 'pt' ? 'Ocultar eventos passados' : 'Hide past events')
                  : (language === 'pt'
                      ? `Mostrar ${pastEventCount} evento${pastEventCount !== 1 ? 's' : ''} passado${pastEventCount !== 1 ? 's' : ''}`
                      : `Show ${pastEventCount} past event${pastEventCount !== 1 ? 's' : ''}`
                    )
                }
              </span>
            </button>
          </div>
        )}

        {/* Calendar Days - Google Calendar Style */}
        {!loading && (
          <div className="px-6 py-4">
            <div className="space-y-0">
              {daysInMonth.map(dayInfo => {
              const eventsForDay = getEventsForDay(
                filteredEvents,
                currentYear,
                currentMonth,
                dayInfo.day
              );

              // Only render days that have events
              if (eventsForDay.length === 0) {
                return null;
              }

              // Hide past events in current month if showPastEvents is false (only in month view)
              if (viewMode === 'month' && isCurrentMonth && !showPastEvents && isDayInPast(dayInfo)) {
                return null;
              }

              return (
                <DayRow
                  key={dayInfo.dateString}
                  dayInfo={dayInfo}
                  events={eventsForDay}
                  nextEventId={nextEventId}
                />
              );
            })}
          </div>

          {/* No Events Message */}
          {daysInMonth.every(dayInfo => {
            const eventsForDay = getEventsForDay(
              filteredEvents,
              currentYear,
              currentMonth,
              dayInfo.day
            );
            return eventsForDay.length === 0;
          }) && (
            <div className="py-16 text-center">
              <div className="text-6xl mb-4 opacity-40">📅</div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                {t('noEvents')}
              </h3>
              <p className="text-sm text-gray-500">
                {t('noEventsDescription')} {t(`months.${getMonthName(currentMonth)}`)} {currentYear}.
              </p>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
