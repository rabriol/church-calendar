import React, { useState, useEffect } from 'react';
import { getEventDateTime } from '../utils/eventTiming';
import { useLanguage } from '../contexts/LanguageContext';

const EventTimeline = ({ event, assumedDuration = 2 }) => {
  const { language } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const eventStart = getEventDateTime(event.date, event.time);
  if (!eventStart) return null;

  const eventEnd = new Date(eventStart.getTime() + assumedDuration * 60 * 60 * 1000);

  // Calculate progress percentage
  const totalDuration = eventEnd - eventStart;
  const elapsed = currentTime - eventStart;
  const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);

  // Calculate time remaining
  const remainingMs = eventEnd - currentTime;
  const remainingMinutes = Math.max(0, Math.floor(remainingMs / (1000 * 60)));
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingMins = remainingMinutes % 60;

  const labels = {
    en: {
      eventProgress: 'Event Progress',
      timeRemaining: 'Time Remaining',
      hours: 'h',
      minutes: 'm'
    },
    pt: {
      eventProgress: 'Progresso do Evento',
      timeRemaining: 'Tempo Restante',
      hours: 'h',
      minutes: 'm'
    }
  };

  const lang = labels[language] || labels.en;

  const formatTime = (date) => {
    return date.toLocaleTimeString(language === 'pt' ? 'pt-BR' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatRemaining = () => {
    if (remainingHours > 0) {
      return `${remainingHours}${lang.hours} ${remainingMins}${lang.minutes}`;
    }
    return `${remainingMins}${lang.minutes}`;
  };

  return (
    <div className="mt-4 bg-white rounded-lg border-2 border-green-300 p-4 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-green-800 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {lang.eventProgress}
        </span>
        <span className="text-sm font-bold text-green-700">
          {lang.timeRemaining}: {formatRemaining()}
        </span>
      </div>

      {/* Timeline bar */}
      <div className="relative">
        {/* Background track */}
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          {/* Progress fill */}
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000 ease-linear relative"
            style={{ width: `${progress}%` }}
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
          </div>
        </div>

        {/* Current time marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear"
          style={{ left: `${progress}%` }}
        >
          {/* Marker line */}
          <div className="relative">
            <div className="w-1 h-6 bg-green-700 rounded-full shadow-lg -translate-x-1/2"></div>
            {/* Pulsing dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600 border-2 border-white shadow-lg"></span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Start and end time labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-600">
        <span className="font-medium">{formatTime(eventStart)}</span>
        <span className="font-medium">{formatTime(eventEnd)}</span>
      </div>

      {/* Progress percentage */}
      <div className="text-center mt-2">
        <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">
          {Math.round(progress)}% {language === 'pt' ? 'Completo' : 'Complete'}
        </span>
      </div>
    </div>
  );
};

export default EventTimeline;
