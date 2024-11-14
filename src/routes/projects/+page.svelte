<!-- src/routes/projects/+page.svelte -->
<script>
  const projects = [
    {
      title: 'Project One',
      year: '2024',
      description: 'A comprehensive portfolio website showcasing my projects, skills, and experiences.',
      image: '/images/project1.svg',
      link: 'https://github.com/nikopastore/project-one',
    },
    {
      title: 'Project Two',
      year: '2023',
      description: 'An innovative project focusing on data visualization and interactive user interfaces.',
      image: '/images/project2.svg',
      link: 'https://github.com/nikopastore/project-two',
    },
    {
      title: 'Project Three',
      year: '2022',
      description: 'A collaborative project aimed at developing scalable backend solutions.',
      image: '/images/project3.svg',
      link: 'https://github.com/nikopastore/project-three',
    },
  ];
</script>

<section class="max-w-6xl mx-auto px-4 py-8">
<h1 class="text-4xl font-bold mb-8 text-center">Projects</h1>

<div class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {#each projects as project}
    <article class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <img src="{project.image}" alt="{project.title}" class="w-full h-48 object-cover rounded-t-lg" />
      <div class="p-4">
        <h2 class="text-2xl font-semibold mb-2">{project.title}</h2>
        <div class="project-details">
          <p class="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
          <p class="project-year">{project.year}</p>
        </div>
        <a href="{project.link}" target="_blank" rel="noopener noreferrer" class="text-indigo-500 hover:underline">
          View Project
        </a>
      </div>
    </article>
  {/each}
</div>
</section>

<style>
.project-year {
  font-size: 0.9em;
  color: #6b7280; /* Tailwind's gray-500 */
  font-family: 'Baskerville', serif;
  font-variant-numeric: oldstyle-nums;
  margin-top: 0.5em;
}
</style>
