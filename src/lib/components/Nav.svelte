<!-- src/lib/components/Nav.svelte -->
<script>
    import { page } from '$app/stores';
  
    // Define the pages array
    export let pages = [
      { url: '/', title: 'Home' },
      { url: '/projects', title: 'Projects' },
      { url: '/contact', title: 'Contact' },
      { url: '/cv', title: 'CV' },
      { url: 'https://github.com/nikopastore', title: 'GitHub Profile' },
    ];
  
    // Get the current path from the page store
    $: currentPath = $page.url.pathname;
  </script>
  
  <nav>
    {#each pages as p}
      {#if !p.url.startsWith('http')}
        <!-- Internal links -->
        <a href="{p.url}" class="{currentPath === p.url ? 'current' : ''}">
          {p.title}
        </a>
      {:else}
        <!-- External links -->
        <a href="{p.url}" target="_blank" rel="noopener noreferrer">
          {p.title}
        </a>
      {/if}
    {/each}
  </nav>
  
  <style>
    nav {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }
    nav a {
      text-decoration: none;
      color: inherit;
    }
    nav a.current {
      font-weight: bold;
      text-decoration: underline;
    }
  </style>
  