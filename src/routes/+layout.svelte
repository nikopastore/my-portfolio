<!-- src/routes/+layout.svelte -->
<script>
	import Nav from '$lib/components/Nav.svelte';
	import ColorSchemeSelector from '$lib/components/ColorSchemeSelector.svelte';
  
	// Console log as per your original global.js
	console.log('IT’S ALIVE!');
  </script>
  
  <!-- Include the color scheme selector and navigation bar -->
  <ColorSchemeSelector />
  <Nav />
  
  <!-- The slot where each page's content will be injected -->
  <slot />
  