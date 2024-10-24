<!-- src/lib/components/ColorSchemeSelector.svelte -->
<script>
    import { onMount } from 'svelte';
  
    let isDark = false;
  
    onMount(() => {
      // Check local storage or system preference
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        isDark = savedTheme === 'dark';
      } else {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      toggleClass();
    });
  
    function toggleClass() {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  
    function toggleTheme() {
      isDark = !isDark;
      toggleClass();
    }
  </script>
  
  <button
  on:click={toggleTheme}
  class="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full focus:outline-none focus:ring focus:ring-indigo-300 dark:focus:ring-indigo-600 transition-colors duration-200 z-60"
  aria-label="Toggle Dark Mode"
>
  {#if isDark}
    🌞 <!-- Sun Emoji for Light Mode -->
  {:else}
    🌙 <!-- Moon Emoji for Dark Mode -->
  {/if}
</button>