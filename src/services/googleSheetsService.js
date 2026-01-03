import axios from 'axios';
import { RRule, RRuleSet, rrulestr } from 'rrule';

// Google Sheets ID from the URL
const SHEET_ID = '1_gwn-4tW7H4-2VBT5qM0xJAKG-ZIkvy_dEIHt9CnO6w';

// Convert Google Sheets to CSV export URL
const getSheetCSVUrl = (sheetId, gid = 0) => {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
};

// Parse CSV data
const parseCSV = (csv) => {
  const lines = csv.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  const data = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = parseCSVLine(lines[i]);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    data.push(row);
  }

  return data;
};

// Fetch program data from a separate Google Sheet
const fetchProgramData = async (programSheetId) => {
  if (!programSheetId) return null;

  try {
    const url = getSheetCSVUrl(programSheetId);
    const response = await axios.get(url);
    const rows = parseCSV(response.data);

    // Transform program rows to a structured format
    return rows.map(row => ({
      unit: row.unit || '',
      startTime: row.start_time || '',
      endTime: row.end_time || '',
      act: row.act || '',
      title: row.title || '',
      presenter: row.presenter || ''
    })).filter(item => item.title); // Only include rows with a title

  } catch (error) {
    console.error('Error fetching program data:', error);
    return null;
  }
};

// Parse a CSV line handling quoted values
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
};

// Parse date from Google Sheets format (M/D/YYYY)
const parseSheetDate = (dateString) => {
  if (!dateString) return null;

  const [month, day, year] = dateString.split('/');
  // Use noon to avoid timezone issues
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0, 0);
};

// Parse time from Google Sheets format (H:MM:SS AM/PM)
const parseSheetTime = (timeString) => {
  if (!timeString) return null;

  const match = timeString.match(/(\d+):(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return null;

  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[4].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return { hours, minutes };
};

// Expand recurring events based on RRULE
const expandRecurringEvent = (event, startDate, endDate) => {
  if (!event.recurrence_rule) {
    return [event];
  }

  try {
    // Ensure startDate is at noon to avoid timezone issues
    const normalizedStartDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      12, 0, 0, 0
    );

    // Parse the RRULE string
    const rrule = rrulestr(event.recurrence_rule, {
      dtstart: normalizedStartDate
    });

    // Get all occurrences between start and end date
    const occurrences = rrule.between(
      new Date(normalizedStartDate.getTime() - 365 * 24 * 60 * 60 * 1000), // 1 year before
      new Date(endDate.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year after
      true
    );

    // Create an event for each occurrence
    return occurrences.map((occurrence, index) => {
      // Ensure we use the local date components
      const occurrenceDate = new Date(occurrence);
      const year = occurrenceDate.getFullYear();
      const month = String(occurrenceDate.getMonth() + 1).padStart(2, '0');
      const day = String(occurrenceDate.getDate()).padStart(2, '0');

      return {
        ...event,
        id: `${event.id}-occurrence-${index}`,
        date: `${year}-${month}-${day}`,
        isRecurring: true,
        occurrenceIndex: index
      };
    });
  } catch (error) {
    console.error('Error parsing RRULE:', error);
    return [event];
  }
};

// Transform Google Sheets row to event format
const transformSheetRowToEvent = (row) => {
  if (!row.title || !row.start_date) return null;

  const startDate = parseSheetDate(row.start_date);
  if (!startDate) return null;

  const startTime = parseSheetTime(row.start_time);

  // Format date as YYYY-MM-DD using the date components directly
  const year = startDate.getFullYear();
  const month = String(startDate.getMonth() + 1).padStart(2, '0');
  const day = String(startDate.getDate()).padStart(2, '0');

  // Format time
  let timeString = '';
  if (startTime) {
    const hours = startTime.hours;
    const minutes = String(startTime.minutes).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    timeString = `${displayHours}:${minutes} ${period}`;
  }

  // Generate a unique ID based on title and date
  const uniqueId = row.event_id || row.row_id || `${row.title.replace(/\s+/g, '-').toLowerCase()}-${row.start_date.replace(/\//g, '-')}`;

  return {
    id: uniqueId,
    churchId: row.calendar_id || 'grace-community',
    title: row.title,
    description: row.description || '',
    location: row.location || '',
    date: `${year}-${month}-${day}`,
    time: timeString,
    type: determineEventType(row.title),
    status: row.status || 'confirmed',
    recurrence_rule: row.recurrence_rule,
    program_sheet_id: row.program_sheet_id || '',
    // Store original data for reference
    _original: {
      start_date: row.start_date,
      end_date: row.end_date,
      start_time: row.start_time,
      end_time: row.end_time,
      timezone: row.timezone
    }
  };
};

// Determine event type based on title (you can customize this logic)
const determineEventType = (title) => {
  const titleLower = title.toLowerCase();

  if (titleLower.includes('worship') || titleLower.includes('sunday')) {
    return { id: 'sunday_service', icon: '⛪', color: 'bg-blue-600', borderColor: 'border-blue-600' };
  }
  if (titleLower.includes('prayer') || titleLower.includes('oração')) {
    return { id: 'prayer_meeting', icon: '🙏', color: 'bg-purple-600', borderColor: 'border-purple-600' };
  }
  if (titleLower.includes('bible') || titleLower.includes('study') || titleLower.includes('estudo')) {
    return { id: 'bible_study', icon: '📖', color: 'bg-green-600', borderColor: 'border-green-600' };
  }
  if (titleLower.includes('youth') || titleLower.includes('jovens')) {
    return { id: 'youth_group', icon: '👥', color: 'bg-orange-600', borderColor: 'border-orange-600' };
  }
  if (titleLower.includes('casais') || titleLower.includes('couples')) {
    return { id: 'special_event', icon: '💑', color: 'bg-pink-600', borderColor: 'border-pink-600' };
  }
  if (titleLower.includes('família') || titleLower.includes('family')) {
    return { id: 'special_event', icon: '👨‍👩‍👧‍👦', color: 'bg-teal-600', borderColor: 'border-teal-600' };
  }

  // Default type
  return { id: 'special_event', icon: '📅', color: 'bg-indigo-600', borderColor: 'border-indigo-600' };
};

// Fetch and parse events from Google Sheets
export const fetchGoogleSheetsEvents = async () => {
  try {
    const url = getSheetCSVUrl(SHEET_ID);
    const response = await axios.get(url);

    const rows = parseCSV(response.data);

    // Transform rows to events
    const baseEvents = rows
      .map(transformSheetRowToEvent)
      .filter(event => event !== null && event.status === 'confirmed');

    // Fetch program data for events that have a program_sheet_id
    await Promise.all(baseEvents.map(async (event) => {
      if (event.program_sheet_id) {
        event.program = await fetchProgramData(event.program_sheet_id);
      }
    }));

    // Expand recurring events
    const allEvents = [];
    const now = new Date();
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const oneYearLater = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    baseEvents.forEach(event => {
      if (event.recurrence_rule) {
        const startDate = parseSheetDate(event._original.start_date);
        const expandedEvents = expandRecurringEvent(event, startDate, oneYearLater);
        allEvents.push(...expandedEvents);
      } else {
        allEvents.push(event);
      }
    });

    return allEvents;
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    throw error;
  }
};
