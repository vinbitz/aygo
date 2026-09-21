/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edf2fe',
          100: '#dbe5fd',
          200: '#b7cbfa',
          300: '#8eb0f8',
          400: '#5a8df4',
          500: '#2b6bf0',
          600: '#003CF5',
          700: '#0030c7',
          800: '#00269e',
          900: '#001e7a',
          950: '#001147',
        },
        ink: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#0C1425',
        },
        lime: {
          400: '#C5F76B',
          950: '#1a3300',
        },
        canvas: '#F7F8FA',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
