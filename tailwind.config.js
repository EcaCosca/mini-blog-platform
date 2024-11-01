import { fontFamily as _fontFamily } from 'tailwindcss/defaultTheme';

export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
];
export const darkMode = 'class';
export const theme = {
  extend: {
    colors: {
      // Light colors
      background: '#f3f4f6',
      primary: '#333333',
      secondary: '#666666',
      accent: '#888888',
      hover: '#1f1f1f',
      border: '#e2e2e2',
      // Dark colors
      dark: {
        background: '#1a1a1a',
        primary: '#e5e5e5',
        secondary: '#b3b3b3',
        accent: '#4a4a4a',
        hover: '#333333',
        border: '#3a3a3a',
      },
    },
    fontFamily: {
      sans: ['Poppins', ..._fontFamily.sans],
    },
    transitionProperty: {
      color: 'color',
      background: 'background-color',
    },
  },
};
export const plugins = [];