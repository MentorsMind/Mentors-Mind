import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <button
      onClick={cycleTheme}
      className="fixed top-4 right-4 z-20 w-12 h-12 rounded-full bg-white dark:bg-[#1c2622] border-2 border-gray-200 dark:border-[#3d524a] flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl group"
      aria-label={`Toggle dark mode (current: ${theme})`}
    >
      <div className="relative w-6 h-6">
        <Sun className={`absolute inset-0 w-6 h-6 text-yellow-500 transition-all duration-300 ${
          theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
        }`} />
        <Moon className={`absolute inset-0 w-6 h-6 text-blue-600 dark:text-blue-400 transition-all duration-300 ${
          theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        }`} />
        <Monitor className={`absolute inset-0 w-6 h-6 text-gray-600 dark:text-gray-300 transition-all duration-300 ${
          theme === 'system' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
        }`} />
      </div>
    </button>
  );
}
