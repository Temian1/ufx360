import React, { useEffect, useState } from 'react';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() =>
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
      return;
    }
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
      return;
    }
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    document.documentElement.classList.toggle('dark', nextIsDark);
    localStorage.setItem('theme', nextIsDark ? 'dark' : 'light');
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <button 
        className="w-11 h-11 inline-flex items-center justify-center rounded-full bg-white text-gray-800 border border-gray-300 shadow-lg hover:scale-110 transition dark:bg-gray-900 dark:text-white dark:border-white/20" 
        onClick={toggleTheme}
        aria-label="Toggle Dark Mode"
      >
        <span className="material-symbols-outlined">
          {isDark ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
    </div>
  );
};

export default ThemeToggle;
