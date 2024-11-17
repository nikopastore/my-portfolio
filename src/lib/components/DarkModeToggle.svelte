<!-- src/lib/components/DarkModeToggle.svelte -->
<script>
    let isDark = false;
  
    function toggleDarkMode() {
      isDark = !isDark;
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  
    // Check local storage for theme preference
    onMount(() => {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark') {
        isDark = true;
        document.documentElement.classList.add('dark');
      }
    });
  
    function handleToggle() {
      toggleDarkMode();
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  </script>
  
  <button
    on:click={handleToggle}
    class="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 transition"
  >
    {#if isDark}
      🌙 Dark Mode
    {:else}
      ☀️ Light Mode
    {/if}
  </button>
  