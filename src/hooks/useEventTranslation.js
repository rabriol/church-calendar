import { useState, useEffect } from 'react';
import { translateText } from '../services/translationService';

// Hook for translating event content
export const useEventTranslation = (text, language) => {
  const [translated, setTranslated] = useState(text);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // If language is Portuguese or text is empty, return original
    if (language === 'pt' || !text || text.trim() === '') {
      setTranslated(text);
      return;
    }

    // If language is English, translate from Portuguese
    if (language === 'en') {
      setIsTranslating(true);

      translateText(text, 'pt', 'en')
        .then(translatedText => {
          setTranslated(translatedText);
          setIsTranslating(false);
        })
        .catch(error => {
          console.error('Translation error:', error);
          setTranslated(text); // Fallback to original
          setIsTranslating(false);
        });
    }
  }, [text, language]);

  return { translated, isTranslating };
};

// Simpler version that just returns the translated text (no loading state)
export const useTranslate = (text, language) => {
  const { translated } = useEventTranslation(text, language);
  return translated;
};
