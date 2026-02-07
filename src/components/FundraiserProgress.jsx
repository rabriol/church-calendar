import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const FundraiserProgress = ({ fundraiser, eventDate, compact = false }) => {
  const { language } = useLanguage();

  if (!fundraiser) return null;

  const { goal, current, currency, donateUrl, donateButtonText } = fundraiser;
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const actualPercentage = goal > 0 ? (current / goal) * 100 : 0;
  const remaining = Math.max(goal - current, 0);

  // Calculate days remaining
  const now = new Date();
  const [year, month, day] = eventDate.split('-').map(Number);
  const endDate = new Date(year, month - 1, day, 23, 59, 59);
  const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));
  const isActive = daysRemaining > 0;

  // Format currency
  const formatCurrency = (amount) => {
    const currencySymbols = {
      'USD': '$',
      'BRL': 'R$',
      'EUR': '€',
      'GBP': '£'
    };
    const symbol = currencySymbols[currency] || currency;
    return `${symbol}${amount.toLocaleString()}`;
  };

  // Get progress bar color based on percentage
  const getProgressColor = () => {
    if (percentage >= 100) return 'from-green-500 to-green-600';
    if (percentage >= 75) return 'from-blue-500 to-blue-600';
    if (percentage >= 50) return 'from-amber-500 to-amber-600';
    if (percentage >= 25) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  // Get status message
  const getStatusMessage = () => {
    const messages = {
      en: {
        starting: "Let's get this started!",
        quarter: "Great start!",
        halfway: "Halfway to our goal!",
        almostThere: `Just ${formatCurrency(remaining)} more to reach our goal!`,
        goalReached: "Goal reached! Thank you!",
        goalExceeded: "Amazing! We've exceeded our goal!",
        ended: "Event ended"
      },
      pt: {
        starting: "Vamos começar!",
        quarter: "Ótimo começo!",
        halfway: "Na metade do caminho!",
        almostThere: `Faltam apenas ${formatCurrency(remaining)}!`,
        goalReached: "Meta alcançada! Obrigado!",
        goalExceeded: "Incrível! Meta superada!",
        ended: "Evento encerrado"
      }
    };

    const lang = messages[language] || messages.en;

    if (!isActive) return { text: lang.ended, emoji: '' };
    if (actualPercentage >= 100) return { text: lang.goalExceeded, emoji: '🎉' };
    if (percentage >= 85) return { text: lang.almostThere, emoji: '🔥' };
    if (percentage >= 50) return { text: lang.halfway, emoji: '🎯' };
    if (percentage >= 25) return { text: lang.quarter, emoji: '👍' };
    return { text: lang.starting, emoji: '💪' };
  };

  const statusMessage = getStatusMessage();

  // Translations
  const t = {
    en: {
      raised: 'raised of',
      stillNeeded: 'still needed',
      daysRemaining: daysRemaining === 1 ? 'day remaining' : 'days remaining',
      funded: 'funded',
      donate: donateButtonText || 'Donate Now',
      share: 'Share Goal'
    },
    pt: {
      raised: 'arrecadados de',
      stillNeeded: 'ainda necessários',
      daysRemaining: daysRemaining === 1 ? 'dia restante' : 'dias restantes',
      funded: 'arrecadado',
      donate: donateButtonText || 'Doar Agora',
      share: 'Compartilhar'
    }
  };

  const labels = t[language] || t.en;

  if (compact) {
    // Compact view for collapsed event card
    return (
      <div className="mt-2">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="font-medium">💰 {formatCurrency(current)} {labels.raised} {formatCurrency(goal)}</span>
        </div>

        {/* Progress bar */}
        <div className="relative w-full h-2 bg-gray-300 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-1000 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-gray-600">{Math.round(actualPercentage)}%</span>
          {isActive && (
            <span className="text-gray-600">{daysRemaining} {labels.daysRemaining}</span>
          )}
        </div>

        {/* Status message */}
        {statusMessage.emoji && (
          <div className="text-sm font-medium mt-1 text-gray-700">
            {statusMessage.emoji} {statusMessage.text}
          </div>
        )}
      </div>
    );
  }

  // Expanded view for event details
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
      <h5 className="text-center text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        {language === 'pt' ? 'Progresso da Campanha' : 'Fundraiser Progress'}
      </h5>

      {/* Amount display */}
      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(current)}</div>
          <div className="text-xs text-gray-600">{labels.raised}</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(goal)}</div>
          <div className="text-xs text-gray-600">{language === 'pt' ? 'meta' : 'goal'}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative w-full h-4 bg-gray-300 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-1000 ease-out shadow-sm`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stats */}
      <div className="text-center text-sm font-semibold text-gray-700 mb-3">
        {Math.round(actualPercentage)}% {labels.funded}
      </div>

      <div className="flex items-center justify-between text-sm mb-3">
        {remaining > 0 && isActive && (
          <div className="flex items-center gap-1 text-gray-700">
            <span>💝</span>
            <span className="font-medium">{formatCurrency(remaining)} {labels.stillNeeded}</span>
          </div>
        )}
        {isActive && (
          <div className="flex items-center gap-1 text-gray-700 ml-auto">
            <span>📅</span>
            <span className="font-medium">{daysRemaining} {labels.daysRemaining}</span>
          </div>
        )}
      </div>

      {/* Status message */}
      {statusMessage.emoji && (
        <div className={`text-center text-sm font-bold mb-3 ${
          actualPercentage >= 100 ? 'text-green-700' :
          percentage >= 75 ? 'text-blue-700' : 'text-gray-700'
        }`}>
          {statusMessage.emoji} {statusMessage.text}
        </div>
      )}

      {/* Action buttons */}
      {donateUrl && isActive && (
        <div className="flex gap-2">
          <a
            href={donateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <span>💝</span>
            <span>{labels.donate}</span>
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `${language === 'pt' ? 'Ajude-nos a alcançar nossa meta!' : 'Help us reach our goal!'}\n${formatCurrency(current)} ${labels.raised} ${formatCurrency(goal)} (${Math.round(actualPercentage)}%)\n\n${donateUrl}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </a>
        </div>
      )}
    </div>
  );
};

export default FundraiserProgress;
