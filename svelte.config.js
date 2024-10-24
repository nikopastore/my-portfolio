// svelte.config.js
import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

export default {
  kit: {
    adapter: adapter(),
    // ... other configurations ...
  },
  preprocess: [
    preprocess({
      postcss: true, // Enables PostCSS processing
    }),
  ],
};
