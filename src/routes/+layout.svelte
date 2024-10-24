<!-- src/routes/+layout.svelte -->
<script>
	import Nav from '$lib/components/Nav.svelte';
	import ColorSchemeSelector from '$lib/components/ColorSchemeSelector.svelte';
	import { onMount } from 'svelte';
  </script>
  
  <div class="min-h-screen flex flex-col">
	<!-- Header Section -->
	<header class="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
	  <Nav />
	  <ColorSchemeSelector />
	</header>
  
	<!-- Main Content -->
	<main class="flex-grow container mx-auto px-4 py-8">
	  <slot />
	</main>
  
	<!-- Footer Section -->
	<footer class="p-4 bg-white dark:bg-gray-800 text-center text-gray-700 dark:text-gray-200">
	  &copy; {new Date().getFullYear()} Nikolai Pastore. All rights reserved.
	</footer>
  </div>
  