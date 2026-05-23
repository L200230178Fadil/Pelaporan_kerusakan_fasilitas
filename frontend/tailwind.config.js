/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        body:    ['"Inter"', '"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // UMS Navy Blue sebagai warna utama
        brand: {
          50:  '#eef0fb',
          100: '#d5d9f5',
          200: '#aab3eb',
          300: '#7f8de0',
          400: '#5467d5',
          500: '#3a52cc',
          600: '#2d3ea8',  // UMS primary navy
          700: '#232f82',
          800: '#1a2260',
          900: '#131840',
          950: '#0c1030',
        },
        // UMS Gold/Yellow sebagai aksen
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // UMS gold
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        ink: {
          50:  'var(--ink-50)',
          100: 'var(--ink-100)',
          200: 'var(--ink-200)',
          300: 'var(--ink-300)',
          400: 'var(--ink-400)',
          500: 'var(--ink-500)',
          600: 'var(--ink-600)',
          700: 'var(--ink-700)',
          800: 'var(--ink-800)',
          900: 'var(--ink-900)',
          950: 'var(--ink-950)',
        },
        accent: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        // UMS navy as surface
        navy: {
          700: '#1e2d78',
          800: '#1a2460',
          900: '#131840',
        }
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        'ums-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'ums': '0 4px 24px rgba(45, 62, 168, 0.15)',
        'ums-lg': '0 8px 40px rgba(45, 62, 168, 0.25)',
        'gold': '0 4px 24px rgba(245, 158, 11, 0.25)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 16px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 24px rgba(45, 62, 168, 0.10)',
        'btn-primary': '0 2px 8px rgba(45, 62, 168, 0.25)',
        'btn-gold': '0 2px 8px rgba(245, 158, 11, 0.30)',
      },
      animation: {
        'slide-down': 'slideDown 0.3s cubic-bezier(0.22,1,0.36,1)',
        'fade-up': 'fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
