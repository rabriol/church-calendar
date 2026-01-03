import { EVENT_TYPES } from './eventTypes';

// Sample events for demonstration
export const sampleEvents = [
  // January 2025 - Grace Community Church
  {
    id: 1,
    churchId: 'grace-community',
    title: 'Sunday Worship Service',
    type: EVENT_TYPES.SUNDAY_SERVICE,
    date: '2025-01-05',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    description: 'Join us for worship, prayer, and biblical teaching.'
  },
  {
    id: 2,
    title: 'Evening Prayer Meeting',
    type: EVENT_TYPES.PRAYER_MEETING,
    date: '2025-01-05',
    time: '6:00 PM',
    location: 'Prayer Room',
    description: 'Come together for corporate prayer and intercession.'
  },
  {
    id: 3,
    title: 'Wednesday Bible Study',
    type: EVENT_TYPES.BIBLE_STUDY,
    date: '2025-01-08',
    time: '7:00 PM',
    location: 'Fellowship Hall',
    description: 'In-depth study of the Book of Romans.'
  },
  {
    id: 4,
    title: 'Choir Practice',
    type: EVENT_TYPES.CHOIR_PRACTICE,
    date: '2025-01-09',
    time: '7:30 PM',
    location: 'Music Room',
    description: 'Preparing songs for upcoming services.'
  },
  {
    id: 5,
    title: 'Sunday Worship Service',
    type: EVENT_TYPES.SUNDAY_SERVICE,
    date: '2025-01-12',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    description: 'Join us for worship, prayer, and biblical teaching.'
  },
  {
    id: 6,
    title: 'Youth Group Meeting',
    type: EVENT_TYPES.YOUTH_GROUP,
    date: '2025-01-12',
    time: '5:00 PM',
    location: 'Youth Center',
    description: 'Fun activities, worship, and discussion for ages 12-18.'
  },
  {
    id: 7,
    title: 'Wednesday Bible Study',
    type: EVENT_TYPES.BIBLE_STUDY,
    date: '2025-01-15',
    time: '7:00 PM',
    location: 'Fellowship Hall',
    description: 'In-depth study of the Book of Romans.'
  },
  {
    id: 8,
    title: 'Choir Practice',
    type: EVENT_TYPES.CHOIR_PRACTICE,
    date: '2025-01-16',
    time: '7:30 PM',
    location: 'Music Room',
    description: 'Preparing songs for upcoming services.'
  },
  {
    id: 9,
    title: 'Community Food Drive',
    type: EVENT_TYPES.OUTREACH,
    date: '2025-01-18',
    time: '9:00 AM',
    location: 'Church Parking Lot',
    description: 'Collecting and distributing food to families in need.'
  },
  {
    id: 10,
    title: 'Sunday Worship Service',
    type: EVENT_TYPES.SUNDAY_SERVICE,
    date: '2025-01-19',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    description: 'Join us for worship, prayer, and biblical teaching.'
  },
  {
    id: 11,
    title: 'Baptism Service',
    type: EVENT_TYPES.CEREMONY,
    date: '2025-01-19',
    time: '12:00 PM',
    location: 'Baptistry',
    description: 'Celebrating new believers in Christ through baptism.'
  },
  {
    id: 12,
    title: 'Youth Group Meeting',
    type: EVENT_TYPES.YOUTH_GROUP,
    date: '2025-01-19',
    time: '5:00 PM',
    location: 'Youth Center',
    description: 'Fun activities, worship, and discussion for ages 12-18.'
  },
  {
    id: 13,
    title: 'Elders Meeting',
    type: EVENT_TYPES.COMMITTEE,
    date: '2025-01-21',
    time: '7:00 PM',
    location: 'Conference Room',
    description: 'Monthly meeting of church leadership.'
  },
  {
    id: 14,
    title: 'Wednesday Bible Study',
    type: EVENT_TYPES.BIBLE_STUDY,
    date: '2025-01-22',
    time: '7:00 PM',
    location: 'Fellowship Hall',
    description: 'In-depth study of the Book of Romans.'
  },
  {
    id: 15,
    title: 'Choir Practice',
    type: EVENT_TYPES.CHOIR_PRACTICE,
    date: '2025-01-23',
    time: '7:30 PM',
    location: 'Music Room',
    description: 'Preparing songs for upcoming services.'
  },
  {
    id: 16,
    title: 'Special Worship Night',
    type: EVENT_TYPES.SPECIAL_EVENT,
    date: '2025-01-25',
    time: '7:00 PM',
    location: 'Main Sanctuary',
    description: 'An evening of extended worship and prayer.'
  },
  {
    id: 17,
    title: 'Sunday Worship Service',
    type: EVENT_TYPES.SUNDAY_SERVICE,
    date: '2025-01-26',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    description: 'Join us for worship, prayer, and biblical teaching.'
  },
  {
    id: 18,
    title: 'Youth Group Meeting',
    type: EVENT_TYPES.YOUTH_GROUP,
    date: '2025-01-26',
    time: '5:00 PM',
    location: 'Youth Center',
    description: 'Fun activities, worship, and discussion for ages 12-18.'
  },
  {
    id: 19,
    title: 'Wednesday Bible Study',
    type: EVENT_TYPES.BIBLE_STUDY,
    date: '2025-01-29',
    time: '7:00 PM',
    location: 'Fellowship Hall',
    description: 'In-depth study of the Book of Romans.'
  },
  {
    id: 20,
    title: 'Choir Practice',
    type: EVENT_TYPES.CHOIR_PRACTICE,
    date: '2025-01-30',
    time: '7:30 PM',
    location: 'Music Room',
    description: 'Preparing songs for upcoming services.'
  },

  // February 2025
  {
    id: 21,
    title: 'Sunday Worship Service',
    type: EVENT_TYPES.SUNDAY_SERVICE,
    date: '2025-02-02',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    description: 'Join us for worship, prayer, and biblical teaching.'
  },
  {
    id: 22,
    title: 'Youth Group Meeting',
    type: EVENT_TYPES.YOUTH_GROUP,
    date: '2025-02-02',
    time: '5:00 PM',
    location: 'Youth Center',
    description: 'Fun activities, worship, and discussion for ages 12-18.'
  },
  {
    id: 23,
    title: 'Wednesday Bible Study',
    type: EVENT_TYPES.BIBLE_STUDY,
    date: '2025-02-05',
    time: '7:00 PM',
    location: 'Fellowship Hall',
    description: 'In-depth study of the Book of Romans.'
  },
  {
    id: 24,
    title: 'Valentine\'s Day Couples Dinner',
    type: EVENT_TYPES.SPECIAL_EVENT,
    date: '2025-02-14',
    time: '6:00 PM',
    location: 'Fellowship Hall',
    description: 'A special evening for married couples with dinner and fellowship.'
  },
  {
    id: 25,
    title: 'Sunday Worship Service',
    type: EVENT_TYPES.SUNDAY_SERVICE,
    date: '2025-02-16',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    description: 'Join us for worship, prayer, and biblical teaching.'
  },
  {
    id: 26,
    title: 'Homeless Shelter Ministry',
    type: EVENT_TYPES.OUTREACH,
    date: '2025-02-22',
    time: '10:00 AM',
    location: 'City Shelter',
    description: 'Serving meals and sharing the Gospel at local shelter.'
  },

  // November 2024
  {
    id: 27,
    title: 'Sunday Worship Service',
    type: EVENT_TYPES.SUNDAY_SERVICE,
    date: '2024-11-03',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    description: 'Join us for worship, prayer, and biblical teaching.'
  },
  {
    id: 28,
    title: 'Wednesday Bible Study',
    type: EVENT_TYPES.BIBLE_STUDY,
    date: '2024-11-06',
    time: '7:00 PM',
    location: 'Fellowship Hall',
    description: 'Studying the Gospel of John - Chapter 15.'
  },
  {
    id: 29,
    title: 'Youth Game Night',
    type: EVENT_TYPES.YOUTH_GROUP,
    date: '2024-11-08',
    time: '6:00 PM',
    location: 'Youth Center',
    description: 'Board games, video games, and pizza night for teens.'
  },
  {
    id: 30,
    title: 'Sunday Worship Service',
    type: EVENT_TYPES.SUNDAY_SERVICE,
    date: '2024-11-10',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    description: 'Join us for worship, prayer, and biblical teaching.'
  },
  {
    id: 31,
    title: 'Veterans Day Prayer Service',
    type: EVENT_TYPES.SPECIAL_EVENT,
    date: '2024-11-11',
    time: '7:00 PM',
    location: 'Main Sanctuary',
    description: 'Honoring and praying for our veterans and active military.'
  },
  {
    id: 32,
    title: 'Wednesday Bible Study',
    type: EVENT_TYPES.BIBLE_STUDY,
    date: '2024-11-13',
    time: '7:00 PM',
    location: 'Fellowship Hall',
    description: 'Studying the Gospel of John - Chapter 16.'
  },
  {
    id: 33,
    title: 'Choir Practice',
    type: EVENT_TYPES.CHOIR_PRACTICE,
    date: '2024-11-14',
    time: '7:30 PM',
    location: 'Music Room',
    description: 'Preparing Thanksgiving hymns and songs.'
  },
  {
    id: 34,
    title: 'Food Bank Volunteer Day',
    type: EVENT_TYPES.OUTREACH,
    date: '2024-11-16',
    time: '9:00 AM',
    location: 'Community Food Bank',
    description: 'Serving at the local food bank. Bring friends and family!'
  },
  {
    id: 35,
    title: 'Sunday Worship Service',
    type: EVENT_TYPES.SUNDAY_SERVICE,
    date: '2024-11-17',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    description: 'Join us for worship, prayer, and biblical teaching.'
  },
  {
    id: 36,
    title: 'Deacons Meeting',
    type: EVENT_TYPES.COMMITTEE,
    date: '2024-11-19',
    time: '7:00 PM',
    location: 'Conference Room',
    description: 'Monthly deacons meeting to discuss church operations.'
  },
  {
    id: 37,
    title: 'Wednesday Bible Study',
    type: EVENT_TYPES.BIBLE_STUDY,
    date: '2024-11-20',
    time: '7:00 PM',
    location: 'Fellowship Hall',
    description: 'Studying the Gospel of John - Chapter 17.'
  },
  {
    id: 38,
    title: 'Friday Night Prayer',
    type: EVENT_TYPES.PRAYER_MEETING,
    date: '2024-11-22',
    time: '7:00 PM',
    location: 'Prayer Room',
    description: 'Join us for an evening of prayer and worship.'
  },
  {
    id: 39,
    title: 'Thanksgiving Potluck Dinner',
    type: EVENT_TYPES.SPECIAL_EVENT,
    date: '2024-11-24',
    time: '5:00 PM',
    location: 'Fellowship Hall',
    description: 'Community Thanksgiving dinner. Bring a dish to share!'
  },
  {
    id: 40,
    title: 'Youth Group Meeting',
    type: EVENT_TYPES.YOUTH_GROUP,
    date: '2024-11-24',
    time: '3:00 PM',
    location: 'Youth Center',
    description: 'Thanksgiving-themed activities and gratitude sharing.'
  },
  {
    id: 41,
    title: 'Sunday Worship Service',
    type: EVENT_TYPES.SUNDAY_SERVICE,
    date: '2024-11-24',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    description: 'Thanksgiving Sunday Service - Celebrating God\'s blessings.'
  },
  {
    id: 42,
    title: 'Choir Practice',
    type: EVENT_TYPES.CHOIR_PRACTICE,
    date: '2024-11-28',
    time: '7:30 PM',
    location: 'Music Room',
    description: 'Beginning Christmas music preparation.'
  },

  // December 2024
  {
    id: 43,
    title: 'Sunday Worship Service',
    type: EVENT_TYPES.SUNDAY_SERVICE,
    date: '2024-12-01',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    description: 'Join us for worship, prayer, and biblical teaching.'
  },
  {
    id: 44,
    title: 'Christmas Choir Concert',
    type: EVENT_TYPES.SPECIAL_EVENT,
    date: '2024-12-15',
    time: '7:00 PM',
    location: 'Main Sanctuary',
    description: 'Annual Christmas concert featuring our choir and special guests.'
  },
  {
    id: 45,
    title: 'Christmas Eve Service',
    type: EVENT_TYPES.SPECIAL_EVENT,
    date: '2024-12-24',
    time: '7:00 PM',
    location: 'Main Sanctuary',
    description: 'Candlelight service celebrating the birth of Jesus Christ.'
  },
  {
    id: 46,
    title: 'Christmas Day Service',
    type: EVENT_TYPES.SPECIAL_EVENT,
    date: '2024-12-25',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    description: 'Special Christmas morning worship service.'
  },
  {
    id: 47,
    title: 'Sunday Worship Service',
    type: EVENT_TYPES.SUNDAY_SERVICE,
    date: '2024-12-29',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    description: 'Join us for worship, prayer, and biblical teaching.'
  },

  // Living Waters Fellowship - November 2024
  {
    id: 100,
    churchId: 'living-waters',
    title: 'Sunday Celebration',
    type: EVENT_TYPES.SUNDAY_SERVICE,
    date: '2024-11-03',
    time: '9:30 AM',
    location: 'Worship Center',
    description: 'Contemporary worship service with live band.'
  },
  {
    id: 101,
    churchId: 'living-waters',
    title: 'Midweek Connect',
    type: EVENT_TYPES.BIBLE_STUDY,
    date: '2024-11-06',
    time: '6:30 PM',
    location: 'Community Room',
    description: 'Small group Bible study and fellowship.'
  },
  {
    id: 102,
    churchId: 'living-waters',
    title: 'Healing Prayer Night',
    type: EVENT_TYPES.PRAYER_MEETING,
    date: '2024-11-13',
    time: '7:00 PM',
    location: 'Prayer Chapel',
    description: 'Prayer for healing and miracles.'
  },
  {
    id: 103,
    churchId: 'living-waters',
    title: 'Thanksgiving Outreach',
    type: EVENT_TYPES.OUTREACH,
    date: '2024-11-23',
    time: '10:00 AM',
    location: 'Community Center',
    description: 'Serving Thanksgiving meals to the community.'
  },

  // First Baptist Church - November 2024
  {
    id: 200,
    churchId: 'first-baptist',
    title: 'Traditional Worship',
    type: EVENT_TYPES.SUNDAY_SERVICE,
    date: '2024-11-03',
    time: '11:00 AM',
    location: 'Historic Sanctuary',
    description: 'Traditional hymns and expository preaching.'
  },
  {
    id: 201,
    churchId: 'first-baptist',
    title: 'Men\'s Bible Study',
    type: EVENT_TYPES.BIBLE_STUDY,
    date: '2024-11-05',
    time: '6:00 AM',
    location: 'Fellowship Hall',
    description: 'Early morning Bible study for men.'
  },
  {
    id: 202,
    churchId: 'first-baptist',
    title: 'Women\'s Ministry Tea',
    type: EVENT_TYPES.SPECIAL_EVENT,
    date: '2024-11-09',
    time: '2:00 PM',
    location: 'Fellowship Hall',
    description: 'Afternoon tea and devotional for women.'
  },
  {
    id: 203,
    churchId: 'first-baptist',
    title: 'Deacons & Elders Meeting',
    type: EVENT_TYPES.COMMITTEE,
    date: '2024-11-12',
    time: '7:00 PM',
    location: 'Board Room',
    description: 'Monthly leadership meeting.'
  },

  // New Life Assembly - November 2024
  {
    id: 300,
    churchId: 'new-life',
    title: 'Encounter Service',
    type: EVENT_TYPES.SUNDAY_SERVICE,
    date: '2024-11-10',
    time: '10:00 AM',
    location: 'Main Auditorium',
    description: 'High-energy worship and relevant teaching.'
  },
  {
    id: 301,
    churchId: 'new-life',
    title: 'Young Adults Night',
    type: EVENT_TYPES.YOUTH_GROUP,
    date: '2024-11-15',
    time: '7:00 PM',
    location: 'Youth Building',
    description: 'Worship, games, and Bible study for ages 18-30.'
  },
  {
    id: 302,
    churchId: 'new-life',
    title: 'Marriage Enrichment',
    type: EVENT_TYPES.SPECIAL_EVENT,
    date: '2024-11-16',
    time: '6:00 PM',
    location: 'Conference Center',
    description: 'Dinner and seminar for married couples.'
  },
  {
    id: 303,
    churchId: 'new-life',
    title: 'Worship Team Practice',
    type: EVENT_TYPES.CHOIR_PRACTICE,
    date: '2024-11-21',
    time: '7:30 PM',
    location: 'Worship Hall',
    description: 'Band and singers rehearsal.'
  },

  // TEST EVENTS FOR TODAY - November 22, 2025
  {
    id: 500,
    churchId: 'grace-community',
    title: 'Morning Prayer',
    type: EVENT_TYPES.PRAYER_MEETING,
    date: '2025-11-22',
    time: '6:00 AM',
    location: 'Prayer Room',
    description: 'Early morning prayer and devotional time.'
  },
  {
    id: 501,
    churchId: 'grace-community',
    title: 'Staff Meeting',
    type: EVENT_TYPES.COMMITTEE,
    date: '2025-11-21',
    time: '9:00 AM',
    location: 'Conference Room',
    description: 'Weekly church staff planning meeting.',
    presenter: 'Pastor Michael Anderson - Lead Pastor',
    program: [
      { time: '9:00 AM', item: 'Opening Prayer & Welcome' },
      { time: '9:10 AM', item: 'Review of Last Week\'s Action Items' },
      { time: '9:25 AM', item: 'Sunday Service Planning - Worship & Message' },
      { time: '9:45 AM', item: 'Upcoming Events & Ministry Updates' },
      { time: '10:00 AM', item: 'Budget Review & Financial Report' },
      { time: '10:15 AM', item: 'Facility Maintenance Discussion' },
      { time: '10:30 AM', item: 'Prayer Requests & Team Prayer' },
      { time: '10:45 AM', item: 'Closing Remarks & Assignments' }
    ]
  },
  {
    id: 502,
    churchId: 'grace-community',
    title: 'Lunch & Learn Bible Study',
    type: EVENT_TYPES.BIBLE_STUDY,
    date: '2025-11-22',
    time: '12:00 PM',
    location: 'Fellowship Hall',
    description: 'Midday Bible study with lunch provided.',
    presenter: 'Pastor Rebecca Johnson - Teaching Pastor',
    program: [
      { time: '12:00 PM', item: 'Welcome & Fellowship' },
      { time: '12:10 PM', item: 'Opening Prayer & Worship Song' },
      { time: '12:20 PM', item: 'Bible Study: The Beatitudes - Matthew 5:1-12' },
      { time: '12:50 PM', item: 'Group Discussion & Application' },
      { time: '1:10 PM', item: 'Q&A Session' },
      { time: '1:25 PM', item: 'Lunch Service Begins' },
      { time: '1:40 PM', item: 'Table Fellowship & Conversation' },
      { time: '1:55 PM', item: 'Closing Prayer & Announcements' },
      { time: '2:00 PM', item: 'Small Group Prayer Circles' },
      { time: '2:30 PM', item: 'Final Blessing & Dismissal' }
    ]
  },
  {
    id: 503,
    churchId: 'grace-community',
    title: 'Youth After School Program',
    type: EVENT_TYPES.YOUTH_GROUP,
    date: '2025-11-22',
    time: '3:30 PM',
    location: 'Youth Center',
    description: 'After school activities and snacks for youth.'
  },
  {
    id: 504,
    churchId: 'grace-community',
    title: 'Choir Rehearsal',
    type: EVENT_TYPES.CHOIR_PRACTICE,
    date: '2025-11-22',
    time: '5:00 PM',
    location: 'Music Room',
    description: 'Preparing worship songs for Sunday service.'
  },
  {
    id: 505,
    churchId: 'grace-community',
    title: 'Friday Night Prayer',
    type: EVENT_TYPES.PRAYER_MEETING,
    date: '2025-11-22',
    time: '12:15 AM',
    location: 'Prayer Room',
    description: 'Join us for an evening of prayer and worship.',
    youtubeUrl: 'https://youtube.com/live/example1',
    presenter: 'Pastor John Smith',
    program: [
      { time: '12:15 AM', item: 'Welcome and Opening Prayer' },
      { time: '12:30 AM', item: 'Worship Songs' },
      { time: '12:50 AM', item: 'Prayer for Healing' },
      { time: '1:10 AM', item: 'Prayer for Nations' },
      { time: '1:30 AM', item: 'Personal Prayer Time' },
      { time: '2:00 AM', item: 'Closing & Benediction' }
    ]
  },
  {
    id: 506,
    churchId: 'grace-community',
    title: 'Young Adults Gathering',
    type: EVENT_TYPES.YOUTH_GROUP,
    date: '2025-11-22',
    time: '8:00 PM',
    location: 'Youth Center',
    description: 'Fellowship, games, and discussion for young adults.'
  },
  {
    id: 507,
    churchId: 'grace-community',
    title: 'Late Night Worship',
    type: EVENT_TYPES.SPECIAL_EVENT,
    date: '2025-11-22',
    time: '10:00 PM',
    location: 'Main Sanctuary',
    description: 'Extended worship and prayer session.',
    youtubeUrl: 'https://youtube.com/live/example2',
    presenter: 'Worship Team & Pastor Sarah Johnson',
    program: [
      { time: '10:00 PM', item: 'Opening Prayer & Invitation to Worship' },
      { time: '10:10 PM', item: 'Worship Set 1 - Songs of Praise' },
      { time: '10:40 PM', item: 'Scripture Reading & Reflection' },
      { time: '10:50 PM', item: 'Worship Set 2 - Intimate Worship' },
      { time: '11:20 PM', item: 'Corporate Prayer & Intercession' },
      { time: '11:40 PM', item: 'Final Worship & Benediction' },
      { time: '12:00 AM', item: 'Optional: Personal Ministry Time' }
    ]
  },
  {
    id: 509,
    churchId: 'grace-community',
    title: 'All-Night Prayer Vigil',
    type: EVENT_TYPES.PRAYER_MEETING,
    date: '2025-11-22',
    time: '12:30 AM',
    location: 'Prayer Chapel',
    description: 'Special all-night prayer vigil seeking God\'s presence and breakthrough.',
    youtubeUrl: 'https://youtube.com/live/prayervigil',
    presenter: 'Pastor David Williams & Prayer Team Leaders',
    program: [
      { time: '12:30 AM', item: 'Opening Worship & Welcome' },
      { time: '12:45 AM', item: 'Scripture Reading - Psalm 63' },
      { time: '1:00 AM', item: 'Prayer for Revival & Awakening' },
      { time: '1:20 AM', item: 'Worship Set - Songs of Consecration' },
      { time: '1:40 AM', item: 'Prayer for Families & Youth' },
      { time: '2:00 AM', item: 'Intercession for Nations' },
      { time: '2:20 AM', item: 'Closing Blessing & Benediction' }
    ]
  },
  {
    id: 510,
    churchId: 'grace-community',
    title: 'Youth Ministry Leadership Training',
    type: EVENT_TYPES.SPECIAL_EVENT,
    date: '2025-11-22',
    time: '12:00 AM',
    location: 'Youth Center',
    description: 'Intensive leadership training session for youth ministry volunteers and leaders.',
    youtubeUrl: 'https://youtube.com/live/youthleadership',
    presenter: 'Pastor Sarah Martinez - Youth Director & Guest Speaker Rev. James Thompson',
    program: [
      { time: '12:00 AM', item: 'Welcome & Vision Casting' },
      { time: '12:15 AM', item: 'Session 1: Understanding Gen Z Culture' },
      { time: '12:40 AM', item: 'Small Group Discussion & Break' },
      { time: '1:00 AM', item: 'Session 2: Effective Communication Skills' },
      { time: '1:30 AM', item: 'Interactive Workshop - Practical Scenarios' },
      { time: '2:00 AM', item: 'Q&A and Resource Sharing' },
      { time: '2:20 AM', item: 'Prayer & Commissioning' },
      { time: '2:30 AM', item: 'Fellowship & Refreshments' }
    ]
  },

  // Add YouTube to some January events
  {
    id: 508,
    churchId: 'grace-community',
    title: 'New Year Service',
    type: EVENT_TYPES.SPECIAL_EVENT,
    date: '2025-01-01',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    description: 'Special New Year celebration service.',
    youtubeUrl: 'https://youtube.com/live/newyear2025'
  }
].map(event => ({
  ...event,
  // Add churchId to all events that don't have one (existing events default to grace-community)
  churchId: event.churchId || 'grace-community'
}));
