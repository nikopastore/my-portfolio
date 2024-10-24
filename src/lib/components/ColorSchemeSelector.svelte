<!-- src/lib/components/ColorSchemeSelector.svelte -->
<script>
    import { onMount } from 'svelte';
  
    let scheme = 'light dark'; // Default to Automatic
  
    // Load the saved scheme from localStorage
    onMount(() => {
      if (localStorage.colorScheme) {
        scheme = localStorage.colorScheme;
      }
      setColorScheme(scheme);
    });
  
    function setColorScheme(scheme) {
      document.documentElement.style.setProperty('color-scheme', scheme);
      localStorage.colorScheme = scheme;
    }
  
    // Update the color scheme whenever the selection changes
    $: if (scheme) {
      setColorScheme(scheme);
    }
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
  