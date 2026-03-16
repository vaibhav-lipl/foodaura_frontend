/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e12364',
        secondary: '#1f2937',
        background: '#f9fafb',
        textPrimary: '#111827',
        success: '#16a34a',
        warning: '#f59e0b',
        danger: '#dc2626',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
      },
    },
  },
  plugins: [],
}

