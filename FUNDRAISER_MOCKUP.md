# Fundraiser Events - Visual Mockup

## Overview
This document shows how fundraiser events will appear in the church calendar application.

---

## 1. Collapsed View (In Calendar List)

### Example 1: Active Fundraiser (65% funded)
```
┌────────────────────────────────────────────────────────┐
│ 🎯 Building Fund Campaign                    [▼]       │
│ ⏰ February 1-28, 2026                                 │
│                                                         │
│ 💰 $3,250 raised of $5,000                             │
│ ████████████████████░░░░░░░░ 65%                      │
│                                                         │
│ 13 days remaining                                      │
└────────────────────────────────────────────────────────┘
```

### Example 2: New Fundraiser (12% funded)
```
┌────────────────────────────────────────────────────────┐
│ 🎯 Mission Trip to Brazil                    [▼]       │
│ ⏰ March 1-31, 2026                                    │
│                                                         │
│ 💰 R$1,200 raised of R$10,000                          │
│ ███░░░░░░░░░░░░░░░░░░░░░░ 12%                         │
│                                                         │
│ 28 days remaining                                      │
└────────────────────────────────────────────────────────┘
```

### Example 3: Almost Complete (92% funded)
```
┌────────────────────────────────────────────────────────┐
│ 🎯 Youth Camp Scholarships                   [▼]       │
│ ⏰ January 15 - February 15, 2026                      │
│                                                         │
│ 💰 $920 raised of $1,000                               │
│ ██████████████████████████░░ 92%                      │
│                                                         │
│ 🔥 Almost there! Only $80 to go!                       │
│ 2 days remaining                                       │
└────────────────────────────────────────────────────────┘
```

### Example 4: Goal Reached! (100%+)
```
┌────────────────────────────────────────────────────────┐
│ 🎯 Christmas Food Drive                      [▼]       │
│ ⏰ December 1-25, 2025                                 │
│                                                         │
│ 💰 $2,500 raised of $2,000                             │
│ ████████████████████████████ 125%                     │
│                                                         │
│ 🎉 Goal exceeded! Thank you!                           │
│ Event ended                                            │
└────────────────────────────────────────────────────────┘
```

---

## 2. Expanded View (When Clicked)

### Full Fundraiser Event Details
```
┌──────────────────────────────────────────────────────────────┐
│ 🎯 Building Fund Campaign                          [▲]       │
│ ⏰ February 1-28, 2026                                       │
│                                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                  FUNDRAISER PROGRESS                     │ │
│ │                                                           │ │
│ │  $3,250                                          $5,000  │ │
│ │  ████████████████████░░░░░░░░░░░░░░                     │ │
│ │                     65% funded                           │ │
│ │                                                           │ │
│ │  💝 $1,750 still needed                                  │ │
│ │  📅 13 days remaining                                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                               │
│ ┌──────────────────┐  ┌──────────────────┐                  │
│ │  💝 Donate Now   │  │  📤 Share Goal   │                  │
│ └──────────────────┘  └──────────────────┘                  │
│                                                               │
│ 📍 Location: New Church Building Site                        │
│                                                               │
│ 📝 Description:                                              │
│ Help us raise funds to complete the construction of our      │
│ new worship center. Every contribution brings us closer      │
│ to having a permanent home for our growing congregation.     │
│                                                               │
│ 🎯 Milestones:                                               │
│ ✅ 25% - Foundation completed                                │
│ ✅ 50% - Walls and roof                                      │
│ ✅ 65% - Current progress                                    │
│ ⬜ 75% - Interior work begins                                │
│ ⬜ 100% - Grand opening!                                     │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Different States & Variations

### State: Just Started (5%)
```
┌────────────────────────────────────────────────────┐
│ $250 raised of $5,000                              │
│ ██░░░░░░░░░░░░░░░░░░░░░░░░ 5%                     │
│ 💪 Let's get this started!                         │
└────────────────────────────────────────────────────┘
```

### State: Halfway There (50%)
```
┌────────────────────────────────────────────────────┐
│ $2,500 raised of $5,000                            │
│ ██████████████████████████░░ 50%                  │
│ 🎯 Halfway to our goal!                            │
└────────────────────────────────────────────────────┘
```

### State: Final Push (85%)
```
┌────────────────────────────────────────────────────┐
│ $4,250 raised of $5,000                            │
│ ████████████████████████████░░ 85%                │
│ 🔥 Just $750 more to reach our goal!               │
└────────────────────────────────────────────────────┘
```

### State: Goal Exceeded (110%)
```
┌────────────────────────────────────────────────────┐
│ $5,500 raised of $5,000                            │
│ ████████████████████████████ 110%                 │
│ 🎉 Amazing! We've exceeded our goal!               │
└────────────────────────────────────────────────────┘
```

---

## 4. Color Schemes

### Progress Bar Colors:
- **0-24%**: Red gradient (`bg-red-500` to `bg-red-600`)
- **25-49%**: Orange gradient (`bg-orange-500` to `bg-orange-600`)
- **50-74%**: Yellow/Amber gradient (`bg-amber-500` to `bg-amber-600`)
- **75-99%**: Blue gradient (`bg-blue-500` to `bg-blue-600`)
- **100%+**: Green gradient (`bg-green-500` to `bg-green-600`) with celebration animation

### Card Background:
- Active fundraisers: Light gradient with accent color
- Completed fundraisers: Green tint with success badge
- Expired fundraisers: Grayscale (like past events)

---

## 5. Portuguese Translation

### Collapsed (PT)
```
┌────────────────────────────────────────────────────────┐
│ 🎯 Campanha do Fundo de Construção           [▼]       │
│ ⏰ 1-28 de Fevereiro, 2026                             │
│                                                         │
│ 💰 R$3.250 arrecadados de R$5.000                      │
│ ████████████████████░░░░░░░░ 65%                      │
│                                                         │
│ 13 dias restantes                                      │
└────────────────────────────────────────────────────────┘
```

### Expanded Buttons (PT)
```
┌──────────────────┐  ┌──────────────────┐
│  💝 Doar Agora   │  │  📤 Compartilhar │
└──────────────────┘  └──────────────────┘
```

### Status Messages (PT)
- "Vamos começar!" (Let's get started)
- "Na metade do caminho!" (Halfway there)
- "Faltam apenas R$750!" (Just $750 more)
- "Meta alcançada! Obrigado!" (Goal reached! Thank you!)
- "Meta superada!" (Goal exceeded!)

---

## 6. Mobile View (Smaller Screens)

### Collapsed Mobile
```
┌─────────────────────────────┐
│ 🎯 Building Fund            │
│ Feb 1-28, 2026              │
│                             │
│ $3,250 / $5,000             │
│ ████████████░░░░░░ 65%     │
│ 13 days left                │
└─────────────────────────────┘
```

### Expanded Mobile
```
┌─────────────────────────────┐
│ 🎯 Building Fund      [▲]   │
│ Feb 1-28, 2026              │
│                             │
│ ┌─────────────────────────┐ │
│ │ $3,250 / $5,000        │ │
│ │ ████████████░░░░░░     │ │
│ │ 65% funded             │ │
│ │                         │ │
│ │ Still need: $1,750     │ │
│ │ Time left: 13 days     │ │
│ └─────────────────────────┘ │
│                             │
│ [💝 Donate]  [📤 Share]     │
│                             │
│ 📍 New Building Site        │
│                             │
│ Help us raise funds to...   │
└─────────────────────────────┘
```

---

## 7. Interactive Features

### WhatsApp Share Message:
```
🎯 Building Fund Campaign

We're at 65% of our goal!
$3,250 raised of $5,000

Help us reach our target! Every donation counts.

Donate here: [donate_url]
```

### Share Link Preview:
When shared on social media, shows:
- Event title with 🎯 emoji
- Progress percentage
- "Help us reach our goal!"
- Link to donate

---

## 8. Google Sheets Structure

### New Columns in Events Sheet:
```
| Column Name           | Type    | Example                  |
|-----------------------|---------|--------------------------|
| event_type           | Text    | fundraiser               |
| fundraiser_goal      | Number  | 5000                     |
| fundraiser_current   | Number  | 3250                     |
| fundraiser_currency  | Text    | USD / BRL / EUR          |
| donate_url           | URL     | https://give.church/... |
| donate_button_text   | Text    | Donate Now (optional)   |
```

### Example Row:
```
title: Building Fund Campaign
event_type: fundraiser
fundraiser_goal: 5000
fundraiser_current: 3250
fundraiser_currency: USD
donate_url: https://give.church/building-fund
donate_button_text: Support Our Building
```

---

## 9. Animation Ideas

### Progress Bar Fill:
- Smooth animation when page loads
- Takes 1-2 seconds to fill to current percentage
- Pulse effect on the filled portion

### Milestone Celebrations:
- Confetti animation when goal reached (100%)
- Gentle sparkle effect at 25%, 50%, 75% milestones
- "New donation!" toast notification (if real-time updates)

### Countdown:
- Days/hours countdown for urgency
- Gentle color pulse when < 7 days remaining

---

## 10. Accessibility

- Progress bar has `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Screen reader announces: "Building Fund Campaign, $3,250 raised of $5,000, 65 percent funded"
- Donate button has clear label and keyboard accessible
- High contrast mode support
- Color blind friendly (not relying on color alone)

---

## Technical Implementation Notes

1. **Data Updates**:
   - Manual update in Google Sheets by admin
   - Future: Real-time sync with donation platform API

2. **Currency Formatting**:
   - Use Intl.NumberFormat for proper formatting
   - Support multiple currencies (USD, BRL, EUR, etc.)

3. **Date Calculations**:
   - Days remaining based on end_date
   - Auto-archive when event ends

4. **Progress Calculation**:
   - `percentage = (current / goal) * 100`
   - Cap display at 100% but show actual amount

---

## What do you think?

Shall I proceed with implementing this design? Any changes you'd like to see?
