# Fundraiser Events - Setup Guide

## How to Add Fundraiser Events to Your Google Sheet

### Step 1: Add New Columns to Events Sheet

Add these columns to your Events spreadsheet:

| Column Name           | Type    | Required | Description                                  |
|-----------------------|---------|----------|----------------------------------------------|
| `event_type`         | Text    | Yes      | Set to "fundraiser" for fundraising events  |
| `fundraiser_goal`    | Number  | Yes      | Target amount (e.g., 5000)                  |
| `fundraiser_current` | Number  | Yes      | Current amount raised (e.g., 3250)          |
| `fundraiser_currency`| Text    | Yes      | Currency code: USD, BRL, EUR, GBP           |
| `donate_url`         | URL     | Yes      | Link to your donation page                  |
| `donate_button_text` | Text    | Optional | Custom button text (default: "Donate Now")  |

### Step 2: Example Fundraiser Entries

#### Example 1: Building Fund Campaign (USD)
```
title: Building Fund Campaign
description: Help us complete construction of our new worship center
start_date: 02/01/2026
end_date: 02/28/2026
event_type: fundraiser
fundraiser_goal: 5000
fundraiser_current: 3250
fundraiser_currency: USD
donate_url: https://give.church/building-fund
donate_button_text: Support Our Building
color_id: 3
```

#### Example 2: Mission Trip (BRL)
```
title: Mission Trip to Brazil
description: Support our youth mission trip to serve communities in Brazil
start_date: 03/01/2026
end_date: 03/31/2026
event_type: fundraiser
fundraiser_goal: 10000
fundraiser_current: 1200
fundraiser_currency: BRL
donate_url: https://give.church/mission-trip
donate_button_text: Ajude Nossa Missão
color_id: 9
```

#### Example 3: Scholarship Fund (Almost Complete)
```
title: Youth Camp Scholarships
description: Provide scholarships for youth who can't afford summer camp
start_date: 01/15/2026
end_date: 02/15/2026
event_type: fundraiser
fundraiser_goal: 1000
fundraiser_current: 920
fundraiser_currency: USD
donate_url: https://give.church/scholarships
color_id: 5
```

#### Example 4: Goal Exceeded
```
title: Christmas Food Drive
description: Provide food baskets for families in need
start_date: 12/01/2025
end_date: 12/25/2025
event_type: fundraiser
fundraiser_goal: 2000
fundraiser_current: 2500
fundraiser_currency: USD
donate_url: https://give.church/food-drive
color_id: 7
```

### Step 3: Update the Donation Amount

To update progress, simply change the `fundraiser_current` value in your Google Sheet:

```
fundraiser_current: 3250  →  fundraiser_current: 3750
```

The calendar will automatically:
- Update the progress bar
- Recalculate the percentage
- Update the "still needed" amount
- Change status messages based on progress

### Step 4: Supported Currencies

Format examples for different currencies:

| Currency Code | Symbol | Example Display    |
|---------------|--------|--------------------|
| USD           | $      | $3,250 raised     |
| BRL           | R$     | R$10.000 arrecadados |
| EUR           | €      | €2.500 collected  |
| GBP           | £      | £1,250 raised     |

### Step 5: Donation URLs

Your `donate_url` can point to:
- **Church giving platform**: `https://pushpay.com/your-church/donate`
- **Specific campaign**: `https://give.church/building-fund`
- **PayPal**: `https://paypal.me/yourchurch`
- **Fundraising platform**: `https://gofundme.com/your-campaign`
- **Custom page**: `https://yourchurch.com/donate?campaign=building`

## Visual Examples

### Progress Stages

**0-24% (Red)** - "Let's get this started!"
```
$250 / $5,000
██░░░░░░░░░░░░░░░░░░░░ 5%
```

**25-49% (Orange)** - "Great start!"
```
$1,500 / $5,000
██████░░░░░░░░░░░░░░░░ 30%
```

**50-74% (Amber)** - "Halfway to our goal!"
```
$3,000 / $5,000
██████████████░░░░░░░░ 60%
```

**75-99% (Blue)** - "Just $750 more to reach our goal!"
```
$4,250 / $5,000
██████████████████████ 85%
```

**100%+ (Green)** - "Amazing! We've exceeded our goal!"
```
$5,500 / $5,000
████████████████████████ 110%
```

## Features

### Automatic Display Features:
✅ **Progress bar** with color-coded stages
✅ **Percentage calculation** (current/goal × 100)
✅ **Days remaining** countdown
✅ **Status messages** in both English and Portuguese
✅ **Donate button** linking to your donation page
✅ **WhatsApp share** button with pre-filled message
✅ **Mobile responsive** design
✅ **Compact view** in calendar list
✅ **Expanded view** with full details
✅ **Auto-archive** when event ends

### Status Messages (Auto-Generated):

**English:**
- "Let's get this started!" (< 25%)
- "Great start!" (25-49%)
- "Halfway to our goal!" (50%)
- "Just $X more to reach our goal!" (75-99%)
- "Goal reached! Thank you!" (100%)
- "Amazing! We've exceeded our goal!" (100%+)

**Portuguese:**
- "Vamos começar!" (< 25%)
- "Ótimo começo!" (25-49%)
- "Na metade do caminho!" (50%)
- "Faltam apenas R$X!" (75-99%)
- "Meta alcançada! Obrigado!" (100%)
- "Incrível! Meta superada!" (100%+)

## Best Practices

### 1. Regular Updates
Update `fundraiser_current` regularly (daily or weekly) to maintain engagement.

### 2. Clear Goals
Set realistic goals that are achievable within the timeframe.

### 3. End Date
Always set an `end_date` to create urgency and show days remaining.

### 4. Description
Use the `description` field to explain:
- What the funds will be used for
- Why it matters to your community
- Who will benefit

### 5. Color Coding
Use color_id to make fundraisers visually distinct:
- **Blue** (#039BE5) - Building projects
- **Green** (#0B8043) - Mission trips
- **Orange** (#F4511E) - Emergency needs
- **Red** (#D50000) - Urgent campaigns

## Testing

### Test Data for Development:
Add this test event to see all features:

```
title: TEST Fundraiser Event
description: This is a test fundraiser to see all features
start_date: [TODAY'S DATE]
end_date: [DATE 30 DAYS FROM NOW]
event_type: fundraiser
fundraiser_goal: 1000
fundraiser_current: 650
fundraiser_currency: USD
donate_url: https://example.com/donate
donate_button_text: Test Donation
color_id: 3
```

This will show:
- 65% progress (blue progress bar)
- "Just $350 more" message
- 30 days remaining countdown
- Both donate and share buttons

## Troubleshooting

### Issue: Progress bar not showing
**Solution:** Make sure `event_type` is exactly "fundraiser" (lowercase, no spaces)

### Issue: Wrong currency symbol
**Solution:** Use correct currency codes: USD, BRL, EUR, GBP (uppercase)

### Issue: Dates not working
**Solution:** Use MM/DD/YYYY format for dates

### Issue: Percentage over 100% looks wrong
**Solution:** This is normal! When you exceed your goal, it shows the actual percentage. The visual bar caps at 100% but shows green to celebrate.

## Advanced Tips

### Multiple Fundraisers
You can have multiple active fundraisers at once. Each will display in the calendar with its own progress.

### Campaign Updates
Add progress updates in the `html_description` column:
```html
<p>Latest update: We've reached 65% of our goal! Thank you to all who have contributed.</p>
<ul>
  <li>Foundation: Complete ✅</li>
  <li>Walls: In Progress 🚧</li>
  <li>Roof: Coming soon</li>
</ul>
```

### Matching Campaigns
If someone is matching donations, note it in the description:
```
All donations doubled until Feb 15th! A generous donor is matching every contribution up to $2,500.
```

---

## Need Help?

If you have questions or need customization, check the main `FEATURE_ROADMAP.md` or create an issue in the repository.
