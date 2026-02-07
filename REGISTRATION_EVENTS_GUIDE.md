# Registration Events - Setup Guide

## Overview
Add a "Register" button to events that links to external registration pages (Google Forms, Eventbrite, SignUpGenius, etc.).

---

## Google Sheets Setup

### Add These Columns to Your Events Sheet:

| Column Name | Type | Required | Description |
|-------------|------|----------|-------------|
| `event_type` | Text | Optional | Set to "registration" (or leave empty) |
| `registration_url` | URL | Yes | Link to your registration form |
| `registration_button_text` | Text | Optional | Custom button text (default: "Register") |
| `registration_deadline` | Text | Optional | Registration deadline date |

---

## Example Events

### Example 1: Youth Summer Camp
```
title: Youth Summer Camp 2026
description: Join us for an amazing week of fun, worship, and community
start_date: 06/01/2026
end_date: 06/07/2026
location: Camp Woodland - Mountain View
registration_url: https://forms.google.com/camp-registration
registration_button_text: Register for Camp
registration_deadline: March 15, 2026
color_id: 4
```

**Result:**
- Orange "Register for Camp" button
- Shows "Deadline: March 15, 2026" in expanded view
- Links to Google Form

---

### Example 2: Women's Conference
```
title: Women's Conference 2026
description: A day of worship, teaching, and fellowship
start_date: 03/15/2026
location: Main Sanctuary
registration_url: https://eventbrite.com/womens-conference
registration_button_text: Reserve Your Spot
registration_deadline: March 10, 2026
color_id: 7
```

---

### Example 3: Volunteer Training (No Deadline)
```
title: Volunteer Training Session
description: Learn how to serve in our children's ministry
start_date: 02/20/2026
time: 7:00 PM
location: Room 201
registration_url: https://signupgenius.com/volunteer-training
registration_button_text: Sign Up to Attend
color_id: 3
```

---

## Registration Platform Options

### 1. **Google Forms** (Free)
**Best for:** Simple registrations, church events
**URL format:** `https://docs.google.com/forms/d/YOUR_FORM_ID/viewform`
**Features:**
- ✅ Free
- ✅ Easy to create
- ✅ Collects responses in Google Sheets
- ✅ Can add custom questions

---

### 2. **Eventbrite** (Free + Paid)
**Best for:** Ticketed events, conferences
**URL format:** `https://eventbrite.com/e/YOUR_EVENT_ID`
**Features:**
- ✅ Professional look
- ✅ Ticket sales integration
- ✅ Email confirmations
- ⚠️ Fees for paid tickets

---

### 3. **SignUpGenius** (Free + Paid)
**Best for:** Volunteer sign-ups, time slots
**URL format:** `https://signupgenius.com/YOUR_SIGNUP_ID`
**Features:**
- ✅ Time slot scheduling
- ✅ Automatic reminders
- ✅ Great for volunteers
- ⚠️ Some features require paid plan

---

### 4. **Planning Center** (Paid)
**Best for:** Churches already using Planning Center
**URL format:** `https://churchname.churchcenter.com/registrations/YOUR_EVENT`
**Features:**
- ✅ Full church management integration
- ✅ Payment processing
- ✅ Check-in integration
- ⚠️ Requires subscription

---

### 5. **Subsplash / ChurchTrac** (Paid)
**Best for:** Churches using these platforms
**Features:**
- ✅ Integrated with church database
- ✅ Mobile app support
- ⚠️ Monthly fees apply

---

## Display Examples

### Collapsed View (In Calendar)
```
┌──────────────────────────────────────────┐
│ Youth Summer Camp 2026           [▼]     │
│ ⏰ June 1-7, 2026                        │
│ 📍 Camp Woodland                         │
│                                          │
│ [ Register for Camp → ]                  │
└──────────────────────────────────────────┘
```

### Expanded View
```
┌──────────────────────────────────────────┐
│ Youth Summer Camp 2026           [▲]     │
│                                          │
│ 📅 Monday, June 1 - Sunday, June 7      │
│                                          │
│ 📋 Click here to register                │
│    Deadline: March 15, 2026              │
│                                          │
│ 📍 Camp Woodland - Mountain View         │
│                                          │
│ 📝 Join us for an amazing week of fun,   │
│    worship, and community at our annual  │
│    youth summer camp! Ages 12-18.        │
└──────────────────────────────────────────┘
```

---

## Button Styling

**Colors:**
- Indigo background (#4F46E5)
- White text
- Hover: Darker indigo (#4338CA)
- Icon: Clipboard with checkmark

**Mobile:**
- Full width on small screens
- Touch-friendly size
- Opens link in new tab

---

## Multilingual Support

### English (Default):
- Button: "Register"
- Link: "Click here to register"
- Deadline: "Deadline: [date]"

### Portuguese:
- Button: "Inscrever-se"
- Link: "Clique aqui para se inscrever"
- Deadline: "Prazo: [date]"

---

## Best Practices

### 1. **Clear Button Text**
Use action-oriented text:
- ✅ "Register for Camp"
- ✅ "Reserve Your Spot"
- ✅ "Sign Up to Attend"
- ❌ "Click Here"
- ❌ "More Info"

### 2. **Set Deadlines**
Always include registration deadline:
- Creates urgency
- Helps with planning
- Prevents late registrations

### 3. **Test Your Links**
Before publishing:
- Click the link to make sure it works
- Test on mobile
- Verify form is accepting responses

### 4. **Update After Deadline**
Remove or update events after deadline passes:
- Change button to "Registration Closed"
- Or remove the event entirely

---

## Use Cases

### Church Events:
- Summer camps
- VBS registration
- Conferences
- Retreats
- Special services (Christmas, Easter)

### Classes & Training:
- Baptism classes
- Membership classes
- Leadership training
- Volunteer orientation

### Social Events:
- Church picnics
- Fellowship dinners
- Sports leagues
- Small group sign-ups

### Ministry Sign-ups:
- Serve team recruitment
- Volunteer scheduling
- Mission trip interest

---

## Advanced Tips

### 1. **Embed Forms in Description**
Use `html_description` column:
```html
<p>Join us for summer camp!</p>
<iframe src="https://docs.google.com/forms/..." width="100%" height="400"></iframe>
```

### 2. **Multiple Registration Options**
Add different buttons for different groups:
```
registration_url: https://forms.google.com/youth
description: Adult registration: forms.google.com/adult
```

### 3. **Capacity Limits**
Include in description:
```
description: Limited to 50 participants. Register early!
```

### 4. **Early Bird Pricing**
```
registration_deadline: Feb 1 (Early Bird: $50)
description: Regular price $75 after February 1st
```

---

## Integration with Other Systems

### Google Forms → Google Sheets
1. Form responses go to Google Sheets
2. Use Zapier/Make to sync
3. Auto-update event capacity

### Eventbrite → Email
1. User registers on Eventbrite
2. Gets confirmation email
3. Email includes calendar link

### Planning Center
1. Direct integration with church database
2. Auto-sync registrations
3. Check-in on event day

---

## Troubleshooting

### Issue: Button not showing
**Solution:** Check that `registration_url` column exists and has a value

### Issue: Link doesn't work
**Solution:** Ensure URL starts with `https://` or `http://`

### Issue: Button text not customized
**Solution:** Add `registration_button_text` column with your custom text

### Issue: Deadline not displaying
**Solution:** Add `registration_deadline` column with deadline text

---

## Migration from Other Systems

### From Paper/Email:
1. Create Google Form
2. Add form URL to event
3. Share calendar link

### From Church Management System:
1. Get registration page URL
2. Add to `registration_url` column
3. Keep both systems in sync

---

## FAQ

**Q: Can I use this for free events?**
A: Yes! Perfect for free events with Google Forms.

**Q: Can I track who registered?**
A: Yes, if using Google Forms/Eventbrite - responses are tracked there.

**Q: Can I collect payments?**
A: Yes, if your registration platform supports it (Eventbrite, Planning Center, etc.)

**Q: Can I limit capacity?**
A: Your registration platform handles capacity limits, not the calendar.

**Q: What if my form URL is very long?**
A: Use a URL shortener (bit.ly, tinyurl.com) for cleaner links.

---

## Next Steps

1. Choose a registration platform (Google Forms is easiest)
2. Create your registration form
3. Add columns to Google Sheets
4. Test with an upcoming event
5. Share calendar with your congregation!

---

Need help? Check the main `FEATURE_ROADMAP.md` for more features!
