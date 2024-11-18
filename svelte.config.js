// svelte.config.js
import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    postcss: true, // Enables PostCSS processing (required for Tailwind CSS)
  }),

  kit: {
    adapter: adapter(),
    // No need to specify `files.appTemplate` unless you have a custom path
    // By default, SvelteKit looks for `app.html` in the root directory
  }
};

export default config;
