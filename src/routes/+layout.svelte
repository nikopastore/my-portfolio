<!-- src/routes/+layout.svelte -->
<script>
  import '../app.css'; // Import global CSS
  import Nav from '$lib/components/Nav.svelte';
  import ColorSchemeSelector from '$lib/components/ColorSchemeSelector.svelte';
  import { onMount } from 'svelte';

  let colorScheme = 'light';

  // Check if running in the browser
  function isBrowser() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  onMount(() => {
    if (isBrowser()) {
      const savedTheme = localStorage.getItem('theme');
      colorScheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      applyColorScheme(); // Apply theme on mount if in the browser
    }
  });

  // Function to apply the color scheme to the document
  function applyColorScheme() {
    if (isBrowser()) {
      document.documentElement.classList.toggle('dark', colorScheme === 'dark');
      document.documentElement.style.setProperty('color-scheme', colorScheme);
      localStorage.setItem('theme', colorScheme); // Persist the selected theme
    }
  }

  // Reactive statement to watch changes in colorScheme and apply them
  $: if (isBrowser() && colorScheme) applyColorScheme();
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
