import { eventTranslations } from '../i18n/eventTranslations';
import { translateText } from '../services/translationService';

// Get cached translation synchronously from localStorage
const getCachedTranslation = (text, fromLang, toLang) => {
  if (!text || fromLang === toLang) return text;

  const cacheKey = `${fromLang}:${toLang}:${text}`;
  try {
    const cached = localStorage.getItem('translation_cache_v1');
    if (cached) {
      const { data } = JSON.parse(cached);
      if (data[cacheKey]) {
        return data[cacheKey];
      }
    }
  } catch (error) {
    // Ignore cache errors
  }
  return null;
};

// Trigger background translation (non-blocking)
const triggerBackgroundTranslation = (text, fromLang, toLang) => {
  if (text && fromLang !== toLang) {
    // Don't await - let it translate in background
    translateText(text, fromLang, toLang).catch(() => {
      // Silently fail - user will see original text
    });
  }
};

export const translateEventContent = (text, language) => {
  if (!text) return text;

  // If language is Portuguese (source language), return original
  if (language === 'pt') return text;

  // Check manual translations first (for UI elements)
  if (eventTranslations[language] && eventTranslations[language][text]) {
    return eventTranslations[language][text];
  }

  // For any non-Portuguese language, try to get cached translation
  const fromLang = 'pt'; // Source is always Portuguese
  const toLang = language; // Target is the selected language (en, es, ro)

  const cached = getCachedTranslation(text, fromLang, toLang);
  if (cached) {
    return cached;
  }

  // Not in cache - trigger background translation for next time
  triggerBackgroundTranslation(text, fromLang, toLang);

  // Return original text for now
  return text;
};
