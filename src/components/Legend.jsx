import React from 'react';
import { EVENT_TYPES } from '../data/eventTypes';
import { useLanguage } from '../contexts/LanguageContext';

const Legend = () => {
  const { t } = useLanguage();
  const eventTypesArray = Object.values(EVENT_TYPES);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('eventTypes.title')}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {eventTypesArray.map(type => (
          <div key={type.id} className="flex items-center gap-2">
            <span className="text-xl">{type.icon}</span>
            <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
            <span className="text-sm text-gray-700">{t(`eventTypes.${type.id}`)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;
