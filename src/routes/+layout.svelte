<!-- src/routes/+layout.svelte -->
<script>
  import '../app.css'; // Import global CSS
  import Nav from '$lib/components/Nav.svelte';
  import ColorSchemeSelector from '$lib/components/ColorSchemeSelector.svelte';
  import { onMount } from 'svelte';

  let colorScheme = 'light'; // Initialize with 'light' as default

  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      colorScheme = savedTheme;
    } else {
      // Detect system preference
      colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  });

  // Reactive statement to apply the color scheme
  $: globalThis?.document?.documentElement?.classList.toggle('dark', colorScheme === 'dark');
  $: globalThis?.document?.documentElement?.style.setProperty('color-scheme', colorScheme);
</script>

<!-- Navigation Bar -->
<Nav />

<!-- Theme Selector -->
<ColorSchemeSelector bind:colorScheme />

<!-- Main Content Container -->
<main class="w-full px-4 pt-20">
  <div class="max-w-6xl mx-auto">
    <slot />
  </div>
</main>

<!-- Footer -->
<footer class="bg-gray-200 dark:bg-gray-800 p-4 text-center text-gray-700 dark:text-gray-300">
  &copy; {new Date().getFullYear()} Nikolai Pastore. All rights reserved.
</footer>

<style>
  /* Any additional styles can go here */
</style>
