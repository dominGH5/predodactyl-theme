// =============================================================================
// ThemeProvider.tsx — Provider wstrzykujący CSS Variables do dokumentu
// Ścieżka: resources/scripts/components/theme/ThemeProvider.tsx
//
// UŻYCIE: Owinąć główny komponent App w <ThemeProvider>...</ThemeProvider>
// =============================================================================

import React, { useEffect } from 'react';
import { cssVariables } from './theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  useEffect(() => {
    // Inject CSS variables into :root
    const styleId = 'predodactyl-theme-vars';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = cssVariables;

    // Add dark class to html element
    document.documentElement.classList.add('dark');

    // Set meta theme-color
    let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = '#0a0a0f';

    return () => {
      // Cleanup (optional — remove on unmount)
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);

  return <>{children}</>;
};

export default ThemeProvider;
