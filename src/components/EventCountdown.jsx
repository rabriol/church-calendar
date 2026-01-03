import React, { useState, useEffect } from 'react';
import { getTimeUntilEvent, formatCountdown } from '../utils/eventTiming';
import { useLanguage } from '../contexts/LanguageContext';

const EventCountdown = ({ event }) => {
  const { language } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  const minutesUntil = getTimeUntilEvent(event, currentTime);

  if (minutesUntil === null || minutesUntil < 0) {
    return null;
  }

  const countdownText = formatCountdown(minutesUntil, language);

  // Different styling based on urgency
  let bgColor = 'bg-green-100';
  let textColor = 'text-green-800';
  let borderColor = 'border-green-500';

  if (minutesUntil <= 15) {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
    borderColor = 'border-red-500';
  } else if (minutesUntil <= 60) {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
    borderColor = 'border-yellow-500';
  }

  const labels = {
    en: { startsIn: 'Starts in', startingSoon: 'Starting soon!', upcoming: 'Upcoming' },
    pt: { startsIn: 'Começa em', startingSoon: 'Começando em breve!', upcoming: 'Próximo' }
  };

  const lang = labels[language] || labels.en;

  return (
    <div className={`${bgColor} ${borderColor} border-2 rounded-lg px-3 py-2 shadow-lg animate-pulse inline-block`}>
      <div className="flex items-center gap-2">
        <svg className={`w-4 h-4 ${textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <div className={`text-xs font-semibold ${textColor} leading-none`}>
            {minutesUntil <= 15 ? lang.startingSoon : lang.startsIn}
          </div>
          <div className={`text-lg font-bold ${textColor} leading-tight`}>
            {countdownText}
          </div>
        </div>
        {minutesUntil <= 5 && (
          <div className="animate-bounce">
            <svg className={`w-5 h-5 ${textColor}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCountdown;
