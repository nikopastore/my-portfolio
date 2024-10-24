<!-- src/lib/components/ColorSchemeSelector.svelte -->
<script>
    import { onMount } from 'svelte';
  
    let scheme = 'light dark'; // Default to Automatic
  
    function setColorScheme(scheme) {
      document.documentElement.style.setProperty('color-scheme', scheme);
      localStorage.colorScheme = scheme;
    }
  
    // Load the saved scheme from localStorage and set the color scheme
    onMount(() => {
      if (localStorage.colorScheme) {
        scheme = localStorage.colorScheme;
      }
      setColorScheme(scheme);
  
      // Watch for changes to scheme and update the color scheme
      $: if (scheme) {
        setColorScheme(scheme);
      }
    });
  </script>
  
  <label class="color-scheme">
    Theme:
    <select bind:value={scheme}>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  
  <style>
    .color-scheme {
      margin-bottom: 15px;
    }
    .color-scheme select {
      margin-left: 5px;
    }
  </style>
  