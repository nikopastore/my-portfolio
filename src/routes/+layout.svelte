<script>
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';
</script>

<!-- Navigation Bar -->
<Nav />

<!-- Main Content with Padding Below the Navigation -->
<main class="w-full px-4 pt-24">
  <div class="max-w-6xl mx-auto">
    <slot />
  </div>
</main>

<!-- Footer -->
<footer class="bg-gray-200 dark:bg-gray-800 p-4 text-center text-gray-700 dark:text-gray-300">
  &copy; {new Date().getFullYear()} Nikolai Pastore. All rights reserved.
</footer>
