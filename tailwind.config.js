/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sunday-service': '#3B82F6',
        'bible-study': '#10B981',
        'choir-practice': '#8B5CF6',
        'prayer-meeting': '#F59E0B',
        'youth-group': '#EC4899',
        'outreach': '#14B8A6',
        'special-event': '#EAB308',
        'ceremony': '#EF4444',
        'committee': '#6B7280',
      },
    },
  },
  plugins: [],
}
