<!-- src/routes/projects/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import PieChart from '$lib/PieChart.svelte';
  import projects from '$lib/projects.json'; // Import centralized projects data

  let projectsByYear = [];
  let projectsByTechnology = [];

  onMount(() => {
    // Aggregate projects by year
    const yearData = projects.reduce((acc, project) => {
      acc[project.year] = acc[project.year] || { label: project.year, value: 0 };
      acc[project.year].value += 1;
      return acc;
    }, {});
    projectsByYear = Object.values(yearData);

    // Aggregate projects by technology
    const techCounts = projects.reduce((acc, project) => {
      project.technologies.forEach(tech => {
        acc[tech] = (acc[tech] || 0) + 1;
      });
      return acc;
    }, {});
    projectsByTechnology = Object.entries(techCounts).map(([label, value]) => ({ label, value }));
  });
</script>

<!-- Projects Section -->
<section id="projects" class="mb-16">
  <h2 class="text-3xl font-semibold mb-6 text-center">Projects</h2>
  <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
    {#each projects as project}
      <article class="border rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-300">
        <h3 class="text-xl font-semibold mb-2">{project.title}</h3>
        <img src="{project.image}" alt="{project.title} Image" class="mb-4 w-full h-48 object-cover rounded" loading="lazy" />
        
        <!-- Description and Year Wrapper -->
        <div class="project-details">
          <p class="text-md text-gray-700">{project.description}</p>
          <p class="project-year">{project.year}</p>
          
          <!-- Technologies Used -->
          {#if project.technologies}
            <p class="text-sm text-gray-500 mt-2">Technologies: {project.technologies.join(', ')}</p>
          {/if}
        </div>
        
        <!-- View Project Link -->
        <a href="{project.link}" target="_blank" rel="noopener noreferrer" class="text-indigo-500 hover:underline mt-2 block">
          View Project
        </a>
      </article>
    {/each}
  </div>

  <!-- Pie Chart Section: Projects by Year -->
  <div class="mt-12">
    <h3 class="text-2xl font-semibold mb-4 text-center">Projects Distribution by Year</h3>
    <PieChart {projectsByYear} width={300} height={300} innerRadius={50} outerRadius={100} />
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

  /* Hover Effect for Project Year */
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
