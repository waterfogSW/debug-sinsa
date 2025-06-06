/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/common/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff6b35',
        secondary: '#ff8c42',
        accent: '#FFFFFF',
        dark: {
          DEFAULT: '#0a0a23',
          lighter: '#1a0a3a',
          light: '#2a1a4a',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 3s infinite alternate',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(-2deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        twinkle: {
          '0%': { opacity: '0.3', transform: 'scale(1)' },
          '100%': { opacity: '1', transform: 'scale(1.5)' },
        },
        glow: {
          'from': { textShadow: '0 0 20px rgba(255, 107, 53, 0.8)' },
          'to': { textShadow: '0 0 30px rgba(255, 107, 53, 1), 0 0 40px rgba(255, 107, 53, 0.8)' },
        },
      },
    },
  },
  plugins: [],
} 
