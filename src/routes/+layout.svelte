<!-- src/routes/+layout.svelte -->
<script>
	import Nav from '$lib/components/Nav.svelte';
	import ColorSchemeSelector from '$lib/components/ColorSchemeSelector.svelte';
	import { onMount } from 'svelte';
  
	onMount(() => {
	  console.log('IT’S ALIVE!');
	});
  </script>
  
  <ColorSchemeSelector />
  <Nav />
  
  <slot />
  