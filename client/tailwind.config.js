/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        health: {
          primary: {
            DEFAULT: '#0F766E', // teal-700
            hover: '#115E59',   // teal-800
            active: '#134E4A',  // teal-900
            subtle: '#F0FDFA',  // teal-50
            border: '#99F6E4',  // teal-200
          },
          status: {
            normal:    { DEFAULT: '#059669', bg: '#ECFDF5', border: '#A7F3D0', text: '#065F46' },
            attention: { DEFAULT: '#D97706', bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
            high:      { DEFAULT: '#EA580C', bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412' },
            emergency: { DEFAULT: '#E11D48', bg: '#FFF1F2', border: '#FECDD3', text: '#9F1239' },
            info:      { DEFAULT: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD', text: '#075985' },
          },
          urgency: {
            low:       { DEFAULT: '#059669', bg: '#ECFDF5', border: '#A7F3D0', text: '#065F46' },
            medium:    { DEFAULT: '#D97706', bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
            high:      { DEFAULT: '#EA580C', bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412' },
            emergency: { DEFAULT: '#E11D48', bg: '#FFF1F2', border: '#FECDD3', text: '#9F1239' },
          }
        }
      },
      borderRadius: {
        'card': '1rem',       // 16px
        'action': '0.75rem',  // 12px
        'input': '0.625rem',  // 10px
        'panel': '1.5rem',    // 24px
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'clinical-card': '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
        'clinical-elevated': '0 4px 12px 0 rgba(15, 23, 42, 0.06)',
        'clinical-emergency': '0 8px 24px -4px rgba(225, 29, 72, 0.12)',
      }
    }
  },
  plugins: [],
};
