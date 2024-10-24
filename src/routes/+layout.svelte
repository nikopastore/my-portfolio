<!-- src/routes/+layout.svelte -->
<script>
	import '../app.css'; // Import global CSS
	import Nav from '$lib/components/Nav.svelte';
	import ColorSchemeSelector from '$lib/components/ColorSchemeSelector.svelte';
  </script>
  
  <!-- Navigation Bar -->
  <Nav />
  
  <!-- Theme Selector -->
  <ColorSchemeSelector />
  
  <!-- Main Content Container -->
  <main class="container mx-auto px-4 pt-20">
	<slot />
  </main>
  
  <!-- Footer (Optional) -->
  <footer class="bg-gray-200 dark:bg-gray-800 p-4 text-center text-gray-700 dark:text-gray-300">
	&copy; {new Date().getFullYear()} Nikolai Pastore. All rights reserved.
  </footer>
  