<!-- src/lib/components/Nav.svelte -->
<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
  
    let currentPath = '';
  
    onMount(() => {
      currentPath = window.location.pathname;
    });
  
    const pages = [
      { title: 'Home', url: '#home' },
      { title: 'Projects', url: '#projects' },
      { title: 'CV', url: '#cv' },
      { title: 'Contact', url: '#contact' },
      { title: 'GitHub Profile', url: 'https://github.com/nikopastore' },
    ];
  </script>
  
  <nav class="flex space-x-4 bg-white dark:bg-gray-800 p-4 shadow-md">
    {#each pages as p}
      {#if !p.url.startsWith('http')}
        <a
          href="{p.url}"
          class="text-gray-700 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200 {currentPath === p.url ? 'font-bold underline' : ''}"
        >
          {p.title}
        </a>
      {:else}
        <a
          href="{p.url}"
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray-700 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200"
        >
          {p.title}
        </a>
      {/if}
    {/each}
  </nav>
  