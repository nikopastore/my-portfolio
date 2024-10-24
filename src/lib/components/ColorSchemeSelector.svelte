<!-- src/lib/components/ColorSchemeSelector.svelte -->
<script>
    import { onMount } from 'svelte';
  
    let scheme = 'light dark'; // Default to Automatic
  
    function setColorScheme(scheme) {
      if (scheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (scheme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // Automatic: Use prefers-color-scheme
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      localStorage.colorScheme = scheme;
    }
  
    onMount(() => {
      if (localStorage.colorScheme) {
        scheme = localStorage.colorScheme;
      }
      setColorScheme(scheme);
    });
  
    function handleChange() {
      setColorScheme(scheme);
    }
  </script>
  
  <label class="color-scheme flex items-center space-x-2">
    <span>Theme:</span>
    <select bind:value={scheme} on:change={handleChange} class="border rounded px-2 py-1">
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  
  <style>
    .color-scheme {
      margin-bottom: 15px;
    }
    select {
      background-color: white;
      color: black;
    }
    .dark select {
      background-color: #2d3748;
      color: white;
    }
  </style>
  