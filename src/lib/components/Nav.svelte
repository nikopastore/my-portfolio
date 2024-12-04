<script>
  import { onMount } from 'svelte';
  import DarkModeToggle from './DarkModeToggle.svelte';

  let activeSection = 'home';
  let isMenuOpen = false;

  const pages = [
    { title: 'Home', url: '#home' },
    { title: 'Projects', url: '#projects' },
    { title: 'Meta-Analysis', url: '#meta' },
    { title: 'CV', url: '#cv' },
    { title: 'Contact', url: '#contact' },
    { title: 'GitHub Profile', url: 'https://github.com/nikopastore' },
  ];

  onMount(() => {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.6 };
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) activeSection = entry.target.id;
      });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = pages
      .filter(p => p.url.startsWith('#'))
      .map(p => document.querySelector(p.url));

    sections.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      if (observer) {
        sections.forEach(section => {
          if (section) observer.unobserve(section);
        });
        observer.disconnect();
      }
    };
  });
</script>

<nav class="flex items-center justify-between bg-white dark:bg-gray-800 p-4 shadow-md fixed top-0 left-0 right-0 z-50">
  <div class="flex items-center space-x-4">
    <a href="/" class="text-2xl font-bold text-indigo-500 dark:text-indigo-400">Nikolai</a>
  </div>

  <div class="hidden md:flex items-center space-x-4">
    {#each pages as p}
      <a
        href={p.url}
        target={p.url.startsWith('http') ? '_blank' : '_self'}
        rel={p.url.startsWith('http') ? 'noopener noreferrer' : undefined}
        class="text-gray-700 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200 {activeSection === p.url.substring(1) ? 'font-bold underline' : ''}"
      >
        {p.title}
      </a>
    {/each}
    <DarkModeToggle />
  </div>

  <div class="md:hidden flex items-center">
    <button on:click={() => isMenuOpen = !isMenuOpen} class="ml-2 focus:outline-none">
      {#if isMenuOpen}
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      {:else}
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      {/if}
    </button>
  </div>

  {#if isMenuOpen}
    <div class="absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-md md:hidden">
      <div class="flex flex-col space-y-2">
        {#each pages as p}
          <a
            href={p.url}
            class="text-gray-700 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200 {activeSection === p.url.substring(1) ? 'font-bold underline' : ''}"
            on:click={() => isMenuOpen = false}
          >
            {p.title}
          </a>
        {/each}
        <DarkModeToggle />
      </div>
    </div>
  {/if}
</nav>

<style>
  nav a.active {
    background-color: #4f46e5;
    font-weight: bold;
  }
</style>
