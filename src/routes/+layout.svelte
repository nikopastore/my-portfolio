<script>
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';
  import { onMount } from 'svelte';

  let colorScheme = 'light'; // Default theme mode

  // Function to apply the color scheme to the page
  function applyColorScheme() {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', colorScheme === 'dark');
    }
  }

  // Load saved theme from localStorage on mount
  onMount(() => {
    if (typeof localStorage !== 'undefined') {
      colorScheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      applyColorScheme();
    }
  });

  // Reactive statement to apply and save color scheme changes
  $: if (typeof localStorage !== 'undefined') {
    applyColorScheme();
    localStorage.setItem('theme', colorScheme);
  }
</script>

<!-- Navigation -->
<Nav />

<!-- Dropdown Theme Switcher -->
<div class="theme-switcher">
  <label for="theme-switcher">Choose Theme:</label>
  <select id="theme-switcher" bind:value={colorScheme}>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
</div>

<!-- Main Content -->
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
  /* Theme switcher dropdown styling */
  .theme-switcher {
    display: flex;
    align-items: center;
    margin: 10px 0;
  }

  #theme-switcher {
    padding: 5px;
    font-size: 1rem;
    margin-left: 10px;
  }
  
  label {
    font-weight: bold;
  }
</style>
