
import { Home } from './pages/Home'
import { useEffect, useState } from 'react';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved preference or use system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200`}>
      <Home darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} /> 
    </div>
  )
}

export default App
