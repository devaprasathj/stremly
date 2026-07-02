/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        streamly: {
          red: '#ff2d55',
          'red-dark': '#cc0033',
          dark: '#0a0a0f',
          darker: '#06060b',
          light: '#14141a',
          gray: '#808099',
          'gray-light': '#b0b0c0',
          'gray-dark': '#2a2a35',
          darkblue: '#0a0e1a',
          accent: '#ff2d55',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.08)',
          medium: 'rgba(255, 255, 255, 0.12)',
          heavy: 'rgba(255, 255, 255, 0.18)',
        },
        category: {
          sciFi: '#6366f1',
          action: '#ef4444',
          romance: '#ec4899',
          horror: '#dc2626',
          adventure: '#14b8a6',
          comedy: '#f59e0b',
          drama: '#8b5cf6',
          thriller: '#f97316',
          animation: '#06b6d4',
          documentary: '#10b981',
        },
        aurora: {
          blue: '#4F46E5',
          purple: '#7C3AED',
          pink: '#EC4899',
          cyan: '#06B6D4',
          teal: '#14B8A6',
          red: '#EF4444',
          orange: '#F97316',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-streamly': 'glow-streamly 3s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'aurora': 'aurora 8s ease-in-out infinite alternate',
        'fog': 'fog 12s ease-in-out infinite alternate',
        'energy': 'energy 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': { 'background-size': '400% 400%', 'background-position': 'center top' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'center center' },
        },
        'gradient-xy': {
          '0%, 100%': { 'background-size': '400% 400%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { 'box-shadow': '0 0 5px rgba(255, 45, 85, 0.5), 0 0 10px rgba(255, 45, 85, 0.3)' },
          '100%': { 'box-shadow': '0 0 20px rgba(255, 45, 85, 0.8), 0 0 40px rgba(255, 45, 85, 0.4)' },
        },
        'glow-streamly': {
          '0%': { 'box-shadow': '0 0 10px rgba(99, 102, 241, 0.3), 0 0 20px rgba(99, 102, 241, 0.1)' },
          '50%': { 'box-shadow': '0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(236, 72, 153, 0.2)' },
          '100%': { 'box-shadow': '0 0 10px rgba(6, 182, 212, 0.3), 0 0 20px rgba(6, 182, 212, 0.1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        aurora: {
          '0%': { transform: 'translateX(-10%) translateY(-10%) scale(1)', opacity: '0.3' },
          '50%': { transform: 'translateX(10%) translateY(5%) scale(1.2)', opacity: '0.6' },
          '100%': { transform: 'translateX(0%) translateY(-5%) scale(1.1)', opacity: '0.4' },
        },
        fog: {
          '0%': { transform: 'translateX(-5%) translateY(0%)', opacity: '0.15' },
          '50%': { transform: 'translateX(5%) translateY(-5%)', opacity: '0.25' },
          '100%': { transform: 'translateX(-2%) translateY(2%)', opacity: '0.15' },
        },
        energy: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '0.3' },
          '33%': { transform: 'scale(1.3) rotate(120deg)', opacity: '0.6' },
          '66%': { transform: 'scale(0.9) rotate(240deg)', opacity: '0.4' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
