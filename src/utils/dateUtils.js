export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getMonthName = (month) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
};

export const getDayName = (date) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    dayName: getDayName(date),
    fullDate: date
  };
};

export const isSameDay = (date1, date2) => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

export const isToday = (dateString) => {
  // Parse date string in local timezone
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  return isSameDay(date, today);
};

export const getEventsForDay = (events, year, month, day) => {
  return events.filter(event => {
    // Parse date string in local timezone to avoid UTC conversion
    const [eventYear, eventMonth, eventDay] = event.date.split('-').map(Number);
    return eventDay === day &&
           (eventMonth - 1) === month &&
           eventYear === year;
  });
};

export const getAllDaysInMonth = (year, month) => {
  const daysInMonth = getDaysInMonth(year, month);
  const days = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push({
      day,
      dayName: getDayName(date),
      date,
      dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    });
  }

  return days;
};
