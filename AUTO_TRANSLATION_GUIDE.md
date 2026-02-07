# Automatic Translation - Full English Support

## Overview
When the US flag (English) is selected, ALL content is automatically translated from Portuguese to English, including:
- Event titles
- Event descriptions
- Event locations
- Presenter names
- Program item titles, acts, and presenters
- All UI elements

## How It Works

### Translation System

**API:** MyMemory Translation API (free, no API key required)
**Caching:** localStorage with 30-day expiry
**Performance:** Non-blocking background translations

### Process Flow:

1. **First Time (Portuguese → English):**
   - Portuguese content displayed initially
   - Translation triggered in background
   - Saved to browser cache

2. **Second Time (Cached):**
   - English translation loaded from cache instantly
   - No API calls needed

3. **Preloading:**
   - All event content translated when calendar loads
   - By the time user switches language, translations ready

### Cache Management

**Location:** `localStorage` under key `translation_cache_v1`
**Expiry:** 30 days automatic
**Size:** Minimal (only translated text, not full events)

**Clear cache manually:**
```javascript
// In browser console:
localStorage.removeItem('translation_cache_v1');
```

---

## Features

### ✅ What Gets Translated

**Events:**
- ✅ Title
- ✅ Description
- ✅ HTML description
- ✅ Location
- ✅ Presenter

**Programs:**
- ✅ Program item titles
- ✅ Act names
- ✅ Presenter names
- ✅ Unit names

**UI Elements:**
- ✅ Buttons (Register, Donate, Share, etc.)
- ✅ Labels (Deadline, Presenter, Program, etc.)
- ✅ Status messages (Finished, Ongoing, Upcoming)
- ✅ Days and months

### Common Portuguese→English Translations

Pre-loaded for instant translation:

**Days:**
- Segunda → Monday
- Terça → Tuesday
- Quarta → Wednesday
- Quinta → Thursday
- Sexta → Friday
- Sábado → Saturday
- Domingo → Sunday

**Months:**
- Janeiro → January
- Fevereiro → February
- Março → March
- etc.

**Events:**
- Culto → Service
- Reunião → Meeting
- Estudo → Study
- Conferência → Conference
- Retiro → Retreat
- Acampamento → Camp

---

## Technical Implementation

### Translation Service

**File:** `src/services/translationService.js`

**Functions:**
- `translateText(text, fromLang, toLang)` - Translate single text
- `translateBatch(texts, fromLang, toLang)` - Translate multiple texts
- `clearTranslationCache()` - Clear all cached translations
- `preloadCommonTranslations()` - Load common translations immediately

**API Endpoint:**
```
https://api.mymemory.translated.net/get?q={text}&langpair=pt|en
```

**Limits:**
- 1000 characters per request
- 5000 requests per day (generous free tier)

---

### Translation Utility

**File:** `src/utils/translateEvent.js`

**How it works:**
1. Check manual translations dictionary (UI elements)
2. Check localStorage cache
3. If not cached, return original + trigger background translation
4. Next time, cached version returned

**Benefits:**
- ✅ Non-blocking (UI doesn't freeze)
- ✅ Fast (cache hits are instant)
- ✅ Resilient (fallback to original on error)

---

### Preloading System

**File:** `src/components/Calendar.jsx`

**When:** After events are loaded from Google Sheets
**What:** All event titles, descriptions, locations, program items
**Why:** Ensures translations ready before language switch

**Console output:**
```
Preloading 127 translations...
```

This means 127 unique pieces of text are being translated in background.

---

## Usage

### For Users:

1. Open calendar (default: Portuguese)
2. Click US flag at top-right
3. **First time:** Content may show Portuguese briefly, then English appears
4. **Subsequent times:** English appears instantly (from cache)

### For Developers:

**Use in components:**
```javascript
import { translateEventContent } from '../utils/translateEvent';

// In component:
const { language } = useLanguage();
const translatedTitle = translateEventContent(event.title, language);
```

**Already used in:**
- `EventCard.jsx` - All event content
- `Calendar.jsx` - Month names, day names
- All UI components

---

## API Details

### MyMemory Translation API

**Why MyMemory?**
- ✅ Free (no API key required)
- ✅ 5000 requests/day limit (more than enough)
- ✅ Good quality translations
- ✅ No registration needed
- ✅ Simple REST API

**Alternatives considered:**
- Google Translate API - $20/1M chars (paid)
- DeepL API - Limited free tier
- LibreTranslate - Self-hosted required

**Response format:**
```json
{
  "responseData": {
    "translatedText": "Sunday Service"
  },
  "responseStatus": 200
}
```

---

## Performance

### Metrics:

**Initial load (Portuguese content):**
- No translation overhead
- Same speed as before

**First English switch:**
- Slight delay (1-2 seconds for translations to appear)
- Non-blocking (UI still responsive)

**Subsequent English use:**
- Instant (from cache)
- Zero API calls

**Preloading:**
- Background process
- Doesn't slow down initial render
- Completes in 3-5 seconds for typical calendar

---

## Troubleshooting

### Issue: Translations not appearing
**Solution:**
1. Check browser console for errors
2. Verify internet connection (API requires online)
3. Clear cache: `localStorage.removeItem('translation_cache_v1')`
4. Refresh page

### Issue: Wrong translations
**Solution:**
1. Clear cache
2. Translations will re-fetch on next use
3. Report specific bad translations

### Issue: Some text still in Portuguese
**Likely causes:**
1. Text just added (not yet translated)
2. API limit reached (wait 24 hours)
3. Network error (check console)

**Fix:** Refresh page or toggle language

### Issue: Slow performance
**Solution:**
1. Check Network tab in DevTools
2. Verify cache is working (should see minimal API calls)
3. Clear old cache if corrupted

---

## Extending Translation Support

### Add more languages:

**Step 1:** Update `translationService.js`:
```javascript
export const translateToSpanish = (text) => {
  return translateText(text, 'pt', 'es');
};
```

**Step 2:** Update `LanguageContext.jsx`:
```javascript
const languages = ['pt', 'en', 'es'];
```

**Step 3:** Add Spanish flag icon

### Customize translations:

**Manual overrides** (for better accuracy):

Edit `src/i18n/eventTranslations.js`:
```javascript
export const eventTranslations = {
  en: {
    'Culto de Celebração': 'Celebration Service',
    'Escola Bíblica': 'Bible School'
  }
};
```

Manual translations take precedence over API translations.

---

## Best Practices

### For Content Creators:

1. **Write in Portuguese** - Translations happen automatically
2. **Keep descriptions clear** - Better translation quality
3. **Avoid slang** - May not translate well
4. **Test both languages** - Verify translations make sense

### For Developers:

1. **Always use `translateEventContent()`** for user content
2. **Don't inline Portuguese strings** - Use translation system
3. **Test with cache cleared** - Ensure fallbacks work
4. **Monitor API usage** - Check browser console

---

## Future Improvements

### Potential enhancements:

1. **Translation quality feedback**
   - Allow users to report bad translations
   - Build custom dictionary from feedback

2. **Offline support**
   - Pre-download common translations
   - Fallback for offline use

3. **More languages**
   - Spanish (es)
   - French (fr)
   - German (de)

4. **Smarter caching**
   - Sync cache across devices
   - Cloud backup of translations

5. **Better translation API**
   - Switch to DeepL for better quality
   - Or build custom ML model

---

## Maintenance

### Monthly Tasks:

- [ ] Check API usage (should be well under 5000/day)
- [ ] Review any translation errors reported
- [ ] Clear cache if complaints about stale translations

### Updates:

- Cache version: `v1` (bump if cache structure changes)
- API endpoint: MyMemory (stable, no auth required)
- No maintenance required unless API changes

---

## FAQ

**Q: Do translations cost money?**
A: No, MyMemory API is free up to 5000 requests/day.

**Q: What happens if I'm offline?**
A: Cached translations still work. New content shows in Portuguese until online.

**Q: Can I edit auto-translations?**
A: Yes, add manual overrides in `eventTranslations.js`.

**Q: How accurate are translations?**
A: Generally good for standard church terminology. May need manual fixes for idioms.

**Q: Does this work on mobile?**
A: Yes! Cache works same on all browsers.

**Q: What if API stops working?**
A: Graceful fallback to Portuguese. No errors, just untranslated.

---

## Support

For translation issues:
1. Check browser console for error messages
2. Verify network connection
3. Clear cache and retry
4. Report persistent issues with specific examples

Translation system is designed to fail gracefully - worst case, content stays in Portuguese.
