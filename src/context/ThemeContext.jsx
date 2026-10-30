import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(function () {
    const saved = localStorage.getItem('amaljith-theme');
    if (saved) {
      return saved;
    } else {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
  });

  useEffect(function () {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('amaljith-theme', theme);
  }, [theme]);

  const value = useMemo(function () {
    return {
      theme,
      toggleTheme: function () {
        const root = document.documentElement;
        root.classList.add('theme-fade');
        window.setTimeout(function () {
          root.classList.remove('theme-fade');
        }, 650);
        setTheme(function (current) {
          return current === 'dark' ? 'light' : 'dark';
        });
      }
    };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context) {
    return context;
  } else {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
}
