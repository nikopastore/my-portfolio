<!-- src/lib/components/Nav.svelte -->
<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
  
    let activeSection = 'home';
  
    const pages = [
      { title: 'Home', url: '#home' },
      { title: 'Projects', url: '#projects' },
      { title: 'CV', url: '#cv' },
      { title: 'Contact', url: '#contact' },
      { title: 'GitHub Profile', url: 'https://github.com/nikopastore' },
    ];
  
    const handleScroll = () => {
      const sections = pages
        .filter(p => p.url.startsWith('#'))
        .map(p => document.querySelector(p.url));
  
      let current = activeSection;
  
      for (const section of sections) {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100) { // Adjust threshold as needed
            current = section.id;
          }
        }
      }
  
      activeSection = current;
    };
  
    onMount(() => {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Initialize on mount
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    });
  </script>
  
  <nav class="flex space-x-4 bg-white dark:bg-gray-800 p-4 shadow-md">
    {#each pages as p}
      {#if !p.url.startsWith('http')}
        <a
          href="{p.url}"
          class="text-gray-700 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200 {activeSection === p.url.substring(1) ? 'font-bold underline' : ''}"
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
  