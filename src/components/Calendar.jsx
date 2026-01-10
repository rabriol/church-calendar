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
        // Clear existing programs first
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

  // Use all events (church filter removed)
  const filteredEvents = events;

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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Top Header Bar - Google Calendar Style */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-3 sm:px-6 py-3 sm:py-4">
            {/* Mobile Layout */}
            <div className="flex flex-col gap-2.5 sm:hidden">
              {/* Row 1: Title */}
              <div className="flex items-center justify-between">
                <h1 className="text-base font-normal text-gray-700 flex-1 truncate pr-2">
                  {t('title')}
                </h1>
                <button
                  onClick={goToToday}
                  className="px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex-shrink-0"
                >
                  {t('goToToday')}
                </button>
              </div>

              {/* Row 2: Month Navigation and Language */}
              <div className="flex items-center justify-between gap-2">
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

                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => switchLanguage('pt')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      language === 'pt'
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    PT
                  </button>
                  <button
                    onClick={() => switchLanguage('en')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      language === 'en'
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    EN
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
                  <button
                    onClick={goToToday}
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    {t('goToToday')}
                  </button>

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
                </div>
              </div>

              {/* Right: Language Selector */}
              <div className="flex items-center gap-4">
                {/* Language Selector */}
                <div className="flex gap-1">
                  <button
                    onClick={() => switchLanguage('pt')}
                    className={`px-3 py-1.5 text-sm rounded transition-colors ${
                      language === 'pt'
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    PT
                  </button>
                  <button
                    onClick={() => switchLanguage('en')}
                    className={`px-3 py-1.5 text-sm rounded transition-colors ${
                      language === 'en'
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    EN
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
