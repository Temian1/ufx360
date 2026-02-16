import React from 'react';
import { LiveMatch } from '../types';

import { useTranslation } from '../contexts/TranslationContext';

interface SearchResultsPanelProps {
  term: string;
  loading: boolean;
  results: LiveMatch[];
  onMatchSelect: (match: LiveMatch) => void;
  onClear: () => void;
}

const SearchResultsPanel: React.FC<SearchResultsPanelProps> = ({ term, loading, results, onMatchSelect, onClear }) => {
  const { t } = useTranslation();

  if (!term.trim()) return null;

  return (
    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-md p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-bold uppercase text-gray-500">{t('search.title')}</h3>
        <button onClick={onClear} className="text-xxs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">
          {t('search.clear')}
        </button>
      </div>
      {loading ? (
        <div className="text-sm text-gray-500 italic py-2">{t('search.fetching')}</div>
      ) : results.length === 0 ? (
        <div className="text-sm text-gray-500 py-2">{t('search.no_results')} "{term}"</div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {results.map((match) => (
            <button
              key={match.id}
              onClick={() => onMatchSelect(match)}
              className="w-full text-left bg-gray-50 dark:bg-black/20 p-2 rounded hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-700 dark:text-gray-200">{match.team1} v {match.team2}</span>
                <span className="text-green-600">{match.time}</span>
              </div>
              <div className="text-xxs text-gray-500 mt-1">{match.sport}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPanel;
