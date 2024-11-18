<script>
  import { onMount } from 'svelte';
  let showContent = false;

  onMount(() => {
    // Delay for animation effect
    setTimeout(() => {
      showContent = true;
    }, 200);
  });
</script>

<style>
  .hero {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to right, #1c92d2, #f2fcfe);
    text-align: center;
  }
  .fade-in {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 1s, transform 1s;
  }
  .fade-in.show {
    opacity: 1;
    transform: translateY(0);
  }
</style>

<div class="hero">
  <div class={`fade-in ${showContent ? 'show' : ''}`}>
    <h1 class="text-4xl font-bold text-white">Welcome to My Portfolio</h1>
    <p class="mt-4 text-lg text-white">Explore my projects and learn more about me.</p>
    <a href="/projects" class="mt-6 inline-block bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100">
      View My Work
    </a>
  </div>
</div>
