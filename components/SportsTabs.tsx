import React from 'react';

interface SportsTabsProps {
  activeTab: string;
  onTabChange: (sport: string) => void;
}

const tabs = [
  { label: 'Soccer', sport: 'Soccer' },
  { label: 'ATP/WTA', sport: 'Tennis' },
  { label: 'NBA', sport: 'Basketball' },
  { label: 'NFL', sport: 'American Football' },
];

const SportsTabs: React.FC<SportsTabsProps> = ({ activeTab, onTabChange }) => {

  return (
    <div className="flex border-b border-gray-300 dark:border-gray-700 bg-transparent">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => onTabChange(tab.sport)}
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === tab.sport
              ? 'border-primary text-primary dark:text-white'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default SportsTabs;
