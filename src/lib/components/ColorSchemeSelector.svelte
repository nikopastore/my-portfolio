<!-- src/lib/components/ColorSchemeSelector.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  export let colorScheme = 'light';
  const dispatch = createEventDispatcher();

  function toggleTheme() {
    colorScheme = colorScheme === 'dark' ? 'light' : 'dark';
    dispatch('themeChange', { colorScheme });
  }
</script>

<button
  on:click={toggleTheme}
  class="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full focus:outline-none focus:ring focus:ring-indigo-300 dark:focus:ring-indigo-600 transition-colors duration-200"
  aria-label="Toggle Dark Mode"
>
  {#if colorScheme === 'dark'}
    🌞
  {:else}
    🌙
  {/if}
</button>
