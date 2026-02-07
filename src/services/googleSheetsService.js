import axios from 'axios';
import { RRule, RRuleSet, rrulestr } from 'rrule';

// Google Sheets ID from the URL
const SHEET_ID = '1_gwn-4tW7H4-2VBT5qM0xJAKG-ZIkvy_dEIHt9CnO6w';

// Convert Google Sheets to CSV export URL
const getSheetCSVUrl = (sheetId, gid = 0) => {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
};

// Fetch colors from Colors tab
const fetchColors = async () => {
  try {
    // Try to fetch the Colors tab - you may need to find the correct gid
    // We'll try multiple gids to find the Colors tab
    console.log('🔍 Searching for Colors tab...');

    for (let gid of [1646991692, 0, 1, 2, 3, 4, 5]) {
      try {
        const url = getSheetCSVUrl(SHEET_ID, gid);
        console.log(`  Trying gid=${gid}...`);
        const response = await axios.get(url);
        const rows = parseCSV(response.data);

        console.log(`  gid=${gid} - Found ${rows.length} rows`);
        if (rows.length > 0) {
          const firstRow = rows[0];
          const headers = Object.keys(firstRow);
          console.log(`  gid=${gid} - Headers:`, headers);

          // Check if this is the Colors tab by looking for expected headers
          const hasIdColumn = headers.some(h => h.toLowerCase() === 'id');
          const hasHexColumn = headers.some(h => h.toLowerCase() === 'hex');

          console.log(`  gid=${gid} - Has 'id' column: ${hasIdColumn}, Has 'hex' column: ${hasHexColumn}`);

          if (hasIdColumn && hasHexColumn) {
            console.log('✅ Found Colors tab at gid:', gid);

            // Create a color mapping: { colorId: { id, visual, hex, text_color } }
            const colorMap = {};
            rows.forEach(row => {
              if (row.id && row.hex) {
                colorMap[row.id.toLowerCase()] = {
                  id: row.id,
                  visual: row.visual || '',
                  hex: row.hex,
                  textColor: row.text_color || '#FFFFFF'
                };
              }
            });

            console.log('🎨 Loaded colors:', colorMap);
            return colorMap;
          }
        }
      } catch (err) {
        console.log(`  gid=${gid} - Error:`, err.message);
        continue;
      }
    }

    console.warn('⚠️ Colors tab not found, using default colors');
    return null;
  } catch (error) {
    console.error('Error fetching colors:', error);
    return null;
  }
};

// Parse CSV data - properly handles multi-line quoted fields
const parseCSV = (csv) => {
  const lines = [];
  let currentLine = '';
  let insideQuotes = false;

  // Split CSV into lines while respecting quoted fields with newlines
  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
      currentLine += char;
    } else if (char === '\n' && !insideQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = '';
    } else {
      currentLine += char;
    }
  }

  // Add last line if exists
  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  const headers = parseCSVLine(lines[0]).map(h => h.trim());
  console.log('📋 CSV Headers:', headers);

  const data = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = parseCSVLine(lines[i]);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    // Debug log for E-0017
    if (row.row_id === 'E-0017' || row.event_id === 'E-0017') {
      console.log('📄 Raw CSV line for E-0017:', lines[i]);
      console.log('📊 Parsed values for E-0017:', values);
      console.log('🗂️ Row object for E-0017:', row);
    }

    data.push(row);
  }

  return data;
};

// Fetch program data from a separate Google Sheet with date-based tab lookup
const fetchProgramData = async (programSheetId, eventDate) => {
  if (!programSheetId || !eventDate) return null;

  try {
    // Parse event date to format: mm/dd/yyyy (with leading zeros)
    const [year, month, day] = eventDate.split('-').map(Number);
    const dateKey = `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;

    console.log(`📅 Looking for program tab for date: ${dateKey}`);

    // Step 1: Fetch the index/lookup tab (gid=0) which maps dates to gids
    const indexUrl = getSheetCSVUrl(programSheetId, 0);
    const indexResponse = await axios.get(indexUrl);
    const indexRows = parseCSV(indexResponse.data);

    console.log(`📋 Program index has ${indexRows.length} entries`);

    // Step 2: Find the gid for the matching date
    let programGid = null;
    for (const row of indexRows) {
      const rowDate = row.date || row.Date || '';
      if (rowDate.trim() === dateKey) {
        programGid = row.gid || row.Gid || row.GID;
        console.log(`✅ Found matching program tab: date=${dateKey}, gid=${programGid}`);
        break;
      }
    }

    // If no matching date found, return null (no program to display)
    if (!programGid) {
      console.log(`⚠️ No program tab found for date: ${dateKey}`);
      return null;
    }

    // Step 3: Fetch the actual program data from the matching tab
    const programUrl = getSheetCSVUrl(programSheetId, programGid);
    const programResponse = await axios.get(programUrl);
    const programRows = parseCSV(programResponse.data);

    console.log(`📊 Loaded ${programRows.length} program items for ${dateKey}`);

    // Transform program rows to a structured format
    return programRows.map(row => ({
      unit: row.unit || '',
      startTime: row.start_time || '',
      endTime: row.end_time || '',
      act: row.act || '',
      title: row.title || '',
      presenter: row.presenter || '',
      link: row.link || '',
      linkDescription: row.link_description || ''
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
const transformSheetRowToEvent = (row, colorMap = null) => {
  // Debug logging for specific event
  if (row.row_id === 'E-0017' || row.event_id === 'E-0017') {
    console.log('🔍 Processing event E-0017:', {
      row_id: row.row_id,
      event_id: row.event_id,
      title: row.title,
      start_date: row.start_date,
      status: row.status,
      color_id: row.color_id,
      fullRow: row
    });
  }

  if (!row.title || !row.start_date) {
    if (row.row_id === 'E-0017' || row.event_id === 'E-0017') {
      console.log('❌ Event E-0017 rejected: Missing title or start_date');
    }
    return null;
  }

  const startDate = parseSheetDate(row.start_date);
  if (!startDate) {
    if (row.row_id === 'E-0017' || row.event_id === 'E-0017') {
      console.log('❌ Event E-0017 rejected: Could not parse start_date');
    }
    return null;
  }

  const startTime = parseSheetTime(row.start_time);
  const endTime = parseSheetTime(row.end_time);

  // Format date as YYYY-MM-DD using the date components directly
  const year = startDate.getFullYear();
  const month = String(startDate.getMonth() + 1).padStart(2, '0');
  const day = String(startDate.getDate()).padStart(2, '0');

  // Format start time
  let timeString = '';
  if (startTime) {
    const hours = startTime.hours;
    const minutes = String(startTime.minutes).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    timeString = `${displayHours}:${minutes} ${period}`;
  }

  // Format end time
  let endTimeString = '';
  if (endTime) {
    const hours = endTime.hours;
    const minutes = String(endTime.minutes).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    endTimeString = `${displayHours}:${minutes} ${period}`;
  }

  // Generate a unique ID based on title and date
  const uniqueId = row.event_id || row.row_id || `${row.title.replace(/\s+/g, '-').toLowerCase()}-${row.start_date.replace(/\//g, '-')}`;

  // Get color from colorMap if available
  let eventColor = null;
  if (colorMap && row.color_id) {
    const colorId = row.color_id.toLowerCase().trim();
    eventColor = colorMap[colorId] || null;
  }

  const event = {
    id: uniqueId,
    title: row.title,
    description: row.description || '',
    htmlDescription: row.html_description || '',
    location: row.location || '',
    date: `${year}-${month}-${day}`,
    time: timeString,
    endTime: endTimeString,
    type: row.event_type || determineEventType(row.title),
    status: row.status || 'confirmed',
    recurrence_rule: row.recurrence_rule,
    program_sheet_id: row.program_sheet_id || '',
    youtubeUrl: row.youtube_url || '',
    zoomUrl: row.zoom_url || '',
    isLive: row.is_live?.toUpperCase() === 'TRUE',
    color: eventColor, // Add color from Colors tab
    // Registration fields
    registrationUrl: row.registration_url || '',
    registrationButtonText: row.registration_button_text || null,
    registrationDeadline: row.registration_deadline || null,
    // Store original data for reference
    _original: {
      start_date: row.start_date,
      end_date: row.end_date,
      start_time: row.start_time,
      end_time: endTimeString,
      timezone: row.timezone
    }
  };

  // Debug logging for specific event
  if (row.row_id === 'E-0017' || row.event_id === 'E-0017') {
    console.log('✅ Event E-0017 transformed successfully:', event);
  }

  return event;
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

// Fetch and parse events from Google Sheets (without programs)
export const fetchGoogleSheetsEvents = async () => {
  try {
    // Fetch colors first
    const colorMap = await fetchColors();

    const url = getSheetCSVUrl(SHEET_ID);
    const response = await axios.get(url);

    const rows = parseCSV(response.data);

    // Transform rows to events, passing colorMap
    const baseEvents = rows
      .map(row => transformSheetRowToEvent(row, colorMap))
      .filter(event => {
        const isValid = event !== null && event.status === 'confirmed';

        // Debug logging for E-0017
        if (event && (event.id === 'E-0017' || event.id?.includes('E-0017'))) {
          console.log('🔍 Filtering event E-0017:', {
            isNull: event === null,
            status: event?.status,
            isValid: isValid,
            willBeIncluded: isValid
          });
        }

        return isValid;
      });

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

// Fetch programs for events in a specific month
export const fetchProgramsForMonth = async (events, year, month) => {
  try {
    console.log(`📆 Fetching programs for ${month + 1}/${year}`);

    // Filter events to only those in the specified month/year
    const eventsInMonth = events.filter(event => {
      const [eventYear, eventMonth] = event.date.split('-').map(Number);
      return eventYear === year && eventMonth === month + 1;
    });

    console.log(`📊 Found ${eventsInMonth.length} events in ${month + 1}/${year} that may have programs`);

    // Fetch programs for events in this month
    await Promise.all(eventsInMonth.map(async (event) => {
      if (event.program_sheet_id && !event.program) {
        event.program = await fetchProgramData(event.program_sheet_id, event.date);
      }
    }));

    console.log(`✅ Programs loaded for ${month + 1}/${year}`);
  } catch (error) {
    console.error('Error fetching programs for month:', error);
  }
};
