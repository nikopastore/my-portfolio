<!-- src/lib/components/ColorSchemeSelector.svelte -->
<script>
  import { onMount } from 'svelte';
  export let colorScheme = 'light';

  // Toggle function to switch theme
  function toggleTheme() {
    colorScheme = colorScheme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', colorScheme === 'dark');
    localStorage.setItem('colorScheme', colorScheme); // Save preference
  }

  // Set initial theme from stored preference or default
  onMount(() => {
    const savedScheme = localStorage.getItem('colorScheme') || colorScheme;
    colorScheme = savedScheme;
    document.documentElement.classList.toggle('dark', colorScheme === 'dark');
  });
</script>

<button
  on:click={toggleTheme}
  class="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full focus:outline-none focus:ring focus:ring-indigo-300 dark:focus:ring-indigo-600 transition-colors duration-200 z-60"
  aria-label="Toggle Dark Mode"
>
  {#if colorScheme === 'dark'}
    🌞 <!-- Sun Emoji for Light Mode -->
  {:else}
    🌙 <!-- Moon Emoji for Dark Mode -->
  {/if}
</button>

<style>
  /* Optional: Add any additional styles here */
</style>
