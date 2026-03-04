// =============================================================================
// tailwind.config.js — Konfiguracja Tailwind CSS dla Predodactyl Theme
// Ścieżka: tailwind.config.js (root Pterodactyla)
//
// INSTRUKCJA: Podmień istniejący tailwind.config.js w katalogu głównym
//             Pterodactyl Panel na ten plik.
//
// Ten plik zachowuje WSZYSTKIE oryginalne klasy Pterodactyla (text-2xs,
// font-header, itp.) i dodaje kolory/animacje motywu Predodactyl.
// =============================================================================

const defaultTheme = require('tailwindcss/defaultTheme');
const lineClamp = require('@tailwindcss/line-clamp');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './resources/scripts/**/*.{js,ts,jsx,tsx}',
    './resources/views/**/*.blade.php',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ---- Colors ----
      colors: {
        // Background shades
        'bg-primary': '#0a0a0f',
        'bg-secondary': '#111118',
        'bg-tertiary': '#16161f',
        'bg-card': '#111118',

        // Accent – Purple
        'accent-purple': '#6c47ff',
        'accent-purple-light': '#8b6fff',
        'accent-purple-dark': '#5535cc',

        // Accent – Cyan
        'accent-cyan': '#00d4ff',
        'accent-cyan-light': '#33ddff',
        'accent-cyan-dark': '#00a8cc',

        // Text
        'text-primary': '#e4e4ed',
        'text-secondary': '#9898b0',
        'text-muted': '#5c5c75',

        // Status
        'status-online': '#22c55e',
        'status-offline': '#ef4444',
        'status-starting': '#f59e0b',
        'status-stopping': '#f97316',

        // Override Pterodactyl primary → purple theme
        primary: {
          50: '#f0edff',
          100: '#ddd6ff',
          200: '#c4b5ff',
          300: '#a48bff',
          400: '#8b6fff',
          500: '#6c47ff',
          600: '#5535cc',
          700: '#422aa3',
          800: '#312080',
          900: '#1f1554',
        },
        // Override Pterodactyl neutral → dark theme
        neutral: {
          50: '#e4e4ed',
          100: '#c8c8d8',
          200: '#9898b0',
          300: '#7a7a94',
          400: '#5c5c75',
          500: '#3d3d55',
          600: '#2a2a3d',
          700: '#1e1e2e',
          800: '#16161f',
          900: '#111118',
          950: '#0a0a0f',
        },
        // Pterodactyl original cyan override
        cyan: {
          50: '#e0faff',
          100: '#b8f3ff',
          200: '#7aebff',
          300: '#33ddff',
          400: '#00d4ff',
          500: '#00a8cc',
          600: '#0087a3',
          700: '#006680',
          800: '#00455c',
          900: '#002436',
        },
      },

      // ---- Fonts ----
      // font-header + font-sans — required by Pterodactyl's twin.macro classes
      fontFamily: {
        header: ['"IBM Plex Sans"', '"Rubik"', 'Inter', ...defaultTheme.fontFamily.sans],
        sans: ['Inter', '"Rubik"', '"IBM Plex Sans"', ...defaultTheme.fontFamily.sans],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', '"Fira Code"', ...defaultTheme.fontFamily.mono],
      },

      // ---- Font Size ----
      // text-2xs — required by Pterodactyl components (UserRow, etc.)
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },

      // ---- Spacing ----
      spacing: {
        sidebar: '240px',
        'sidebar-collapsed': '72px',
        navbar: '64px',
      },

      // ---- Border Width ----
      // Pterodactyl uses border-DEFAULT override
      borderWidth: {
        DEFAULT: '1px',
        0: '0px',
        2: '2px',
        4: '4px',
        8: '8px',
      },

      // ---- Border Radius ----
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        md: '10px',
        lg: '14px',
        xl: '20px',
        '2xl': '24px',
      },

      // ---- Box Shadow ----
      boxShadow: {
        // Pterodactyl original shadows
        none: 'none',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        // Predodactyl custom shadows
        card: '0 4px 24px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 40px rgba(108, 71, 255, 0.15), 0 4px 24px rgba(0, 0, 0, 0.3)',
        glow: '0 0 30px rgba(108, 71, 255, 0.2)',
        'glow-cyan': '0 0 30px rgba(0, 212, 255, 0.2)',
        input: '0 2px 8px rgba(0, 0, 0, 0.2)',
        'input-focus': '0 0 0 3px rgba(108, 71, 255, 0.15), 0 2px 8px rgba(0, 0, 0, 0.2)',
        navbar: '0 2px 20px rgba(0, 0, 0, 0.4)',
        dropdown: '0 8px 40px rgba(0, 0, 0, 0.5)',
      },

      // ---- Background Gradient ----
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6c47ff 0%, #00d4ff 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(108, 71, 255, 0.05) 0%, rgba(0, 212, 255, 0.03) 100%)',
        'gradient-glow': 'radial-gradient(ellipse at center, rgba(108, 71, 255, 0.15) 0%, transparent 70%)',
        'gradient-bg': 'radial-gradient(ellipse at 20% 50%, rgba(108, 71, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0, 212, 255, 0.06) 0%, transparent 50%)',
      },

      // ---- Backdrop Blur ----
      backdropBlur: {
        xs: '4px',
        glass: '20px',
        heavy: '40px',
      },

      // ---- Transitions ----
      transitionDuration: {
        DEFAULT: '250ms',
        fast: '150ms',
        slow: '400ms',
      },

      // ---- Animation ----
      animation: {
        'gradient-shift': 'gradientShift 25s ease-in-out infinite',
        'float-orb': 'floatOrb 20s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
      },

      keyframes: {
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '25%': { backgroundPosition: '50% 0%' },
          '50%': { backgroundPosition: '100% 50%' },
          '75%': { backgroundPosition: '50% 100%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        floatOrb: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.4' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)', opacity: '0.6' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)', opacity: '0.3' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-20px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          from: { transform: 'translateX(20px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        fadeInUp: {
          from: { transform: 'translateY(16px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },

      // ---- Z-Index ----
      zIndex: {
        sidebar: '40',
        navbar: '30',
        dropdown: '50',
        modal: '60',
        toast: '70',
      },
    },
  },
  plugins: [
    lineClamp,
    // Custom plugin for glassmorphism + Predodactyl utilities
    function ({ addUtilities }) {
      addUtilities({
        '.glass': {
          background: 'rgba(17, 17, 24, 0.6)',
          'backdrop-filter': 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          border: '1px solid rgba(108, 71, 255, 0.12)',
        },
        '.glass-strong': {
          background: 'rgba(17, 17, 24, 0.8)',
          'backdrop-filter': 'blur(40px)',
          '-webkit-backdrop-filter': 'blur(40px)',
          border: '1px solid rgba(108, 71, 255, 0.18)',
        },
        '.glass-subtle': {
          background: 'rgba(17, 17, 24, 0.3)',
          'backdrop-filter': 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
        '.text-gradient': {
          background: 'linear-gradient(135deg, #6c47ff 0%, #00d4ff 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-reverse': {
          background: 'linear-gradient(135deg, #00d4ff 0%, #6c47ff 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
      });
    },
  ],
};
