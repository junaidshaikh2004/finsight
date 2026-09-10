'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // The inline script in layout.js already set the class on <html> before
  // hydration, so just read it back instead of guessing a default here.
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Deliberately not a lazy useState initializer: reading `document` during
    // the render itself would give the server render (no DOM) and the
    // client's first hydration render different results, since the inline
    // script has already toggled the class by then — a hydration mismatch.
    // Matching the server's default here first, then correcting after mount,
    // is the standard fix (the same approach next-themes uses).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem('finsight-theme', next);
    } catch {
      // localStorage may be unavailable (private browsing); theme just won't persist.
    }
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
