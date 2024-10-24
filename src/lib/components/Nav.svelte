<!-- src/lib/components/Nav.svelte -->
<script>
    import { onMount } from 'svelte';
    import { MenuIcon, XIcon } from '@heroicons/svelte/24/outline'; // Optional for responsive menu
    import ColorSchemeSelector from '$lib/components/ColorSchemeSelector.svelte';
  
    let activeSection = 'home';
    let isMenuOpen = false;
  
    const pages = [
      { title: 'Home', url: '#home' },
      { title: 'Projects', url: '#projects' },
      { title: 'CV', url: '#cv' },
      { title: 'Contact', url: '#contact' },
      { title: 'GitHub Profile', url: 'https://github.com/nikopastore' },
    ];
  
    // Scroll Spy to Highlight Active Section using Intersection Observer for better performance
    onMount(() => {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.6, // Adjust threshold as needed
      };
      
      const observerCallback = (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            activeSection = entry.target.id;
          }
        });
      };
      
      const observer = new IntersectionObserver(observerCallback, observerOptions);
      
      const sections = pages
        .filter(p => p.url.startsWith('#'))
        .map(p => document.querySelector(p.url));
    
      sections.forEach(section => {
        if (section) {
          observer.observe(section);
        }
      });
      
      // Cleanup on destroy
      return () => {
        if (observer) {
          sections.forEach(section => {
            if (section) {
              observer.unobserve(section);
            }
          });
          observer.disconnect();
        }
      };
    });
  </script>
  
  <!-- Navigation Bar -->
  <nav class="flex items-center justify-between bg-white dark:bg-gray-800 p-4 shadow-md fixed top-0 left-0 right-0 z-50">
    <!-- Brand/Logo -->
    <div class="flex items-center space-x-4">
      <a href="/" class="text-2xl font-bold text-indigo-500 dark:text-indigo-400">Nikolai</a>
    </div>
    
    <!-- Desktop Menu -->
    <div class="hidden md:flex items-center space-x-4">
      {#each pages as p}
        {#if !p.url.startsWith('http')}
          <a
            href="{p.url}"
            aria-current="{activeSection === p.url.substring(1) ? 'page' : undefined}"
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
      
      <!-- Theme Selector -->
      <ColorSchemeSelector />
    </div>
    
    <!-- Mobile Menu Button -->
    <div class="md:hidden flex items-center">
      <ColorSchemeSelector /> <!-- Include Theme Selector in Mobile Menu -->
      <button on:click={() => isMenuOpen = !isMenuOpen} class="ml-2 focus:outline-none">
        {#if isMenuOpen}
          <XIcon class="w-6 h-6 text-gray-700 dark:text-gray-200" />
        {:else}
          <MenuIcon class="w-6 h-6 text-gray-700 dark:text-gray-200" />
        {/if}
      </button>
    </div>
    
    <!-- Mobile Menu -->
    {#if isMenuOpen}
      <div class="absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-md md:hidden">
        <div class="flex flex-col space-y-2">
          {#each pages as p}
            {#if !p.url.startsWith('http')}
              <a
                href="{p.url}"
                aria-current="{activeSection === p.url.substring(1) ? 'page' : undefined}"
                class="text-gray-700 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200 {activeSection === p.url.substring(1) ? 'font-bold underline' : ''}"
                on:click={() => isMenuOpen = false}
              >
                {p.title}
              </a>
            {:else}
              <a
                href="{p.url}"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-700 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200"
                on:click={() => isMenuOpen = false}
              >
                {p.title}
              </a>
            {/if}
          {/each}
        </div>
      </div>
    {/if}
  </nav>
  
  <style>
    /* Ensure the navbar's padding accounts for the theme selector and menu button */
    /* Optional: Add any additional custom styles here */
  </style>
  