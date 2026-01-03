// Parse time string like "10:00 AM" to hours and minutes
export const parseEventTime = (timeString) => {
  const match = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return null;

  let [, hours, minutes, period] = match;
  hours = parseInt(hours);
  minutes = parseInt(minutes);

  // Convert to 24-hour format
  if (period.toUpperCase() === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
};

// Get event datetime by combining date string and time string
export const getEventDateTime = (dateString, timeString) => {
  // Parse date in local timezone to avoid UTC issues
  const [year, month, day] = dateString.split('-').map(Number);
  const time = parseEventTime(timeString);

  if (!time) return null;

  // Create date in local timezone
  const eventDateTime = new Date(year, month - 1, day, time.hours, time.minutes, 0, 0);

  return eventDateTime;
};

// Calculate event status: 'finished', 'ongoing', 'upcoming'
export const getEventStatus = (event, currentTime, assumedDuration = 2) => {
  const eventStart = getEventDateTime(event.date, event.time);
  if (!eventStart) return 'upcoming';

  const eventEnd = new Date(eventStart.getTime() + assumedDuration * 60 * 60 * 1000);

  if (currentTime < eventStart) {
    return 'upcoming';
  } else if (currentTime >= eventStart && currentTime < eventEnd) {
    return 'ongoing';
  } else {
    return 'finished';
  }
};

// Get time until event in minutes
export const getTimeUntilEvent = (event, currentTime) => {
  const eventStart = getEventDateTime(event.date, event.time);
  if (!eventStart) return null;

  const diff = eventStart - currentTime;
  return Math.floor(diff / (1000 * 60)); // Convert to minutes
};

// Format countdown display
export const formatCountdown = (minutes, language = 'en') => {
  if (minutes < 0) return null;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const labels = {
    en: { h: 'h', m: 'm', hour: 'hour', hours: 'hours', minute: 'minute', minutes: 'minutes' },
    pt: { h: 'h', m: 'm', hour: 'hora', hours: 'horas', minute: 'minuto', minutes: 'minutos' }
  };

  const lang = labels[language] || labels.en;

  if (hours > 0) {
    if (mins === 0) {
      return `${hours}${lang.h}`;
    }
    return `${hours}${lang.h} ${mins}${lang.m}`;
  }

  return `${mins}${lang.m}`;
};

// Get next upcoming event from a list
export const getNextEvent = (events, currentTime) => {
  const upcomingEvents = events
    .map(event => ({
      ...event,
      startTime: getEventDateTime(event.date, event.time)
    }))
    .filter(event => event.startTime && event.startTime > currentTime)
    .sort((a, b) => a.startTime - b.startTime);

  return upcomingEvents[0] || null;
};
