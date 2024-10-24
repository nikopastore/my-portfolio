<!-- src/routes/projects/+page.svelte -->
<script>
    const projects = [
      {
        title: 'Project 1',
        image: 'https://vis-society.github.io/labs/2/images/empty.svg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      {
        title: 'Project 2',
        image: 'https://vis-society.github.io/labs/2/images/empty.svg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      {
        title: 'Project 3',
        image: 'https://vis-society.github.io/labs/2/images/empty.svg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      {
        title: 'Project 4',
        image: 'https://vis-society.github.io/labs/2/images/empty.svg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
    ];
  </script>
  
  <h1 class="text-3xl font-semibold mb-6">Projects</h1>
  
  <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
    {#each projects as project}
      <article class="border rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-300">
        <h2 class="text-xl font-semibold mb-2">{project.title}</h2>
        <img src="{project.image}" alt="{project.title}" class="mb-4 w-full h-48 object-cover rounded" />
        <p class="text-md text-gray-700">{project.description}</p>
      </article>
    {/each}
  </div>
  