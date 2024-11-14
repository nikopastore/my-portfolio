<!-- src/routes/projects/+page.svelte -->
<script>
  const projects = [
    {
      title: 'Project One',
      year: '2024',
      description: 'A comprehensive portfolio website showcasing my projects, skills, and experiences.',
      image: '/images/project1.svg',
      link: 'https://github.com/nikopastore/project-one',
      technologies: ['Svelte', 'Tailwind CSS', 'D3.js']
    },
    {
      title: 'Project Two',
      year: '2023',
      description: 'An innovative project focusing on data visualization and interactive user interfaces.',
      image: '/images/project2.svg',
      link: 'https://github.com/nikopastore/project-two',
      technologies: ['Svelte', 'Tailwind CSS', 'D3.js']
    },
    {
      title: 'Project Three',
      year: '2022',
      description: 'A collaborative project aimed at developing scalable backend solutions.',
      image: '/images/project3.svg',
      link: 'https://github.com/nikopastore/project-three',
      technologies: ['Svelte', 'Tailwind CSS', 'D3.js']
    },
  ];
</script>

<!-- Projects Section -->
<section id="projects" class="mb-16">
  <h2 class="text-3xl font-semibold mb-6">Projects</h2>
  <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
    {#each projects as project}
      <article class="border rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-300">
        <h3 class="text-xl font-semibold mb-2">{project.title}</h3>
        <img src="{project.image}" alt="{project.title} Image" class="mb-4 w-full h-48 object-cover rounded" />
        
        <!-- Description and Year Wrapper -->
        <div class="project-details">
          <p class="text-md text-gray-700">{project.description}</p>
          <p class="project-year">{project.year}</p>
          
          <!-- Technologies Used (Optional) -->
          {#if project.technologies}
            <p class="text-sm text-gray-500 mt-2">Technologies: {project.technologies.join(', ')}</p>
          {/if}
        </div>
        
        <!-- View Project Link (Optional) -->
        <a href="{project.link}" target="_blank" rel="noopener noreferrer" class="text-indigo-500 hover:underline mt-2 block">
          View Project
        </a>
      </article>
    {/each}
  </div>
</section>

<style>
  /* Styles for Project Details */
  .project-details {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* Styles for the Project Year */
  .project-year {
    font-size: 0.9em;
    color: #6b7280; /* Tailwind's gray-500 */
    font-family: 'Baskerville', serif;
    font-variant-numeric: oldstyle-nums;
    margin-top: 0.5em;
  }

  /* Optional: Hover Effect for Project Year */
  article:hover .project-year {
    color: #4f46e5; /* Tailwind's indigo-600 */
    transition: color 0.3s ease;
  }

  /* Responsive Image Height Adjustment */
  @media (max-width: 640px) {
    img {
      height: 36vh; /* Adjust as needed */
    }
  }

  /* Responsive Project Details Layout */
  @media (max-width: 480px) {
    .project-details {
      align-items: flex-start;
    }
  }
</style>