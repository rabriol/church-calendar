import { eventTranslations } from '../i18n/eventTranslations';

export const translateEventContent = (text, language) => {
  if (!text) return text;

  // If translation exists for this text, use it
  if (eventTranslations[language] && eventTranslations[language][text]) {
    return eventTranslations[language][text];
  }

  // Otherwise return original text
  return text;
};
