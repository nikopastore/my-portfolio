// svelte.config.js
import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

const config = {
  kit: {
    adapter: adapter(),
    // Optional: Add other kit configurations here
  },
  preprocess: [
    preprocess({
      postcss: true, // Enables PostCSS processing
      // Optional: Add other preprocessors like SCSS, TypeScript, etc.
    }),
  ],
};

export default config;
