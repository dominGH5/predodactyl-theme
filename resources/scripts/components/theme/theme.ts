// =============================================================================
// theme.ts — Pełna konfiguracja kolorów i zmiennych motywu Predodactyl
// Ścieżka: resources/scripts/components/theme/theme.ts
// =============================================================================

export const theme = {
  colors: {
    // Tła
    background: {
      primary: '#0a0a0f',
      secondary: '#111118',
      tertiary: '#16161f',
      card: '#111118',
      cardHover: '#161622',
      input: '#0e0e15',
      overlay: 'rgba(10, 10, 15, 0.85)',
    },

    // Akcenty
    accent: {
      purple: '#6c47ff',
      purpleLight: '#8b6fff',
      purpleDark: '#5535cc',
      purpleGlow: 'rgba(108, 71, 255, 0.3)',
      cyan: '#00d4ff',
      cyanLight: '#33ddff',
      cyanDark: '#00a8cc',
      cyanGlow: 'rgba(0, 212, 255, 0.3)',
    },

    // Tekst
    text: {
      primary: '#e4e4ed',
      secondary: '#9898b0',
      muted: '#5c5c75',
      accent: '#6c47ff',
      link: '#00d4ff',
    },

    // Statusy serwerów
    status: {
      online: '#22c55e',
      offline: '#ef4444',
      starting: '#f59e0b',
      stopping: '#f97316',
      installing: '#6c47ff',
    },

    // Obramowania
    border: {
      default: 'rgba(108, 71, 255, 0.12)',
      hover: 'rgba(108, 71, 255, 0.3)',
      active: 'rgba(108, 71, 255, 0.5)',
      subtle: 'rgba(255, 255, 255, 0.05)',
    },

    // Gradienty
    gradient: {
      primary: 'linear-gradient(135deg, #6c47ff 0%, #00d4ff 100%)',
      card: 'linear-gradient(145deg, rgba(108, 71, 255, 0.05) 0%, rgba(0, 212, 255, 0.03) 100%)',
      glow: 'radial-gradient(ellipse at center, rgba(108, 71, 255, 0.15) 0%, transparent 70%)',
      background: 'radial-gradient(ellipse at 20% 50%, rgba(108, 71, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0, 212, 255, 0.06) 0%, transparent 50%)',
    },
  },

  // Glassmorphism
  glass: {
    background: 'rgba(17, 17, 24, 0.6)',
    blur: '20px',
    border: '1px solid rgba(108, 71, 255, 0.12)',
  },

  // Cienie
  shadows: {
    card: '0 4px 24px rgba(0, 0, 0, 0.3)',
    cardHover: '0 8px 40px rgba(108, 71, 255, 0.15), 0 4px 24px rgba(0, 0, 0, 0.3)',
    glow: '0 0 30px rgba(108, 71, 255, 0.2)',
    input: '0 2px 8px rgba(0, 0, 0, 0.2)',
    navbar: '0 2px 20px rgba(0, 0, 0, 0.4)',
  },

  // Animacje
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    default: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: { type: 'spring', stiffness: 300, damping: 25 },
  },

  // Zaokrąglenia
  borderRadius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
    full: '9999px',
  },

  // Sidebar
  sidebar: {
    width: {
      expanded: '240px',
      collapsed: '72px',
    },
  },
} as const;

// CSS Variables – wstaw do :root
export const cssVariables = `
  :root {
    --bg-primary: ${theme.colors.background.primary};
    --bg-secondary: ${theme.colors.background.secondary};
    --bg-tertiary: ${theme.colors.background.tertiary};
    --bg-card: ${theme.colors.background.card};
    --bg-card-hover: ${theme.colors.background.cardHover};
    --bg-input: ${theme.colors.background.input};
    --bg-overlay: ${theme.colors.background.overlay};

    --accent-purple: ${theme.colors.accent.purple};
    --accent-purple-light: ${theme.colors.accent.purpleLight};
    --accent-purple-dark: ${theme.colors.accent.purpleDark};
    --accent-purple-glow: ${theme.colors.accent.purpleGlow};
    --accent-cyan: ${theme.colors.accent.cyan};
    --accent-cyan-light: ${theme.colors.accent.cyanLight};
    --accent-cyan-dark: ${theme.colors.accent.cyanDark};
    --accent-cyan-glow: ${theme.colors.accent.cyanGlow};

    --text-primary: ${theme.colors.text.primary};
    --text-secondary: ${theme.colors.text.secondary};
    --text-muted: ${theme.colors.text.muted};

    --status-online: ${theme.colors.status.online};
    --status-offline: ${theme.colors.status.offline};
    --status-starting: ${theme.colors.status.starting};
    --status-stopping: ${theme.colors.status.stopping};

    --border-default: ${theme.colors.border.default};
    --border-hover: ${theme.colors.border.hover};

    --shadow-card: ${theme.shadows.card};
    --shadow-card-hover: ${theme.shadows.cardHover};
    --shadow-glow: ${theme.shadows.glow};

    --sidebar-width: ${theme.sidebar.width.expanded};
    --sidebar-collapsed: ${theme.sidebar.width.collapsed};

    --radius-sm: ${theme.borderRadius.sm};
    --radius-md: ${theme.borderRadius.md};
    --radius-lg: ${theme.borderRadius.lg};
    --radius-xl: ${theme.borderRadius.xl};
  }
`;

export type ThemeColors = typeof theme.colors;
export type Theme = typeof theme;
export default theme;
