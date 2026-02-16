import React from 'react';

const ThemeToggle: React.FC = () => {
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <button 
        className="bg-gray-800 dark:bg-white text-white dark:text-gray-900 p-3 rounded-full shadow-lg border-2 border-white dark:border-gray-900 hover:scale-110 transition" 
        onClick={toggleTheme}
        aria-label="Toggle Dark Mode"
      >
        <span className="material-symbols-outlined block dark:hidden">dark_mode</span>
        <span className="material-symbols-outlined hidden dark:block">light_mode</span>
      </button>
    </div>
  );
};

export default ThemeToggle;