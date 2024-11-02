<!-- src/lib/components/ColorSchemeSelector.svelte -->
<script>
  export let colorScheme = 'light'; // Receive the colorScheme variable from the layout

  function toggleTheme() {
    colorScheme = colorScheme === 'dark' ? 'light' : 'dark';
  }
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
  /* Any additional component-specific styles can go here */
</style>
