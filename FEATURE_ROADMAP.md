# Church Calendar - Feature Roadmap

**Last Updated:** 2026-01-30
**Project:** Church Calendar Application
**Tech Stack:** React, Vite, Tailwind CSS, Google Sheets

---

## Completed Features ✅

- [x] Google Sheets integration for events
- [x] Recurring events support (via recurrence_rule)
- [x] Dynamic event colors from Google Sheets
- [x] YouTube live stream integration with "Watch Live" button
- [x] Zoom meeting integration
- [x] WhatsApp sharing for live events
- [x] Portuguese/English language toggle with flags
- [x] Event status indicators (finished, ongoing, upcoming)
- [x] Countdown timer for next event
- [x] Program/schedule support via Google Sheets tabs
- [x] Real-time program item highlighting during events
- [x] HTML description support for rich content
- [x] Week view filter
- [x] Auto-collapse past events in current month
- [x] Program item links with friendly descriptions

---

## Event Enhancements

- [ ] **Event Registration/RSVP**
  - Allow people to register for events directly
  - Optional fields: name, email, phone, number of attendees
  - Store responses in Google Sheets or database
  - Display registration count/capacity

- [ ] **Event Reminders**
  - Email/SMS notifications 1 day or 1 hour before events start
  - Requires backend service (Firebase Cloud Functions, etc.)
  - User subscription management

- [ ] **iCal/Google Calendar Export**
  - "Add to Calendar" button generating .ics files
  - Google Calendar quick-add links
  - Support for multi-day events and recurring patterns

- [ ] **Event Categories/Tags**
  - Filter events by ministry (Youth, Women's, Men's, Children's, etc.)
  - Tag-based filtering UI with chips/badges
  - Color-coding by category

- [ ] **Photo Galleries**
  - Link to photo albums from past events
  - Integrate with Google Photos or embed galleries
  - Thumbnail previews in event details

- [ ] **Attendance Tracking**
  - Simple check-in system for tracking event attendance
  - QR code check-in option
  - Analytics on attendance trends

---

## Content & Media

- [ ] **Sermon Archive Integration**
  - Display recent sermons with audio/video links
  - Sermon series grouping
  - Search by speaker, topic, or scripture

- [ ] **Podcast Feed**
  - Integrate church podcast episodes
  - Display latest episodes with play buttons
  - RSS feed integration

- [ ] **Bulletin/Announcements**
  - Weekly announcements section
  - Priority levels and expiration dates
  - Separate Google Sheet for announcements

- [ ] **Bible Reading Plans**
  - Daily scripture readings
  - Progress tracking per user
  - Multiple reading plan options

- [ ] **Prayer Requests**
  - Submit and display prayer requests
  - Moderation/approval workflow
  - Privacy options (public/private)

---

## User Experience

- [ ] **Search & Filters**
  - Search events by keyword
  - Filter by date range, ministry, or event type
  - Advanced filter combinations

- [ ] **Print View**
  - Clean, printer-friendly layout
  - Weekly/monthly schedule print options
  - Customizable print settings

- [ ] **Dark Mode**
  - Toggle between light and dark themes
  - System preference detection
  - Persistent user preference

- [ ] **Calendar Subscription**
  - Subscribe to events via iCal URL (auto-updates)
  - Dynamic feed from Google Sheets
  - Separate feeds by ministry/category

- [ ] **Mobile PWA**
  - Convert to Progressive Web App
  - Home screen installation
  - Offline support
  - Push notifications

- [ ] **Multi-church Support**
  - Dropdown to switch between church locations
  - Separate Google Sheets per location
  - Location-specific events and programs

---

## Engagement & Participation

- [ ] **Volunteer Sign-ups**
  - Schedule with time slots for volunteers
  - Roles: greeters, ushers, tech team, etc.
  - Email confirmations and reminders
  - Shift management

- [ ] **Ministry Spotlight**
  - Rotating feature highlighting different ministries
  - Rich media content (photos, videos, descriptions)
  - Contact information and join links

- [ ] **Giving Integration**
  - Quick links to online giving/tithes
  - Integration with giving platforms (Pushpay, Tithe.ly, etc.)
  - QR codes for mobile giving

- [ ] **Social Sharing**
  - Pre-filled social media posts
  - Auto-generated event graphics
  - Share to Facebook, Twitter, Instagram

- [ ] **Comments/Questions**
  - Allow members to ask questions about events
  - Moderation system
  - Email notifications for responses

---

## Analytics & Admin

- [ ] **Event Analytics**
  - Track views, clicks, RSVPs per event
  - Most popular events dashboard
  - Engagement metrics over time

- [ ] **Popular Events**
  - Show trending or most-viewed upcoming events
  - "Featured Events" section
  - Algorithmic or manual curation

- [ ] **Admin Dashboard**
  - Manage events without editing Google Sheets
  - WYSIWYG event editor
  - Drag-and-drop program builder
  - Bulk operations

- [ ] **Automated Recurring Events**
  - Smart generation of weekly/monthly patterns
  - Template-based event creation
  - Exception handling for holidays

---

## Priority Tracking

### High Priority 🔴
- Event Registration/RSVP
- iCal/Google Calendar Export
- Search & Filters
- Mobile PWA

### Medium Priority 🟡
- Dark Mode
- Event Categories/Tags
- Sermon Archive Integration
- Volunteer Sign-ups

### Low Priority 🟢
- Prayer Requests
- Comments/Questions
- Event Analytics
- Admin Dashboard

---

## Notes

- Keep Google Sheets as primary data source for simplicity
- Consider backend requirements for interactive features (registration, comments)
- Maintain mobile-first responsive design
- Ensure accessibility (WCAG 2.1 AA compliance)
- Performance: Keep bundle size under 500KB

---

## Ideas/Brainstorming

- Integration with church management systems (Planning Center, CCB, etc.)
- Multi-language support beyond PT/EN (Spanish, French, etc.)
- Accessibility features: screen reader optimization, high contrast mode
- Event templates for common event types
- Location-based features (maps, directions, parking info)
- Weather integration for outdoor events
