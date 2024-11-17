<!-- src/lib/components/DarkModeToggle.svelte -->
<script>
    import { onMount } from 'svelte';
  
    let isDark = false;
  
    // Check for user's preference or system setting on mount
    onMount(() => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        isDark = storedTheme === 'dark';
      } else {
        isDark = prefersDark;
      }
      updateTheme();
    });
  
    function toggleDarkMode() {
      isDark = !isDark;
      updateTheme();
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  
    function updateTheme() {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  </script>
  
  <button 
    on:click={toggleDarkMode} 
    class="flex items-center px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300 transition"
    aria-label="Toggle Dark Mode"
  >
    {#if isDark}
      <!-- Sun Icon for Light Mode -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414-1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464" />
      </svg>
    {:else}
      <!-- Moon Icon for Dark Mode -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
      </svg>
    {/if}
  </button>
  