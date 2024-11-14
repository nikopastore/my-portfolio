<script>
  const projects = [
    {
      title: 'Project One',
      description: 'A brief description of Project One.',
      image: '/images/project1.svg',
      link: 'https://github.com/nikopastore/project-one',
      year: '2024', // Added year
    },
    {
      title: 'Project Two',
      description: 'A brief description of Project Two.',
      image: '/images/project2.svg',
      link: 'https://github.com/nikopastore/project-two',
      year: '2024', // Added year
    },
    {
      title: 'Project Three',
      description: 'A brief description of Project Three.',
      image: '/images/project3.svg',
      link: 'https://github.com/nikopastore/project-three',
      year: '2024', // Added year
    },
  ];
</script>
  
<section class="max-w-6xl mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center">Projects</h1>
  
  <div class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {#each projects as project}
      <article class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
        <img src="{project.image}" alt="{project.title}" class="w-full h-48 object-cover rounded-t-lg" />
        <div class="p-4">
          <h2 class="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{project.title}</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
          <a href="{project.link}" target="_blank" rel="noopener noreferrer" class="text-indigo-500 hover:underline">
            View Project
          </a>
        </div>
      </article>
    {/each}
  </div>
</section>
