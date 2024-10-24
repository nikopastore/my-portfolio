// tailwind.config.cjs
module.exports = {
  darkMode: 'class', // Enables class-based dark mode
  content: [
    './src/**/*.{html,js,svelte,ts}', // Scans all relevant files for Tailwind classes
    './static/**/*.{html,js,svelte,ts}', // Also scan static files if necessary
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
