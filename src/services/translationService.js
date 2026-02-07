// Translation service using MyMemory Translation API (free, no API key required)
// Caches translations in localStorage to minimize API calls

const CACHE_KEY = 'translation_cache_v1';
const CACHE_EXPIRY_DAYS = 30;

// Get translation cache from localStorage
const getCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return {};

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    // Check if cache is expired
    if (now - timestamp > expiryTime) {
      localStorage.removeItem(CACHE_KEY);
      return {};
    }

    return data;
  } catch (error) {
    console.error('Error reading translation cache:', error);
    return {};
  }
};

// Save translation to cache
const saveToCache = (sourceText, translatedText) => {
  try {
    const cache = getCache();
    cache[sourceText] = translatedText;

    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: cache,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Error saving to translation cache:', error);
  }
};

// Translate text from Portuguese to English using MyMemory API
export const translateText = async (text, fromLang = 'pt', toLang = 'en') => {
  // Return empty string if input is empty
  if (!text || text.trim() === '') {
    return text;
  }

  // If already in English (no Portuguese characters), return as-is
  const hasPortugueseChars = /[àáâãäçèéêëìíîïñòóôõöùúûü]/i.test(text);
  if (!hasPortugueseChars && toLang === 'en') {
    return text;
  }

  // Check cache first
  const cacheKey = `${fromLang}:${toLang}:${text}`;
  const cache = getCache();
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  // Translate using MyMemory API (free, 1000 chars per request limit)
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData) {
      const translated = data.responseData.translatedText;

      // Save to cache
      saveToCache(cacheKey, translated);

      return translated;
    } else {
      console.warn('Translation API returned non-200 status:', data);
      return text; // Return original if translation fails
    }
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
};

// Translate multiple texts in batch (to reduce API calls)
export const translateBatch = async (texts, fromLang = 'pt', toLang = 'en') => {
  const results = await Promise.all(
    texts.map(text => translateText(text, fromLang, toLang))
  );
  return results;
};

// Clear translation cache (useful for testing or if translations are bad)
export const clearTranslationCache = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
    console.log('Translation cache cleared');
  } catch (error) {
    console.error('Error clearing translation cache:', error);
  }
};

// Preload common translations for multiple languages
const COMMON_TRANSLATIONS = {
  en: {
    // Days of week
    'Segunda': 'Monday',
    'Terça': 'Tuesday',
    'Quarta': 'Wednesday',
    'Quinta': 'Thursday',
    'Sexta': 'Friday',
    'Sábado': 'Saturday',
    'Domingo': 'Sunday',
    // Months
    'Janeiro': 'January',
    'Fevereiro': 'February',
    'Março': 'March',
    'Abril': 'April',
    'Maio': 'May',
    'Junho': 'June',
    'Julho': 'July',
    'Agosto': 'August',
    'Setembro': 'September',
    'Outubro': 'October',
    'Novembro': 'November',
    'Dezembro': 'December',
    // Common event terms
    'Culto': 'Service',
    'Reunião': 'Meeting',
    'Estudo': 'Study',
    'Conferência': 'Conference',
    'Retiro': 'Retreat',
    'Acampamento': 'Camp',
    'Jantar': 'Dinner',
    'Almoço': 'Lunch',
    'Café': 'Coffee',
    'Adoração': 'Worship',
    'Oração': 'Prayer',
    'Jejum': 'Fasting',
    'Batismo': 'Baptism',
    'Casamento': 'Wedding',
    'Funeral': 'Funeral',
  },
  es: {
    // Days of week
    'Segunda': 'Lunes',
    'Terça': 'Martes',
    'Quarta': 'Miércoles',
    'Quinta': 'Jueves',
    'Sexta': 'Viernes',
    'Sábado': 'Sábado',
    'Domingo': 'Domingo',
    // Months
    'Janeiro': 'Enero',
    'Fevereiro': 'Febrero',
    'Março': 'Marzo',
    'Abril': 'Abril',
    'Maio': 'Mayo',
    'Junho': 'Junio',
    'Julho': 'Julio',
    'Agosto': 'Agosto',
    'Setembro': 'Septiembre',
    'Outubro': 'Octubre',
    'Novembro': 'Noviembre',
    'Dezembro': 'Diciembre',
    // Common event terms
    'Culto': 'Servicio',
    'Reunião': 'Reunión',
    'Estudo': 'Estudio',
    'Conferência': 'Conferencia',
    'Retiro': 'Retiro',
    'Acampamento': 'Campamento',
    'Jantar': 'Cena',
    'Almoço': 'Almuerzo',
    'Café': 'Café',
    'Adoração': 'Adoración',
    'Oração': 'Oración',
    'Jejum': 'Ayuno',
    'Batismo': 'Bautismo',
    'Casamento': 'Boda',
    'Funeral': 'Funeral',
  },
  ro: {
    // Days of week
    'Segunda': 'Luni',
    'Terça': 'Marți',
    'Quarta': 'Miercuri',
    'Quinta': 'Joi',
    'Sexta': 'Vineri',
    'Sábado': 'Sâmbătă',
    'Domingo': 'Duminică',
    // Months
    'Janeiro': 'Ianuarie',
    'Fevereiro': 'Februarie',
    'Março': 'Martie',
    'Abril': 'Aprilie',
    'Maio': 'Mai',
    'Junho': 'Iunie',
    'Julho': 'Iulie',
    'Agosto': 'August',
    'Setembro': 'Septembrie',
    'Outubro': 'Octombrie',
    'Novembro': 'Noiembrie',
    'Dezembro': 'Decembrie',
    // Common event terms
    'Culto': 'Serviciu',
    'Reunião': 'Întâlnire',
    'Estudo': 'Studiu',
    'Conferência': 'Conferință',
    'Retiro': 'Retragere',
    'Acampamento': 'Tabără',
    'Jantar': 'Cină',
    'Almoço': 'Prânz',
    'Café': 'Cafea',
    'Adoração': 'Adorație',
    'Oração': 'Rugăciune',
    'Jejum': 'Post',
    'Batismo': 'Botez',
    'Casamento': 'Nuntă',
    'Funeral': 'Funeral',
  }
};

// Preload common translations into cache for all languages
export const preloadCommonTranslations = () => {
  const cache = getCache();
  let updated = false;

  // Preload for all target languages
  Object.entries(COMMON_TRANSLATIONS).forEach(([targetLang, translations]) => {
    Object.entries(translations).forEach(([pt, translated]) => {
      const key = `pt:${targetLang}:${pt}`;
      if (!cache[key]) {
        cache[key] = translated;
        updated = true;
      }
    });
  });

  if (updated) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: cache,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error preloading translations:', error);
    }
  }
};

// Initialize preloaded translations on module load
preloadCommonTranslations();
